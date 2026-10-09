import React, { useState, useEffect } from 'react';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';
import { QuoteFormState } from '../types';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  Ship, 
  Package, 
  Clock,
  Sparkles
} from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoffeeName?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  selectedCoffeeName,
}) => {
  const [formData, setFormData] = useState<QuoteFormState>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    businessType: 'Importer',
    coffeeType: selectedCoffeeName || 'Lumera Highland Reserve — Red Bourbon G1',
    quantityRequired: '1 x 20ft FCL Container (320 bags / 19.2 MT)',
    incoterm: 'FOB (Free on Board)',
    destinationPort: '',
    preferredPackaging: '60 kg Jute Bag with Hermetic GrainPro® Liner',
    targetShippingMonth: 'Next Available Sailing',
    requestSamples: true,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  useEffect(() => {
    if (selectedCoffeeName) {
      setFormData(prev => ({ ...prev, coffeeType: selectedCoffeeName }));
    }
  }, [selectedCoffeeName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');
    try {
      const { submitInquiry } = await import('../lib/inquiries');
      setRefId(await submitInquiry(formData));
      setSubmitted(true);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Your inquiry could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="bg-[#111412] border border-[#C5A059]/40 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#18201A] text-[#B0ACA0] hover:text-white hover:bg-[#222E25] border border-[#2B382E] transition-colors z-20 cursor-pointer"
          aria-label="Close quote modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-[#212822] bg-gradient-to-r from-[#141C16] via-[#101412] to-[#141C16]">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>International Buyer Trade Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Request an Export Quotation & Samples
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A498] mt-1 font-light">
            Receive official FOB/CIF pricing, coffee technical specifications, and air courier evaluation samples.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-10 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#163624] border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Inquiry Received
              </h3>
              <p className="text-xs text-[#C5A059] font-mono">
                Tracking Ref: <span className="font-bold text-white">{refId}</span>
              </p>
              <div className="p-4 bg-[#0B0D0C] rounded-xl border border-[#202822] text-left text-xs text-[#AAA69B] space-y-2 max-w-md mx-auto">
                <p>• Commercial offer for <strong className="text-white">{formData.coffeeType}</strong> will be prepared for <strong className="text-white">{formData.companyName}</strong>.</p>
                <p>• Turnaround: 24 business hours to <strong className="text-white">{formData.email}</strong>.</p>
                {formData.requestSamples && (
                  <p className="text-emerald-400">• 300g–500g green samples queued for DHL express courier delivery.</p>
                )}
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="gold-button-gradient px-6 py-2.5 rounded text-xs uppercase tracking-wider font-bold"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Continental Coffee Ltd."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Buyer Country *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Kingdom"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Business Classification
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Importer">Green Coffee Importer</option>
                    <option value="Roaster">Specialty / Commercial Roaster</option>
                    <option value="Distributor">Wholesale Distributor</option>
                    <option value="Broker">Coffee Broker</option>
                    <option value="Private Label / Manufacturer">Private Label / Manufacturer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Coffee Lot Desired *
                  </label>
                  <select
                    value={formData.coffeeType}
                    onChange={(e) => setFormData({ ...formData, coffeeType: e.target.value })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    {COFFEE_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                    <option value="Consolidated Container / Multiple Grades">Consolidated Container / Multiple Grades</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Volume Required *
                  </label>
                  <select
                    value={formData.quantityRequired}
                    onChange={(e) => setFormData({ ...formData, quantityRequired: e.target.value })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Evaluation Samples Only (1kg – 5kg)">Evaluation Samples Only (1kg – 5kg)</option>
                    <option value="LCL Trial Lot (10 – 50 bags / 600kg – 3,000kg)">LCL Trial Lot (10 – 50 bags / 600kg – 3,000kg)</option>
                    <option value="1 x 20ft FCL Container (320 bags / 19.2 MT)">1 x 20ft FCL Container (320 bags / 19.2 MT)</option>
                    <option value="Multi-Container Contract (2+ FCL)">Multi-Container Contract (2+ FCL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Incoterms Preferred
                  </label>
                  <select
                    value={formData.incoterm}
                    onChange={(e) => setFormData({ ...formData, incoterm: e.target.value as any })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="FOB (Free on Board)">FOB (Free on Board Origin Port)</option>
                    <option value="CIF (Cost, Insurance & Freight)">CIF (Cost, Insurance & Freight Destination)</option>
                    <option value="CFR (Cost and Freight)">CFR (Cost and Freight)</option>
                    <option value="Sample Lot Request">Sample Lot Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                    Destination Port / City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rotterdam, Hamburg, Long Beach"
                    value={formData.destinationPort}
                    onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                    className="w-full bg-[#0B0D0C] border border-[#252C27] rounded px-3 py-2 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.requestSamples}
                    onChange={(e) => setFormData({ ...formData, requestSamples: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C5A059] bg-[#0B0D0C] border-[#2B332E] focus:ring-[#C5A059]"
                  />
                  <span className="text-xs text-[#E5C378]">
                    Include 300g–500g green evaluation samples via courier (DHL/FedEx)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C4B8] mb-1">
                  Specific Requirements / Cupping Score Target
                </label>
                <textarea
                  rows={2}
                  placeholder="Target delivery date, payment terms, or custom preparation specs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#0B0D0C] border border-[#252C27] rounded p-2.5 text-xs text-white placeholder-[#5C5A53] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <span className="text-[11px] text-[#7C786E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  24–48h Commercial Response
                </span>

                {submissionError && <p role="alert" className="text-sm text-red-300">{submissionError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gold-button-gradient px-8 py-3 rounded text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C5A059]/20 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Inquiry…' : 'Submit Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
