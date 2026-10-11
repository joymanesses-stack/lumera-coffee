import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp,
  Globe,
  Camera
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
              Looking for Rwandan Arabica Coffee?
            </h3>
            <p className="text-xs text-[#8E8B81] mt-1 max-w-xl">
              Contact Lumera for product details, a tailored business quote, samples or international trade inquiries.
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
              <Logo size="lg" />
            </Link>
            <p className="text-xs text-[#A8A49A] leading-relaxed max-w-sm mt-3 font-light">
              Lumera Company Ltd is a Rwandan coffee brand offering green Arabica beans and roasted coffee from Karongi and Nyamasheke.
            </p>

            <div className="pt-2 text-xs text-[#C5A059] font-medium tracking-wider uppercase">
              Pure Origin. Rich Flavor. True Quality.
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
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">Green Arabica Coffee</Link>
              </li>
              <li>
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">Roasted Whole Beans</Link>
              </li>
              <li>
                <Link to="/coffee" className="hover:text-[#C5A059] transition-colors">Roasted Ground Coffee</Link>
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
                  Rwanda<br />
                  Coffee origin: Karongi and Nyamasheke
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:lumeracampanyltd@gmail.com" className="text-white hover:text-[#C5A059] transition-colors">
                  lumeracampanyltd@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/250722415434" target="_blank" rel="noreferrer" className="text-white hover:text-emerald-400 transition-colors">
                  WhatsApp: +250 722 415 434
                </a>
              </div>

              <div className="flex flex-col items-start gap-2 pt-2 text-[11px]"><a href="https://lumera-coffee.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white hover:text-[#C5A059]"><Globe className="h-3.5 w-3.5 shrink-0 text-[#C5A059]"/><span>lumera-coffee.com</span></a><a href="https://instagram.com/lumeracoffee2026" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white hover:text-[#C5A059]"><Camera className="h-3.5 w-3.5 shrink-0 text-[#C5A059]"/><span>Instagram: @lumeracoffee2026</span></a></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#161D18] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6E6B63]">
          <div>
            <Link to="/company-document" className="hover:text-[#C5A059] transition-colors" aria-label="Open the private Lumera Company Ltd document">
              © {new Date().getFullYear()} Lumera Company Ltd.
            </Link>{' '}All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Rwandan Arabica Coffee</span>
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

