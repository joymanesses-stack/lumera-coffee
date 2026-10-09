import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { NAV_DROPDOWNS } from '../data/navDropdownData';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Send
} from 'lucide-react';

interface NavbarProps {
  onOpenQuoteModal: (initialCoffee?: string) => void;
  onOpenCatalogModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenQuoteModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownPath, setOpenDropdownPath] = useState<string | null>(null);
  const [mobileExpandedPath, setMobileExpandedPath] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdownPath(null);
    setMobileMenuOpen(false);
    setMobileExpandedPath(null);
  }, [location.pathname]);

  // Click outside to dismiss dropdown without masking
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownPath(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdownPath(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Calm, concise navigation links
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Coffee', path: '/coffee' },
    { label: 'Origin', path: '/origin' },
    { label: 'Quality', path: '/quality' },
    { label: 'Export', path: '/export' },
    { label: 'Buyers', path: '/buyers' },
    { label: 'About', path: '/about' },
  ];

  const handleToggleDropdown = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    setOpenDropdownPath(prev => (prev === path ? null : path));
  };

  const handleNavigate = (path: string) => {
    setOpenDropdownPath(null);
    navigate(path);
  };

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      <nav 
        className={`transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#0B0C0D]/95 backdrop-blur-md border-b border-[#C5A059]/25 py-3.5 shadow-2xl shadow-black/80' 
            : 'bg-gradient-to-b from-[#0B0C0D]/90 via-[#0B0C0D]/75 to-transparent backdrop-blur-sm py-5 sm:py-6 border-b border-[#C5A059]/15'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Circular Brand Logo */}
          <Link 
            to="/" 
            className="group flex items-center gap-3 shrink-0" 
            onClick={() => setOpenDropdownPath(null)}
          >
            <Logo size="md" showTagline={false} />
          </Link>

          {/* Desktop Nav: Spacious, serene, no visual icon clutter */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navItems.map((item) => {
              const isOpen = openDropdownPath === item.path;
              const isCurrentRoute = location.pathname === item.path;
              const config = NAV_DROPDOWNS[item.path];

              return (
                <div key={item.path} className="relative">
                  {/* Clean text button with generous hit area */}
                  <button
                    onClick={(e) => handleToggleDropdown(e, item.path)}
                    className={`text-xs uppercase tracking-[0.2em] font-medium transition-all py-2 px-1 cursor-pointer select-none relative ${
                      isOpen
                        ? 'text-[#F3E5AB] font-bold'
                        : isCurrentRoute
                        ? 'text-[#E5C378] font-bold'
                        : 'text-[#C8C5BC] hover:text-[#C5A059]'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span>{item.label}</span>
                    
                    {/* Subtle active / open indicator dot */}
                    {(isOpen || isCurrentRoute) && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]" />
                    )}
                  </button>

                  {/* ========================================================= */}
                  {/* Anchored Dropdown Popover (Directly underneath the word) */}
                  {/* ========================================================= */}
                  {isOpen && config && (
                    <div 
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl bg-[#0E1210]/98 backdrop-blur-2xl border border-[#C5A059]/40 shadow-[0_20px_45px_rgba(0,0,0,0.9)] p-3 z-50 animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Top mini gold accent line */}
                      <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

                      {/* Mini Header */}
                      <div className="px-2 pt-1.5 pb-2 border-b border-[#1E2520] flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059] font-bold">
                          {config.label}
                        </span>
                        <span className="text-[9px] text-[#7A766D] font-mono uppercase">
                          {config.badge}
                        </span>
                      </div>

                      {/* Clean list of sections on this page */}
                      <div className="py-1.5 space-y-1">
                        {config.sections.map((sec, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleNavigate(item.path)}
                            className="group flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-[#162019] transition-all cursor-pointer"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-xs font-semibold text-white group-hover:text-[#F3E5AB] block truncate">
                                {sec.title}
                              </span>
                              <span className="text-[10.5px] text-[#8F8B81] font-light leading-snug block line-clamp-1">
                                {sec.desc}
                              </span>
                            </div>

                            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]/40 group-hover:text-[#C5A059] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                          </div>
                        ))}
                      </div>

                      {/* Bottom Direct Page Jump */}
                      <div className="pt-2 border-t border-[#1C231E]">
                        <button
                          onClick={() => handleNavigate(item.path)}
                          className="w-full py-1.5 px-3 rounded-lg gold-button-gradient text-[10.5px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>Explore {config.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Single Refined Pill Button */}
          <div className="hidden sm:flex items-center">
            <Link
              to="/contact"
              onClick={() => setOpenDropdownPath(null)}
              className="gold-button-gradient px-5 py-2 rounded-full text-xs uppercase tracking-[0.16em] font-bold shadow-md shadow-[#C5A059]/15 flex items-center gap-2 group cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <span>REQUEST A QUOTE</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="gold-button-gradient px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#D4AF37] hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0D0F0E] border-b border-[#C5A059]/30 px-6 py-6 animate-fadeIn shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const config = NAV_DROPDOWNS[item.path];
                const isExpanded = mobileExpandedPath === item.path;

                return (
                  <div key={item.path} className="border-b border-[#1A1F1C] pb-2">
                    <div className="flex items-center justify-between py-2">
                      <button
                        onClick={() => handleNavigate(item.path)}
                        className="text-xs uppercase tracking-widest font-semibold text-white hover:text-[#C5A059] text-left"
                      >
                        {item.label}
                      </button>

                      {config && (
                        <button
                          onClick={() => setMobileExpandedPath(isExpanded ? null : item.path)}
                          className="p-1.5 text-[#C5A059] hover:text-white text-[11px] tracking-wider uppercase font-medium"
                        >
                          {isExpanded ? 'Less' : 'Preview'}
                        </button>
                      )}
                    </div>

                    {/* Expanded Mobile Details */}
                    {isExpanded && config && (
                      <div className="mt-1 p-3 rounded-lg bg-[#121614] border border-[#232B25] space-y-2 animate-fadeIn">
                        <div className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold">
                          What is on this page:
                        </div>
                        <div className="space-y-1">
                          {config.sections.map((sec, idx) => (
                            <div key={idx} className="text-[10.5px] text-[#CDC9BF] flex items-start gap-1.5">
                              <span className="text-[#C5A059]">•</span>
                              <span><strong>{sec.title}:</strong> {sec.desc}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleNavigate(item.path)}
                          className="w-full mt-2 gold-button-gradient py-2 rounded text-[11px] uppercase tracking-wider font-bold"
                        >
                          Go to {item.label} Page
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-4">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full gold-button-gradient py-3 rounded-full text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 text-center"
                >
                  <Send className="w-4 h-4" />
                  REQUEST A QUOTE
                </Link>

                <div className="pt-3 text-center text-[10.5px] text-[#7A766D]">
                  Trade WhatsApp: <strong className="text-white">+250 722 415 434</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
