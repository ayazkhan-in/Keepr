import { Resend } from 'resend';
import { PromptTemplate } from '@langchain/core/prompts';
import { GoogleGenAI } from '@google/genai';
import { PurchaseItem } from '../types';

let resendClient: Resend | null = null;
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

/**
 * LangChain Prompt Template for composing a personalized, high-precision warranty expiry email notice.
 */
const warrantyEmailPrompt = PromptTemplate.fromTemplate(`
You are Keepr's Automated Warranty Intelligence Agent.
Compose a concise, professional HTML email alerting a user that their product warranty is expiring very soon.

Product Details:
- Product Name: {name}
- Vendor / Store: {vendor}
- Purchase Date: {purchaseDate}
- Warranty Expiry Date: {expiryDate}
- Days Remaining: {daysLeft} days
- Serial / Order ID: {serialNumber}
- Warranty Terms Summary: {warrantyTerms}

Design & Email Structure Requirements:
1. Return ONLY clean, valid HTML code inside a <div> container (do not include markdown block ticks like \`\`\`html).
2. Use a modern, sleek design with a slate blue header, bold typography, and a highlighted callout box for the expiration date.
3. Include clear bullet points summarizing:
   - What to check before coverage ends (hardware diagnostics, display, power ports, etc.).
   - Instructions on how to file a claim with {vendor} if any issues are detected.
4. Keep the tone urgent yet helpful and reassuring.
5. Include a closing signature from "Keepr Automated Asset Protection".
`);

/**
 * Generate a custom HTML email via LangChain PromptTemplate & Google AI Studio, then send via Resend.
 */
export async function sendWarrantyExpiryAlert(
  purchase: PurchaseItem,
  recipientEmail: string = 'onboarding@resend.dev',
  customDaysLeft?: number
): Promise<{ success: boolean; emailId?: string; error?: string; message?: string }> {
  try {
    const resend = getResend();
    if (!resend) {
      return {
        success: false,
        error: 'RESEND_API_KEY is not configured in .env file.',
      };
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.VITE_FIREBASE_API_KEY;
    
    // Calculate days left
    const expiry = new Date(purchase.warranty?.expiryDate || Date.now());
    const diffTime = expiry.getTime() - Date.now();
    const daysLeft = customDaysLeft ?? Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let htmlContent = '';

    // Format prompt using LangChain PromptTemplate
    const formattedPrompt = await warrantyEmailPrompt.format({
      name: purchase.name,
      vendor: purchase.vendor,
      purchaseDate: purchase.purchaseDate,
      expiryDate: purchase.warranty?.expiryDate || 'Expiring Soon',
      daysLeft: daysLeft.toString(),
      serialNumber: purchase.serialNumber || purchase.orderNumber || 'Recorded in Keepr',
      warrantyTerms: purchase.warranty?.terms || 'Standard limited manufacturer hardware warranty.',
    });

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const tryModels = [
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash'
];
        let responseText = '';

        for (const m of tryModels) {
          try {
            const res = await ai.models.generateContent({
              model: m,
              contents: formattedPrompt,
            });
            if (res.text) {
              responseText = res.text;
              break;
            }
          } catch (modelErr: any) {
            console.warn(`[LangChain Model ${m} busy/unavailable]:`, modelErr.message);
          }
        }

        if (responseText) {
          htmlContent = responseText.replace(/```html/g, '').replace(/```/g, '').trim();
        }
      } catch (genErr: any) {
        console.warn('[LangChain Prompt Generation Notice]:', genErr.message);
      }
    }

    // Fallback HTML template if LangChain is bypassed or offline
    if (!htmlContent) {
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #0F172A; color: #ffffff; padding: 24px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 6-00;">Warranty Expiration Notice</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #94A3B8;">Keepr Asset & Protection Intelligence</p>
          </div>
          <div style="padding: 24px; color: #334155; font-size: 14px; line-height: 1.6;">
            <p style="margin-top: 0;">Your warranty for <strong>${purchase.name}</strong> from <strong>${purchase.vendor}</strong> is set to expire in <strong style="color: #DC2626;">${daysLeft} days</strong> (Expiration Date: ${purchase.warranty?.expiryDate}).</p>
            <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 14px; border-radius: 8px; margin: 18px 0;">
              <strong style="color: #991B1B;">Action Recommended:</strong> Inspect all device ports, screen functions, and power adapters before your coverage officially ends.
            </div>
            <ul style="padding-left: 20px; color: #475569;">
              <li><strong>Item:</strong> ${purchase.name}</li>
              <li><strong>Serial Number:</strong> ${purchase.serialNumber || 'Recorded in Keepr Vault'}</li>
              <li><strong>Vendor:</strong> ${purchase.vendor}</li>
            </ul>
            <p style="font-size: 12px; color: #64748B; margin-top: 24px;">Sent automatically by Keepr Automated Warranty Intelligence.</p>
          </div>
        </div>
      `;
    }

    // Send email via Resend
    const resendResponse = await resend.emails.send({
      from: 'Keepr Warranty Alerts <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `🚨 Warranty Expiring Soon (${daysLeft} Days Remaining): ${purchase.name}`,
      html: htmlContent,
    });

    if (resendResponse.error) {
      console.error('[Resend Error]:', resendResponse.error);
      return {
        success: false,
        error: resendResponse.error.message || 'Failed to send email via Resend',
      };
    }

    return {
      success: true,
      emailId: resendResponse.data?.id,
      message: `Warranty alert email successfully sent via Resend (ID: ${resendResponse.data?.id})`,
    };
  } catch (error: any) {
    console.error('Error sending warranty expiry email:', error);
    return {
      success: false,
      error: error.message || 'Error executing warranty email service',
    };
  }
}
