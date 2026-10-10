import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe2, PackageCheck, Ship, Users } from 'lucide-react';

const partners = ['Coffee importers', 'Distributors and wholesalers', 'Commercial and specialty roasters', 'Coffee shops and coffee bars', 'Hotels and restaurants', 'Retailers and specialty stores', 'Private-label brands, by agreement'];

export const ExportPage: React.FC = () => (
  <div className="pt-36 sm:pt-40 pb-24 bg-[#F2EFE7] text-[#26382D]">
    <section className="py-16 bg-[#E8E4D9] border-b border-[#D9D3C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8B4F2A] mb-3"><Globe2 size={15} /><span>International trade</span></div>
        <h1 className="text-4xl sm:text-6xl font-bold font-display">Rwandan Coffee for Your Market</h1>
        <p className="text-sm sm:text-base text-[#526056] max-w-2xl mx-auto mt-4 leading-relaxed">We welcome inquiries about green and roasted Rwandan Arabica coffee. Availability, export options, documents and delivery terms are confirmed for each order.</p>
      </div>
    </section>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div><span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8B4F2A]">Who we work with</span><h2 className="text-3xl font-bold font-display mt-3">Coffee businesses around the world</h2><p className="text-sm leading-7 text-[#526056] mt-3">Tell us about your business and what you need. We will discuss available products and the details that fit your request.</p></div>
        <div className="grid sm:grid-cols-2 gap-3">{partners.map((partner) => <div key={partner} className="flex items-center gap-3 rounded-xl bg-white/75 border border-[#D9D3C4] p-4 text-sm"><Users size={16} className="text-[#A96532] shrink-0" />{partner}</div>)}</div>
      </section>

      <section className="rounded-2xl bg-[#173B2B] p-7 sm:p-10 text-[#F7F4EC]">
        <div className="flex items-start gap-4"><Ship className="w-6 h-6 text-[#E4BD91] shrink-0 mt-1" /><div><h2 className="text-2xl font-bold font-display">Shipping and export requirements</h2><p className="text-sm leading-7 text-[#E3E7DE] mt-3 max-w-3xl">Include your destination country and port or location, preferred shipping terms or Incoterms agreement, quantity and packaging requirements. Lumera will confirm available shipping options, costs and required export or transport documents in the formal quotation and order agreement.</p></div></div>
        <div className="mt-7 pt-6 border-t border-white/20 flex items-start gap-4"><PackageCheck className="w-6 h-6 text-[#E4BD91] shrink-0 mt-1" /><div><h3 className="font-semibold">Preparation by agreement</h3><p className="text-sm leading-6 text-[#D3DBD1] mt-2">Product preparation follows the specifications and mutual terms confirmed for each order. Packaging options and minimum order quantities are agreed based on the request.</p></div></div>
      </section>

      <section className="grid md:grid-cols-3 gap-5">{[['01', 'Share your needs', 'Tell us the product, quantity, roast preference, packaging and destination.'], ['02', 'Review the quotation', 'We confirm availability, specifications, pricing, shipping and delivery costs.'], ['03', 'Agree and prepare', 'Both parties confirm the terms before preparation and dispatch planning.']].map(([num, title, copy]) => <article key={num} className="bg-white/75 border border-[#D9D3C4] rounded-xl p-6"><span className="text-sm font-bold text-[#A96532]">{num}</span><h3 className="text-lg font-bold font-display mt-3">{title}</h3><p className="text-sm text-[#526056] leading-6 mt-2">{copy}</p></article>)}</section>

      <section className="text-center border-t border-[#D9D3C4] pt-9"><h2 className="text-2xl font-bold font-display">Tell us about your market</h2><p className="max-w-xl mx-auto text-sm text-[#526056] mt-2 mb-5">Share your quantity, destination and product requirements for a tailored business proposal.</p><Link to="/contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#A96532] text-white text-sm font-semibold">Start an inquiry <ArrowRight size={16} /></Link></section>
    </div>
  </div>
);
