import React from 'react';
import { CoffeeProduct } from '../types';
import { 
  X, 
  Award, 
  MapPin, 
  Package, 
  Droplet, 
  ShieldCheck, 
  Scale, 
  Layers, 
  Calendar,
  Send,
  FileCheck2
} from 'lucide-react';

interface CoffeeSpecModalProps {
  product: CoffeeProduct | null;
  onClose: () => void;
  onSelectForQuote: (product: CoffeeProduct) => void;
}

export const CoffeeSpecModal: React.FC<CoffeeSpecModalProps> = ({
  product,
  onClose,
  onSelectForQuote,
}) => {
  if (!product) return null;

  const sensoryAttributes = [
    { name: 'Aroma / Fragrance', score: product.sensoryScores.aroma },
    { name: 'Flavor Intensity', score: product.sensoryScores.flavor },
    { name: 'Acidity (Crispness)', score: product.sensoryScores.acidity },
    { name: 'Body / Mouthfeel', score: product.sensoryScores.body },
    { name: 'Cup Balance', score: product.sensoryScores.balance },
    { name: 'Aftertaste / Finish', score: product.sensoryScores.aftertaste },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="bg-[#101311] border border-[#C5A059]/40 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#18201A] text-[#B0ACA0] hover:text-white hover:bg-[#222E25] border border-[#2B382E] transition-colors z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 border-b border-[#212822] bg-gradient-to-r from-[#141C16] via-[#101412] to-[#141C16]">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded bg-[#0B0D0C] text-[11px] font-bold text-[#E5C378] border border-[#C5A059]/40 uppercase tracking-wider">
              {product.category}
            </span>
            {product.cupScore && (
              <span className="px-3 py-1 rounded bg-[#163624] text-[11px] font-bold text-[#9BE0B3] border border-emerald-500/40 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                SCA Cupping Score: {product.cupScore} / 100
              </span>
            )}
            <span className="px-3 py-1 rounded bg-[#18201A] text-[11px] font-medium text-[#B8B4A8] border border-[#2B382F]">
              Harvest: {product.harvestSeason}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            {product.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-[#C5A059] mt-1 font-medium">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{product.origin} • Altitude {product.altitude}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Flavor Profile Notes */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-3">
              Official Sensory Cupping Profile
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.cupProfile.map((note) => (
                <span
                  key={note}
                  className="px-3.5 py-1.5 rounded-lg bg-[#18221B] border border-[#2C3D30] text-xs font-semibold text-white tracking-wide"
                >
                  {note}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#A8A498] mt-3 font-light leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Sensory Attribute Breakdown */}
          <div className="bg-[#0B0D0C] p-5 rounded-xl border border-[#212923]">
            <h3 className="text-xs uppercase tracking-widest text-[#E5C378] font-bold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>Sensory Score Breakdown (SCA Protocol /10)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sensoryAttributes.map((attr) => (
                <div key={attr.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#BFBBB0]">{attr.name}</span>
                    <span className="text-white font-bold">{attr.score.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-[#1C241E] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#8E7230] to-[#E5C378] h-full rounded-full transition-all duration-500"
                      style={{ width: `${(attr.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comprehensive Physical Specifications Table */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>Green Coffee Physical & Grade Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#121614] p-3.5 rounded-lg border border-[#222A24]">
                <span className="text-[10px] uppercase tracking-wider text-[#79766E] block font-semibold">Botanical Variety</span>
                <span className="text-white font-medium block mt-0.5">{product.variety}</span>
              </div>

              <div className="bg-[#121614] p-3.5 rounded-lg border border-[#222A24]">
                <span className="text-[10px] uppercase tracking-wider text-[#79766E] block font-semibold">Processing Method</span>
                <span className="text-white font-medium block mt-0.5">{product.process}</span>
              </div>

              <div className="bg-[#121614] p-3.5 rounded-lg border border-[#222A24]">
                <span className="text-[10px] uppercase tracking-wider text-[#79766E] block font-semibold">Screen Size</span>
                <span className="text-[#E5C378] font-bold block mt-0.5">{product.screenSize}</span>
              </div>

              <div className="bg-[#121614] p-3.5 rounded-lg border border-[#222A24]">
                <span className="text-[10px] uppercase tracking-wider text-[#79766E] block font-semibold">Moisture Content</span>
                <span className="text-[#9BE0B3] font-bold block mt-0.5">{product.moisture}</span>
              </div>

              <div className="bg-[#121614] p-3.5 rounded-lg border border-[#222A24]">
                <span className="text-[10px] uppercase tracking-wider text-[#79766E] block font-semibold">Water Activity (aw)</span>
                <span className="text-white font-medium block mt-0.5">{product.waterActivity || '< 0.58 aw'}</span>
              </div>

              <div className="bg-[#121614] p-3.5 rounded-lg border border-[#222A24]">
                <span className="text-[10px] uppercase tracking-wider text-[#79766E] block font-semibold">Defect Tolerance</span>
                <span className="text-white font-medium block mt-0.5">{product.defectCount}</span>
              </div>

              <div className="bg-[#121614] p-3.5 rounded-lg border border-[#222A24]">
                <span className="text-[10px] uppercase tracking-wider text-[#79766E] block font-semibold">Export Grade</span>
                <span className="text-white font-medium block mt-0.5">{product.grade}</span>
              </div>

              <div className="bg-[#121614] p-3.5 rounded-lg border border-[#222A24]">
                <span className="text-[10px] uppercase tracking-wider text-[#79766E] block font-semibold">Batch Availability</span>
                <span className="text-white font-medium block mt-0.5">{product.availability}</span>
              </div>
            </div>
          </div>

          {/* Export Packaging & Logistics */}
          <div className="bg-[#121614] p-5 rounded-xl border border-[#232B25] space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Export Packaging & Ocean Freight Logistics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#878379] block">Standard Packaging:</span>
                <span className="text-white font-medium">{product.packaging}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#878379] block">Bag Unit Weight:</span>
                <span className="text-white font-medium">{product.bagWeight}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#878379] block">Minimum Order Quantity (MOQ):</span>
                <span className="text-white font-medium">{product.moq}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#878379] block">Full Container Load (FCL):</span>
                <span className="text-white font-medium">320 bags / 19.2 MT net in 20ft dry container</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 border-t border-[#212822] bg-[#0E1110] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#878379] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pre-Shipment Samples (PSS) available for verification before ocean dispatch.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold text-[#A8A49A] hover:text-white border border-[#2A332C]"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onSelectForQuote(product);
              }}
              className="w-full sm:w-auto gold-button-gradient px-6 py-2.5 rounded text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C5A059]/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Inquire / Request Sample</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
