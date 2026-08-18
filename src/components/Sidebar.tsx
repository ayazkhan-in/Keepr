import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Vault,
  BarChart3,
  Calendar,
  Settings,
  HelpCircle,
  Box,
  Sparkles,
} from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  riskCount: number;
  openScanner: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  riskCount,
  openScanner,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'purchases' as ActiveView, label: 'Purchases', icon: ShoppingBag },
    {
      id: 'warranties' as ActiveView,
      label: 'Warranties',
      icon: ShieldCheck,
    },
    {
      id: 'returns' as ActiveView,
      label: 'Returns',
      icon: RotateCcw,
      badge: riskCount > 0 ? `${riskCount}` : undefined,
    },
    { id: 'vault' as ActiveView, label: 'Vault', icon: Vault },
    { id: 'analytics' as ActiveView, label: 'Analytics', icon: BarChart3 },
    { id: 'timeline' as ActiveView, label: 'Timeline', icon: Calendar },
  ];

  return (
    <aside className="hidden md:flex flex-col bg-[#FFFFFF] border-r border-[#E2E8F0] h-screen w-64 py-4 px-3 shrink-0 z-20 select-none">
      {/* Brand Header */}
      <div className="px-3 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0F172A] flex items-center justify-center shrink-0 shadow-xs">
            <Box className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-base text-[#0F172A] tracking-tight leading-none flex items-center gap-1.5">
              Keepr
              <span className="text-[10px] font-mono-code bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded-full border border-[#E2E8F0] font-medium">
                AI
              </span>
            </h2>
            <p className="font-mono-code text-[10px] text-[#76777D] uppercase tracking-wider mt-1">
              Purchase Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                isActive
                  ? 'bg-[#F1F5F9] text-[#0F172A] shadow-xs'
                  : 'text-[#45464D] hover:text-[#0F172A] hover:bg-[#F9F9FB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F172A]' : 'text-[#76777D]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="font-mono-code text-[10px] px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Action Box */}
      <div className="p-3.5 my-3 bg-[#F9F9FB] rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#0F172A]" />
          <span className="font-mono-code text-[10px] uppercase tracking-wider text-[#76777D] font-semibold">
            AI Ingestion
          </span>
        </div>
        <p className="text-[12px] text-[#45464D] mb-2.5 leading-snug">
          Upload any receipt or warranty invoice to auto-extract items.
        </p>
        <button
          onClick={openScanner}
          className="w-full py-2 px-3 bg-[#0F172A] text-white hover:bg-[#1E293B] rounded-xl text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Scan Document</span>
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="pt-3 border-t border-[#E2E8F0] space-y-1">
        <button
          onClick={() => setActiveView('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
            activeView === 'settings'
              ? 'bg-[#F1F5F9] text-[#0F172A]'
              : 'text-[#45464D] hover:text-[#0F172A] hover:bg-[#F9F9FB]'
          }`}
        >
          <Settings className="w-4 h-4 text-[#76777D]" />
          <span>Settings</span>
        </button>
        <a
          href="https://ai.google.dev"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-[#45464D] hover:text-[#0F172A] hover:bg-[#F9F9FB] transition-all"
        >
          <HelpCircle className="w-4 h-4 text-[#76777D]" />
          <span>Documentation</span>
        </a>
      </div>

      {/* User profile capsule */}
      <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center text-[12px] font-semibold text-[#0F172A]">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-[#0F172A] leading-none">Alex Morgan</span>
            <span className="text-[10px] font-mono-code text-[#76777D] mt-0.5">alex@keepr.ai</span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#10B981]" title="Gemini 3.7 Online" />
      </div>
    </aside>
  );
};
