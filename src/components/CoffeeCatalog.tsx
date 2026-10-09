import React, { useState } from 'react';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';
import { CoffeeProduct } from '../types';
import { 
  Package, 
  Layers, 
  MapPin, 
  Award, 
  Droplets, 
  Check, 
  ExternalLink, 
  ArrowUpRight,
  Filter,
  Sparkles,
  Search
} from 'lucide-react';

interface CoffeeCatalogProps {
  onSelectProductForSpec: (product: CoffeeProduct) => void;
  onSelectProductForQuote: (product: CoffeeProduct) => void;
}

export const CoffeeCatalog: React.FC<CoffeeCatalogProps> = ({
  onSelectProductForSpec,
  onSelectProductForQuote,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    'All',
    'Specialty Arabica',
    'Premium Washed',
    'Natural & Sun-Dried',
    'Fine Robusta',
  ];

  const filteredProducts = COFFEE_PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.process.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.cupProfile.some(note => note.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="coffee" className="py-24 bg-[#0D0F0E] border-t border-[#1E2320] relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#163624]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Export Offerings & Green Coffee Lots</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Our Coffee Portfolio
            </h2>
            <p className="text-sm sm:text-base text-[#A8A499] mt-3 font-light leading-relaxed">
              Export-ready green coffee lots prepared according to strict international physical grading, moisture tolerances, and SCA cupping protocols. Filter by process, screen size, and lot profile.
            </p>
          </div>

          <div className="text-xs text-[#8E8B83] border-l-2 border-[#C5A059] pl-4 hidden md:block">
            <span className="text-white font-medium block">Standard Export Packaging:</span>
            60 kg Net Jute Bags + High-Barrier GrainPro® Liners<br />
            20ft FCL Container Capacity: 320 Bags (19.2 MT)
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#212622]">
          {/* Category Tabs */}
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

          {/* Quick Search */}
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
              {/* Card Top: Image + High Level Badges */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-[#181D1A]">
                <img
                  src={coffee.imageUrl}
                  alt={coffee.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121513] via-[#121513]/40 to-transparent" />

                {/* Score Pill & Category */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded bg-[#0B0C0D]/90 backdrop-blur-md text-[11px] font-bold text-[#E5C378] border border-[#C5A059]/40">
                    {coffee.category}
                  </span>
                  {coffee.cupScore && (
                    <span className="px-3 py-1 rounded bg-[#163624]/90 backdrop-blur-md text-[11px] font-bold text-[#9BE0B3] border border-emerald-500/40 flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#9BE0B3]" />
                      SCA {coffee.cupScore} PTS
                    </span>
                  )}
                </div>

                {/* Harvest / Availability Tag */}
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded bg-[#0B0C0D]/80 backdrop-blur-md text-[10.5px] font-medium text-[#B0ACA1] border border-[#2B332E]">
                    {coffee.availability.includes('Booking') ? 'Offer List Open' : 'Export Ready'}
                  </span>
                </div>

                {/* Card Title placed over lower gradient */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                    {coffee.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#C5A059] mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{coffee.origin} • {coffee.altitude}</span>
                  </div>
                </div>
              </div>

              {/* Card Content & Export Technical Specifications */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                {/* Cupping Flavor Profile Notes */}
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#8A877E] font-semibold mb-2">
                    Cup Profile & Sensory Notes
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {coffee.cupProfile.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 rounded-md bg-[#1B221D] border border-[#28332B] text-[11px] font-medium text-[#E0DCCE]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications Table / Grid */}
                <div className="bg-[#0B0D0C] rounded-lg p-3.5 border border-[#1F2621] text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Variety</span>
                      <span className="text-white font-medium">{coffee.variety}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Process</span>
                      <span className="text-white font-medium">{coffee.process}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Grade</span>
                      <span className="text-[#E0C079] font-medium">{coffee.grade}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Screen Size</span>
                      <span className="text-white font-medium">{coffee.screenSize}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Moisture %</span>
                      <span className="text-white font-medium">{coffee.moisture}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A776F] block">Defects / 300g</span>
                      <span className="text-white font-medium">{coffee.defectCount}</span>
                    </div>
                  </div>

                  {/* Packaging & MOQ Strip */}
                  <div className="mt-3 pt-3 border-t border-[#1C221E] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#9E9B92] gap-1.5">
                    <div>
                      <strong className="text-white font-medium">Export Packaging:</strong> {coffee.packaging}
                    </div>
                    <div>
                      <strong className="text-white font-medium">MOQ:</strong> {coffee.moq}
                    </div>
                  </div>
                </div>

                {/* Description summary */}
                <p className="text-xs text-[#9E9B91] leading-relaxed font-light line-clamp-2">
                  {coffee.description}
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onSelectProductForSpec(coffee)}
                    className="flex-1 py-2.5 px-3 rounded text-xs font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#191F1A] hover:bg-[#202721] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Full Spec Sheet</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectProductForQuote(coffee)}
                    className="flex-1 gold-button-gradient py-2.5 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#C5A059]/15"
                  >
                    <span>Request Sample / Quote</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-[#121513] rounded-xl border border-[#212723]">
            <p className="text-[#9F9B90] text-sm">No coffee lots found matching your filter criteria.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
              className="mt-3 text-xs text-[#C5A059] underline uppercase tracking-wider font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Exporter Note */}
        <div className="mt-14 p-6 rounded-xl bg-[#111613] border border-[#222E26] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#183525] border border-[#2C573E] flex items-center justify-center shrink-0 text-[#C5A059]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Custom Exporter Specifications & Micro-Lots</h4>
              <p className="text-xs text-[#8F8B81] mt-0.5">
                Require bespoke screen sizes (Screen 17/18 separation), zero-defect European Prep, customized GrainPro packaging, or direct washing station exclusive container contracts?
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectProductForQuote(COFFEE_PRODUCTS[0])}
            className="shrink-0 gold-outline-button px-5 py-2.5 rounded text-xs uppercase tracking-wider font-bold"
          >
            Inquire for Custom Preparation
          </button>
        </div>
      </div>
    </section>
  );
};
