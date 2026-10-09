import React from 'react';
import { 
  Compass, 
  Target, 
  Eye, 
  HeartHandshake, 
  ShieldCheck, 
  Leaf, 
  Users2,
  Sparkles
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-[#0E100F] border-t border-[#1E241F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Built on Trust & Proven Origin</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight leading-tight">
            About Lumera Coffee
          </h2>
          <p className="text-sm sm:text-base text-[#9F9B90] mt-4 font-light leading-relaxed">
            Bridging pristine coffee origin highlands with international buyers who demand uncompromising quality, transparency, and dependable trade relationships.
          </p>
        </div>

        {/* Our Story Feature Card */}
        <div className="rounded-2xl bg-[#121614] border border-[#242C26] p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Our Story
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-white font-display leading-tight">
              Exceptional Coffee Begins at Its Origin
            </h3>
            <div className="space-y-4 text-sm sm:text-base text-[#C2BEB2] font-light leading-relaxed">
              <p>
                At <strong className="text-white font-medium">Lumera Coffee</strong>, we believe exceptional coffee begins at its origin.
              </p>
              <p>
                We work with carefully selected coffee producers and supply partners to source quality coffee while maintaining a strong focus on consistency, traceability, and responsible sourcing.
              </p>
              <p className="text-[#E5C378] font-medium">
                Our goal is simple: to connect the richness of coffee-growing regions with buyers around the world.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          <div className="bg-[#121614] border border-[#242D26] hover:border-[#C5A059]/60 rounded-xl p-8 transition-all group flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#18261E] border border-[#283C2F] flex items-center justify-center text-[#C5A059] mb-5 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>

              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
                Our Purpose
              </span>
              <h3 className="text-2xl font-bold text-white mb-4 font-display">
                Our Mission
              </h3>

              <blockquote className="text-sm sm:text-base text-[#D0CCC2] font-serif-luxury italic border-l-2 border-[#C5A059] pl-4 py-1 leading-relaxed">
                "To connect coffee producers and global buyers through reliable sourcing, exceptional quality, and responsible export."
              </blockquote>
            </div>

            <p className="text-xs text-[#8E8A80] mt-6 pt-4 border-t border-[#1C221D] font-light">
              Direct producer partnerships, clean processing, and dependable contract fulfillment.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-[#121614] border border-[#242D26] hover:border-[#C5A059]/60 rounded-xl p-8 transition-all group flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#18261E] border border-[#283C2F] flex items-center justify-center text-[#C5A059] mb-5 group-hover:scale-105 transition-transform">
                <Eye className="w-6 h-6" />
              </div>

              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
                Our Horizon
              </span>
              <h3 className="text-2xl font-bold text-white mb-4 font-display">
                Our Vision
              </h3>

              <blockquote className="text-sm sm:text-base text-[#D0CCC2] font-serif-luxury italic border-l-2 border-[#C5A059] pl-4 py-1 leading-relaxed">
                "To become a trusted global coffee partner recognized for quality, transparency, and long-term relationships."
              </blockquote>
            </div>

            <p className="text-xs text-[#8E8A80] mt-6 pt-4 border-t border-[#1C221D] font-light">
              Cultivating multi-year supply contracts founded on mutual prosperity and excellence.
            </p>
          </div>
        </div>

        {/* Responsible Sourcing Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-xl bg-[#111412] border border-[#212823]">
            <HeartHandshake className="w-6 h-6 text-[#C5A059] mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Farmer Equity</h4>
            <p className="text-xs text-[#8D897F] font-light leading-relaxed">
              Transparent, premium cherry prices paid directly at washing stations to incentivize quality harvesting.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#111412] border border-[#212823]">
            <Leaf className="w-6 h-6 text-[#C5A059] mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Eco-Water Stewardship</h4>
            <p className="text-xs text-[#8D897F] font-light leading-relaxed">
              Low-water eco-pulpers and natural bio-filtration systems protect local rivers and mountain aquifers.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#111412] border border-[#212823]">
            <ShieldCheck className="w-6 h-6 text-[#C5A059] mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Export Integrity</h4>
            <p className="text-xs text-[#8D897F] font-light leading-relaxed">
              Total fidelity to contracts, guaranteed pre-shipment sample specifications, and timely document dispatch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
