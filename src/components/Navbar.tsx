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

  const handleNavigate = (path: string) => {
    setOpenDropdownPath(null);
    navigate(path);
  };

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      <nav 
        className={`transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#173B2B]/98 backdrop-blur-md border-b border-[#A96532]/45 py-3.5 shadow-lg shadow-black/20' 
            : 'bg-gradient-to-b from-[#173B2B]/98 via-[#173B2B]/90 to-[#173B2B]/80 backdrop-blur-sm py-5 sm:py-6 border-b border-[#A96532]/35'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Circular Brand Logo */}
          <Link 
            to="/" 
            className="navbar-brand group flex items-center gap-3 shrink-0" 
            onClick={() => setOpenDropdownPath(null)}
          >
            <Logo size="lg" showTagline={false} />
          </Link>

          {/* Desktop Nav: Spacious, serene, no visual icon clutter */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navItems.map((item) => {
              const isOpen = openDropdownPath === item.path;
              const isCurrentRoute = location.pathname === item.path;
              const config = NAV_DROPDOWNS[item.path];

              return (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => setOpenDropdownPath(item.path)}
                  onMouseLeave={() => setOpenDropdownPath(null)}
                >
                  {/* Clicking a title opens its page; hovering reveals its section links. */}
                  <Link
                    to={item.path}
                    onClick={() => setOpenDropdownPath(null)}
                    className={`text-[13px] normal-case tracking-normal font-medium transition-all py-2 px-1 cursor-pointer select-none relative ${
                      isOpen
                        ? 'text-[#E7C48C] font-bold'
                        : isCurrentRoute
                        ? 'text-[#E7C48C] font-bold'
                        : 'text-[#F4F0E7] hover:text-[#E7C48C]'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span>{item.label}</span>
                    
                    {/* Subtle active / open indicator dot */}
                    {(isOpen || isCurrentRoute) && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D28A52] shadow-[0_0_8px_#D28A52]" />
                    )}
                  </Link>

                  {/* ========================================================= */}
                  {/* Anchored Dropdown Popover (Directly underneath the word) */}
                  {/* ========================================================= */}
                  {isOpen && config && (
                    <div 
                      className="absolute top-full left-1/2 -translate-x-1/2 w-64 rounded-xl bg-[#F7F4EC] border border-[#D9D3C4] shadow-[0_18px_40px_rgba(24,44,32,0.22)] p-3 z-50 animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Top mini gold accent line */}
                      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#A96532] to-transparent" />

                      {/* Mini Header */}
                      <div className="px-2 pt-1.5 pb-2 border-b border-[#DDD8CC]">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#7B4A2A] font-bold">
                          {config.label}
                        </span>
                      </div>

                      {/* Clean list of sections on this page */}
                      <div className="py-1.5 space-y-1">
                        {config.sections.map((sec, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleNavigate(item.path)}
                            className="group w-full flex items-center justify-between gap-3 px-2.5 py-2.5 rounded-lg text-left hover:bg-[#E9EDE5] transition-colors cursor-pointer"
                          >
                              <span className="text-[12px] leading-snug font-semibold text-[#26382D] group-hover:text-[#7B4A2A] block">
                                {sec.title}
                              </span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#98603A]/60 group-hover:text-[#7B4A2A] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>

                      {/* Bottom Direct Page Jump */}
                      <div className="pt-2 border-t border-[#DDD8CC]">
                        <button
                          onClick={() => handleNavigate(item.path)}
                          className="w-full py-2 px-3 rounded-lg bg-[#214A35] text-[#F7F4EC] text-[10.5px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#173B2B] transition-colors"
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
              className="px-5 py-2 rounded-full text-xs uppercase tracking-[0.16em] font-bold shadow-md flex items-center gap-2 group cursor-pointer transition-colors bg-[#B86F3F] text-white hover:bg-[#C6814E]"
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
              className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#B86F3F] text-white hover:bg-[#C6814E]"
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
          <div className="lg:hidden bg-[#173B2B] border-b border-[#A96532]/40 px-6 py-6 animate-fadeIn shadow-2xl max-h-[85vh] overflow-y-auto">
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
                      <div className="mt-1 p-3 rounded-lg bg-[#F7F4EC] border border-[#D9D3C4] space-y-2 animate-fadeIn">
                        <div className="space-y-1">
                          {config.sections.map((sec, idx) => (
                            <button key={idx} onClick={() => handleNavigate(item.path)} className="group w-full px-2 py-2 text-left text-xs font-medium text-[#26382D] rounded-md hover:bg-[#E9EDE5] hover:text-[#7B4A2A]">{sec.title}</button>
                          ))}
                        </div>

                        <button
                          onClick={() => handleNavigate(item.path)}
                          className="w-full mt-2 bg-[#214A35] text-[#F7F4EC] py-2 rounded text-[11px] uppercase tracking-wider font-bold"
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

