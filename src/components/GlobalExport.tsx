import React from 'react';
import { 
  Globe2, 
  Ship, 
  Anchor, 
  Building2, 
  Layers, 
  Boxes, 
  Check, 
  CheckCircle2, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface GlobalExportProps {
  onOpenQuoteModal: () => void;
}

export const GlobalExport: React.FC<GlobalExportProps> = ({ onOpenQuoteModal }) => {
  const buyerTypes = [
    {
      icon: '🌍',
      title: 'Green Coffee Importers',
      desc: 'Supplying bulk 20ft/40ft container loads on FOB or CIF terms with forward contract security and flexible delivery windows.',
      focus: 'FCL Forward Contracts & Spot Cargo',
    },
    {
      icon: '🏭',
      title: 'Specialty & Commercial Roasters',
      desc: 'Consistent cup profiles year-over-year, direct origin relationship documentation, and customized pre-shipment sample verification.',
      focus: 'Strict Cupping & Moisture Consistency',
    },
    {
      icon: '📦',
      title: 'Wholesale Distributors',
      desc: 'Multi-grade consolidation, consistent commercial washed lots, high-grade fine Robusta, and reliable shipping schedules.',
      focus: 'Reliable Volume & Stable Pricing',
    },
    {
      icon: '☕',
      title: 'Specialty Coffee Brands',
      desc: 'Traceable high-scoring micro-lots (86–88.5+ SCA) with complete washing station provenance and farmer impact narratives.',
      focus: 'High-Elevation Terroir Micro-Lots',
    },
    {
      icon: '🏢',
      title: 'Industrial & Private Label',
      desc: 'Large-scale green coffee supply tailored for cold brew, espresso blends, RTD beverages, and retail private label operations.',
      focus: 'Uniform Grading & Defect Standards',
    },
  ];

  const destinationPorts = [
    { region: 'Europe', ports: ['Port of Rotterdam (Netherlands)', 'Port of Hamburg (Germany)', 'Port of Antwerp-Bruges (Belgium)', 'Port of Genoa (Italy)'] },
    { region: 'North America', ports: ['Port of New York / New Jersey (USA)', 'Port of Oakland (USA)', 'Port of Long Beach / LA (USA)', 'Port of Montreal (Canada)'] },
    { region: 'Middle East & Gulf', ports: ['Jebel Ali Port / Dubai (UAE)', 'King Abdulaziz Port / Dammam (Saudi Arabia)', 'Jeddah Islamic Port (Saudi Arabia)'] },
    { region: 'Asia-Pacific', ports: ['Port of Yokohama (Japan)', 'Port of Busan (South Korea)', 'Port of Shanghai (China)', 'Port of Melbourne (Australia)'] },
  ];

  return (
    <section id="export" className="py-24 bg-[#0B0D0C] border-t border-[#1F2520] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>International Trade & Logistics</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight leading-tight">
            From Our Origin to Global Markets
          </h2>
          <p className="text-sm sm:text-base text-[#9F9B90] mt-4 font-light leading-relaxed">
            We partner with international coffee professionals seeking direct, dependable access to exceptional green coffee. Our export infrastructure manages ocean freight logistics, customs documentation, and quality verification without intermediaries.
          </p>
        </div>

        {/* 5 Core Buyer Sectors Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
              Serving Discerning Coffee Buyers Worldwide
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyerTypes.map((buyer, idx) => (
              <div
                key={buyer.title}
                className={`bg-[#121614] border border-[#232B25] hover:border-[#C5A059]/60 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg ${
                  idx === 0 ? 'lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="text-3xl mb-3">{buyer.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#F3E5AB] transition-colors">
                    {buyer.title}
                  </h3>
                  <p className="text-xs text-[#9B978D] font-light leading-relaxed mb-4">
                    {buyer.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1C221E] flex items-center gap-2 text-[11px] text-[#C5A059] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{buyer.focus}</span>
                </div>
              </div>
            ))}

            {/* Direct Inquiry Action Card */}
            <div className="bg-gradient-to-br from-[#182B20] to-[#111A14] border border-[#C5A059]/40 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#9BE0B3] font-semibold block mb-2">
                  Direct Trade Exporter
                </span>
                <h3 className="text-lg font-bold text-white mb-2 font-display">
                  Have Specific Export Specifications?
                </h3>
                <p className="text-xs text-[#C5C2B8] font-light leading-relaxed">
                  We supply custom screen sorting, double hand-picking, custom bag stenciling, and specialized vacuum packaging for micro-lots.
                </p>
              </div>

              <button
                onClick={onOpenQuoteModal}
                className="mt-6 gold-button-gradient py-2.5 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* International Destination Ports & Logistics Details */}
        <div className="bg-[#101412] border border-[#232C25] rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Logistics Left Info */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                <Ship className="w-4 h-4" />
                <span>Ocean Freight & Container Specifications</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Engineered for International Ocean Transit
              </h3>

              <p className="text-xs sm:text-sm text-[#A39F93] font-light leading-relaxed">
                Green coffee is susceptible to moisture migration and temperature spikes during long oceanic voyages. We implement rigorous container stuffing protocols to safeguard bean vitality.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-[#0B0D0C] border border-[#1E2520]">
                  <strong className="text-white block mb-0.5">20ft FCL Standard Container</strong>
                  <span className="text-[#8F8B81]">320 Bags (60kg Net each) = 19,200 kg Net / ~19.5 MT Gross. Lined with food-grade kraft paper, corrugated floorboards, and high-absorption container desiccant poles.</span>
                </div>

                <div className="p-3 rounded-lg bg-[#0B0D0C] border border-[#1E2520]">
                  <strong className="text-white block mb-0.5">Incoterms Supported</strong>
                  <span className="text-[#8F8B81]">FOB (Free on Board Origin Port), CIF (Cost, Insurance & Freight Destination Port), CFR, or Air Freight for urgent micro-lots.</span>
                </div>
              </div>
            </div>

            {/* Destination Ports Right Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destinationPorts.map((group) => (
                <div key={group.region} className="bg-[#0B0D0C] border border-[#1E2420] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#E5C378] font-crest uppercase tracking-wider mb-2">
                      {group.region}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#B5B1A5]">
                      {group.ports.map((port) => (
                        <li key={port} className="flex items-start gap-1.5">
                          <Anchor className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                          <span>{port}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#191F1A] text-[10.5px] text-[#78746B]">
                    Regular scheduled sailings & direct Bill of Lading
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
