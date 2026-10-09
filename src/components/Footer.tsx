import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  onOpenQuoteModal: () => void;
  onOpenCatalogModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenQuoteModal,
  onOpenCatalogModal 
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070908] border-t border-[#1C221D] text-xs text-[#A19D92]">
      {/* Top Banner with Direct Exporter Call to Action */}
      <div className="border-b border-[#181F19] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
              International Trade Partnerships
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Ready to Source Premium Origin Green Coffee?
            </h3>
            <p className="text-xs text-[#8E8B81] mt-1 max-w-xl">
              Lock in your seasonal allocations, request courier evaluation samples, or submit your technical specifications to our export desk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCatalogModal}
              className="gold-outline-button px-5 py-3 rounded text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              View Offer Sheet
            </button>
            <Link
              to="/contact"
              className="gold-button-gradient px-7 py-3 rounded text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#C5A059]/20 cursor-pointer"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/">
              <Logo size="md" />
            </Link>
            <p className="text-xs text-[#A8A49A] leading-relaxed max-w-sm mt-3 font-light">
              Lumera Coffee is an international green coffee exporter and supplier. We source from verified highland washing stations and deliver export-ready lots with guaranteed consistency, traceability, and certified quality.
            </p>

            <div className="pt-2 text-xs text-[#C5A059] font-medium tracking-wider uppercase">
              Pure Origin. Rich Flavor. True Quality.
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded bg-[#101412] border border-[#212A23] text-[10.5px] text-[#8F8B81]">
                ICO Registered Exporter
              </span>
              <span className="px-2.5 py-1 rounded bg-[#101412] border border-[#212A23] text-[10.5px] text-[#8F8B81]">
                SCA Cupping Standards
              </span>
              <span className="px-2.5 py-1 rounded bg-[#101412] border border-[#212A23] text-[10.5px] text-[#8F8B81]">
                GrainPro® Hermetic Protection
              </span>
            </div>
          </div>

          {/* Dedicated Page Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-crest text-xs uppercase tracking-widest font-bold">
              Company Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#C5A059] transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C5A059] transition-colors">About Lumera</Link>
              </li>
              <li>
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">Our Coffee Portfolio</Link>
              </li>
              <li>
                <Link to="/origin" className="hover:text-[#C5A059] transition-colors">Our Origin & Terroir</Link>
              </li>
              <li>
                <Link to="/quality" className="hover:text-[#C5A059] transition-colors">Quality & Traceability</Link>
              </li>
              <li>
                <Link to="/export" className="hover:text-[#C5A059] transition-colors">Global Export & Ports</Link>
              </li>
              <li>
                <Link to="/buyers" className="hover:text-[#C5A059] transition-colors">For Buyers (Workflow)</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C5A059] transition-colors">Request a Quote / Contact</Link>
              </li>
            </ul>
          </div>

          {/* Coffee Offerings */}
          <div className="space-y-3">
            <h4 className="text-white font-crest text-xs uppercase tracking-widest font-bold">
              Coffee Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">Specialty Arabica G1 (87+)</Link>
              </li>
              <li>
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">Fully Washed Bourbon</Link>
              </li>
              <li>
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">Sun-Dried Natural Lots</Link>
              </li>
              <li>
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">Honey Process Micro-Lots</Link>
              </li>
              <li>
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">Fine Highland Robusta (Screen 18)</Link>
              </li>
              <li>
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">European Prep (FAQ Export)</Link>
              </li>
            </ul>
          </div>

          {/* Trade Contacts */}
          <div className="space-y-3">
            <h4 className="text-white font-crest text-xs uppercase tracking-widest font-bold">
              Export Operations
            </h4>
            <div className="space-y-2.5 text-xs text-[#9B978C]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  Highland Trade Corridors<br />
                  Central & East African Origin Desk
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:export@lumeracoffee.com" className="text-white hover:text-[#C5A059] transition-colors">
                  export@lumeracoffee.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/250722415434" target="_blank" rel="noreferrer" className="text-white hover:text-emerald-400 transition-colors">
                  WhatsApp: +250 722 415 434
                </a>
              </div>

              <div className="pt-2 text-[11px] text-[#78756D]">
                Trade Hours: Mon – Fri 08:00 – 18:00 (CAT / GMT+2)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#161D18] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6E6B63]">
          <div>
            © {new Date().getFullYear()} Lumera Coffee Ltd. All rights reserved. International Coffee Exporters.
          </div>

          <div className="flex items-center gap-6">
            <span>Incoterms® 2020 Compliant</span>
            <span>GrainPro® Hermetic Packaging</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#C5A059] hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
