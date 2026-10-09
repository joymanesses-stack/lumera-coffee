import React from 'react';
import { QuoteSection } from '../components/QuoteSection';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-36 sm:pt-40 pb-24 bg-[#0B0D0C]">
      {/* Page Header */}
      <section className="relative py-16 bg-[#0E1110] border-b border-[#1E241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>International Trade Desk</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white font-display">
            Request an Export Quotation
          </h1>
          <p className="text-sm sm:text-base text-[#A8A498] max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            Connect with our international export specialists to receive proforma FOB/CIF quotes, reserve crop allocations, or request courier evaluation samples.
          </p>
        </div>
      </section>

      {/* Embedded Comprehensive Form */}
      <div>
        <QuoteSection />
      </div>
    </div>
  );
};
