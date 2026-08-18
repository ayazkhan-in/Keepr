import React, { useState } from 'react';
import {
  Download,
  Scan,
  LayoutList,
  LayoutGrid,
  Filter,
  Calendar,
  DollarSign,
  Sparkles,
  MoreVertical,
  Laptop,
  Armchair,
  Terminal,
  Printer,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  FileText,
  Trash2,
} from 'lucide-react';
import { PurchaseItem, CategoryType } from '../types';

interface PurchasesViewProps {
  purchases: PurchaseItem[];
  openScanner: () => void;
  onSelectPurchase: (item: PurchaseItem) => void;
  onDeletePurchase: (id: string) => void;
  onTriggerClaim: (item: PurchaseItem) => void;
  onTriggerReturn: (item: PurchaseItem) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  purchases,
  openScanner,
  onSelectPurchase,
  onDeletePurchase,
  onTriggerClaim,
  onTriggerReturn,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [timeFilter, setTimeFilter] = useState<string>('All Time');
  const [priceFilter, setPriceFilter] = useState<string>('Any Price');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter purchases
  const filtered = purchases.filter((item) => {
    if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
      return false;
    }
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.vendor.toLowerCase().includes(q) ||
        (item.orderNumber && item.orderNumber.toLowerCase().includes(q)) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(q)) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (priceFilter === 'Under $200' && item.price >= 200) return false;
    if (priceFilter === '$200 - $1,000' && (item.price < 200 || item.price > 1000)) return false;
    if (priceFilter === 'Over $1,000' && item.price <= 1000) return false;

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const itemsToExport =
      selectedIds.length > 0
        ? purchases.filter((p) => selectedIds.includes(p.id))
        : purchases;

