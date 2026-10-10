import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Coffee, 
  CheckCircle, 
  FileCheck2, 
  Ship, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const BuyersPage: React.FC = () => {
  const steps = [
    { num: '01', title: 'Send an inquiry', desc: 'Tell us the product type and quantity you need, your packaging preferences and destination.', icon: FileText, badge: 'Step 1: Inquiry' },
    { num: '02', title: 'Review available details', desc: 'We confirm current stock, product specifications and the details available for your selected coffee batch.', icon: Search, badge: 'Step 2: Product details' },
    { num: '03', title: 'Discuss samples', desc: 'If you would like a sample, include that in your inquiry. The team can confirm availability and arrangements.', icon: Coffee, badge: 'Step 3: Samples' },
    { num: '04', title: 'Receive a quotation', desc: 'Lumera confirms pricing, availability, specifications, packaging and delivery terms in a formal quotation.', icon: CheckCircle, badge: 'Step 4: Quotation' },
    { num: '05', title: 'Agree on the order', desc: 'Both parties agree on product, quantity, price, payment terms and delivery instructions.', icon: FileCheck2, badge: 'Step 5: Order' },
    { num: '06', title: 'Prepare shipping details', desc: 'Coffee is prepared to the agreed terms. Shipping methods and required documents are finalized before dispatch.', icon: Ship, badge: 'Step 6: Delivery' },
  ];

  const faqs = [
    { q: 'What is the minimum order quantity?', a: 'The minimum order quantity depends on the product and order. Share the quantity you need so Lumera can confirm current options.' },
    { q: 'Can I request a sample?', a: 'Tell us which product you would like to sample. Availability, specifications and delivery arrangements will be confirmed by the team.' },
    { q: 'How are payment terms decided?', a: 'Payment terms are discussed and mutually agreed as part of the order confirmation.' },
    { q: 'Can packaging be customized?', a: 'Packaging is agreed based on order volume, buyer requirements and available packaging options.' },
  ];

  return (
    <div className="pt-36 sm:pt-40 pb-24 bg-[#0B0D0C]">
      {/* Page Header */}
      <section className="relative py-16 bg-[#0E1110] border-b border-[#1E241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>International trade inquiries</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white font-display">
            For International Buyers
          </h1>
          <p className="text-sm sm:text-base text-[#A8A498] max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            Lumera welcomes inquiries from importers, distributors, roasters, retailers, coffee shops, hotels and restaurants.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
            The ordering process
          </span>
          <h2 className="text-3xl font-bold text-white font-display">
            Looking for a Reliable Coffee Supplier?
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A498] mt-3 font-light leading-relaxed">
            Product information, pricing, packaging, delivery and payment terms are confirmed with you before an order is prepared.
          </p>
        </div>

        {/* 6 Step Procurement Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="bg-[#121614] border border-[#232C25] hover:border-[#C5A059]/60 rounded-xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-crest text-xl font-bold gold-text-gradient">
                      {item.num}
                    </span>
                    <span className="text-[10.5px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#18231C] text-[#C5A059] border border-[#C5A059]/20">
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-[#18261E] border border-[#253A2E] flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#F3E5AB] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#9B978D] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#1C221D] flex items-center justify-between text-[11px] text-[#7A766D]">
                  <span>Stage {idx + 1} of 6</span>
                  <span className="text-[#C5A059] font-medium">Next step →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-[#101412] border border-[#232C25] rounded-2xl p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase tracking-wider text-[#C5A059] font-bold block mb-1">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Buyer & Trade FAQs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0B0D0C] p-6 rounded-xl border border-[#1E241F] space-y-2">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <h4 className="font-bold text-white text-sm">{faq.q}</h4>
                </div>
                <p className="text-[#969288] font-light leading-relaxed pl-6.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8 border-t border-[#1C221D]">
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
            Ready to Begin Step 1?
          </h3>
          <p className="text-xs sm:text-sm text-[#8F8B81] max-w-lg mx-auto mb-6">
            Send us your product, quantity, packaging and destination requirements for a formal quotation.
          </p>
          <Link
            to="/contact"
            className="gold-button-gradient px-8 py-3.5 rounded text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
          >
            <span>Tell Us What You Need</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

