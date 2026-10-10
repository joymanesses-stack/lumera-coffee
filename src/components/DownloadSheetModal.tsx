import React from 'react';
import { Logo } from './Logo';
import { Printer, X, ArrowRight, Mail, Phone, Globe, Camera } from 'lucide-react';

interface DownloadSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal: () => void;
}

const products = [
  { name: 'Green Arabica Coffee', details: 'Unroasted Rwandan Arabica from Karongi and Nyamasheke. Processing method, grade and specifications are confirmed per available batch.', formats: 'Green coffee beans', moq: 'One 19,200 kg container, subject to confirmed availability and shipping arrangements' },
  { name: 'Roasted Coffee', details: 'Rwandan Arabica in light, medium to dark, or dark roast levels, subject to order confirmation.', formats: 'Whole roasted beans or ground coffee', moq: '500 kg' },
];

export const DownloadSheetModal: React.FC<DownloadSheetModalProps> = ({ isOpen, onClose, onOpenQuoteModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto" onClick={onClose}>
      <section className="bg-[#F7F4EC] text-[#26382D] border border-[#D9D3C4] rounded-2xl w-full max-w-5xl max-h-[94vh] overflow-y-auto shadow-2xl relative my-6" onClick={(event) => event.stopPropagation()} aria-labelledby="offering-sheet-title" role="dialog" aria-modal="true">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 py-4 bg-[#173B2B] text-[#F7F4EC] print:hidden">
          <span className="text-xs uppercase tracking-[0.16em] font-semibold">General Product Offering Sheet · 2026</span>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs"><Printer size={15} /> Print / Save PDF</button>
            <button onClick={onClose} className="grid place-items-center w-9 h-9 rounded-full hover:bg-white/10" aria-label="Close offering sheet"><X size={18} /></button>
          </div>
        </div>

        <article className="p-6 sm:p-10 space-y-9 print:p-0 print:text-black">
          <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 border-b border-[#D9D3C4]">
            <div>
              <Logo size="lg" />
              <p className="mt-3 text-xs leading-6 text-[#526056]">LUMERA COFFEE · RWANDAN ARABICA COFFEE<br />Exceptional coffee. Authentic Rwandan origin.</p>
            </div>
            <div className="sm:text-right text-sm leading-6 text-[#526056]">
              <strong className="text-[#26382D]">Lumera Company Ltd</strong><br />
              Country of origin: Rwanda<br />
              Coffee origin: Karongi and Nyamasheke
            </div>
          </header>

          <section>
            <h2 id="offering-sheet-title" className="text-2xl sm:text-3xl font-display font-bold">General Product Offering Sheet | 2026</h2>
            <p className="mt-3 text-sm leading-7 text-[#405046]">Lumera Coffee is a Rwandan coffee brand bringing the quality, authenticity and origin of Rwandan Arabica to international markets. We focus on green coffee beans and roasted coffee, serving importers, distributors, roasters, retailers and hospitality businesses. Our goal is to build reliable business partnerships through product quality, clear communication and professional service.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold font-display mb-4">Coffee products</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {products.map((product) => <div key={product.name} className="rounded-xl border border-[#D9D3C4] bg-white/70 p-5">
                <h4 className="font-bold text-[#214A35]">{product.name}</h4>
                <p className="mt-2 text-sm leading-6 text-[#526056]">{product.details}</p>
                <p className="mt-3 text-xs"><strong>Format:</strong> {product.formats}</p>
                <p className="mt-1 text-xs"><strong>Packaging:</strong> To be agreed based on order volume, buyer requirements and available options.</p>
                <p className="mt-1 text-xs"><strong>Minimum order:</strong> {product.moq}.</p>
                <p className="mt-1 text-xs"><strong>Availability:</strong> Subject to current stock and confirmed orders.</p>
              </div>)}
            </div>
            <p className="mt-3 text-xs text-[#59665B]">Green coffee minimum quantity and shipping arrangements are confirmed alongside current stock for each inquiry. Green coffee grade and specifications are available upon request.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold font-display mb-3">Commercial pricing</h3>
            <p className="text-sm leading-6 text-[#526056]">Pricing depends on product type, quantity, specifications, packaging and shipping destination. Prices are available upon request.</p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-[#D9D3C4]">
              <table className="w-full text-sm text-left"><thead className="bg-[#E8E4D9]"><tr><th className="p-3">Product</th><th className="p-3">Pricing</th></tr></thead><tbody className="divide-y divide-[#E0DBCF]">{['Green Arabica Coffee', 'Roasted Coffee Beans', 'Roasted Ground Coffee', 'Bulk Orders'].map((item) => <tr key={item}><td className="p-3">{item}</td><td className="p-3">Price available upon request</td></tr>)}</tbody></table>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-[#E8EDE5] text-sm">
              <strong>To request a custom business quote, please share:</strong>
              <p className="mt-2 leading-6">Product type · Quantity in kilograms or metric tons · Preferred roast profile, if applicable · Packaging requirements · Destination country and port/location · Preferred shipping terms or Incoterms agreement.</p>
              <p className="mt-2 text-xs text-[#59665B]">Final pricing, stock availability, delivery costs and terms will be confirmed in a formal quotation.</p>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-7">
            <div>
              <h3 className="text-lg font-bold font-display mb-3">Quality & traceability</h3>
              <p className="text-sm leading-6 text-[#526056]">Product information is provided based on the selected coffee grade and product type. When required and available, documentation may include a product specification sheet, origin and grade information, processing details, quality assessment or cupping report, packaging information, and required export or transport documents.</p>
              <p className="mt-3 text-xs leading-5 text-[#59665B]">Grades, certifications, cupping scores and quality parameters are declared only after they have been tested and verified for a specific product or batch.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold font-display mb-3">Ordering process</h3>
              <ol className="space-y-2 text-sm leading-6 text-[#526056] list-decimal pl-5">
                <li>Send your product and quantity inquiry.</li>
                <li>Lumera confirms availability, specifications, pricing, packaging and delivery terms.</li>
                <li>Both parties agree on product, volume, price, payment and delivery details.</li>
                <li>The coffee is prepared to the agreed specifications and terms.</li>
                <li>Shipping and required documentation are finalized before dispatch.</li>
              </ol>
            </div>
          </section>

          <section className="rounded-xl bg-[#173B2B] text-[#F7F4EC] p-5 sm:p-6">
            <h3 className="text-lg font-bold font-display">International trade inquiries</h3>
            <p className="mt-2 text-sm leading-6 text-[#E3E7DE]">We welcome inquiries from international importers, distributors, roasters, retailers, coffee shops, hotels, restaurants and other business partners. Contact us for bulk orders, samples, product specifications or shipping inquiries.</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
              <a className="inline-flex items-center gap-2 hover:text-[#E7C48C]" href="https://lumera-coffee.com"><Globe size={16} /> lumera-coffee.com</a>
              <a className="inline-flex items-center gap-2 hover:text-[#E7C48C]" href="mailto:lumeracampanyltd@gmail.com"><Mail size={16} /> lumeracampanyltd@gmail.com</a>
              <a className="inline-flex items-center gap-2 hover:text-[#E7C48C]" href="https://wa.me/250722415434"><Phone size={16} /> +250 722 415 434</a>
              <a className="inline-flex items-center gap-2 hover:text-[#E7C48C]" href="https://instagram.com/lumeracoffee2026" target="_blank" rel="noreferrer"><Camera size={16} /> @lumeracoffee2026</a>
            </div>
          </section>

          <footer className="pt-5 border-t border-[#D9D3C4]">
            <p className="text-xs leading-5 text-[#59665B]"><strong>Commercial disclaimer:</strong> This sheet outlines our products and trade inquiry process. Product availability, specifications, pricing, minimum order quantities, delivery terms and export capabilities are subject to final confirmation for each transaction.</p>
            <p className="mt-3 text-center text-sm font-semibold text-[#214A35]">Lumera Coffee · Rwanda’s light in every cup.</p>
          </footer>

          <div className="flex justify-end print:hidden">
            <button onClick={() => { onClose(); onOpenQuoteModal(); }} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#A96532] text-white text-sm font-semibold hover:bg-[#B97542]">Request a business quote <ArrowRight size={16} /></button>
          </div>
        </article>
      </section>
    </div>
  );
};
