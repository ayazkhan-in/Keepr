import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Bell,
  Sparkles,
  Shield,
  CreditCard,
  Database,
  Check,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [currency, setCurrency] = useState('USD ($)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [returnReminders, setReturnReminders] = useState('3 days before');
  const [warrantyReminders, setWarrantyReminders] = useState('14 days before');
  const [saved, setSaved] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);

  const handleSendTestEmail = async () => {
    if (!testEmailAddress.trim()) {
      setTestEmailStatus('⚠️ Please enter your recipient email address first.');
      return;
    }

    setIsSendingTestEmail(true);
    setTestEmailStatus(null);
    try {
      const res = await fetch('/api/warranty/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: testEmailAddress.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestEmailStatus(`✅ Email sent to ${testEmailAddress.trim()} via Resend!`);
      } else {
        setTestEmailStatus(`❌ ${data.error || 'Failed to send'}`);
      }
    } catch (err: any) {
      setTestEmailStatus('❌ Network error sending test email');
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 16, filter: 'blur(8px)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-2xl max-w-xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFAFC]">
              <h3 className="font-medium text-[15px] text-[#0F172A]">Keepr Settings</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#76777D] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-[13px]">
          {/* Account Profile */}
          <div className="space-y-3">
            <h4 className="font-mono-code text-[11px] uppercase tracking-wider text-[#76777D] font-semibold">
              Profile & Organization
            </h4>
            <div className="flex items-center gap-3 p-3.5 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl">
              <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-semibold text-sm">
                AM
              </div>
              <div>
                <p className="font-medium text-[#0F172A]">Alex Morgan</p>
                <p className="text-[12px] text-[#76777D]">alex@keepr.ai · Executive Tier</p>
              </div>
            </div>
          </div>

          {/* Currency & Financial Preferences */}
          <div className="space-y-3">
            <h4 className="font-mono-code text-[11px] uppercase tracking-wider text-[#76777D] font-semibold">
              Financial Defaults
            </h4>
            <div>
              <label className="block text-[#45464D] mb-1.5 font-medium">Default Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl text-[#0F172A]"
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>CAD ($)</option>
              </select>
            </div>
          </div>

          {/* Notification Deadlines */}
          <div className="space-y-3">
            <h4 className="font-mono-code text-[11px] uppercase tracking-wider text-[#76777D] font-semibold">
              Alerts & Deadlines
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl">
                <div>
                  <p className="font-medium text-[#0F172A]">Email & In-App Alerts</p>
                  <p className="text-[12px] text-[#76777D]">Receive daily digests on closing return windows</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded-md border-[#CBD5E1] text-[#0F172A] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[#45464D] mb-1.5 font-medium">Return Window Alert Buffer</label>
                <select
                  value={returnReminders}
                  onChange={(e) => setReturnReminders(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                >
                  <option>3 days before</option>
                  <option>5 days before</option>
                  <option>7 days before</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Ingestion Engine */}
          <div className="space-y-2">
            <h4 className="font-mono-code text-[11px] uppercase tracking-wider text-[#76777D] font-semibold">
              AI Intelligence
            </h4>
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#0F172A]" />
                <div>
                  <p className="font-medium text-[#0F172A]">Gemini 3.6 Flash Model</p>
                  <p className="text-[11px] text-[#76777D]">Active backend OCR & Purchase Parser</p>
                </div>
              </div>
              <span className="font-mono-code text-[10px] bg-[#ECFDF5] text-[#065F46] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                Connected
              </span>
            </div>
          </div>

          {/* LangChain + Resend Email Intelligence */}
          <div className="space-y-2">
            <h4 className="font-mono-code text-[11px] uppercase tracking-wider text-[#76777D] font-semibold">
              LangChain & Resend Email Alerts
            </h4>
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
              <div>
                <p className="font-medium text-[#0F172A] text-xs">Automated Expiry Email Engine</p>
                <p className="text-[11px] text-[#76777D]">Powered by LangChain LLM & Resend Transactional Email</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                />
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail}
                  className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isSendingTestEmail ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Send Test Email</span>
                  )}
                </button>
              </div>

              {testEmailStatus && (
                <p className="text-[11px] font-mono-code pt-1 border-t border-[#E2E8F0]">
                  {testEmailStatus}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] flex justify-end items-center gap-2 bg-white">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-[12px] font-medium text-[#45464D] hover:bg-[#F9F9FB] rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#0F172A] text-white text-[12px] font-medium rounded-xl hover:bg-[#1E293B] flex items-center gap-1 cursor-pointer"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saved ? 'Saved' : 'Save Changes'}</span>
          </button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
