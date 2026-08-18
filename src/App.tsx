import React, { useState, useEffect } from 'react';
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
import { ActiveView, PurchaseItem, AIActionItem } from './types';
import { INITIAL_PURCHASES, INITIAL_ACTIONS } from './data/mockData';

export function App() {
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
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);

  const [claimModalState, setClaimModalState] = useState<{
    isOpen: boolean;
    purchase: PurchaseItem | null;
    mode: 'warranty_claim' | 'return_request';
  }>({
    isOpen: false,
    purchase: null,
    mode: 'warranty_claim',
  });

  // Persist purchases
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

  const handleAddPurchase = (newPurchase: PurchaseItem) => {
    setPurchases((prev) => [newPurchase, ...prev]);
  };

  const handleDeletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
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

  return (
    <div className="flex h-screen w-full bg-[#F9F9FB] text-[#1A1C1D] overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        riskCount={riskCount}
        openScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openCommandPalette={() => setIsCommandPaletteOpen(true)}
          openScanner={() => setIsScannerOpen(true)}
          activeView={activeView}
          setActiveView={setActiveView}
          openSettings={() => setIsSettingsOpen(true)}
          riskCount={riskCount}
        />

        {/* Viewport Screen with smooth scrolling */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl w-full mx-auto">
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
        </main>
      </div>

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
    </div>
  );
}

export default App;
