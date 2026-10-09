import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Target, 
  Eye, 
  HeartHandshake, 
  ShieldCheck, 
  Leaf, 
  Users2,
  Award,
  ArrowRight,
  Globe2,
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-36 sm:pt-40 pb-24 bg-[#0B0D0C]">
      {/* Page Header */}
      <section className="relative py-16 bg-[#0E1110] border-b border-[#1E241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Company Profile & Philosophy</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white font-display">
            About Lumera Coffee
          </h1>
          <p className="text-sm sm:text-base text-[#A8A498] max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            Founded on trust, origin integrity, and responsible international trade. Connecting pristine highland coffee terroirs with discerning buyers worldwide.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Our Story Card */}
        <div className="rounded-2xl bg-[#121614] border border-[#242C26] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-xs uppercase tracking-[0.28em] text-[#C5A059] font-semibold">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display leading-tight">
              At Lumera Coffee, we believe exceptional coffee begins at its origin.
            </h2>
            <div className="space-y-4 text-base text-[#C2BEB2] font-light leading-relaxed">
              <p>
                We work with carefully selected coffee producers and supply partners to source quality coffee while maintaining a strong focus on consistency, traceability, and responsible sourcing.
              </p>
              <p className="text-[#E5C378] font-medium text-lg font-serif-luxury italic">
                Our goal is simple: to connect the richness of coffee-growing regions with buyers around the world.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-[#121614] border border-[#242D26] hover:border-[#C5A059]/60 rounded-xl p-8 sm:p-10 transition-all group flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#18261E] border border-[#283C2F] flex items-center justify-center text-[#C5A059] mb-5 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>

              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
                Our Mission
              </span>
              <h3 className="text-2xl font-bold text-white mb-4 font-display">
                Connecting Origin & World
              </h3>

              <blockquote className="text-base text-[#D0CCC2] font-serif-luxury italic border-l-2 border-[#C5A059] pl-4 py-1 leading-relaxed">
                "To connect coffee producers and global buyers through reliable sourcing, exceptional quality, and responsible export."
              </blockquote>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1C221D] text-xs text-[#8E8A80]">
              Built to serve international roasters, importers, and distributors with unwavering consistency.
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-[#121614] border border-[#242D26] hover:border-[#C5A059]/60 rounded-xl p-8 sm:p-10 transition-all group flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#18261E] border border-[#283C2F] flex items-center justify-center text-[#C5A059] mb-5 group-hover:scale-105 transition-transform">
                <Eye className="w-6 h-6" />
              </div>

              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
                Our Vision
              </span>
              <h3 className="text-2xl font-bold text-white mb-4 font-display">
                A Trusted Global Partner
              </h3>

              <blockquote className="text-base text-[#D0CCC2] font-serif-luxury italic border-l-2 border-[#C5A059] pl-4 py-1 leading-relaxed">
                "To become a trusted global coffee partner recognized for quality, transparency, and long-term relationships."
              </blockquote>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1C221D] text-xs text-[#8E8A80]">
              Cultivating multi-year supply contracts founded on mutual prosperity and respect.
            </div>
          </div>
        </div>

        {/* Responsible Sourcing & Producer Equity */}
        <div className="bg-[#101412] border border-[#222B25] rounded-2xl p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-2">
              Our Principles
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Ethical Sourcing & Environmental Responsibility
            </h3>
            <p className="text-xs sm:text-sm text-[#A19D92] mt-2 font-light leading-relaxed">
              Long-term exporter sustainability requires direct economic vitality for coffee farming families and preservation of pristine mountain ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0B0D0C] border border-[#1F2620]">
              <HeartHandshake className="w-6 h-6 text-[#C5A059] mb-3" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Fair Farmgate Cherry Prices</h4>
              <p className="text-xs text-[#8E8A80] font-light leading-relaxed">
                Partner smallholders receive premium, transparent cash payouts upon cherry delivery, providing livelihood stability and incentivizing selective ripe harvesting.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B0D0C] border border-[#1F2620]">
              <Leaf className="w-6 h-6 text-[#C5A059] mb-3" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Aquifer & Forest Protection</h4>
              <p className="text-xs text-[#8E8A80] font-light leading-relaxed">
                Eco-pulpers reduce water usage by up to 80%. Washing station wastewater is neutralised in natural vetiver filtration ponds before returning to mountain watersheds.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B0D0C] border border-[#1F2620]">
              <ShieldCheck className="w-6 h-6 text-[#C5A059] mb-3" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Total Contract Fidelity</h4>
              <p className="text-xs text-[#8E8A80] font-light leading-relaxed">
                When you sign a contract with Lumera Coffee, volume allocations, moisture limits, and cupping score profiles are guaranteed without compromise.
              </p>
            </div>
          </div>
        </div>

        {/* CTA to Contact Page */}
        <div className="text-center pt-8 border-t border-[#1C221D]">
          <h3 className="text-2xl font-bold text-white font-display mb-2">
            Interested in Partnering with Lumera Coffee?
          </h3>
          <p className="text-xs sm:text-sm text-[#8F8B81] max-w-lg mx-auto mb-6">
            Speak directly with our trade operations desk to explore spot offerings, forward bookings, or sample evaluations.
          </p>
          <Link
            to="/contact"
            className="gold-button-gradient px-8 py-3.5 rounded text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
          >
            <span>Request a Quote & Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
