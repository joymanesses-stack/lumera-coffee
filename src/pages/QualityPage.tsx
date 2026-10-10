import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, ClipboardList, FileCheck2, ShieldCheck } from 'lucide-react';

const information = [
  { icon: ClipboardList, title: 'Product & batch details', text: 'Processing method, grade and specifications are shared for the selected coffee when available.' },
  { icon: BadgeCheck, title: 'Verified claims', text: 'Grades, certifications, cupping scores and quality parameters are stated only after they have been tested and verified for a specific product or batch.' },
  { icon: FileCheck2, title: 'Documents when available', text: 'Documentation can be discussed based on buyer requirements and may include origin, processing, quality, packaging and export or transport information.' },
];

export const QualityPage: React.FC = () => (
  <div className="pt-36 sm:pt-40 pb-24 bg-[#F2EFE7] text-[#26382D]">
    <section className="py-16 bg-[#E8E4D9] border-b border-[#D9D3C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8B4F2A] mb-3"><ShieldCheck size={15} /><span>Product information & verification</span></div>
        <h1 className="text-4xl sm:text-6xl font-bold font-display">Quality, Clearly Explained</h1>
        <p className="text-sm sm:text-base text-[#526056] max-w-2xl mx-auto mt-4 leading-relaxed">Lumera values consistent product quality, full origin traceability and responsible business practices. Details are provided for the selected coffee and batch.</p>
      </div>
    </section>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <section className="grid md:grid-cols-3 gap-5">
        {information.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl bg-white/75 border border-[#D9D3C4] p-6 sm:p-7"><Icon className="w-6 h-6 text-[#A96532] mb-5" /><h2 className="text-xl font-bold font-display">{title}</h2><p className="text-sm leading-6 text-[#526056] mt-3">{text}</p></article>)}
      </section>

      <section className="grid lg:grid-cols-2 gap-8 items-center rounded-2xl bg-[#173B2B] p-7 sm:p-10 text-[#F7F4EC]">
        <div><span className="text-xs uppercase tracking-[0.2em] text-[#E4BD91] font-semibold">Available on request</span><h2 className="text-2xl sm:text-3xl font-bold font-display mt-2">Information for your purchase</h2><p className="text-sm leading-7 text-[#E3E7DE] mt-3">Ask us about the selected product’s grade, processing method, packaging and origin. We’ll confirm which specifications and documents are available for that batch.</p></div>
        <ul className="space-y-3 text-sm text-[#F7F4EC]">{['Product specification sheet', 'Origin and coffee grade information', 'Processing method details', 'Quality assessment or cupping report', 'Packaging information', 'Required export and transport documents'].map((item) => <li key={item} className="flex items-center gap-3 border-b border-white/15 pb-3"><FileCheck2 size={16} className="text-[#E4BD91] shrink-0" />{item}</li>)}</ul>
      </section>

      <section className="border-t border-[#D9D3C4] pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div><h2 className="text-xl font-bold font-display">Need batch-specific details?</h2><p className="text-sm leading-6 text-[#526056] mt-1">Tell us which coffee you are considering and where you plan to receive it.</p></div>
        <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#A96532] text-white text-sm font-semibold">Ask for product details <ArrowRight size={16} /></Link>
      </section>
    </div>
  </div>
);
