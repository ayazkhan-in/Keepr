import React from 'react';
import {
  RotateCcw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { PurchaseItem } from '../types';

interface ReturnsViewProps {
  purchases: PurchaseItem[];
  onSelectPurchase: (item: PurchaseItem) => void;
  onTriggerReturn: (item: PurchaseItem) => void;
}

export const ReturnsView: React.FC<ReturnsViewProps> = ({
  purchases,
  onSelectPurchase,
  onTriggerReturn,
}) => {
  const returnEligibleItems = purchases.filter((p) => p.returnWindow.hasReturn);
  const activeReturns = returnEligibleItems.filter(
    (p) => p.returnWindow.status !== 'closed'
  );
  const closedReturns = returnEligibleItems.filter(
    (p) => p.returnWindow.status === 'closed'
  );

  const totalAtRisk = activeReturns.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight">
          Return Deadlines
        </h1>
        <p className="text-[13px] text-[#76777D] mt-1">
          Monitor closing return windows and generate one-click merchant refund requests.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#76777D] mb-1">
            <span className="font-mono-code text-[11px] uppercase font-semibold">
              Capital at Risk
            </span>
            <DollarSign className="w-4 h-4 text-[#94A3B8]" />
          </div>
          <p className="font-mono-code text-2xl md:text-3xl font-semibold text-[#0F172A] mt-2">
            ${totalAtRisk.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-[#76777D] mt-1">
            Across {activeReturns.length} active return windows
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#76777D] mb-1">
            <span className="font-mono-code text-[11px] uppercase font-semibold">
              Closing This Week
            </span>
            <Clock className="w-4 h-4 text-[#DC2626]" />
          </div>
          <p className="font-mono-code text-2xl md:text-3xl font-semibold text-[#DC2626] mt-2">
            2 Items
          </p>
          <p className="text-[11px] text-[#76777D] mt-1">
            MacBook Pro (3d) · Sony XM5 (2d)
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#76777D] mb-1">
            <span className="font-mono-code text-[11px] uppercase font-semibold">
              Return Success Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="font-mono-code text-2xl md:text-3xl font-semibold text-[#0F172A] mt-2">
            100%
          </p>
          <p className="text-[11px] text-[#76777D] mt-1">
            0 missed return deadlines on record
          </p>
        </div>
      </div>

      {/* Active Return Windows */}
      <section className="space-y-3">
        <h3 className="font-mono-code text-[11px] uppercase tracking-wider text-[#76777D] font-semibold">
          Active Return Windows
        </h3>

        <div className="space-y-3">
          {activeReturns.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPurchase(item)}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#94A3B8] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-[14px] text-[#0F172A]">{item.name}</h4>
                      <span className="font-mono-code text-[10px] bg-[#FEE2E2] text-[#991B1B] px-2.5 py-0.5 rounded-full font-semibold border border-[#FECACA]">
                        CLOSING SOON
                      </span>
                    </div>
                    <p className="text-[12px] text-[#76777D] mt-0.5">
                      {item.vendor} · Order #{item.orderNumber || 'N/A'} · Purchased on {item.purchaseDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <p className="font-mono-code text-[14px] font-semibold text-[#0F172A]">
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-[#DC2626] font-mono-code">
                      Deadline: {item.returnWindow.deadlineDate}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerReturn(item);
                    }}
                    className="bg-[#0F172A] text-white px-4 py-2 rounded-xl text-[12px] font-medium hover:bg-[#1E293B] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Draft Return Email</span>
                  </button>
                </div>
              </div>

              {/* Policy note */}
              <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] text-[#76777D]">
                <span>Policy: {item.returnWindow.policy}</span>
                {item.returnWindow.restockingFee && (
                  <span className="font-mono-code text-[11px] text-[#B45309]">
                    Restocking Fee: {item.returnWindow.restockingFee}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Historical / Closed Return Windows */}
      <section className="space-y-3">
        <h3 className="font-mono-code text-[11px] uppercase tracking-wider text-[#76777D] font-semibold">
          Closed Return Windows ({closedReturns.length})
        </h3>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl divide-y divide-[#F1F5F9] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          {closedReturns.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPurchase(item)}
              className="p-3.5 flex items-center justify-between hover:bg-[#F9F9FB] transition-colors cursor-pointer text-[13px]"
            >
              <div>
                <p className="font-medium text-[#0F172A]">{item.name}</p>
                <p className="text-[11px] text-[#76777D]">
                  {item.vendor} · Expired on {item.returnWindow.deadlineDate}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono-code text-[11px] text-[#94A3B8] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full">
                  Window Closed
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
