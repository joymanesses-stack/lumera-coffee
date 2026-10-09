import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';
import { CoffeeProduct } from '../types';
import { 
  ArrowRight, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Globe2, 
  Sparkles, 
  Package, 
  CheckCircle2, 
  Anchor,
  Compass,
  FileText
} from 'lucide-react';

interface HomePageProps {
  onOpenQuoteModal: (coffeeName?: string) => void;
  onOpenCatalogModal: () => void;
  onSelectProductForSpec: (product: CoffeeProduct) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenQuoteModal,
  onOpenCatalogModal,
  onSelectProductForSpec,
}) => {
  const featuredCoffees = COFFEE_PRODUCTS.slice(0, 3);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero 
        onOpenQuoteModal={() => onOpenQuoteModal()}
        onOpenCatalogModal={onOpenCatalogModal}
      />

      {/* 2. Executive Positioning Strip: Who, What, Where, Why, How */}
      <section className="py-20 bg-[#0E1110] border-t border-[#1E2520]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.28em] text-[#C5A059] font-semibold block mb-2">
              The Exporter Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Built for Discerning Global Coffee Importers
            </h2>
            <p className="text-sm text-[#A39F93] mt-3 font-light leading-relaxed">
              We operate exclusively as a professional B2B coffee exporter. Every lot is graded, cupped, and packaged specifically for international green coffee trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Box 1: What We Export */}
            <div className="bg-[#121614] border border-[#232C25] hover:border-[#C5A059]/60 rounded-xl p-6 flex flex-col justify-between group transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#18261E] border border-[#273B2E] flex items-center justify-center text-[#C5A059] mb-4">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">What We Export</h3>
                <p className="text-xs text-[#9B978D] font-light leading-relaxed">
                  Specialty Arabica (Red Bourbon G1), European Prep Washed, Natural Sun-Dried micro-lots, and Screen 18 Fine Highland Robusta.
                </p>
              </div>
              <Link 
                to="/coffee" 
                className="mt-6 text-xs text-[#C5A059] group-hover:text-white font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <span>View All Coffee Lots</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Box 2: Where We Export */}
            <div className="bg-[#121614] border border-[#232C25] hover:border-[#C5A059]/60 rounded-xl p-6 flex flex-col justify-between group transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#18261E] border border-[#273B2E] flex items-center justify-center text-[#C5A059] mb-4">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Where We Export</h3>
                <p className="text-xs text-[#9B978D] font-light leading-relaxed">
                  Reliable ocean freight container dispatch (FOB & CIF) to Rotterdam, Hamburg, Antwerp, New York, Oakland, Dubai, and East Asia.
                </p>
              </div>
              <Link 
                to="/export" 
                className="mt-6 text-xs text-[#C5A059] group-hover:text-white font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <span>Explore Trade Routes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Box 3: Why Trust Us */}
            <div className="bg-[#121614] border border-[#232C25] hover:border-[#C5A059]/60 rounded-xl p-6 flex flex-col justify-between group transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#18261E] border border-[#273B2E] flex items-center justify-center text-[#C5A059] mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Why Importers Trust Us</h3>
                <p className="text-xs text-[#9B978D] font-light leading-relaxed">
                  Triple cupping protocol (OS, PSS, VS), strict moisture thresholds (10.5%–11.5%), GrainPro® hermetic bags, and full lot traceability.
                </p>
              </div>
              <Link 
                to="/quality" 
                className="mt-6 text-xs text-[#C5A059] group-hover:text-white font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <span>Our Quality Protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Box 4: How To Buy */}
            <div className="bg-[#121614] border border-[#232C25] hover:border-[#C5A059]/60 rounded-xl p-6 flex flex-col justify-between group transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#18261E] border border-[#273B2E] flex items-center justify-center text-[#C5A059] mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">How To Buy</h3>
                <p className="text-xs text-[#9B978D] font-light leading-relaxed">
                  A structured 6-step procurement workflow: Request quote → Spec match → Sample approval → Contract lock → QC → Sea shipment.
                </p>
              </div>
              <Link 
                to="/buyers" 
                className="mt-6 text-xs text-[#C5A059] group-hover:text-white font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <span>View Buyer Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Green Coffee Lots Section */}
      <section className="py-24 bg-[#0B0D0C] border-t border-[#1C221D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-2">
                Export Catalog Snapshot
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
                Featured Coffee Offerings
              </h2>
            </div>
            <Link
              to="/coffee"
              className="gold-outline-button px-5 py-2.5 rounded text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2"
            >
              <span>Explore All Offerings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCoffees.map((coffee) => (
              <div 
                key={coffee.id}
                className="bg-[#121514] border border-[#232B25] hover:border-[#C5A059]/60 rounded-xl overflow-hidden transition-all duration-300 flex flex-col group shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-[#181D1A]">
                  <img
                    src={coffee.imageUrl}
                    alt={coffee.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121514] via-[#121514]/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-[#0B0C0D]/90 text-[10.5px] font-bold text-[#E5C378] border border-[#C5A059]/40">
                      {coffee.category}
                    </span>
                  </div>
                  {coffee.cupScore && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded bg-[#163624]/90 text-[10.5px] font-bold text-[#9BE0B3] border border-emerald-500/40">
                        SCA {coffee.cupScore}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white font-display">
                      {coffee.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[#C5A059]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{coffee.origin} • {coffee.altitude}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {coffee.cupProfile.slice(0, 3).map((note) => (
                        <span key={note} className="px-2 py-0.5 rounded bg-[#1A221C] text-[10.5px] text-[#D8D4C8]">
                          {note}
                        </span>
                      ))}
                    </div>
                    <div className="bg-[#0B0D0C] p-2.5 rounded border border-[#1E241F] grid grid-cols-2 gap-2 text-[11px] mt-2">
                      <div>
                        <span className="text-[#78756D] block">Screen Size</span>
                        <span className="text-white font-medium">{coffee.screenSize}</span>
                      </div>
                      <div>
                        <span className="text-[#78756D] block">Moisture %</span>
                        <span className="text-white font-medium">{coffee.moisture}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProductForSpec(coffee)}
                      className="flex-1 py-2 px-3 rounded text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#18201A] hover:bg-[#202721] border border-[#C5A059]/30 transition-colors"
                    >
                      Spec Sheet
                    </button>
                    <button
                      onClick={() => onOpenQuoteModal(coffee.name)}
                      className="flex-1 gold-button-gradient py-2 px-3 rounded text-[11px] font-bold uppercase tracking-wider text-center"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Origin Story & Terroir Teaser */}
      <section className="py-24 bg-[#0E100F] border-t border-[#1C221D] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.28em] text-[#C5A059] font-semibold">
                Highland Terroir
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-display leading-tight">
                Born in the Highlands.<br />
                <span className="gold-text-gradient font-display italic">Prepared for the World.</span>
              </h2>
              <p className="text-sm text-[#BFBBB0] font-light leading-relaxed">
                Nurtured on nutrient-dense volcanic slopes at elevations between 1,750m and 2,200m above sea level. Cool mountain mists and warm equatorial sunlight create beans of extraordinary density and vibrant complexity.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 rounded-lg bg-[#121614] border border-[#242D26]">
                  <strong className="text-white block">Volcanic Soil</strong>
                  <span className="text-[#8E8B81]">Deep mineral nutrients promote complex phosphoric cup acidity.</span>
                </div>
                <div className="p-3 rounded-lg bg-[#121614] border border-[#242D26]">
                  <strong className="text-white block">Mountain Spring Water</strong>
                  <span className="text-[#8E8B81]">Pure highland aquifers used for pristine double-washing.</span>
                </div>
              </div>
              <div>
                <Link
                  to="/origin"
                  className="gold-button-gradient px-6 py-3 rounded text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
                >
                  <span>Explore Our Origin & Supply Chain</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#262E28] relative min-h-[380px] group shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"
                alt="Highland Coffee Terroir"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0D] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0B0C0D]/85 backdrop-blur-md border border-[#232B25]">
                <div className="text-xs uppercase tracking-wider text-[#C5A059] font-bold">Traceable Washing Stations</div>
                <div className="text-white text-sm font-semibold mt-0.5">Direct Farmgate Cherry Sourcing & Raised Bed Drying</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Big Exporter CTA Ribbon */}
      <section className="py-20 bg-gradient-to-r from-[#17251C] via-[#101412] to-[#17251C] border-t border-[#C5A059]/30 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
            Pure Origin. Rich Flavor. True Quality.
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display">
            Ready to Source Green Coffee with Lumera?
          </h2>
          <p className="text-sm text-[#C8C4B8] max-w-xl mx-auto font-light leading-relaxed">
            Get in touch with our export operations desk to request FOB/CIF commercial quotes, reserve seasonal allocations, or receive courier sample lots.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="w-full sm:w-auto gold-button-gradient px-8 py-4 rounded text-xs uppercase tracking-wider font-bold shadow-xl shadow-[#C5A059]/25 inline-flex items-center justify-center gap-2"
            >
              <span>REQUEST A QUOTE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={onOpenCatalogModal}
              className="w-full sm:w-auto gold-outline-button px-6 py-4 rounded text-xs uppercase tracking-wider font-semibold"
            >
              Download Offer List (PDF)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
