import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mountain, 
  CloudSun, 
  Droplet, 
  Trees, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const OriginPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Grown at Origin',
      sub: 'Highland Volcanic Slopes',
      desc: 'Cultivated at 1,750m – 2,200m ASL in deep volcanic soil, shaded under native canopy trees and nourished by pure mountain rains.',
    },
    {
      num: '02',
      title: 'Carefully Selected',
      sub: 'Hand Harvesting & Density Floats',
      desc: 'Only fully ripened red cherries with optimal Brix sugar levels are hand-picked. Hydro-density floatation tanks eliminate floats and defects.',
    },
    {
      num: '03',
      title: 'Eco Wet-Milled',
      sub: 'Pure Mountain Spring Water',
      desc: 'Depulped with ecological wet mills, undergo regulated double fermentation, and washed thoroughly with pristine mountain springs.',
    },
    {
      num: '04',
      title: 'Slow Bed Drying',
      sub: 'African Raised Mesh Beds',
      desc: 'Sun-dried gently over 15 to 25 days on elevated African drying tables, hand-turned hourly until moisture stabilizes precisely between 10.5%–11.5%.',
    },
    {
      num: '05',
      title: 'Dry Milled & Graded',
      sub: 'Precision Optical Sorting',
      desc: 'Hulled, gravity-separated, and graded through precision screen sieves (Screen 15+ / 17+) and optical bichromatic color sorters.',
    },
    {
      num: '06',
      title: 'Hermetic Export & Delivery',
      sub: 'FOB / CIF Global Dispatch',
      desc: 'Sealed inside multi-layer GrainPro® hermetic liners within 60kg food-grade jute sacks, containerized and shipped under strict temperature protocol.',
    },
  ];

  return (
    <div className="pt-36 sm:pt-40 pb-24 bg-[#0B0D0C]">
      {/* Page Header */}
      <section className="relative py-16 bg-[#0E1110] border-b border-[#1E241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <Mountain className="w-3.5 h-3.5" />
            <span>Terroir, Altitude & Supply Chain</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white font-display">
            From Our Origin to Your Market
          </h1>
          <p className="text-sm sm:text-base text-[#A8A498] max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            Where exceptional coffee begins. Volcanic soils, high-altitude microclimates, and generational smallholder dedication.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Born in the Highlands Headline Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden relative min-h-[460px] border border-[#242C27] flex flex-col justify-end p-8 group shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=80"
              alt="Highland Coffee Terroir"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0D] via-[#0B0C0D]/70 to-transparent" />

            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 rounded bg-[#163624] text-xs font-semibold uppercase tracking-wider text-[#9BE0B3] border border-emerald-500/30 inline-block">
                Volcanic Terroir
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
                Born in the highlands. Prepared for the world.
              </h2>
              <p className="text-xs sm:text-sm text-[#BFBBB0] font-light leading-relaxed max-w-xl">
                At elevations between 1,750 and 2,200 meters above sea level, coffee cherries mature at a dramatically slower pace. This extended gestation allows sugars, phosphoric acids, and delicate floral precursors to condense into exceptionally dense green beans that withstand long sea voyages and reward discerning roasters.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-[#0B0C0D]/80 backdrop-blur-md p-3 rounded-lg border border-[#262D28]">
                  <span className="text-[10px] uppercase text-[#C5A059] block font-semibold">Elevation Range</span>
                  <span className="text-white font-medium text-sm">1,750m – 2,200m ASL</span>
                </div>
                <div className="bg-[#0B0C0D]/80 backdrop-blur-md p-3 rounded-lg border border-[#262D28]">
                  <span className="text-[10px] uppercase text-[#C5A059] block font-semibold">Annual Rainfall</span>
                  <span className="text-white font-medium text-sm">1,250mm – 1,500mm</span>
                </div>
                <div className="bg-[#0B0C0D]/80 backdrop-blur-md p-3 rounded-lg border border-[#262D28] col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-[#C5A059] block font-semibold">Soil Composition</span>
                  <span className="text-white font-medium text-sm">Rich Volcanic Loam</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-[#121614] border border-[#232B25] rounded-xl p-6 hover:border-[#C5A059]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#18261E] text-[#C5A059] shrink-0">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Equatorial Microclimate</h3>
                  <p className="text-xs text-[#9B978D] mt-1 leading-relaxed">
                    Sunny mornings accelerate solar photosynthesis while cool afternoon mountain mists buffer temperatures, preserving delicate floral volatiles and clean cup structures.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#121614] border border-[#232B25] rounded-xl p-6 hover:border-[#C5A059]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#18261E] text-[#C5A059] shrink-0">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Mountain Spring Processing</h3>
                  <p className="text-xs text-[#9B978D] mt-1 leading-relaxed">
                    Our partner washing stations utilize pure natural mountain aquifers for fermentation and double-soaking, guaranteeing sparkling clean cup clarity.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#121614] border border-[#232B25] rounded-xl p-6 hover:border-[#C5A059]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#18261E] text-[#C5A059] shrink-0">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Smallholder Heritage & Hand Harvesting</h3>
                  <p className="text-xs text-[#9B978D] mt-1 leading-relaxed">
                    Generations of traditional cultivation passed down through farmer families. Only dark-red, perfectly ripe cherries are accepted at the washing stations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Stage Supply Chain Infographic */}
        <div className="pt-8 border-t border-[#1F2621]">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059]">
              The Supply Chain Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1 font-display">
              Grown at Origin → Delivered to Your Port
            </h2>
            <p className="text-xs sm:text-sm text-[#8F8B81] max-w-xl mx-auto mt-2">
              Every stage from harvest to ocean container loading is monitored to preserve moisture stability and cup excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-[#121514] border border-[#232924] hover:border-[#C5A059]/50 rounded-xl p-6 transition-all duration-300 relative group shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold font-crest gold-text-gradient">
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#18201A] border border-[#2B382F] flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {step.title}
                </h3>
                <div className="text-xs uppercase tracking-wider text-[#C5A059] font-medium mb-3">
                  {step.sub}
                </div>
                <p className="text-xs text-[#99958C] font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Origin Harvest Calendar Table */}
        <div className="bg-[#111412] border border-[#232C25] rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-2">
            <Calendar className="w-4 h-4" />
            <span>Highland Harvest & Shipping Timeline</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-display mb-6">
            Seasonal Crop Calendar
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#0B0D0C] p-4 rounded-xl border border-[#202721]">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">Main Crop Harvest</span>
              <span className="text-white font-bold text-sm block mt-1">March – July</span>
              <p className="text-[#88857B] mt-1">Highland Arabica cherry hand-picking, wet milling & sun-drying on raised beds.</p>
            </div>

            <div className="bg-[#0B0D0C] p-4 rounded-xl border border-[#202721]">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">Offer List & Sampling</span>
              <span className="text-white font-bold text-sm block mt-1">May – August</span>
              <p className="text-[#88857B] mt-1">Offer samples (OS) cupped and dispatched via express air courier to international buyers.</p>
            </div>

            <div className="bg-[#0B0D0C] p-4 rounded-xl border border-[#202721]">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">Container Ocean Shipments</span>
              <span className="text-white font-bold text-sm block mt-1">July – December</span>
              <p className="text-[#88857B] mt-1">Dry milling, optical sorting, GrainPro stuffing, and FOB/CIF vessel sailings.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1C221D] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#9B978C]">
              Ready to secure your volume for the 2026/2027 harvest?
            </span>
            <Link
              to="/contact"
              className="gold-button-gradient px-6 py-2.5 rounded text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
            >
              <span>Book Crop Allocations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
