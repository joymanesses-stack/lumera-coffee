import React from 'react';
import { 
  FileText, 
  Search, 
  Coffee, 
  CheckCircle, 
  FileCheck2, 
  Ship, 
  ArrowRight,
  Sparkles,
  Send
} from 'lucide-react';

interface ForBuyersProps {
  onOpenQuoteModal: () => void;
}

export const ForBuyers: React.FC<ForBuyersProps> = ({ onOpenQuoteModal }) => {
  const steps = [
    {
      num: '01',
      title: 'Tell Us What You Need',
      desc: 'Submit your inquiry specifying desired coffee type (Arabica/Robusta), grade, volume (FCL or LCL sample lots), preferred packaging, and destination port.',
      icon: FileText,
      badge: 'Step 1: Inquiry',
    },
    {
      num: '02',
      title: 'We Match Requirements',
      desc: 'Our export desk matches your exact requirements against active harvest lots, curating commercial offers with transparent FOB or CIF pricing.',
      icon: Search,
      badge: 'Step 2: Quotation',
    },
    {
      num: '03',
      title: 'Sample & Quality Evaluation',
      desc: 'We dispatch 300g–500g green coffee Offer Samples (OS) via express courier (DHL/FedEx) to your roasting laboratory for cupping and moisture verification.',
      icon: Coffee,
      badge: 'Step 3: Cupping',
    },
    {
      num: '04',
      title: 'Confirm Specifications',
      desc: 'Upon sample approval, we confirm technical contracts: screen tolerances, moisture limits (<11.5%), payment terms (L/C, CAD, TT), and shipping schedules.',
      icon: CheckCircle,
      badge: 'Step 4: Contract',
    },
    {
      num: '05',
      title: 'Milling & Pre-Shipment QC',
      desc: 'Green coffee is milled, optical-color sorted, hermetically sealed in GrainPro liners, and Pre-Shipment Samples (PSS) are approved prior to container loading.',
      icon: FileCheck2,
      badge: 'Step 5: Verification',
    },
    {
      num: '06',
      title: 'Container Shipment & Docs',
      desc: 'Ocean container stuffed, fumigated, and dispatched with complete export documentation: ICO Certificate of Origin, Phytosanitary, Bill of Lading, and QC certs.',
      icon: Ship,
      badge: 'Step 6: Delivery',
    },
  ];

  return (
    <section id="buyers" className="py-24 bg-[#0E110F] border-t border-[#1C221D] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Procurement Process</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight leading-tight">
            Looking for a Reliable Coffee Exporter?
          </h2>
          <p className="text-sm sm:text-base text-[#A19D92] mt-4 font-light leading-relaxed">
            Whether you are an international green coffee importer, a specialty roaster, a regional distributor, or a coffee brand, Lumera Coffee operates with the transparency, speed, and precision of a world-class export house.
          </p>
        </div>

        {/* 6 Step Procurement Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="bg-[#121614] border border-[#232C25] hover:border-[#C5A059]/60 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-crest text-xl font-bold gold-text-gradient">
                      {item.num}
                    </span>
                    <span className="text-[10.5px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#18231C] text-[#C5A059] border border-[#C5A059]/20">
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-[#18261E] border border-[#253A2E] flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#F3E5AB] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#9B978D] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#1C221D] flex items-center justify-between text-[11px] text-[#7A766D]">
                  <span>Stage {idx + 1} of 6</span>
                  <span className="text-[#C5A059] font-medium">Standard Protocol →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout Action Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#17241B] via-[#121814] to-[#17221A] border border-[#C5A059]/40 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-2">
            Initiate Your Procurement Today
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Ready to Evaluate Lumera Coffee Lots?
          </h3>
          <p className="text-xs sm:text-sm text-[#BFBBB0] font-light max-w-xl mx-auto mt-2 mb-8 leading-relaxed">
            Request an export price quotation, forward-crop reservation, or receive green coffee sample lots delivered to your roasting facility.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto gold-button-gradient px-8 py-3.5 rounded text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C5A059]/25"
            >
              <Send className="w-4 h-4" />
              <span>REQUEST A QUOTE & SAMPLES</span>
            </button>

            <a
              href="mailto:export@lumeracoffee.com"
              className="w-full sm:w-auto px-6 py-3.5 rounded text-xs uppercase tracking-[0.16em] font-semibold border border-[#C5A059]/50 text-[#E5C378] hover:bg-[#C5A059]/10 transition-colors"
            >
              Direct Email to Export Desk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
