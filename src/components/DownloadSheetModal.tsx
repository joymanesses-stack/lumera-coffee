import React from 'react';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';
import { Logo } from './Logo';
import { 
  X, 
  FileDown, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Globe2, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface DownloadSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal: () => void;
}

export const DownloadSheetModal: React.FC<DownloadSheetModalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="bg-[#121413] border border-[#C5A059]/40 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl relative my-8 print:m-0 print:border-none print:bg-white print:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-4 sm:p-6 border-b border-[#222923] flex items-center justify-between bg-[#151916] sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">
              Official Offer Sheet
            </span>
            <span className="text-white text-xs hidden sm:inline">• 2026/2027 Crop Harvest Allocations</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-[#1B221D] border border-[#2D3A2F] text-xs text-[#DCD8CE] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#18201A] text-[#ABA69A] hover:text-white border border-[#2B382E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Offer Document */}
        <div className="p-6 sm:p-10 space-y-8 bg-[#0E100F] print:bg-white print:text-black">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#222822] print:border-gray-300">
            <div>
              <Logo size="lg" />
              <div className="mt-2 text-xs text-[#8F8B80] print:text-gray-600">
                Registered International Coffee Exporters & Producers<br />
                Headquarters & Export Desk: Kigali / Bujumbura Highland Corridors<br />
                Email: export@lumeracoffee.com • Web: www.lumeracoffee.com
              </div>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1">
              <span className="inline-block px-3 py-1 rounded bg-[#1A261D] text-[#9BE0B3] border border-emerald-500/30 font-bold uppercase tracking-wider print:border-gray-400 print:text-black print:bg-gray-100">
                Crop Year: 2026 / 2027 Main Harvest
              </span>
              <div className="text-white print:text-black font-semibold mt-1">
                Document Ref: LUM-SPEC-OFFER-2026
              </div>
              <div className="text-[#848074] print:text-gray-500">
                Standard Incoterms: FOB Origin Port & CIF Destination
              </div>
            </div>
          </div>

          {/* Table of Lots */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#29332A] text-[#C5A059] print:text-gray-800 uppercase tracking-wider text-[10.5px]">
                  <th className="py-3 px-2">Lot & Grade</th>
                  <th className="py-3 px-2">Variety & Process</th>
                  <th className="py-3 px-2">Altitude</th>
                  <th className="py-3 px-2">Screen</th>
                  <th className="py-3 px-2">Moisture</th>
                  <th className="py-3 px-2">Defect Std</th>
                  <th className="py-3 px-2">SCA Cup</th>
                  <th className="py-3 px-2">Packaging & MOQ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D241E] print:divide-gray-200">
                {COFFEE_PRODUCTS.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#141815] transition-colors">
                    <td className="py-3 px-2 font-medium text-white print:text-black">
                      {prod.name}
                      <span className="block text-[10px] text-[#868379] print:text-gray-500">{prod.origin}</span>
                    </td>
                    <td className="py-3 px-2 text-[#C2BEB2] print:text-gray-700">
                      {prod.variety}<br />
                      <span className="text-[10px] text-[#A6A296]">{prod.process}</span>
                    </td>
                    <td className="py-3 px-2 text-[#C2BEB2] print:text-gray-700">{prod.altitude}</td>
                    <td className="py-3 px-2 font-mono text-[#D4AF37] print:text-gray-800 font-semibold">{prod.screenSize}</td>
                    <td className="py-3 px-2 text-[#9BE0B3] print:text-gray-800 font-medium">{prod.moisture}</td>
                    <td className="py-3 px-2 text-[#B8B4A8] print:text-gray-600">{prod.defectCount}</td>
                    <td className="py-3 px-2 font-bold text-white print:text-black">
                      {prod.cupScore ? `${prod.cupScore} pts` : 'FAQ Standard'}
                    </td>
                    <td className="py-3 px-2 text-[10.5px] text-[#A3A094] print:text-gray-600">
                      {prod.packaging}<br />
                      <strong className="text-[#C5A059] print:text-black">MOQ:</strong> {prod.moq}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Standard Export Contract Notes */}
          <div className="bg-[#121614] print:bg-gray-50 p-5 rounded-xl border border-[#222B25] print:border-gray-300 text-xs space-y-2 text-[#ABA69A] print:text-gray-700">
            <h4 className="font-bold text-white print:text-black uppercase tracking-wider text-[11px] text-[#C5A059]">
              Export Terms & Conditions Summary:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <p>• <strong>Quality Verification:</strong> All sales subject to approved Pre-Shipment Sample (PSS) courier approval.</p>
                <p>• <strong>Packaging Integrity:</strong> Multi-layer GrainPro® hermetic barrier inside 60kg food-grade natural jute sacks.</p>
              </div>
              <div>
                <p>• <strong>Container Stuffing:</strong> Standard 20ft FCL container loads 320 bags (19.2 MT) with kraft paper & desiccants.</p>
                <p>• <strong>Documentation:</strong> Full ICO Certificate of Origin, Phytosanitary Certificate, Bill of Lading, Weight/Quality Certificate.</p>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#202722] print:hidden">
            <span className="text-xs text-[#8A867C]">
              Prices quoted upon receipt of company credentials and volume schedule.
            </span>

            <button
              onClick={() => {
                onClose();
                onOpenQuoteModal();
              }}
              className="gold-button-gradient px-6 py-2.5 rounded text-xs uppercase tracking-wider font-bold"
            >
              Request Commercial Quote Based on this Offer List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
