import React from 'react';
import { CoffeeProduct } from '../types';
import { MapPin, Package, Send, X } from 'lucide-react';

interface CoffeeSpecModalProps {
  product: CoffeeProduct | null;
  onClose: () => void;
  onSelectForQuote: (product: CoffeeProduct) => void;
}

export const CoffeeSpecModal: React.FC<CoffeeSpecModalProps> = ({ product, onClose, onSelectForQuote }) => {
  if (!product) return null;

  const details = [
    ['Product format', product.format],
    ['Coffee type', product.variety],
    ['Origin', product.origin],
    ['Processing', product.process],
    ['Grade & specifications', product.grade],
    ['Availability', product.availability],
    ['Packaging', product.packaging],
    ['Minimum order quantity', product.moq],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto" onClick={onClose}>
      <section className="bg-[#F7F4EC] text-[#26382D] border border-[#D9D3C4] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative my-8" onClick={(event) => event.stopPropagation()} aria-labelledby="coffee-detail-title" role="dialog" aria-modal="true">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 grid place-items-center w-10 h-10 rounded-full bg-white/90 text-[#26382D] hover:bg-[#E8E4D9]" aria-label="Close coffee details">
          <X className="w-5 h-5" />
        </button>
        <img src={product.imageUrl} alt="" className="w-full h-56 sm:h-72 object-cover" />
        <div className="p-6 sm:p-8">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8B4F2A] font-bold">{product.category}</span>
          <h2 id="coffee-detail-title" className="text-2xl sm:text-3xl font-bold font-display mt-2">{product.name}</h2>
          <p className="flex items-start gap-2 text-sm text-[#4C5B50] mt-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0" />{product.origin}</p>
          <p className="mt-5 text-sm leading-relaxed text-[#405046]">{product.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-lg bg-white/75 border border-[#DDD8CC] p-4">
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-[#7B4A2A]">{label}</span>
                <span className="block mt-1 text-sm leading-relaxed text-[#26382D]">{value}</span>
              </div>
            ))}
          </div>

          <p className="flex items-start gap-2 mt-5 text-xs leading-relaxed text-[#59665B]"><Package className="w-4 h-4 mt-0.5 shrink-0" />Final pricing, stock, specifications, order quantity, packaging and delivery terms are confirmed in a formal quotation for each order.</p>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-7">
            <button onClick={onClose} className="px-5 py-3 rounded-lg border border-[#BFC8BC] text-sm font-semibold text-[#34483A]">Close</button>
            <button onClick={() => { onClose(); onSelectForQuote(product); }} className="px-5 py-3 rounded-lg bg-[#A96532] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#B97542]"><Send className="w-4 h-4" />Request product quote</button>
          </div>
        </div>
      </section>
    </div>
  );
};
