import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoffeePage } from './pages/CoffeePage';
import { OriginPage } from './pages/OriginPage';
import { QualityPage } from './pages/QualityPage';
import { ExportPage } from './pages/ExportPage';
import { BuyersPage } from './pages/BuyersPage';
import { ContactPage } from './pages/ContactPage';
import { CoffeeSpecModal } from './components/CoffeeSpecModal';
import { QuoteModal } from './components/QuoteModal';
import { DownloadSheetModal } from './components/DownloadSheetModal';
import { CoffeeProduct } from './types';
import { Phone } from 'lucide-react';

const AgentDashboardPage = lazy(() =>
  import('./pages/AgentDashboardPage').then((module) => ({ default: module.AgentDashboardPage }))
);
const InstantCallPage = lazy(() =>
  import('./pages/InstantCallPage').then((module) => ({ default: module.InstantCallPage }))
);

export function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedCoffeeForQuote, setSelectedCoffeeForQuote] = useState<string | undefined>(undefined);
  const [specProduct, setSpecProduct] = useState<CoffeeProduct | null>(null);
  const [isOfferSheetOpen, setIsOfferSheetOpen] = useState(false);

  const handleOpenQuoteModal = (coffeeName?: string) => {
    setSelectedCoffeeForQuote(coffeeName);
    setIsQuoteModalOpen(true);
  };

  const handleSelectProductForSpec = (product: CoffeeProduct) => {
    setSpecProduct(product);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0B0C0D] text-[#DEDBD2] flex flex-col font-sans selection:bg-[#C5A059] selection:text-[#0B0C0D]">
        {/* Navigation Header */}
        <Navbar 
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenCatalogModal={() => setIsOfferSheetOpen(true)}
        />

        {/* Multi-Page Routes */}
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  onOpenQuoteModal={handleOpenQuoteModal}
                  onOpenCatalogModal={() => setIsOfferSheetOpen(true)}
                  onSelectProductForSpec={handleSelectProductForSpec}
                />
              } 
            />
            <Route path="/about" element={<AboutPage />} />
            <Route 
              path="/coffee" 
              element={
                <CoffeePage 
                  onSelectProductForSpec={handleSelectProductForSpec}
                  onOpenQuoteModal={handleOpenQuoteModal}
                  onOpenCatalogModal={() => setIsOfferSheetOpen(true)}
                />
              } 
            />
            <Route path="/origin" element={<OriginPage />} />
            <Route path="/quality" element={<QualityPage />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/buyers" element={<BuyersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/instant-call"
              element={
                <Suspense fallback={<div className="min-h-screen bg-[#0B0D0C] pt-40 text-center text-sm text-[#A8A498]">Opening call desk…</div>}>
                  <InstantCallPage />
                </Suspense>
              }
            />
            <Route
              path="/agent"
              element={
                <Suspense fallback={<div className="min-h-screen bg-[#0B0D0C] pt-40 text-center text-sm text-[#A8A498]">Loading agent desk…</div>}>
                  <AgentDashboardPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer 
          onOpenQuoteModal={() => handleOpenQuoteModal()}
          onOpenCatalogModal={() => setIsOfferSheetOpen(true)}
        />

        {/* Technical Coffee Spec Modal */}
        <CoffeeSpecModal 
          product={specProduct}
          onClose={() => setSpecProduct(null)}
          onSelectForQuote={(prod) => {
            setSpecProduct(null);
            handleOpenQuoteModal(prod.name);
          }}
        />

        {/* Quick Quote Modal */}
        <QuoteModal 
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          selectedCoffeeName={selectedCoffeeForQuote}
        />

        {/* Crop Offer Sheet & Specifications Document Modal */}
        <DownloadSheetModal 
          isOpen={isOfferSheetOpen}
          onClose={() => setIsOfferSheetOpen(false)}
          onOpenQuoteModal={() => {
            setIsOfferSheetOpen(false);
            handleOpenQuoteModal();
          }}
        />

        {/* Floating B2B WhatsApp Action Button */}
        <a
          href="https://wa.me/250722415434"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl shadow-black/80 flex items-center justify-center transition-transform hover:scale-110 group cursor-pointer border border-white/20"
          aria-label="Chat with Export Desk on WhatsApp"
          title="Direct WhatsApp with Export Operations Desk"
        >
          <Phone className="w-5 h-5 fill-current" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pl-0 group-hover:pl-2">
            Export WhatsApp
          </span>
        </a>
      </div>
    </BrowserRouter>
  );
}

export default App;
