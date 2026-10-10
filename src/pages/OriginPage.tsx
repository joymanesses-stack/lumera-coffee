import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Coffee, PackageCheck } from 'lucide-react';

const originDetails = [
  { name: 'Karongi', detail: 'One of Lumera’s stated coffee origins in Rwanda.' },
  { name: 'Nyamasheke', detail: 'One of Lumera’s stated coffee origins in Rwanda.' },
];

export const OriginPage: React.FC = () => (
  <div className="pt-36 sm:pt-40 pb-24 bg-[#F2EFE7] text-[#26382D]">
    <section className="py-16 bg-[#E8E4D9] border-b border-[#D9D3C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8B4F2A] mb-3"><MapPin size={15} /><span>Rwandan Arabica Coffee</span></div>
        <h1 className="text-4xl sm:text-6xl font-bold font-display">Rooted in Rwanda</h1>
        <p className="text-sm sm:text-base text-[#526056] max-w-2xl mx-auto mt-4 leading-relaxed">Lumera’s coffee comes from Karongi and Nyamasheke. The origin, processing and specifications for a product are confirmed for the selected coffee batch.</p>
      </div>
    </section>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <img src="/images/lumera/rwanda-highlands.jpeg" alt="Rwandan coffee-growing landscape" className="w-full h-[320px] sm:h-[440px] object-cover rounded-2xl" />
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8B4F2A]">Coffee origin</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mt-3">From Karongi and Nyamasheke.</h2>
          <p className="text-sm leading-7 text-[#526056] mt-4">Lumera Company Ltd offers Rwandan Arabica coffee from these two districts. We share details about the origin and processing method based on the available product batch.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-7">
            {originDetails.map((place) => <div key={place.name} className="rounded-xl bg-white/75 border border-[#D9D3C4] p-5"><MapPin className="w-5 h-5 text-[#A96532] mb-3" /><h3 className="font-bold">{place.name}</h3><p className="text-xs leading-5 text-[#59665B] mt-1">{place.detail}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#173B2B] rounded-2xl p-7 sm:p-10 text-[#F7F4EC]">
        <div className="max-w-3xl"><span className="text-xs uppercase tracking-[0.2em] text-[#E4BD91] font-semibold">Coffee from Rwanda</span><h2 className="text-2xl sm:text-3xl font-bold font-display mt-2">Green beans and roasted coffee</h2><p className="text-sm text-[#E3E7DE] leading-7 mt-3">Choose unroasted green Arabica beans or roasted coffee in whole-bean and ground formats. Roast preferences, processing, specifications, packaging and availability are discussed for the product and order.</p></div>
        <div className="grid sm:grid-cols-3 gap-4 mt-7">
          {[['Green coffee', 'Unroasted Rwandan Arabica'], ['Whole beans', 'Roasted coffee beans'], ['Ground coffee', 'Roasted and ground coffee']].map(([title, desc]) => <div key={title} className="border-t border-white/25 pt-4"><Coffee className="w-5 h-5 text-[#E4BD91] mb-3" /><h3 className="font-semibold">{title}</h3><p className="text-xs text-[#D3DBD1] mt-1">{desc}</p></div>)}
        </div>
      </section>

      <section className="grid md:grid-cols-[1fr_auto] items-center gap-6 border-t border-[#D9D3C4] pt-8">
        <div className="flex gap-4"><PackageCheck className="w-6 h-6 shrink-0 text-[#A96532]" /><div><h2 className="text-xl font-bold font-display">Details confirmed for each order</h2><p className="text-sm text-[#526056] mt-2 leading-6">Availability, grade, specifications, minimum order quantity, packaging, price and delivery costs depend on the selected product and are confirmed in a formal quotation.</p></div></div>
        <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#A96532] text-white text-sm font-semibold">Ask about origin <ArrowRight size={16} /></Link>
      </section>
    </div>
  </div>
);
