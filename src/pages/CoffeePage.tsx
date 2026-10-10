import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';
import { CoffeeProduct } from '../types';
import { 
  Package, 
  MapPin, 
  ArrowUpRight,
  Sparkles,
  Search,
  FileDown,
  FileText
} from 'lucide-react';

interface CoffeePageProps {
  onSelectProductForSpec: (product: CoffeeProduct) => void;
  onOpenQuoteModal: (coffeeName?: string) => void;
  onOpenCatalogModal: () => void;
}

export const CoffeePage: React.FC<CoffeePageProps> = ({
  onSelectProductForSpec,
  onOpenQuoteModal,
  onOpenCatalogModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    'All',
    'Green Coffee',
    'Roasted Coffee',
  ];

  const filteredProducts = COFFEE_PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.format.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.process.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.cupProfile || []).some(note => note.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-36 sm:pt-40 pb-24 bg-[#0B0D0C]">
      {/* Page Header */}
      <section className="relative py-16 bg-[#0E1110] border-b border-[#1E241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rwandan Arabica · Green & Roasted</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-white font-display">
                Our Coffee Portfolio
              </h1>
              <p className="text-sm sm:text-base text-[#A8A498] mt-4 font-light leading-relaxed">
                Explore unroasted green beans and roasted whole-bean or ground coffee from Rwanda. Batch details, pricing, order quantities and packaging are confirmed with each inquiry.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCatalogModal}
                className="gold-outline-button px-5 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-[#C5A059]" />
                <span>2026/27 Offer Sheet (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#212622]">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#C5A059] text-[#0B0C0D] shadow-md shadow-[#C5A059]/20'
                    : 'bg-[#141815] text-[#A6A296] hover:text-white hover:bg-[#1B201D] border border-[#252C27]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E7A70]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search variety, process, notes..."
              className="w-full bg-[#131614] border border-[#262D28] rounded pl-10 pr-4 py-2 text-xs text-white placeholder-[#68655E] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProducts.map((coffee) => (
            <div
              key={coffee.id}
              className="bg-[#121513] border border-[#242B26] hover:border-[#C5A059]/60 rounded-xl overflow-hidden transition-all duration-300 flex flex-col group shadow-xl hover:shadow-2xl hover:shadow-black"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden bg-[#181D1A]">
                <img
                  src={coffee.imageUrl}
                  alt={coffee.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121513] via-[#121513]/40 to-transparent" />

                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded bg-[#0B0C0D]/90 backdrop-blur-md text-[11px] font-bold text-[#E5C378] border border-[#C5A059]/40">
                    {coffee.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded bg-[#0B0C0D]/80 backdrop-blur-md text-[10.5px] font-medium text-[#B0ACA1] border border-[#2B332E]">
                    Availability on inquiry
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                    {coffee.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#C5A059] mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{coffee.origin}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#8A877E] font-semibold mb-2">
                    Product format
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[coffee.format].map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 rounded-md bg-[#1B221D] border border-[#28332B] text-[11px] font-medium text-[#E0DCCE]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0B0D0C] rounded-lg p-3.5 border border-[#1F2621] text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Coffee type</span>
                      <span className="text-white font-medium">{coffee.variety}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Processing</span>
                      <span className="text-white font-medium">{coffee.process}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Grade & specifications</span>
                      <span className="text-white font-medium">{coffee.grade}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Availability</span>
                      <span className="text-white font-medium">{coffee.availability}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#1C221E] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#9E9B92] gap-1.5">
                    <div>
                      <strong className="text-white font-medium">Export Packaging:</strong> {coffee.packaging}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#B86F3F]/80 bg-[#2A241C] px-4 py-3">
                  <span className="block text-[10px] uppercase tracking-[0.16em] font-bold text-[#E7A56F]">Minimum order</span>
                  <span className="block mt-1 text-sm font-semibold leading-relaxed text-white">{coffee.moq}</span>
                </div>

                <p className="text-xs text-[#9E9B91] leading-relaxed font-light line-clamp-2">
                  {coffee.description}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onSelectProductForSpec(coffee)}
                    className="flex-1 py-2.5 px-3 rounded text-xs font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#191F1A] hover:bg-[#202721] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Product details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    to="/contact"
                    className="flex-1 gold-button-gradient py-2.5 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#C5A059]/15 text-center"
                  >
                    <span>Request Quote</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Prep Callout Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-xl bg-[#173B2B] border border-[#B86F3F]/70 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#183525] border border-[#2C573E] flex items-center justify-center shrink-0 text-[#C5A059]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white">Request details for your order</h4>
              <p className="text-sm text-[#F0EBDD] mt-1.5 max-w-2xl leading-relaxed">
                Share your product, quantity, packaging preferences and destination. We will confirm what is available for your order.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="shrink-0 inline-flex items-center justify-center bg-[#B86F3F] hover:bg-[#C6814E] text-white px-6 py-3 rounded text-sm font-bold transition-colors"
          >
            Request a business quote
          </Link>
        </div>
      </div>
    </div>
  );
};