    const headers = 'ID,Name,Vendor,Category,Purchase Date,Price,Warranty Expiry,Return Deadline,Serial Number\n';
    const rows = itemsToExport
      .map(
        (p) =>
          `"${p.id}","${p.name}","${p.vendor}","${p.category}","${p.purchaseDate}",${p.price},"${p.warranty.expiryDate}","${p.returnWindow.deadlineDate}","${p.serialNumber || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `keepr_purchases_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'Electronics':
        return <Laptop className="w-4 h-4 text-[#76777D]" />;
      case 'Office Furniture':
        return <Armchair className="w-4 h-4 text-[#76777D]" />;
      case 'Software':
        return <Terminal className="w-4 h-4 text-[#76777D]" />;
      default:
        return <Printer className="w-4 h-4 text-[#76777D]" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header with Export and Scan */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight">
            Purchases
          </h1>
          <p className="text-[13px] text-[#76777D] mt-1">
            Manage and track your entire purchase history with AI extraction.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white border border-[#E2E8F0] text-[#0F172A] px-3.5 py-2 rounded-xl text-[13px] font-medium hover:bg-[#F9F9FB] transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#76777D]" />
            <span>Export ({selectedIds.length > 0 ? selectedIds.length : 'All'})</span>
          </button>
          <button
            onClick={openScanner}
            className="flex items-center gap-2 bg-[#0F172A] text-white px-3.5 py-2 rounded-xl text-[13px] font-medium hover:bg-[#1E293B] transition-colors shadow-xs group cursor-pointer"
          >
            <Scan className="w-4 h-4 group-hover:rotate-6 transition-transform" />
            <span>Scan Receipt</span>
          </button>
        </div>
      </div>

      {/* Filter and View Mode Controls Bar */}
      <div className="bg-white border border-[#E2E8F0] p-2.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: View Switcher + Category */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border-r border-[#E2E8F0] pr-2.5 gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#94A3B8] hover:text-[#0F172A]'
              }`}
              title="List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#94A3B8] hover:text-[#0F172A]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-[13px] font-medium text-[#0F172A] pl-2 pr-7 py-1 focus:ring-0 cursor-pointer appearance-none"
            >
              <option value="All Categories">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Office Furniture">Office Furniture</option>
              <option value="Software">Software</option>
              <option value="Appliances">Appliances</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Search box inside filter */}
          <div className="hidden sm:flex items-center bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 w-44 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] mr-1.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter..."
              className="bg-transparent text-[12px] w-full focus:outline-none placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        {/* Right: Date, Price, AI Insights Toggle */}
        <div className="flex items-center gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-[12px] text-[#45464D] border border-[#E2E8F0] bg-[#F9F9FB] px-3 py-1.5 rounded-xl hover:border-[#94A3B8] transition-colors focus:ring-0 cursor-pointer font-medium"
          >
            <option value="All Time">All Time</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
            <option value="This Year">This Year</option>
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="text-[12px] text-[#45464D] border border-[#E2E8F0] bg-[#F9F9FB] px-3 py-1.5 rounded-xl hover:border-[#94A3B8] transition-colors focus:ring-0 cursor-pointer font-medium"
          >
            <option value="Any Price">Any Price</option>
            <option value="Under $200">Under $200</option>
            <option value="$200 - $1,000">$200 - $1,000</option>
            <option value="Over $1,000">Over $1,000</option>
          </select>

          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              showAIInsights
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'text-[#45464D] border-dashed border-[#CBD5E1] bg-[#F9F9FB] hover:border-[#76777D]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Insights</span>
          </button>
        </div>
      </div>

      {/* AI Insights Banner (when toggled) */}
      {showAIInsights && (
        <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl relative ai-border-subtle animate-in fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#0F172A]" />
            <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#0F172A] font-semibold">
              Purchase Intelligence Summary
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px] text-[#45464D]">
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
              <p className="font-semibold text-[#0F172A]">Tax Deductions Identified</p>
              <p className="mt-0.5 text-[#76777D]">
                5 hardware items ($7,389.50) marked tax deductible for FY2023.
              </p>
            </div>
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
              <p className="font-semibold text-[#0F172A]">Warranty Coverage Rate</p>
              <p className="mt-0.5 text-[#76777D]">
                87.5% of electronic hardware currently protected under valid warranty.
              </p>
            </div>
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
              <p className="font-semibold text-[#0F172A]">Return Velocity</p>
              <p className="mt-0.5 text-[#76777D]">
                2 items eligible for full refund within the next 48-72 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* List View Table */}
      {viewMode === 'list' ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#FAFAFC]">
                  <th className="py-3 px-4 font-mono-code text-[11px] text-[#76777D] uppercase tracking-wider font-semibold w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                      onChange={toggleSelectAll}
                      className="rounded border-[#CBD5E1] text-[#0F172A] focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </th>
                  <th className="py-3 px-4 font-mono-code text-[11px] text-[#76777D] uppercase tracking-wider font-semibold">
                    Item Details
                  </th>
                  <th className="py-3 px-4 font-mono-code text-[11px] text-[#76777D] uppercase tracking-wider font-semibold">
                    Vendor
                  </th>
                  <th className="py-3 px-4 font-mono-code text-[11px] text-[#76777D] uppercase tracking-wider font-semibold text-right">
                    Date
                  </th>
                  <th className="py-3 px-4 font-mono-code text-[11px] text-[#76777D] uppercase tracking-wider font-semibold text-right">
                    Price
                  </th>
                  <th className="py-3 px-4 font-mono-code text-[11px] text-[#76777D] uppercase tracking-wider font-semibold">
                    Status
                  </th>
                  <th className="py-3 px-4 font-mono-code text-[11px] text-[#76777D] uppercase tracking-wider font-semibold w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F9F9FB] transition-colors group cursor-pointer"
                      onClick={() => onSelectPurchase(item)}
                    >
                      <td
                        className="py-3 px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectItem(item.id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-[#CBD5E1] text-[#0F172A] focus:ring-0 cursor-pointer w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#F1F5F9] flex items-center justify-center shrink-0 border border-[#E2E8F0] relative">
                            {getItemIcon(item.category)}
                            {item.aiConfidence && item.aiConfidence > 0.9 && (
                              <div
                                className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center border border-[#E2E8F0]"
                                title="AI Extracted"
                              >
                                <Sparkles className="w-2 h-2 text-[#76777D]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[#0F172A] text-[13px] flex items-center gap-1.5">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-[#76777D] mt-0.5">
                              {item.category} {item.tags.length > 0 ? `• ${item.tags[0]}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[13px] text-[#0F172A]">{item.vendor}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono-code text-[12px] text-[#45464D]">
                          {item.purchaseDate}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono-code text-[13px] font-medium text-[#0F172A]">
                          ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {item.returnWindow.hasReturn &&
                          item.returnWindow.status === 'expiring_soon' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-mono-code text-[11px] font-medium border border-[#FDE68A]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                              Return: {item.returnWindow.returnDays} Days
                            </span>
                          ) : item.warranty.hasWarranty ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] font-mono-code text-[11px] font-medium border border-[#A7F3D0]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                              Active Warranty
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#76777D] font-mono-code text-[11px]">
                              N/A
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setActiveMenuId(activeMenuId === item.id ? null : item.id)
                            }
                            className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === item.id && (
                            <div className="origin-top-right absolute right-0 mt-1 w-44 rounded-xl shadow-xl bg-white border border-[#E2E8F0] py-1.5 z-30 animate-in fade-in overflow-hidden">
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onSelectPurchase(item);
                                }}
                                className="w-full text-left px-3 py-1.5 text-[12px] text-[#0F172A] hover:bg-[#F9F9FB] flex items-center gap-2 cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#76777D]" />
                                View Details
                              </button>
                              {item.warranty.hasWarranty && (
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onTriggerClaim(item);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-[12px] text-[#0F172A] hover:bg-[#F9F9FB] flex items-center gap-2 cursor-pointer"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                                  Draft AI Claim
                                </button>
                              )}
                              {item.returnWindow.hasReturn && (
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onTriggerReturn(item);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-[12px] text-[#0F172A] hover:bg-[#F9F9FB] flex items-center gap-2 cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-[#F59E0B]" />
                                  Draft Return Email
                                </button>
                              )}
                              <div className="border-t border-[#F1F5F9] my-1" />
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onDeletePurchase(item.id);
                                }}
                                className="w-full text-left px-3 py-1.5 text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                                Remove Item
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-[#E2E8F0] p-3.5 flex items-center justify-between bg-white">
            <div className="text-[12px] text-[#76777D] font-mono-code">
              Showing 1-{filtered.length} of {purchases.length} items
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="p-1 rounded-lg text-[#CBD5E1] cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium bg-[#0F172A] text-white">
                1
              </button>
              <button
                disabled
                className="p-1 rounded-lg text-[#CBD5E1] cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPurchase(item)}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#94A3B8] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F9F9FB] border border-[#E2E8F0] flex items-center justify-center">
                    {getItemIcon(item.category)}
                  </div>
                  <span className="font-mono-code text-[14px] font-semibold text-[#0F172A]">
                    ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <h3 className="font-medium text-[14px] text-[#0F172A] line-clamp-1">{item.name}</h3>
                <p className="text-[12px] text-[#76777D] mt-0.5">
                  {item.vendor} · {item.purchaseDate}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                {item.warranty.hasWarranty ? (
                  <span className="text-[11px] font-mono-code text-[#065F46] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                    Warranty Active
                  </span>
                ) : (
                  <span className="text-[11px] font-mono-code text-[#76777D] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full">
                    No Warranty
                  </span>
                )}
                <span className="text-[11px] text-[#0F172A] font-medium hover:underline">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
