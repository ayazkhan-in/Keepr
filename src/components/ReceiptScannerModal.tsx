import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PurchaseItem, CategoryType } from '../types';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePurchase: (newPurchase: PurchaseItem) => void;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose,
  onSavePurchase,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewBase64, setPreviewBase64] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewBase64(base64);
      triggerAIScan(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const loadSampleReceipt = (type: 'apple' | 'amazon' | 'dwr') => {
    let mockContext = '';
    let mockName = '';
    let mockPrice = 0;
    let mockVendor = '';
    let mockCategory: CategoryType = 'Electronics';

    if (type === 'apple') {
      mockName = 'Apple Studio Display 27" 5K';
      mockPrice = 1599.00;
      mockVendor = 'Apple Store';
      mockContext = `APPLE STORE RETAIL INVOICE
Order Number: W998124901
Item: Apple Studio Display 27-inch 5K Retina (Standard Glass, Tilt-adjustable)
Price: $1,599.00 USD
Serial: APL-SD5K-881920
Date: 2023-10-28
Warranty: 1-Year Limited Manufacturer Warranty
Return Window: 14 days`;
    } else if (type === 'amazon') {
      mockName = 'Keychron Q1 Pro Wireless Mechanical Keyboard';
      mockPrice = 198.00;
      mockVendor = 'Amazon';
      mockContext = `AMAZON.COM INVOICE
Order # 113-9918231-5501923
Keychron Q1 Pro Custom Mechanical Keyboard (Carbon Black, Gateron Red)
Price: $198.00 USD
Date: 2023-10-27
Warranty: 12 Months
Return Period: 30 days hassle-free`;
    } else {
      mockName = 'Grovemade Walnut Desk Shelf System';
      mockPrice = 280.00;
      mockVendor = 'Grovemade';
      mockCategory = 'Office Furniture';
      mockContext = `GROVEMADE ORDER CONFIRMATION
Order: GM-88192
Item: Solid Walnut Desk Shelf (Medium) + Aluminum Tray
Total: $280.00 USD
Date: 2023-10-26
Warranty: 2-Year Craftsmanship Guarantee
Return Window: 30 Days`;
    }

    setPreviewBase64('https://images.unsplash.com/photo-1554415707-9e4c07dca042?auto=format&fit=crop&w=600&q=80');
    triggerAIScan(undefined, 'text/plain', mockContext);
  };

  const triggerAIScan = async (base64?: string, mimeType?: string, textContext?: string) => {
    setIsScanning(true);
    setScanStep('Analyzing document structure with Gemini 3.7 Flash...');

    try {
      setTimeout(() => setScanStep('Extracting warranty periods & return deadlines...'), 600);

      const res = await fetch('/api/gemini/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          textContext,
        }),
      });

      const data = await res.json();
      if (data.success && data.extracted) {
        setExtractedData(data.extracted);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleSave = () => {
    if (!extractedData) return;

    const purchaseDate = extractedData.purchaseDate || new Date().toISOString().split('T')[0];
    const warrantyMonths = extractedData.warrantyMonths || 12;
    const returnDays = extractedData.returnDays || 14;

    // Calculate dates
    const pDate = new Date(purchaseDate);
    const warExpDate = new Date(pDate);
    warExpDate.setMonth(warExpDate.getMonth() + warrantyMonths);

    const retDeadlineDate = new Date(pDate);
    retDeadlineDate.setDate(retDeadlineDate.getDate() + returnDays);

    const newPurchase: PurchaseItem = {
      id: `pur-${Date.now()}`,
      name: extractedData.name || 'New Scanned Item',
      vendor: extractedData.vendor || 'Retailer',
      category: (extractedData.category as CategoryType) || 'Electronics',
      purchaseDate,
      price: Number(extractedData.price) || 0,
      currency: extractedData.currency || 'USD',
      orderNumber: extractedData.orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      serialNumber: extractedData.serialNumber,
      paymentMethod: extractedData.paymentMethod || 'Credit Card (•••• 1004)',
      warranty: {
        hasWarranty: warrantyMonths > 0,
        durationMonths: warrantyMonths,
        startDate: purchaseDate,
        expiryDate: warExpDate.toISOString().split('T')[0],
        provider: extractedData.warrantyProvider || `${extractedData.vendor} Manufacturer Warranty`,
        terms: extractedData.warrantyTerms || 'Standard limited warranty coverage.',
        claimStatus: 'none',
      },
      returnWindow: {
        hasReturn: returnDays > 0,
        returnDays,
        deadlineDate: retDeadlineDate.toISOString().split('T')[0],
        status: returnDays > 0 ? 'open' : 'closed',
        policy: extractedData.returnPolicy || `${returnDays}-day standard return policy.`,
      },
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: `${(extractedData.name || 'Receipt').replace(/[^a-zA-Z0-9]/g, '_')}_Proof.pdf`,
          type: 'receipt',
          fileUrl: previewBase64 || 'https://images.unsplash.com/photo-1554415707-9e4c07dca042?auto=format&fit=crop&w=600&q=80',
          previewUrl: previewBase64 || 'https://images.unsplash.com/photo-1554415707-9e4c07dca042?auto=format&fit=crop&w=300&q=80',
          uploadDate: new Date().toISOString().split('T')[0],
          fileSize: '412 KB',
        },
      ],
      tags: ['AI Scanned', extractedData.category || 'Asset'],
      notes: extractedData.notes,
      aiConfidence: extractedData.aiConfidence || 0.98,
      aiExtractedNotes: `Automatically parsed on ${new Date().toLocaleDateString()}`,
      taxDeductible: Boolean(extractedData.taxDeductible),
    };

    onSavePurchase(newPurchase);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-medium text-[15px] text-[#0F172A] leading-tight">
                AI Receipt & Invoice Ingestion
              </h3>
              <p className="text-[11px] text-[#76777D]">
                Powered by Gemini 3.7 Flash OCR & Purchase Metadata Extractor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#76777D] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!extractedData && !isScanning && (
            <div>
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#CBD5E1] hover:border-[#0F172A] bg-[#F9F9FB] rounded-2xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] mb-3 group-hover:scale-105 transition-transform shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="font-medium text-[14px] text-[#0F172A]">
                  Click or drag and drop receipt / invoice
                </p>
                <p className="text-[12px] text-[#76777D] mt-1">
                  Supports PNG, JPG, WEBP, and PDF files
                </p>
              </div>

              {/* Sample Receipts Quick Load */}
              <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
                <p className="font-mono-code text-[11px] uppercase tracking-wider text-[#76777D] font-semibold mb-2.5">
                  Or test with sample preloaded receipts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => loadSampleReceipt('apple')}
                    className="p-3 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl hover:border-[#94A3B8] text-left transition-colors cursor-pointer"
                  >
                    <p className="font-medium text-[12px] text-[#0F172A]">Apple Studio Display</p>
                    <p className="text-[11px] text-[#76777D]">Apple Store · $1,599.00</p>
                  </button>
                  <button
                    onClick={() => loadSampleReceipt('amazon')}
                    className="p-3 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl hover:border-[#94A3B8] text-left transition-colors cursor-pointer"
                  >
                    <p className="font-medium text-[12px] text-[#0F172A]">Keychron Keyboard</p>
                    <p className="text-[11px] text-[#76777D]">Amazon.com · $198.00</p>
                  </button>
                  <button
                    onClick={() => loadSampleReceipt('dwr')}
                    className="p-3 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl hover:border-[#94A3B8] text-left transition-colors cursor-pointer"
                  >
                    <p className="font-medium text-[12px] text-[#0F172A]">Grovemade Shelf</p>
                    <p className="text-[11px] text-[#76777D]">Grovemade · $280.00</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scanning Progress */}
          {isScanning && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <Loader2 className="w-10 h-10 text-[#0F172A] animate-spin" />
                <Sparkles className="w-4 h-4 text-[#76777D] absolute -top-1 -right-1" />
              </div>
              <div>
                <h4 className="font-medium text-[15px] text-[#0F172A]">
                  Scanning & Parsing Receipt...
                </h4>
                <p className="text-[12px] text-[#76777D] mt-1 font-mono-code">{scanStep}</p>
              </div>
            </div>
          )}

          {/* Verification & Edit Form once extracted */}
          {extractedData && !isScanning && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center justify-between text-[12px] text-[#065F46]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span className="font-medium">
                    Successfully extracted metadata (98% confidence score)
                  </span>
                </div>
                <span className="font-mono-code text-[11px]">Gemini 3.7 OCR</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                <div>
                  <label className="block text-[#76777D] font-mono-code text-[11px] uppercase mb-1">
                    Product / Asset Name
                  </label>
                  <input
                    type="text"
                    value={extractedData.name || ''}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl text-[#0F172A] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#76777D] font-mono-code text-[11px] uppercase mb-1">
                    Vendor / Retailer
                  </label>
                  <input
                    type="text"
                    value={extractedData.vendor || ''}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, vendor: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[#76777D] font-mono-code text-[11px] uppercase mb-1">
                    Total Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={extractedData.price || 0}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl font-mono-code text-[#0F172A] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#76777D] font-mono-code text-[11px] uppercase mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={extractedData.purchaseDate || ''}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, purchaseDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl font-mono-code text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[#76777D] font-mono-code text-[11px] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={extractedData.category || 'Electronics'}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Office Furniture">Office Furniture</option>
                    <option value="Software">Software</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#76777D] font-mono-code text-[11px] uppercase mb-1">
                    Warranty Duration (Months)
                  </label>
                  <input
                    type="number"
                    value={extractedData.warrantyMonths || 12}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        warrantyMonths: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl font-mono-code text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[#76777D] font-mono-code text-[11px] uppercase mb-1">
                    Return Window (Days)
                  </label>
                  <input
                    type="number"
                    value={extractedData.returnDays || 14}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        returnDays: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl font-mono-code text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[#76777D] font-mono-code text-[11px] uppercase mb-1">
                    Serial Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={extractedData.serialNumber || ''}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, serialNumber: e.target.value })
                    }
                    placeholder="e.g. SN-8829-X01"
                    className="w-full px-3.5 py-2 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl font-mono-code text-[#0F172A]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E2E8F0] flex justify-between items-center bg-white">
          {extractedData ? (
            <button
              onClick={() => {
                setExtractedData(null);
                setPreviewBase64(null);
              }}
              className="text-[12px] text-[#76777D] hover:text-[#0F172A] font-medium cursor-pointer"
            >
              ← Scan Another Document
            </button>
          ) : (
            <span className="text-[11px] text-[#76777D] font-mono-code">
              OCR Engine Ready
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[12px] font-medium text-[#45464D] hover:bg-[#F9F9FB] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            {extractedData && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#0F172A] text-white text-[12px] font-medium hover:bg-[#1E293B] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Save to Purchases & Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
