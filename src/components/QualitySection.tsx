import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  FileCheck, 
  Truck, 
  PackageCheck, 
  BadgeCheck, 
  Cpu, 
  Award,
  Layers,
  ThermometerSnowflake,
  ClipboardList
} from 'lucide-react';

export const QualitySection: React.FC = () => {
  const qcSteps = [
    {
      step: '01',
      title: 'Sourcing & Farmer Partnerships',
      desc: 'We partner directly with established washing stations, cooperatives, and vetted smallholder groups, establishing long-term sourcing relationships built on fair farmgate cherry compensation and responsible practices.',
      metric: 'Direct Origin Ties',
    },
    {
      step: '02',
      title: 'Physical Green Lab Inspection',
      desc: 'Rigorous laboratory analysis of green coffee lots before milling: calibrated moisture determination (strictly 10.5% – 11.5%), water activity testing (aw < 0.60), screen distribution sieving, and full SCA green defect counting.',
      metric: 'Strict 10.5–11.5% Moisture',
    },
    {
      step: '03',
      title: 'Preparation & Precision Milling',
      desc: 'Parchment is rested in controlled conditioning warehouses before dry-milling. We utilize multi-deck gravity separation tables and dual-camera optical color sorters to eliminate chipped, broken, or discolored beans.',
      metric: 'Bichromatic Optical Sort',
    },
    {
      step: '04',
      title: 'Sensory Cupping & Verification',
      desc: 'Three-tiered sensory verification: Offer Sample (OS), Pre-Shipment Sample (PSS), and Vessel Sample (VS). Every single lot is cupped strictly following SCA cupping protocols to guarantee profile consistency before container sealing.',
      metric: 'Triple Cupping Protocol',
    },
    {
      step: '05',
      title: 'Hermetic Export Packaging',
      desc: 'Export-grade 60 kg natural jute sacks with food-grade multi-barrier GrainPro® hermetic liners. Prevents condensation, moisture absorption, oxidation, and preserves fresh-crop cup aromatics throughout trans-oceanic voyages.',
      metric: 'GrainPro® Hermetic Liners',
    },
    {
      step: '06',
      title: 'Export Compliance & Documentation',
      desc: 'Comprehensive export documentation dispatched promptly: International Coffee Organization (ICO) Certificate of Origin, National Phytosanitary Certificate, Bill of Lading, Weight & Quality Inspection Certificates, and Container Sealing Reports.',
      metric: 'Full ICO & Phytosanitary Docs',
    },
  ];

  return (
    <section id="quality" className="py-24 bg-[#0E100F] border-t border-[#1C221D] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Traceability & Export Standards</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight">
            Quality Without Compromise
          </h2>
          <p className="text-sm sm:text-base text-[#9F9B90] mt-4 font-light leading-relaxed">
            From sourcing to shipment, every stage is managed with meticulous attention to quality, consistency, and end-to-end traceability. Importers and roasters receive green coffee that strictly matches approved pre-shipment samples.
          </p>
        </div>

        {/* 6 Step QC Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {qcSteps.map((item) => (
            <div
              key={item.step}
              className="bg-[#121614] border border-[#232B25] hover:border-[#C5A059]/60 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-crest text-xl font-bold gold-text-gradient">
                    {item.step}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#18261E] text-[#9BE0B3] border border-emerald-500/20">
                    {item.metric}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#F3E5AB] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-[#99958B] font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1B221D] flex items-center gap-2 text-[11px] text-[#C5A059] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Audited Export Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Lab & Traceability Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#141C16] via-[#101412] to-[#141A15] border border-[#C5A059]/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient-hero opacity-30 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2E22] text-[#9BE0B3] text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>End-to-End Lot Traceability Guarantee</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Every Export Bag Identified to Station, Lot & Harvest Week
              </h3>

              <p className="text-xs sm:text-sm text-[#BFBBB0] font-light leading-relaxed max-w-2xl">
                We believe transparency builds enduring partnerships. Each lot exported by Lumera Coffee carries a dedicated tracking manifest recording the specific washing station, cherry collection point, delivery dates, fermentation duration, moisture logs, and moisture barrier integrity.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#E5C378]">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>Physical Pre-Shipment Sample (PSS) Provided</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>Zero Pesticide & Heavy Metal Screening</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>International Coffee Org. (ICO) Certified Export</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-3">
              <div className="p-4 rounded-xl bg-[#0B0D0C] border border-[#273229] w-full text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#7D7970] block font-semibold">Pre-Shipment Samples (PSS)</span>
                <span className="text-white text-sm font-semibold block mt-0.5">300g – 500g Courier Express</span>
                <span className="text-[11px] text-[#A6A298] block mt-1">Dispatched via DHL/FedEx worldwide for buyer cupping approval prior to vessel dispatch.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
