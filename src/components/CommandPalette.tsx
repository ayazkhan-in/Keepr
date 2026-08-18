import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Vault,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { PurchaseItem, ActiveView } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  purchases: PurchaseItem[];
  setActiveView: (view: ActiveView) => void;
  onSelectPurchase: (item: PurchaseItem) => void;
  openScanner: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  purchases,
  setActiveView,
  onSelectPurchase,
  openScanner,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle palette
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedPurchases = query
    ? purchases.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.vendor.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : purchases.slice(0, 4);

  const navActions: Array<{
    label: string;
    icon: any;
    action: () => void;
  }> = [
    {
      label: 'Scan & Ingest Receipt (AI)',
      icon: Sparkles,
      action: () => {
        onClose();
        openScanner();
      },
    },
    {
      label: 'Go to Dashboard',
      icon: ShoppingBag,
      action: () => {
        setActiveView('dashboard');
        onClose();
      },
    },
    {
      label: 'View Warranties & Protection',
      icon: ShieldCheck,
      action: () => {
        setActiveView('warranties');
        onClose();
      },
    },
    {
      label: 'View Return Deadlines',
      icon: RotateCcw,
      action: () => {
        setActiveView('returns');
        onClose();
      },
    },
    {
      label: 'Open Document Vault',
      icon: Vault,
      action: () => {
        setActiveView('vault');
        onClose();
      },
    },
    {
      label: 'View Spending Analytics',
      icon: BarChart3,
      action: () => {
        setActiveView('analytics');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in">
        {/* Search Input */}
        <div className="p-3.5 border-b border-[#E2E8F0] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a purchase, vendor, or command..."
            autoFocus
            className="flex-1 text-[13px] text-[#0F172A] bg-transparent focus:outline-none placeholder:text-[#94A3B8]"
          />
          <kbd className="font-mono-code text-[10px] text-[#76777D] bg-[#F1F5F9] px-2 py-0.5 rounded-md border border-[#E2E8F0]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2.5 divide-y divide-[#F1F5F9] text-[13px]">
          {/* Quick Actions */}
          <div className="pb-2">
            <span className="px-2 py-1 block text-[10px] font-mono-code uppercase text-[#76777D] font-semibold">
              Navigation & Actions
            </span>
            {navActions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F9F9FB] text-left text-[#0F172A] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#76777D] group-hover:text-[#0F172A]" />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#0F172A]" />
                </button>
              );
            })}
          </div>

          {/* Matched Purchases */}
          <div className="pt-2">
            <span className="px-2 py-1 block text-[10px] font-mono-code uppercase text-[#76777D] font-semibold">
              Purchases ({matchedPurchases.length})
            </span>
            {matchedPurchases.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onClose();
                  onSelectPurchase(p);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F9F9FB] text-left transition-colors cursor-pointer group"
              >
                <div>
                  <p className="font-medium text-[#0F172A]">{p.name}</p>
                  <p className="text-[11px] text-[#76777D]">
                    {p.vendor} · ${p.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-mono-code text-[11px] text-[#76777D]">
                  {p.purchaseDate}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
