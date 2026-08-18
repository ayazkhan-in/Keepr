import React, { useState } from 'react';
import {
  Vault,
  FileText,
  Download,
  Eye,
  Plus,
  Search,
  Check,
  ShieldCheck,
  Receipt,
  FileCheck,
  ExternalLink,
  X,
} from 'lucide-react';
import { PurchaseItem, DocumentItem } from '../types';

interface VaultViewProps {
  purchases: PurchaseItem[];
  openScanner: () => void;
  onSelectPurchase: (item: PurchaseItem) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  purchases,
  openScanner,
  onSelectPurchase,
}) => {
  const [activeType, setActiveType] = useState<string>('all');
  const [vaultSearch, setVaultSearch] = useState<string>('');
  const [previewDoc, setPreviewDoc] = useState<{
    doc: DocumentItem;
    purchase: PurchaseItem;
  } | null>(null);

  // Flatten all documents from all purchases
  const allDocuments = purchases.flatMap((p) =>
    p.documents.map((d) => ({
      ...d,
      purchase: p,
    }))
  );

  const filteredDocs = allDocuments.filter((item) => {
    if (activeType !== 'all' && item.type !== activeType) return false;
    if (vaultSearch) {
      const q = vaultSearch.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.purchase.name.toLowerCase().includes(q) ||
        item.purchase.vendor.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getDocBadge = (type: string) => {
    switch (type) {
      case 'receipt':
        return (
          <span className="font-mono-code text-[10px] bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded border border-[#E2E8F0] uppercase">
            Receipt
          </span>
        );
      case 'invoice':
        return (
          <span className="font-mono-code text-[10px] bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded border border-[#A7F3D0] uppercase">
            Invoice
          </span>
        );
      case 'warranty_card':
        return (
          <span className="font-mono-code text-[10px] bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded border border-[#FDE68A] uppercase">
            Warranty Card
          </span>
        );
      default:
        return (
          <span className="font-mono-code text-[10px] bg-[#F1F5F9] text-[#76777D] px-2 py-0.5 rounded uppercase">
            Document
          </span>
        );
    }
  };

  const handleDownloadDoc = (doc: DocumentItem) => {
    // Generate text/mock file or trigger download
    const dummyContent = `Keepr Vault Document: ${doc.name}\nUpload Date: ${doc.uploadDate}\nFile Size: ${doc.fileSize}\nVerified by Keepr AI OCR Engine.`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight">
            Document Vault
          </h1>
          <p className="text-[13px] text-[#76777D] mt-1">
            Encrypted vault storing all original invoices, store receipts, and warranty slips.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openScanner}
            className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#1E293B] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3">
        {/* Type pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Documents' },
            { id: 'receipt', label: 'Receipts' },
            { id: 'invoice', label: 'Invoices' },
            { id: 'warranty_card', label: 'Warranty Slips' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-colors cursor-pointer ${
                activeType === tab.id
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-[#F9F9FB] text-[#45464D] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#94A3B8]" />
          <input
            type="text"
            value={vaultSearch}
            onChange={(e) => setVaultSearch(e.target.value)}
            placeholder="Search vault documents..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#F9F9FB] border border-[#E2E8F0] rounded-xl text-[12px] text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDocs.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden hover:border-[#94A3B8] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] group flex flex-col justify-between"
          >
            {/* Visual Thumbnail / Preview header */}
            <div
              onClick={() => setPreviewDoc({ doc: item, purchase: item.purchase })}
              className="h-36 bg-[#F8FAFC] border-b border-[#E2E8F0] relative overflow-hidden flex items-center justify-center cursor-pointer"
            >
              {item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-[#94A3B8]">
                  <FileText className="w-8 h-8" />
                  <span className="text-[10px] font-mono-code">PDF INVOICE</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="bg-white text-[#0F172A] text-[12px] font-medium px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </span>
              </div>

              <div className="absolute top-2 left-2">{getDocBadge(item.type)}</div>
            </div>

            {/* Document Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4
                  onClick={() => onSelectPurchase(item.purchase)}
                  className="font-medium text-[13px] text-[#0F172A] hover:underline cursor-pointer line-clamp-1"
                  title={item.name}
                >
                  {item.name}
                </h4>
                <p className="text-[11px] text-[#76777D] mt-0.5">
                  Linked to: {item.purchase.name} (${item.purchase.price.toFixed(2)})
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#76777D] font-mono-code">
                <span>{item.fileSize}</span>
                <button
                  onClick={() => handleDownloadDoc(item)}
                  className="p-1.5 text-[#45464D] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFAFC]">
              <div>
                <h3 className="font-medium text-[14px] text-[#0F172A]">{previewDoc.doc.name}</h3>
                <p className="text-[11px] text-[#76777D] font-mono-code">
                  Uploaded {previewDoc.doc.uploadDate} · {previewDoc.doc.fileSize}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-[#76777D] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-[#F8FAFC] flex flex-col items-center justify-center min-h-[300px]">
              {previewDoc.doc.fileUrl ? (
                <img
                  src={previewDoc.doc.fileUrl}
                  alt={previewDoc.doc.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[380px] object-contain rounded-xl border border-[#E2E8F0] shadow-xs"
                />
              ) : (
                <FileText className="w-16 h-16 text-[#CBD5E1]" />
              )}
            </div>

            <div className="p-4 border-t border-[#E2E8F0] flex justify-between items-center bg-white">
              <button
                onClick={() => onSelectPurchase(previewDoc.purchase)}
                className="text-[12px] text-[#0F172A] font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Purchase Record</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDownloadDoc(previewDoc.doc)}
                className="bg-[#0F172A] text-white px-4 py-2 rounded-xl text-[12px] font-medium hover:bg-[#1E293B] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
