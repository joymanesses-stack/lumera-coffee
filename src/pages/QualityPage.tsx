import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  BadgeCheck, 
  ClipboardList, 
  Scale, 
  Layers, 
  ArrowRight,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export const QualityPage: React.FC = () => {
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
    <div className="pt-36 sm:pt-40 pb-24 bg-[#0B0D0C]">
      {/* Page Header */}
      <section className="relative py-16 bg-[#0E1110] border-b border-[#1E241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Traceability & Export Standards</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white font-display">
            Quality Without Compromise
          </h1>
          <p className="text-sm sm:text-base text-[#A8A498] max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            From sourcing to shipment, every stage is managed with attention to quality, consistency, and traceability.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Intro Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#141C16] via-[#101412] to-[#141A15] border border-[#C5A059]/30 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-[#9BE0B3] font-bold block mb-2">
              Foreign Buyer Assurance
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
              Confidence That Your Export Coffee Strictly Matches Approved Samples
            </h2>
            <p className="text-sm text-[#BFBBB0] font-light mt-3 leading-relaxed">
              International coffee importers and roasters face significant financial and reputation risks when green coffee drifts in moisture, cup score, or defect grade during shipment. At Lumera Coffee, we operate our own cupping laboratories and physical inspection benches, guaranteeing contract parameters prior to container dispatch.
            </p>
          </div>
        </div>

        {/* 6 Stage QC Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qcSteps.map((item) => (
            <div
              key={item.step}
              className="bg-[#121614] border border-[#232B25] hover:border-[#C5A059]/60 rounded-xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between group shadow-xl"
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
                <span>Audited Exporter Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Triple Cupping & Lab Protocol Section */}
        <div className="bg-[#101412] border border-[#222B25] rounded-2xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2E22] text-[#9BE0B3] text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>End-to-End Lot Traceability</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Every Export Bag Identified to Station, Lot & Harvest Week
              </h2>

              <p className="text-xs sm:text-sm text-[#BFBBB0] font-light leading-relaxed">
                We believe transparency builds enduring partnerships. Each lot exported by Lumera Coffee carries a dedicated tracking manifest recording the specific washing station, cherry collection point, delivery dates, fermentation duration, moisture logs, and moisture barrier integrity.
              </p>

              <div className="space-y-2 pt-2 text-xs text-[#E5C378]">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Offer Sample (OS): 300g–500g green sample dispatched for preliminary cupping approval.</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pre-Shipment Sample (PSS): Drawn directly from finished export bags before stuffing.</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Vessel Sample (VS): Drawn upon container sealing and archived for buyer reference.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0B0D0C] p-6 rounded-xl border border-[#232C25] space-y-4">
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-bold block">
                Physical Lab Parameters
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#1C221D]">
                  <span className="text-[#89857B]">Moisture Content:</span>
                  <span className="text-white font-medium">10.5% – 11.5% Target (Max 12.0%)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1C221D]">
                  <span className="text-[#89857B]">Water Activity (aw):</span>
                  <span className="text-white font-medium">&lt; 0.60 aw (Rot Prevention)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1C221D]">
                  <span className="text-[#89857B]">Primary Defects:</span>
                  <span className="text-white font-medium">0 per 300g (Grade 1 / Specialty)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1C221D]">
                  <span className="text-[#89857B]">Hermetic Lining:</span>
                  <span className="text-white font-medium">GrainPro® Ultra-Barrier Film</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#89857B]">Certificates:</span>
                  <span className="text-white font-medium">Phytosanitary & ICO Origin</span>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full gold-button-gradient py-3 rounded text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 mt-4"
              >
                <span>Request Sample Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
