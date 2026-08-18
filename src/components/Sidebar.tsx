import React from 'react';
import { motion } from 'framer-motion';
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
  Sparkles,
  LogIn,
  LogOut,
  Globe,
} from 'lucide-react';
import { ActiveView } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  riskCount: number;
  openScanner: () => void;
  openAuthModal?: () => void;
  onNavigateToLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  riskCount,
  openScanner,
  openAuthModal,
  onNavigateToLanding,
}) => {
  const { user, logout } = useAuth();
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
    <motion.aside
      initial={{ opacity: 0, x: -24, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="hidden md:flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl h-full w-64 p-3.5 shrink-0 z-20 select-none shadow-sm overflow-y-auto"
    >
      {/* Brand Header */}
      <div
        className={`px-3 mb-6 flex items-center justify-between ${onNavigateToLanding ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''}`}
        onClick={onNavigateToLanding}
        title={onNavigateToLanding ? 'Return to Landing Page' : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-xs border border-[#E2E8F0] bg-white flex items-center justify-center">
            <img src="/abstract.png" alt="Keepr Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-semibold text-base text-[#0F172A] tracking-tight leading-none">
              Keepr
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
        {onNavigateToLanding && (
          <button
            onClick={onNavigateToLanding}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-[#45464D] hover:text-[#0F172A] hover:bg-[#F9F9FB] transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#76777D]" />
            <span>Landing Overview</span>
          </button>
        )}
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
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-7 h-7 rounded-full border border-[#CBD5E1] object-cover shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
              {user?.displayName
                ? user.displayName.slice(0, 2).toUpperCase()
                : user?.email
                ? user.email.slice(0, 2).toUpperCase()
                : 'KP'}
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] font-medium text-[#0F172A] leading-none truncate">
              {user?.displayName || 'Active Account'}
            </span>
            <span className="text-[10px] font-mono-code text-[#76777D] mt-0.5 truncate">
              {user?.email || 'Protected Enclave'}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            if (onNavigateToLanding) onNavigateToLanding();
          }}
          className="p-1.5 text-[#76777D] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </motion.aside>
  );
};
