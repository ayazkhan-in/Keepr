import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Plus, Scan, Menu, X, ShieldAlert, CheckCircle2, Bot } from 'lucide-react';
import { ActiveView } from '../types';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openCommandPalette: () => void;
  openScanner: () => void;
  openAIChat: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  openSettings: () => void;
  riskCount: number;
  dbConnected?: boolean;
  openAuthModal: () => void;
  onNavigateToLanding?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  setSearchQuery,
  openCommandPalette,
  openScanner,
  openAIChat,
  activeView,
  setActiveView,
  openSettings,
  riskCount,
  dbConnected = true,
  openAuthModal,
  onNavigateToLanding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="bg-[#FFFFFF] border-b border-[#E2E8F0] flex justify-between items-center w-full px-4 md:px-6 h-16 shrink-0 z-30 sticky top-0 rounded-t-2xl"
    >
      {/* Left side: Mobile Toggle / Search Input */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-[#45464D] hover:text-[#0F172A] rounded-md hover:bg-[#F1F5F9]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Brand */}
        <div
          className={`md:hidden flex items-center gap-2 ${onNavigateToLanding ? 'cursor-pointer' : ''}`}
          onClick={onNavigateToLanding}
        >
          <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0] bg-white flex items-center justify-center">
            <img src="/abstract.png" alt="Keepr Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-base text-[#0F172A] tracking-tight">Keepr</span>
        </div>

        {/* Desktop Global Search */}
        <div className="hidden md:flex items-center w-full max-w-md relative">
          <Search className="absolute left-3.5 text-[#94A3B8] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search receipts, items, warranties (⌘K)..."
            onClick={openCommandPalette}
            className="w-full pl-9 pr-14 py-2 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] focus:outline-none focus:border-[#0F172A] focus:bg-white transition-colors placeholder:text-[#94A3B8] h-9.5 shadow-2xs"
          />
          <div className="absolute right-2.5 flex items-center">
            <kbd className="font-mono-code text-[10px] bg-[#FFFFFF] px-2 py-0.5 rounded-full text-[#76777D] border border-[#E2E8F0] shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3">
        {/* Firebase Firestore Status Green Dot with Hover Tooltip */}
        <div className="relative group flex items-center justify-center cursor-pointer p-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125 ${
              dbConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 bg-[#0F172A] text-white text-[11px] font-mono-code rounded-lg whitespace-nowrap shadow-xl pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-150">
            <span className={`w-1.5 h-1.5 rounded-full ${dbConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>{dbConnected ? 'Firestore Connected' : 'Offline Cache'}</span>
          </div>
        </div>

        {/* Ask Keepr AI Assistant */}
        <button
          onClick={openAIChat}
          className="px-3 py-2 bg-[#F9F9FB] border border-[#E2E8F0] hover:border-[#0F172A] text-[#0F172A] rounded-xl text-[13px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Ask Keepr AI Assistant"
        >
          <Bot className="w-3.5 h-3.5 text-[#0F172A]" />
          <span className="hidden sm:inline">Ask Keepr AI</span>
        </button>

        {/* Add / Scan CTA */}
        <button
          onClick={openScanner}
          className="px-3.5 py-2 bg-[#0F172A] text-white hover:bg-[#1E293B] rounded-xl text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Scan className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Receipt</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#76777D] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {riskCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -8, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.96, y: -8, filter: 'blur(8px)' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
              >
                <div className="px-3.5 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between">
                  <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#76777D] font-medium">
                    Active Alerts ({riskCount + 2})
                  </span>
                  <span className="text-[11px] text-[#0F172A] cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="divide-y divide-[#F1F5F9] max-h-72 overflow-y-auto">
                  <div
                    onClick={() => {
                      setActiveView('returns');
                      setShowNotifications(false);
                    }}
                    className="p-3.5 hover:bg-[#F9F9FB] cursor-pointer transition-colors flex gap-2.5 items-start"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-medium text-[#0F172A]">
                        MacBook Pro Return Window: 3 Days Left
                      </p>
                      <p className="text-[11px] text-[#76777D]">
                        Apple Store · Best Buy Order #W99281
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveView('warranties');
                      setShowNotifications(false);
                    }}
                    className="p-3.5 hover:bg-[#F9F9FB] cursor-pointer transition-colors flex gap-2.5 items-start"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-medium text-[#0F172A]">
                        Sony A7IV Warranty Expiry
                      </p>
                      <p className="text-[11px] text-[#76777D]">
                        Manufacturer 1-Year Limited expires Nov 2
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveView('vault');
                      setShowNotifications(false);
                    }}
                    className="p-3.5 hover:bg-[#F9F9FB] cursor-pointer transition-colors flex gap-2.5 items-start"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-medium text-[#0F172A]">
                        2 Receipts Automatically Parsed
                      </p>
                      <p className="text-[11px] text-[#76777D]">
                        Herman Miller and Breville invoices stored in Vault
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
            exit={{ opacity: 0, height: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden fixed inset-0 top-16 bg-white z-40 p-4 flex flex-col border-t border-[#E2E8F0] overflow-hidden"
          >
            <nav className="space-y-2">
              {[
                { id: 'dashboard' as ActiveView, label: 'Dashboard' },
                { id: 'purchases' as ActiveView, label: 'Purchases' },
                { id: 'warranties' as ActiveView, label: 'Warranties' },
                { id: 'returns' as ActiveView, label: 'Returns' },
                { id: 'vault' as ActiveView, label: 'Document Vault' },
                { id: 'analytics' as ActiveView, label: 'Analytics' },
                { id: 'timeline' as ActiveView, label: 'Timeline' },
                { id: 'settings' as ActiveView, label: 'Settings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveView(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    activeView === tab.id
                      ? 'bg-[#F1F5F9] text-[#0F172A]'
                      : 'text-[#45464D] hover:bg-[#F9F9FB]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
