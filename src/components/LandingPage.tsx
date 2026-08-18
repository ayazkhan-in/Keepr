import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Layers,
  Scan,
  Timer,
  ShieldCheck,
  FileText,
  DollarSign,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Receipt,
  Cpu,
  Bot,
  Calendar,
  Check,
  HelpCircle,
  ExternalLink,
  Laptop,
  Smartphone,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToAuth: () => void;
  onNavigateToApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToAuth,
  onNavigateToApp,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'scanner' | 'warranties' | 'returns' | 'vault'>('scanner');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: 'What types of documents can Keepr ingest?',
      a: 'Keepr accepts camera photos (JPG, PNG, WebP), scanned PDF invoices, e-commerce digital invoices (Amazon, Apple Store, Best Buy), and warranty slips. Our Gemini 3.7 multimodal pipeline automatically extracts item names, serial numbers, tax amounts, and merchant return terms.',
    },
    {
      q: 'How does Keepr protect return deadlines?',
      a: 'When an invoice is scanned, Keepr identifies the store return policy (e.g. 14 days, 30 days, or holiday policy) and calculates the exact expiry date. You receive proactive notifications 7 days, 3 days, and 24 hours before the deadline closes so you never forfeit refunds.',
    },
    {
      q: 'Can I generate formal warranty claims and refund requests?',
      a: 'Yes! Keepr includes an AI Claim Filing assistant. If an item malfunctions or you need a refund, Keepr generates an evidence-backed email draft with order numbers, purchase dates, serials, and attached invoice proofs ready to send to the merchant or manufacturer.',
    },
    {
      q: 'Can I export my data for tax deduction preparation?',
      a: 'Yes. Keepr automatically tags business hardware and eligible tax deductions. You can export structured CSV or Excel spreadsheets anytime with categorized line items, purchase proofs, and Schedule C tax deduction summaries.',
    },
    {
      q: 'Is my financial and receipt data private and secure?',
      a: 'Yes. Keepr uses bank-grade AES-256 zero-knowledge encryption at rest and in transit. Your invoices, receipts, and personal purchase trends remain strictly in your private enclave and are never sold to third-party advertisers.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1C1D] font-sans selection:bg-[#0F172A] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#F8F9FA]/95 backdrop-blur-md border-b border-[#E2E8F0]/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/abstract.png" alt="Keepr Logo" className="w-9 h-9 object-contain" />
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-semibold text-xl text-[#0F172A] tracking-tight">Keepr</span>
              <span className="text-[10px] font-mono-code bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded-full border border-[#A7F3D0] font-semibold">
                AI
              </span>
            </div>
          </div>

          {/* Desktop Center Links */}
          <nav className="hidden md:flex items-center gap-9 text-[14px] text-[#45464D]">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#0F172A] font-medium transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Showcase
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToAuth}
              className="text-[13px] font-medium text-[#0F172A] px-5 py-2 rounded-full border border-[#E2E8F0] hover:bg-black/5 transition-colors cursor-pointer bg-white"
            >
              Log in
            </button>
            <button
              onClick={onNavigateToApp}
              className="text-[13px] font-medium bg-[#00C48C] text-white px-5 py-2 rounded-full hover:bg-[#00B07D] transition-all cursor-pointer shadow-xs"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-20 sm:space-y-28">
        {/* SECTION 1: HERO SECTION (Edge-to-Edge with Features Cutout, No Artifacts) */}
        <section className="relative">
          {/* Main Hero Card with bg.jpg */}
          <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden min-h-[600px] sm:min-h-[660px] lg:min-h-[720px] flex flex-col justify-between p-7 sm:p-12 lg:p-16 bg-[#F8F9FA] border-0 outline-none ring-0 shadow-none">
            {/* Background Image Layer */}
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: "url('/bg.jpg')" }}
            />

            {/* Ambient Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 pointer-events-none" />

            {/* Top Label inside Hero (Plain Text, No Pill) */}
            <div className="relative z-10">
              <p className="text-white/90 text-sm sm:text-[15px] font-normal tracking-wide">
                #1 Purchase & Asset Intelligence in the world
              </p>
            </div>

            {/* Main Headline & Underlined Action Links (Left Aligned) */}
            <div className="relative z-10 max-w-3xl mt-auto pb-4 lg:pb-8">
              <h1 className="font-heading font-normal text-4xl sm:text-6xl lg:text-[72px] text-white tracking-tight leading-[1.06]">
                Autonomous Asset & <br />
                Warranty Intelligence
              </h1>

              {/* Bottom-left action links with underline & diagonal arrow */}
              <div className="flex items-center gap-7 sm:gap-10 mt-8 sm:mt-12">
                <button
                  onClick={onNavigateToAuth}
                  className="inline-flex items-center gap-1.5 text-white hover:text-white/80 font-normal text-[15px] sm:text-base pb-0.5 border-b border-white hover:border-white/80 transition-all cursor-pointer"
                >
                  <span>Get in touch</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onNavigateToApp}
                  className="inline-flex items-center gap-1.5 text-white hover:text-white/80 font-normal text-[15px] sm:text-base pb-0.5 border-b border-white hover:border-white/80 transition-all cursor-pointer"
                >
                  <span>Our services</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop Signature Cutout Features Box (Seam-free overlapping curves) */}
            <div className="hidden lg:flex absolute -bottom-[2px] -right-[2px] bg-[#F8F9FA] rounded-tl-[36px] pl-12 pr-10 pt-8 pb-8 z-20 items-center gap-10 xl:gap-14 border-0 outline-none ring-0 shadow-none">
              {/* Top-right concave inverse fillet (overlapping by 1px to eliminate any subpixel seam) */}
              <svg
                className="absolute -top-[36px] -right-[1px] w-[37px] h-[37px] pointer-events-none fill-[#F8F9FA] border-0 outline-none"
                viewBox="0 0 37 37"
                style={{ shapeRendering: 'geometricPrecision' }}
              >
                <path d="M0,37 A36,36 0 0,0 37,0 L37,37 Z" fill="#F8F9FA" />
              </svg>

              {/* Bottom-left concave inverse fillet (overlapping by 1px to eliminate any subpixel seam) */}
              <svg
                className="absolute -bottom-[1px] -left-[36px] w-[37px] h-[37px] pointer-events-none fill-[#F8F9FA] border-0 outline-none"
                viewBox="0 0 37 37"
                style={{ shapeRendering: 'geometricPrecision' }}
              >
                <path d="M37,0 A36,36 0 0,1 0,37 L37,37 Z" fill="#F8F9FA" />
              </svg>

              {/* Feature 1 */}
              <div>
                <Scan className="w-9 h-9 text-[#059669] mb-3" strokeWidth={1.75} />
                <h4 className="font-heading font-semibold text-lg sm:text-xl text-[#0F172A] tracking-tight whitespace-nowrap">
                  AI Receipt Parser
                </h4>
              </div>

              {/* Feature 2 */}
              <div>
                <ShieldCheck className="w-9 h-9 text-[#059669] mb-3" strokeWidth={1.75} />
                <h4 className="font-heading font-semibold text-lg sm:text-xl text-[#0F172A] tracking-tight whitespace-nowrap">
                  Warranty Shield
                </h4>
              </div>

              {/* Feature 3 */}
              <div>
                <Timer className="w-9 h-9 text-[#059669] mb-3" strokeWidth={1.75} />
                <h4 className="font-heading font-semibold text-lg sm:text-xl text-[#0F172A] tracking-tight whitespace-nowrap">
                  Return Safeguard
                </h4>
              </div>
            </div>
          </div>

          {/* Mobile Features Row (Below hero on small screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 pb-2 lg:hidden">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] flex items-center gap-4">
              <Scan className="w-8 h-8 text-[#059669] shrink-0" strokeWidth={1.75} />
              <h4 className="font-heading font-semibold text-base text-[#0F172A]">AI Receipt Parser</h4>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-[#059669] shrink-0" strokeWidth={1.75} />
              <h4 className="font-heading font-semibold text-base text-[#0F172A]">Warranty Shield</h4>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] flex items-center gap-4">
              <Timer className="w-8 h-8 text-[#059669] shrink-0" strokeWidth={1.75} />
              <h4 className="font-heading font-semibold text-base text-[#0F172A]">Return Safeguard</h4>
            </div>
          </div>
        </section>

        {/* SECTION 2: DUAL-TONE SPLIT HEADLINE (Matching Reference Image 1) */}
        <section id="about" className="pt-2 sm:pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-6">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.15] tracking-tight">
                <span className="text-[#0F172A]">Focusing on quality,</span>{' '}
                <span className="text-[#94A3B8]">we maintain customer trust</span>
              </h2>
            </div>
            <div className="lg:col-span-6 text-[#76777D] text-[15px] leading-relaxed lg:pt-2">
              <p>
                We ensure that every invoice, receipt, and warranty slip stored in Keepr undergoes strict neural OCR validation. Sustainable automated solutions for complete asset protection, return tracking, and peace of mind.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: 6-GRID FEATURE SECTION (Matching Reference Image 2) */}
        <section id="features" className="space-y-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight">
              <span className="text-[#0F172A]">We offer intelligence,</span>{' '}
              <span className="text-[#94A3B8]">with the best automation and protection</span>
            </h2>
          </div>

          {/* Unified Bento Grid Card Container with Dividers */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            {/* Top Row of 3 Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
              {/* Feature 1 */}
              <div className="p-8 sm:p-10 flex flex-col justify-between hover:bg-[#FAFAFC] transition-colors group">
                <div>
                  <Scan className="w-8 h-8 text-[#059669] mb-5 group-hover:scale-105 transition-transform" strokeWidth={1.75} />
                  <h3 className="font-heading font-medium text-lg text-[#0F172A]">
                    Multimodal AI Parsing
                  </h3>
                  <p className="text-[13px] text-[#76777D] mt-2.5 leading-relaxed">
                    Every invoice, store receipt, and warranty contract is analyzed for product models, serials, and tax deductions.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-8 sm:p-10 flex flex-col justify-between hover:bg-[#FAFAFC] transition-colors group">
                <div>
                  <ShieldCheck className="w-8 h-8 text-[#059669] mb-5 group-hover:scale-105 transition-transform" strokeWidth={1.75} />
                  <h3 className="font-heading font-medium text-lg text-[#0F172A]">
                    Autonomous Warranty Tracker
                  </h3>
                  <p className="text-[13px] text-[#76777D] mt-2.5 leading-relaxed">
                    Continuous tracking of limited manufacturer warranties, extended AppleCare, and third-party coverage terms.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-8 sm:p-10 flex flex-col justify-between hover:bg-[#FAFAFC] transition-colors group">
                <div>
                  <Timer className="w-8 h-8 text-[#059669] mb-5 group-hover:scale-105 transition-transform" strokeWidth={1.75} />
                  <h3 className="font-heading font-medium text-lg text-[#0F172A]">
                    Return Window Safeguard
                  </h3>
                  <p className="text-[13px] text-[#76777D] mt-2.5 leading-relaxed">
                    Live countdown timers alert you 7 days, 3 days, and 24 hours before retailer refund windows shut down.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row of 3 Items */}
            <div className="border-t border-[#E2E8F0]">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
                {/* Feature 4 */}
                <div className="p-8 sm:p-10 flex flex-col justify-between hover:bg-[#FAFAFC] transition-colors group">
                  <div>
                    <FileText className="w-8 h-8 text-[#059669] mb-5 group-hover:scale-105 transition-transform" strokeWidth={1.75} />
                    <h3 className="font-heading font-medium text-lg text-[#0F172A]">
                      One-Click Claim Filing
                    </h3>
                    <p className="text-[13px] text-[#76777D] mt-2.5 leading-relaxed">
                      Instant creation of formal, evidence-backed merchant refund emails and warranty claim drafts with attached proof.
                    </p>
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="p-8 sm:p-10 flex flex-col justify-between hover:bg-[#FAFAFC] transition-colors group">
                  <div>
                    <Layers className="w-8 h-8 text-[#059669] mb-5 group-hover:scale-105 transition-transform" strokeWidth={1.75} />
                    <h3 className="font-heading font-medium text-lg text-[#0F172A]">
                      Layered Vault Security
                    </h3>
                    <p className="text-[13px] text-[#76777D] mt-2.5 leading-relaxed">
                      Zero-knowledge encryption and cloud sync safeguard the complete privacy and safety of every original PDF receipt.
                    </p>
                  </div>
                </div>

                {/* Feature 6 */}
                <div className="p-8 sm:p-10 flex flex-col justify-between hover:bg-[#FAFAFC] transition-colors group">
                  <div>
                    <DollarSign className="w-8 h-8 text-[#059669] mb-5 group-hover:scale-105 transition-transform" strokeWidth={1.75} />
                    <h3 className="font-heading font-medium text-lg text-[#0F172A]">
                      Tax Deductions & Analytics
                    </h3>
                    <p className="text-[13px] text-[#76777D] mt-2.5 leading-relaxed">
                      Automated classification of business equipment versus personal expenses with single-click Schedule C export.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: INTERACTIVE PRODUCT SHOWCASE & UI PREVIEW */}
        <section id="showcase" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#059669] font-semibold">
                Live Interface
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-normal text-[#0F172A] tracking-tight mt-1">
                Explore the Keepr Workspace
              </h2>
            </div>

            {/* Tab switchers */}
            <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] p-1.5 rounded-2xl shadow-2xs overflow-x-auto">
              {[
                { id: 'scanner', label: 'AI Scanner' },
                { id: 'warranties', label: 'Warranty Matrix' },
                { id: 'returns', label: 'Return Radar' },
                { id: 'vault', label: 'Document Vault' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activePreviewTab === tab.id
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-[#45464D] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive UI Card Display */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-10 shadow-sm">
            {activePreviewTab === 'scanner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                    <Scan className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-2xl text-[#0F172A]">
                    Sub-second Multimodal OCR
                  </h3>
                  <p className="text-[14px] text-[#76777D] leading-relaxed">
                    Simply drop any receipt photo, store PDF, or screenshot. Keepr instantly extracts item name, serial number, merchant terms, and tax deduction eligibility without manual typing.
                  </p>
                  <button
                    onClick={onNavigateToApp}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#059669] hover:underline pt-2 cursor-pointer"
                  >
                    <span>Test scanner in live app</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-inner space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
                    <span className="font-mono-code text-[11px] text-[#059669] uppercase font-semibold">
                      Extraction Complete · 99.8% Confidence
                    </span>
                    <span className="text-[11px] font-mono-code text-[#76777D]">0.42s</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                      <span className="text-[#76777D]">Item</span>
                      <p className="font-semibold text-[#0F172A] mt-0.5">Sony A7IV Mirrorless</p>
                    </div>
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                      <span className="text-[#76777D]">Price</span>
                      <p className="font-semibold text-[#0F172A] mt-0.5">$2,498.00 USD</p>
                    </div>
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                      <span className="text-[#76777D]">Serial Number</span>
                      <p className="font-mono-code font-semibold text-[#0F172A] mt-0.5">SN-88219401</p>
                    </div>
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                      <span className="text-[#76777D]">Return Deadline</span>
                      <p className="font-semibold text-[#DC2626] mt-0.5">3 Days Remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'warranties' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-2xl text-[#0F172A]">
                    Automated Warranty Coverage
                  </h3>
                  <p className="text-[14px] text-[#76777D] leading-relaxed">
                    Track factory 1-year limited warranties, extended AppleCare+, and retailer protection plans in a synchronized timeline with automated RMA claim drafting.
                  </p>
                  <button
                    onClick={onNavigateToApp}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#059669] hover:underline pt-2 cursor-pointer"
                  >
                    <span>View warranty matrix in app</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
                  <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-mono-code text-[10px] text-[#059669] uppercase font-semibold">Active Coverage</span>
                      <h4 className="font-medium text-[14px] text-[#0F172A]">MacBook Pro 16" AppleCare+</h4>
                    </div>
                    <span className="font-mono-code text-xs font-semibold text-[#0F172A]">Expires Oct 2026</span>
                  </div>

                  <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-mono-code text-[10px] text-[#F59E0B] uppercase font-semibold">Expiring Soon</span>
                      <h4 className="font-medium text-[14px] text-[#0F172A]">Breville Barista Pro</h4>
                    </div>
                    <span className="font-mono-code text-xs font-semibold text-[#DC2626]">14 Days Left</span>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'returns' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                    <Timer className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-2xl text-[#0F172A]">
                    Capital Protection Radar
                  </h3>
                  <p className="text-[14px] text-[#76777D] leading-relaxed">
                    Keepr aggregates the exact total monetary value of items eligible for return this week, ensuring no merchant return deadline ever slips past unnoticed.
                  </p>
                  <button
                    onClick={onNavigateToApp}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#059669] hover:underline pt-2 cursor-pointer"
                  >
                    <span>Check return countdowns</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
                  <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl">
                    <span className="text-[11px] font-mono-code text-[#76777D] uppercase font-semibold">Capital at Risk</span>
                    <p className="font-heading font-semibold text-3xl text-[#0F172A] mt-1">$3,897.00</p>
                    <p className="text-xs text-[#DC2626] font-medium mt-1">2 items closing within 72 hours</p>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'vault' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-2xl text-[#0F172A]">
                    Encrypted Document Vault
                  </h3>
                  <p className="text-[14px] text-[#76777D] leading-relaxed">
                    Search original invoices, slips, and receipts with full-text natural language queries (⌘K). Filter by merchant, price bracket, or tax deduction status.
                  </p>
                  <button
                    onClick={onNavigateToApp}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#059669] hover:underline pt-2 cursor-pointer"
                  >
                    <span>Open vault demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
                  <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#059669]" />
                      <div>
                        <p className="text-xs font-medium text-[#0F172A]">Apple_Store_Invoice_W9928.pdf</p>
                        <p className="text-[10px] text-[#76777D]">Stored with AES-256 Encryption · 1.4 MB</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono-code bg-[#F1F5F9] px-2.5 py-0.5 rounded-md">Verified</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 6: HOW IT WORKS (3-Step Workflow) */}
        <section id="services" className="space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#059669] font-semibold">
              Simple 3-Step Setup
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-normal text-[#0F172A] tracking-tight mt-1">
              How Keepr Automates Purchase Management
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="font-mono-code text-xs font-bold text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                  STEP 01
                </span>
                <h3 className="font-heading font-medium text-xl text-[#0F172A] mt-5">
                  Capture & Upload
                </h3>
                <p className="text-[13px] text-[#76777D] mt-2.5 leading-relaxed">
                  Drag & drop any store receipt, screenshot, or PDF invoice directly into Keepr's browser interface.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="font-mono-code text-xs font-bold text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                  STEP 02
                </span>
                <h3 className="font-heading font-medium text-xl text-[#0F172A] mt-5">
                  Gemini Neural Extraction
                </h3>
                <p className="text-[13px] text-[#76777D] mt-2.5 leading-relaxed">
                  Multimodal vision models parse product models, serials, warranties, and return terms automatically.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="font-mono-code text-xs font-bold text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                  STEP 03
                </span>
                <h3 className="font-heading font-medium text-xl text-[#0F172A] mt-5">
                  Autonomous Protection
                </h3>
                <p className="text-[13px] text-[#76777D] mt-2.5 leading-relaxed">
                  Receive expiry alerts, track return countdowns, and draft formal warranty claims in one click.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: SECURITY & PRIVACY ENCLAVE */}
        <section className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#34D399] text-[11px] font-mono-code uppercase tracking-wider border border-white/10">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Knowledge Architecture</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight text-white leading-tight">
              Your sensitive financial documents remain completely confidential.
            </h2>
            <p className="text-white/70 text-[14px] leading-relaxed">
              Every document is encrypted at rest and in transit. Keepr does not sell personal spending habits or share your invoice records with advertising networks.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToAuth}
                className="bg-white text-[#0F172A] hover:bg-slate-100 px-6 py-3 rounded-full text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Create Protected Account
              </button>
              <button
                onClick={onNavigateToApp}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Try Demo Environment
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 8: FAQ ACCORDION */}
        <section id="faq" className="max-w-3xl mx-auto space-y-8 pt-4">
          <div className="text-center">
            <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#059669] font-semibold">
              Got Questions?
            </span>
            <h2 className="font-heading text-3xl font-normal text-[#0F172A] tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-medium text-[15px] text-[#0F172A] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#76777D]" /> : <ChevronDown className="w-4 h-4 text-[#76777D]" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-[13px] text-[#76777D] leading-relaxed border-t border-[#F1F5F9] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 10: CALL TO ACTION BOTTOM HERO */}
        <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="font-heading text-3xl sm:text-5xl font-normal tracking-tight text-white">
              Never let another warranty or return deadline slip away.
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Join thousands of creators and asset owners protecting their purchases with autonomous intelligence.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onNavigateToAuth}
                className="bg-[#00C48C] hover:bg-[#00B07D] text-white font-semibold text-xs px-7 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
              >
                Get Started for Free
              </button>
              <button
                onClick={onNavigateToApp}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-7 py-3.5 rounded-full border border-white/20 transition-all cursor-pointer"
              >
                Launch Demo App
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-[#E2E8F0] bg-white mt-24 py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/abstract.png" alt="Keepr Logo" className="w-8 h-8 object-contain" />
            <span className="font-heading font-semibold text-sm text-[#0F172A]">Keepr</span>
            <span className="text-[12px] text-[#76777D]">© 2026 Keepr AI Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-[12px] text-[#76777D]">
            <button onClick={onNavigateToApp} className="hover:text-[#0F172A] cursor-pointer">
              Dashboard
            </button>
            <button onClick={onNavigateToAuth} className="hover:text-[#0F172A] cursor-pointer">
              Sign In
            </button>
            <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="hover:text-[#0F172A]">
              Gemini 3.7 API
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
