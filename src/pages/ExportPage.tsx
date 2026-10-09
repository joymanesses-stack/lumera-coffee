import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe2, 
  Ship, 
  Anchor, 
  Package, 
  CheckCircle2, 
  ArrowRight,
  FileCheck2,
  Boxes,
  Compass
} from 'lucide-react';

export const ExportPage: React.FC = () => {
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
    { region: 'Europe', ports: ['Port of Rotterdam (Netherlands)', 'Port of Hamburg (Germany)', 'Port of Antwerp-Bruges (Belgium)', 'Port of Genoa (Italy)', 'Port of Le Havre (France)'] },
    { region: 'North America', ports: ['Port of New York / New Jersey (USA)', 'Port of Oakland (USA)', 'Port of Long Beach / LA (USA)', 'Port of Montreal (Canada)'] },
    { region: 'Middle East & Gulf', ports: ['Jebel Ali Port / Dubai (UAE)', 'King Abdulaziz Port / Dammam (Saudi Arabia)', 'Jeddah Islamic Port (Saudi Arabia)'] },
    { region: 'Asia-Pacific', ports: ['Port of Yokohama (Japan)', 'Port of Busan (South Korea)', 'Port of Shanghai (China)', 'Port of Melbourne (Australia)'] },
  ];

  return (
    <div className="pt-36 sm:pt-40 pb-24 bg-[#0B0D0C]">
      {/* Page Header */}
      <section className="relative py-16 bg-[#0E1110] border-b border-[#1E241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>International Trade & Ocean Logistics</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white font-display">
            From Our Origin to Global Markets
          </h1>
          <p className="text-sm sm:text-base text-[#A8A498] max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            We work with international buyers seeking reliable access to quality coffee. Full container load shipments, certified export documents, and dependable maritime execution.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Core Buyer Sectors */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
              Buyer Profiles We Supply
            </span>
            <h2 className="text-3xl font-bold text-white font-display">
              Serving the International Coffee Industry
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyerTypes.map((buyer, idx) => (
              <div
                key={buyer.title}
                className="bg-[#121614] border border-[#232B25] hover:border-[#C5A059]/60 rounded-xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between group shadow-xl"
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

            <div className="bg-gradient-to-br from-[#182B20] to-[#111A14] border border-[#C5A059]/40 rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#9BE0B3] font-semibold block mb-2">
                  Bespoke Ocean Shipments
                </span>
                <h3 className="text-xl font-bold text-white mb-2 font-display">
                  Have Specific Port Requirements?
                </h3>
                <p className="text-xs text-[#C5C2B8] font-light leading-relaxed">
                  We supply custom screen sorting, double hand-picking, custom bag stenciling, and specialized vacuum packaging for micro-lots.
                </p>
              </div>

              <Link
                to="/contact"
                className="mt-6 gold-button-gradient py-3 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Ocean Freight Container Specifications */}
        <div className="bg-[#101412] border border-[#232C25] rounded-2xl p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-1">
              Maritime Freight Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Export Container & Packaging Specifications
            </h2>
            <p className="text-xs sm:text-sm text-[#A39F93] mt-2 font-light leading-relaxed">
              Green coffee is a hygroscopic commodity. We implement stringent container preparation standards to prevent condensation during ocean transit through equatorial and temperate maritime zones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-[#0B0D0C] p-5 rounded-xl border border-[#1E241F] space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">20ft FCL Standard Container</span>
              <span className="text-white font-bold text-sm block">320 Bags (19.2 MT Net)</span>
              <p className="text-[#8B877D] leading-relaxed">
                60kg net jute bags protected with GrainPro® hermetic liners. Floors and walls lined with heavy-duty kraft paper and corrugated card.
              </p>
            </div>

            <div className="bg-[#0B0D0C] p-5 rounded-xl border border-[#1E241F] space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">Moisture Protection</span>
              <span className="text-white font-bold text-sm block">High-Absorption Desiccant Poles</span>
              <p className="text-[#8B877D] leading-relaxed">
                4 to 6 industrial calcium chloride moisture poles suspended inside the container ceiling to eliminate container sweat and mold risk.
              </p>
            </div>

            <div className="bg-[#0B0D0C] p-5 rounded-xl border border-[#1E241F] space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">Supported Incoterms®</span>
              <span className="text-white font-bold text-sm block">FOB, CIF, CFR & Air Freight</span>
              <p className="text-[#8B877D] leading-relaxed">
                FOB Origin Sea Port, CIF Destination Port with comprehensive marine cargo insurance, or air freight courier for rapid sample lots.
              </p>
            </div>
          </div>
        </div>

        {/* Global Destination Ports Directory */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
              Trade Routes & Maritime Hubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              International Discharge Ports
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinationPorts.map((group) => (
              <div key={group.region} className="bg-[#121614] border border-[#222A24] rounded-xl p-5 flex flex-col justify-between shadow-lg">
                <div>
                  <h3 className="text-sm font-bold text-[#E5C378] font-crest uppercase tracking-wider mb-3">
                    {group.region}
                  </h3>
                  <ul className="space-y-2 text-xs text-[#B5B1A5]">
                    {group.ports.map((port) => (
                      <li key={port} className="flex items-start gap-1.5">
                        <Anchor className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>{port}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 pt-3 border-t border-[#1C221D] text-[10.5px] text-[#7A766D]">
                  Direct ocean bills of lading & tracked transit
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Documentation Banner */}
        <div className="rounded-xl bg-[#111412] border border-[#222A23] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Full Export Documentation Suite Included</h3>
            <p className="text-xs text-[#8E8A80] mt-1 max-w-2xl">
              ICO Certificate of Origin, Phyto Certificate, Clean on Board Ocean Bill of Lading, Weight/Quality Certificate, and Certificate of Analysis dispatched via express courier upon vessel departure.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 gold-button-gradient px-6 py-3 rounded text-xs uppercase tracking-wider font-bold"
          >
            Request CIF Shipping Quote
          </Link>
        </div>
      </div>
    </div>
  );
};
