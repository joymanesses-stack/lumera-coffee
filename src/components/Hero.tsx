import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Globe2, 
  Award, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  FileDown,
  Anchor
} from 'lucide-react';

interface HeroProps {
  onOpenQuoteModal: () => void;
  onOpenCatalogModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOpenQuoteModal,
  onOpenCatalogModal 
}) => {
  return (
    <section id="home" className="relative min-h-[95vh] flex items-center justify-center pt-36 sm:pt-44 pb-24 overflow-hidden bg-[#0B0C0D]">
      {/* Background Layer with Dark Luxury Gradient and Agricultural Terroir Texture */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform transition-transform duration-10000 hover:scale-100"
          style={{
            backgroundImage: `url('/images/lumera/rwanda-highlands.jpeg')`,
          }}
        />
        {/* Layered vignette & gold-emerald radiance */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0D] via-[#0B0C0D]/80 to-[#0B0C0D]/60" />
        <div className="absolute inset-0 bg-radial-gradient-hero" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#1B3E2D]/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#C5A059]/10 blur-[140px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
        {/* Top Badge: Verified Exporter Credential */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#141C16]/80 border border-[#C5A059]/40 backdrop-blur-md mb-8 shadow-lg shadow-black/60">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#F3E5AB]">
            INTERNATIONAL COFFEE EXPORTER & SUPPLIER
          </span>
          <span className="text-[#4E564F]">|</span>
          <span className="text-[10.5px] tracking-wider uppercase text-[#96B89E] font-medium hidden md:inline">
            International trade inquiries
          </span>
        </div>

        {/* Hero Main Headline */}
        <div className="space-y-2 mb-6">
          <p className="font-crest text-xs sm:text-sm uppercase tracking-[0.35em] text-[#C5A059] font-semibold">
            LUMERA COFFEE
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
            PREMIUM COFFEE.<br />
            <span className="gold-text-gradient font-display italic font-medium">FROM ORIGIN TO THE WORLD.</span>
          </h1>
        </div>

        {/* Brand Tagline & Positioning Copy */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          <p className="text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-[#D4AF37]/90 font-sans">
            EXCEPTIONAL COFFEE. AUTHENTIC RWANDAN ORIGIN.
          </p>
          <p className="text-base sm:text-lg text-[#BFBBB0] leading-relaxed font-light">
            Lumera Company Ltd offers Rwandan Arabica green coffee and roasted coffee from Karongi and Nyamasheke. Product details, pricing and delivery terms are confirmed for each inquiry.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          <button
            onClick={onOpenQuoteModal}
            className="w-full sm:w-auto gold-button-gradient px-8 py-4 rounded text-xs sm:text-sm uppercase tracking-[0.18em] font-bold shadow-xl shadow-[#C5A059]/25 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>REQUEST A QUOTE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#coffee"
            className="w-full sm:w-auto gold-outline-button px-8 py-4 rounded text-xs sm:text-sm uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>EXPLORE OUR COFFEE</span>
          </a>

          <button
            onClick={onOpenCatalogModal}
            className="w-full sm:w-auto px-6 py-4 rounded text-xs sm:text-sm uppercase tracking-[0.16em] font-medium text-[#AFAAA0] hover:text-white bg-[#131614]/80 hover:bg-[#1C201D] border border-[#2D332F] transition-all flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4 text-[#C5A059]" />
            <span>2026/27 Offer Sheet</span>
          </button>
        </div>

        {/* The 4 Core Export Pillars Strip */}
        <div className="pt-8 border-t border-[#232824]/90 max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold mb-6">
            ORIGIN • QUALITY • TRACEABILITY • GLOBAL SUPPLY
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            {/* Metric 1 */}
            <div className="p-4 rounded-lg bg-[#111412]/90 border border-[#252C27] hover:border-[#C5A059]/50 transition-colors group">
              <div className="flex items-center gap-2 text-[#C5A059] mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8DAA98]">Origin</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-display">
                Rwanda
              </div>
              <p className="text-[12px] text-[#8C8980] mt-1">
                Rwandan Arabica coffee
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-lg bg-[#111412]/90 border border-[#252C27] hover:border-[#C5A059]/50 transition-colors group">
              <div className="flex items-center gap-2 text-[#C5A059] mb-1">
                <Award className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8DAA98]">Quality</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-display">
                Green & roasted coffee
              </div>
              <p className="text-[12px] text-[#8C8980] mt-1">
                Whole beans and ground coffee formats
              </p>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-lg bg-[#111412]/90 border border-[#252C27] hover:border-[#C5A059]/50 transition-colors group">
              <div className="flex items-center gap-2 text-[#C5A059] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8DAA98]">Traceability</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-display">
                Karongi & Nyamasheke
              </div>
              <p className="text-[12px] text-[#8C8980] mt-1">
                Coffee-growing districts in Rwanda
              </p>
            </div>

            {/* Metric 4 */}
            <div className="p-4 rounded-lg bg-[#111412]/90 border border-[#252C27] hover:border-[#C5A059]/50 transition-colors group">
              <div className="flex items-center gap-2 text-[#C5A059] mb-1">
                <Anchor className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8DAA98]">Global Supply</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-display">
                Details by inquiry
              </div>
              <p className="text-[12px] text-[#8C8980] mt-1">
                Packaging, order quantity and shipping terms agreed per order
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
