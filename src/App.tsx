import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { PurchasesView } from './components/PurchasesView';
import { WarrantiesView } from './components/WarrantiesView';
import { ReturnsView } from './components/ReturnsView';
import { VaultView } from './components/VaultView';
import { AnalyticsView } from './components/AnalyticsView';
import { TimelineView } from './components/TimelineView';
import { ReceiptScannerModal } from './components/ReceiptScannerModal';
import { PurchaseDetailModal } from './components/PurchaseDetailModal';
import { AIClaimModal } from './components/AIClaimModal';
import { CommandPalette } from './components/CommandPalette';
import { SettingsModal } from './components/SettingsModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './context/AuthContext';
import { ActiveView, PurchaseItem, AIActionItem } from './types';
import { INITIAL_PURCHASES, INITIAL_ACTIONS } from './data/mockData';
import {
  subscribePurchases,
  addPurchaseToDb,
  deletePurchaseFromDb,
  seedPurchasesIfEmpty
} from './services/purchaseService';

type AppRoute = 'landing' | 'auth' | 'app';

export function App() {
  const { user } = useAuth();

  // Route state: default to 'landing', check pathname first, then fallback to hash
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/auth' || hash === '#auth') return 'auth';
      if (path === '/app' || hash === '#app') return 'app';
    }
    return 'landing';
  });

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      const targetPath = route === 'landing' ? '/' : `/${route}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/auth' || hash === '#auth') setCurrentRoute('auth');
      else if (path === '/app' || hash === '#app') setCurrentRoute('app');
      else setCurrentRoute('landing');
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [purchases, setPurchases] = useState<PurchaseItem[]>(() => {
    try {
      const saved = localStorage.getItem('keepr_purchases_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PURCHASES;
  });

  const [actions, setActions] = useState<AIActionItem[]>(INITIAL_ACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean>(true);

  const [claimModalState, setClaimModalState] = useState<{
    isOpen: boolean;
    purchase: PurchaseItem | null;
    mode: 'warranty_claim' | 'return_request';
  }>({
    isOpen: false,
    purchase: null,
    mode: 'warranty_claim',
  });

  // Subscribe to real-time Firestore database updates (user-scoped)
  useEffect(() => {
    const userId = user?.uid;
    seedPurchasesIfEmpty(INITIAL_PURCHASES, userId);

    const unsubscribe = subscribePurchases(
      (items) => {
        if (items && items.length > 0) {
          setPurchases(items);
        }
        setDbConnected(true);
      },
      (_error) => {
        setDbConnected(false);
      },
      userId
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Persist purchases locally as fallback cache
  useEffect(() => {
    try {
      localStorage.setItem('keepr_purchases_v1', JSON.stringify(purchases));
    } catch (e) {
      console.error(e);
    }
  }, [purchases]);

  // Global keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddPurchase = async (newPurchase: PurchaseItem) => {
    setPurchases((prev) => [newPurchase, ...prev]);
    try {
      await addPurchaseToDb(newPurchase, user?.uid);
    } catch (err) {
      console.warn('Failed to sync new purchase to Firestore (using local state):', err);
    }

    // Automatically send an instant email alert if product has a warranty or return deadline
    if (newPurchase.warranty?.hasWarranty || newPurchase.returnWindow?.hasReturn) {
      try {
        const recipientEmail = user?.email || 'onboarding@resend.dev';
        fetch('/api/warranty/send-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchase: newPurchase,
            recipientEmail: recipientEmail,
          }),
        }).catch((e) => console.warn('Instant warranty/return email alert notice:', e.message));
      } catch (e) {
        console.warn('Failed to trigger instant email:', e);
      }
    }
  };

  const handleDeletePurchase = async (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    try {
      await deletePurchaseFromDb(id, user?.uid);
    } catch (err) {
      console.warn('Failed to delete purchase from Firestore (using local state):', err);
    }
  };

  const handleTriggerClaim = (purchase: PurchaseItem) => {
    setClaimModalState({
      isOpen: true,
      purchase,
      mode: 'warranty_claim',
    });
  };

  const handleTriggerReturn = (purchase: PurchaseItem) => {
    setClaimModalState({
      isOpen: true,
      purchase,
      mode: 'return_request',
    });
  };

  // Calculate closing return windows count for badge
  const riskCount = purchases.filter(
    (p) => p.returnWindow.hasReturn && p.returnWindow.status === 'expiring_soon'
  ).length;

  // ROUTE 1: Landing Page (Default)
  if (currentRoute === 'landing') {
    return (
      <LandingPage
        onNavigateToAuth={() => navigateTo('auth')}
        onNavigateToApp={() => navigateTo('app')}
      />
    );
  }

  // ROUTE 2: Auth Page
  if (currentRoute === 'auth') {
    return (
      <AuthPage
        onBackToLanding={() => navigateTo('landing')}
        onLoginSuccess={() => navigateTo('app')}
      />
    );
  }

  // ROUTE 3: Main Dashboard App
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(12px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex h-screen w-full text-[#1A1C1D] overflow-hidden font-sans p-3 md:p-3.5 gap-3.5 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Floating Left Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        riskCount={riskCount}
        openScanner={() => setIsScannerOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
        onNavigateToLanding={() => navigateTo('landing')}
      />

      {/* Main Content Area (Floating Panel) */}
      <motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
        className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white rounded-2xl border border-[#E2E8F0] shadow-sm"
      >
        {/* Top Bar */}
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openCommandPalette={() => setIsCommandPaletteOpen(true)}
          openScanner={() => setIsScannerOpen(true)}
          openAIChat={() => setIsAIChatOpen(true)}
          activeView={activeView}
          setActiveView={setActiveView}
          openSettings={() => setIsSettingsOpen(true)}
          riskCount={riskCount}
          dbConnected={dbConnected}
          openAuthModal={() => setIsAuthModalOpen(true)}
          onNavigateToLanding={() => navigateTo('landing')}
        />

        {/* Viewport Screen with smooth scrolling & blur transition between tabs */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {activeView === 'dashboard' && (
                <DashboardView
                  purchases={purchases}
                  actions={actions}
                  setActiveView={setActiveView}
                  openScanner={() => setIsScannerOpen(true)}
                  onSelectPurchase={(item) => setSelectedPurchase(item)}
                  onTriggerClaim={handleTriggerClaim}
                  onTriggerReturn={handleTriggerReturn}
                />
              )}

              {activeView === 'purchases' && (
                <PurchasesView
                  purchases={purchases}
                  openScanner={() => setIsScannerOpen(true)}
                  onSelectPurchase={(item) => setSelectedPurchase(item)}
                  onDeletePurchase={handleDeletePurchase}
                  onTriggerClaim={handleTriggerClaim}
                  onTriggerReturn={handleTriggerReturn}
                />
              )}

              {activeView === 'warranties' && (
                <WarrantiesView
                  purchases={purchases}
                  onSelectPurchase={(item) => setSelectedPurchase(item)}
                  onTriggerClaim={handleTriggerClaim}
                  onTriggerReturn={handleTriggerReturn}
                />
              )}

              {activeView === 'returns' && (
                <ReturnsView
                  purchases={purchases}
                  onSelectPurchase={(item) => setSelectedPurchase(item)}
                  onTriggerReturn={handleTriggerReturn}
                />
              )}

              {activeView === 'vault' && (
                <VaultView
                  purchases={purchases}
                  openScanner={() => setIsScannerOpen(true)}
                  onSelectPurchase={(item) => setSelectedPurchase(item)}
                  onDeletePurchase={handleDeletePurchase}
                />
              )}

              {activeView === 'analytics' && (
                <AnalyticsView
                  purchases={purchases}
                  onSelectPurchase={(item) => setSelectedPurchase(item)}
                />
              )}

              {activeView === 'timeline' && (
                <TimelineView
                  purchases={purchases}
                  onSelectPurchase={(item) => setSelectedPurchase(item)}
                  onTriggerClaim={handleTriggerClaim}
                  onTriggerReturn={handleTriggerReturn}
                />
              )}

              {activeView === 'settings' && (
                <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 max-w-2xl">
                  <h2 className="text-xl font-semibold text-[#0F172A]">Application Settings</h2>
                  <p className="text-[13px] text-[#76777D] mt-1 mb-6">
                    Manage preferences, default currency, and AI scanning parameters.
                  </p>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-4 py-2 bg-[#0F172A] text-white rounded text-[13px] font-medium"
                  >
                    Open Detailed Preferences
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Interactive Modals */}
      <ReceiptScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSavePurchase={handleAddPurchase}
      />

      <PurchaseDetailModal
        purchase={selectedPurchase}
        isOpen={Boolean(selectedPurchase)}
        onClose={() => setSelectedPurchase(null)}
        onDelete={handleDeletePurchase}
        onTriggerClaim={handleTriggerClaim}
        onTriggerReturn={handleTriggerReturn}
      />

      <AIClaimModal
        isOpen={claimModalState.isOpen}
        onClose={() =>
          setClaimModalState({ isOpen: false, purchase: null, mode: 'warranty_claim' })
        }
        purchase={claimModalState.purchase}
        mode={claimModalState.mode}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        purchases={purchases}
        setActiveView={setActiveView}
        onSelectPurchase={(item) => setSelectedPurchase(item)}
        openScanner={() => setIsScannerOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        purchases={purchases}
        onSelectPurchase={(item) => setSelectedPurchase(item)}
        onTriggerClaim={handleTriggerClaim}
        onTriggerReturn={handleTriggerReturn}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </motion.div>
  );
}

export default App;
