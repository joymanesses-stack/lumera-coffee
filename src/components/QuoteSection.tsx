import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QuoteFormState, CoffeeProduct } from '../types';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';
import { 
  Send, 
  CheckCircle2, 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  Package, 
  Ship, 
  FileText,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface QuoteSectionProps {
  initialCoffeeName?: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ initialCoffeeName }) => {
  const [formData, setFormData] = useState<QuoteFormState>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    businessType: 'Importer',
    coffeeType: initialCoffeeName || COFFEE_PRODUCTS[0].name,
    quantityRequired: '',
    incoterm: 'To be discussed',
    destinationPort: '',
    preferredPackaging: '',
    targetShippingMonth: '',
    requestSamples: false,
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const selectedProduct = COFFEE_PRODUCTS.find((product) => product.name === formData.coffeeType);

  useEffect(() => {
    if (initialCoffeeName) {
      setFormData(prev => ({ ...prev, coffeeType: initialCoffeeName }));
    }
  }, [initialCoffeeName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');
    try {
      const { submitInquiry } = await import('../lib/inquiries');
      setInquiryId(await submitInquiry(formData));
      setIsSubmitted(true);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Your inquiry could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0B0D0C] border-t border-[#1F2520] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>International Buyer Trade Desk</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight leading-tight">
            Request an Export Quotation
          </h2>
          <p className="text-sm sm:text-base text-[#9F9B90] mt-3 font-light leading-relaxed">
            Share your product, quantity, packaging preferences and destination. Product details, pricing and delivery terms are confirmed in a formal quotation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Column */}
          <div className="lg:col-span-8 bg-[#111412] border border-[#242C26] rounded-2xl p-6 sm:p-10 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12 px-4 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#163624] border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
                    Inquiry Successfully Registered
                  </span>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Thank You, {formData.contactName || 'Valued Partner'}
                  </h3>
                  <div className="inline-block mt-3 px-4 py-1.5 rounded bg-[#18221B] border border-[#2E3C32] text-xs font-mono text-[#D4AF37]">
                    Inquiry Reference: <span className="text-white font-bold">{inquiryId}</span>
                  </div>
                </div>

                <div className="bg-[#0B0D0C] p-5 rounded-xl border border-[#212723] max-w-md mx-auto text-left text-xs space-y-2 text-[#ABA69A]">
                  <p className="text-white font-medium">Next Procurement Steps:</p>
                  <p>1. Our export desk is reviewing your requirements for <strong className="text-white">{formData.coffeeType}</strong> ({formData.quantityRequired}).</p>
                  <p>2. The team will review your requirements and follow up at <strong className="text-white">{formData.email}</strong> with a formal quotation.</p>
                  {formData.requestSamples && (
                    <p className="text-emerald-400">3. We will contact you about sample availability and arrangements.</p>
                  )}
                </div>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 gold-outline-button px-6 py-2.5 rounded text-xs uppercase tracking-wider font-semibold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-[#202722] pb-3 mb-4">
                  <h3 className="text-sm uppercase tracking-wider text-[#C5A059] font-bold">
                    1. Company & Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D6A62]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nordic Roasters ApS"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full bg-[#0B0D0C] border border-[#252C27] rounded pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Henrik Lindqvist"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Business Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D6A62]" />
                      <input
                        type="email"
                        required
                        placeholder="buying@yourcompany.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#0B0D0C] border border-[#252C27] rounded pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Phone / WhatsApp (with country code) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D6A62]" />
                      <input
                        type="text"
                        required
                        placeholder="+45 20 12 34 56"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#0B0D0C] border border-[#252C27] rounded pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Buyer Country *
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D6A62]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Germany, UAE, United States"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-[#0B0D0C] border border-[#252C27] rounded pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Business Type
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                      className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="Importer">Green Coffee Importer</option>
                      <option value="Roaster">Specialty / Commercial Roaster</option>
                      <option value="Distributor">Wholesale Distributor</option>
                      <option value="Retailer">Retailer</option>
                      <option value="Hospitality">Hotel, restaurant or coffee shop</option><option value="Other">Other business</option>
                    </select>
                  </div>
                </div>

                <div className="border-b border-[#202722] pb-3 pt-3 mb-4">
                  <h3 className="text-sm uppercase tracking-wider text-[#C5A059] font-bold">
                    2. Coffee Specifications & Logistics
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Product Type *
                    </label>
                    <select
                      value={formData.coffeeType}
                      onChange={(e) => setFormData({ ...formData, coffeeType: e.target.value })}
                      className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      {COFFEE_PRODUCTS.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                      <option value="Custom business request">Custom business request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Volume Required *
                    </label>
                    <input type="text" required placeholder="e.g. 500 kg or 2 metric tons" value={formData.quantityRequired} onChange={(e) => setFormData({ ...formData, quantityRequired: e.target.value })} className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]" />
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[#C9C3B5]">{selectedProduct ? `Minimum order: ${selectedProduct.moq}.` : 'Minimum order depends on the selected product; please ask us to confirm.'}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Incoterms Required
                    </label>
                    <select
                      value={formData.incoterm}
                      onChange={(e) => setFormData({ ...formData, incoterm: e.target.value as any })}
                      className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="To be discussed">To be discussed</option><option value="FOB (Free on Board)">FOB (Free on Board Origin Port)</option>
                      <option value="CIF (Cost, Insurance & Freight)">CIF (Cost, Insurance & Freight Destination)</option>
                      <option value="CFR (Cost and Freight)">CFR (Cost and Freight)</option>
                      <option value="Sample Lot Request">Sample request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Destination Port / Country *
                    </label>
                    <div className="relative">
                      <Ship className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D6A62]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rotterdam, Hamburg, Jebel Ali"
                        value={formData.destinationPort}
                        onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                        className="w-full bg-[#0B0D0C] border border-[#252C27] rounded pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Preferred Export Packaging
                    </label>
                    <input type="text" placeholder="To be agreed based on your order" value={formData.preferredPackaging} onChange={(e) => setFormData({ ...formData, preferredPackaging: e.target.value })} className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                      Target Shipment Window
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prompt / Next sailing or Q3 2026"
                      value={formData.targetShippingMonth}
                      onChange={(e) => setFormData({ ...formData, targetShippingMonth: e.target.value })}
                      className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.requestSamples}
                      onChange={(e) => setFormData({ ...formData, requestSamples: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C5A059] bg-[#0B0D0C] border-[#2B332E] focus:ring-[#C5A059]"
                    />
                    <span className="text-xs text-[#E5C378] font-medium">
                      I would like to ask about a sample
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1.5">
                    Additional Specifications & Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specific cupping profile preferences, target price range, custom bag marking instructions, or special phytosanitary documentation required..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded p-3 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {submissionError && <p role="alert" className="text-sm text-red-300">{submissionError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gold-button-gradient py-4 rounded text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-[#C5A059]/20 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'SENDING INQUIRY…' : 'SUBMIT INQUIRY TO EXPORT DESK'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 self-stretch">
            <div className="bg-[#121614] border border-[#232C25] rounded-xl p-6 text-xs space-y-4 h-full">
              <div className="flex items-center gap-2 text-[#C5A059] font-semibold uppercase tracking-wider text-xs">
                <Clock className="w-4 h-4" />
                <span>Export Desk Turnaround</span>
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                Fast, Professional Trade Response
              </h4>
              <p className="text-[#99958C] font-light leading-relaxed">
                Share your product, quantity, preferred roast, packaging, destination and shipping terms. Availability, specifications, pricing and delivery costs are confirmed in a formal quotation.
              </p>

              <div className="pt-2 space-y-2.5 border-t border-[#1C221D] text-[#BFBBB0]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Strict Confidentiality & Non-Disclosure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Official Proforma Invoice & Contract</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Export documentation confirmed per order</span>
                </div>
              </div>
            </div>

            {/* Direct Export Desk Contacts */}
            <div className="bg-[#121614] border border-[#232C25] rounded-xl p-6 text-xs space-y-4 h-full">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">
                Direct Contact Channels
              </span>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#18261E] border border-[#273E2F] flex items-center justify-center text-[#C5A059] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#7F7B71] block text-[10px] uppercase">Export Inquiries</span>
                    <a href="mailto:lumeracampanyltd@gmail.com" className="text-white hover:text-[#C5A059] transition-colors font-medium">
                      lumeracampanyltd@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#18261E] border border-[#273E2F] flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#7F7B71] block text-[10px] uppercase">Trade WhatsApp Hotline</span>
                    <a href="https://wa.me/250722415434" target="_blank" rel="noreferrer" className="text-white hover:text-emerald-400 transition-colors font-medium">
                      +250 722 415 434 (Export Operations)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#121614] border border-[#232C25] rounded-xl p-6 h-full flex flex-col justify-center">
              <div className="mb-3 text-[#D8D1C0] text-[11px] leading-relaxed">
                Speak instantly with the Lumera Agent for quick product questions, shipment guidance, and export support.
              </div>
              <Link
                to="/instant-call"
                className="gold-button-gradient w-full py-3 rounded text-[10px] uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[#C5A059]/20"
              >
                <Phone className="w-4 h-4" />
                <span>Make an instant call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};




