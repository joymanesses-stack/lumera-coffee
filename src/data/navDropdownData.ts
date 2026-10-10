export interface NavDropdownItem {
  title: string;
  desc: string;
  tag?: string;
  iconName?: string;
}

export interface NavDropdownConfig {
  path: string;
  label: string;
  headline: string;
  tagline: string;
  badge: string;
  overview: string;
  sections: NavDropdownItem[];
  ctaLabel: string;
  imageUrl: string;
}

export const NAV_DROPDOWNS: Record<string, NavDropdownConfig> = {
  '/': {
    path: '/',
    label: 'Home',
    headline: 'LUMERA COFFEE EXPORT',
    tagline: 'Premium Coffee. From Origin to the World.',
    badge: 'Main Gateway',
    overview: 'The primary international gateway showcasing our B2B export credentials, origin terroirs, featured harvest lots, and trade inquiry desk.',
    imageUrl: '/images/lumera/rwanda-highlands.jpeg',
    ctaLabel: 'Go to Home Page',
    sections: [
      {
        title: 'Export credentials',
        desc: 'Core metrics ticker: 1,750m–2,200m altitude, Grade 1 / Specialty, 100% station traceability, and FCL GrainPro® supply.',
        tag: 'Hero',
      },
      {
        title: 'Why Lumera',
        desc: 'Immediate answers to who we are, what we export, where we ship, why importers trust us, and how to buy.',
        tag: 'B2B Positioning',
      },
      {
        title: 'Featured coffees',
        desc: 'Curated selection of active harvest lots: Bourbon G1, Washed Arabica, and Fine Highland Robusta.',
        tag: 'Catalog',
      },
      {
        title: 'Origin & supply chain',
        desc: 'Pristine volcanic soils, equatorial mists, and the 6-stage journey from cherry to container stuffing.',
        tag: 'Origin',
      },
      {
        title: 'Trade inquiries',
        desc: 'Direct CTA to request proforma FOB/CIF quotes or download the 2026/2027 Crop Offer List.',
        tag: 'Trade Desk',
      },
    ],
  },
  '/coffee': {
    path: '/coffee',
    label: 'Our Coffee',
    headline: 'EXPORT COFFEE CATALOG',
    tagline: 'Strict Physical Grading & SCA Cupping Standards',
    badge: 'Product Portfolio',
    overview: 'Full commercial & specialty green coffee catalog with complete physical specifications, cupping radar scores, and container packaging.',
    imageUrl: '/images/lumera/green-coffee-drying.jpeg',
    ctaLabel: 'Explore Coffee Portfolio',
    sections: [
      {
        title: 'Specialty Arabica',
        desc: 'High-altitude 1,850m–2,150m, SCA 87.5 pts, Screen 16/17+, moisture 10.8%–11.4%, jasmine & candied citrus notes.',
        tag: 'SCA 87.5',
      },
      {
        title: 'Washed Arabica',
        desc: 'European Prep (SCA 84.5), Screen 15+, clean citric acidity, cocoa & brown sugar sweetness for roasters.',
        tag: 'Grade A',
      },
      {
        title: 'Natural micro-lots',
        desc: 'Elevated African bed drying for 28 days, SCA 88.0 pts, winey blueberry & dark cherry liqueur cup.',
        tag: 'SCA 88.0',
      },
      {
        title: 'Fine Robusta',
        desc: 'Clean washed Robusta with dense golden crema, low acidity, and dark chocolate notes for espresso blends.',
        tag: 'Screen 18 Bold',
      },
      {
        title: 'Specifications & offer sheet',
        desc: 'View comprehensive sensory breakdowns (flavor, acidity, body, balance) and print the 2026/27 Crop Offer List.',
        tag: 'Lab Specs',
      },
    ],
  },
  '/origin': {
    path: '/origin',
    label: 'Our Origin',
    headline: 'HIGHLAND TERROIR & SUPPLY',
    tagline: 'Born in the Highlands. Prepared for the World.',
    badge: 'Origin Story',
    overview: 'Exploration of our high-altitude volcanic terroirs, equitable smallholder washing station partnerships, and end-to-end supply chain.',
    imageUrl: '/images/lumera/coffee-blossom-green-cherries.jpeg',
    ctaLabel: 'Discover Our Origin',
    sections: [
      {
        title: 'Highland terroir',
        desc: 'Elevations from 1,750m to 2,200m ASL with fertile volcanic loam and cool mountain mists causing slow cherry maturation.',
        tag: 'Terroir',
      },
      {
        title: 'Washing stations',
        desc: 'Pristine mountain spring water double-washing, density floatation sorting, and ecological water stewardship.',
        tag: 'Washing Stations',
      },
      {
        title: 'From harvest to export',
        desc: 'Grown at Origin → Carefully Selected → Eco Wet-Milled → Slow Bed Drying → Precision Milled → Hermetic Export.',
        tag: '6 Stages',
      },
      {
        title: 'Harvest calendar',
        desc: 'Main crop picking schedule (March–July), offer sampling window, and ocean container departure timeline.',
        tag: 'Crop Calendar',
      },
    ],
  },
  '/quality': {
    path: '/quality',
    label: 'Quality',
    headline: 'QUALITY & TRACEABILITY',
    tagline: 'Quality Without Compromise',
    badge: 'Standards & QC',
    overview: 'Our multi-tiered laboratory inspection, physical grading tolerances, triple cupping protocols, and lot traceability guarantee.',
    imageUrl: '/images/lumera/shared-harvest.jpeg',
    ctaLabel: 'View Quality Standards',
    sections: [
      {
        title: 'Quality checks',
        desc: 'Sourcing, physical inspection, precision milling, sensory cupping, hermetic packaging, and export compliance documentation.',
        tag: '6 QC Stages',
      },
      {
        title: 'Green coffee grading',
        desc: 'Calibrated moisture meters (10.5%–11.5%), water activity (aw < 0.60), screen sieves, and zero primary defect counts.',
        tag: 'Lab Tolerances',
      },
      {
        title: 'Cup evaluation',
        desc: 'Rigorous assessment of Offer Sample (OS), Pre-Shipment Sample (PSS), and Vessel Sample (VS) by certified Q-graders.',
        tag: 'Triple Cupping',
      },
      {
        title: 'Lot traceability',
        desc: 'Every 60kg export jute bag recorded down to washing station ID, harvest date, and GrainPro® hermetic seal integrity.',
        tag: 'Traceability',
      },
    ],
  },
  '/export': {
    path: '/export',
    label: 'Export',
    headline: 'GLOBAL TRADE & LOGISTICS',
    tagline: 'From Our Origin to Global Markets',
    badge: 'International Trade',
    overview: 'Ocean container logistics, Incoterms, supported buyer categories, and direct international shipping ports across four continents.',
    imageUrl: '/images/lumera/roasted-beans-hopper.jpeg',
    ctaLabel: 'View Export & Logistics',
    sections: [
      {
        title: 'Who we serve',
        desc: 'Specialized supply for Green Coffee Importers, Commercial Roasters, Wholesale Distributors, Specialty Brands, and Manufacturers.',
        tag: 'Buyer Sectors',
      },
      {
        title: 'Shipping options',
        desc: '320 Bags (60kg Net each) = 19.2 MT Net. Food-grade kraft paper lining and industrial moisture absorption poles.',
        tag: '19.2 MT FCL',
      },
      {
        title: 'Destination ports',
        desc: 'Scheduled sailings to Port of Rotterdam, Hamburg, Antwerp, New York, Oakland, Jebel Ali (Dubai), and Yokohama.',
        tag: 'Global Ports',
      },
      {
        title: 'Trade terms & documents',
        desc: 'FOB & CIF terms with full ICO Certificate of Origin, Phytosanitary, Clean on Board Bill of Lading, and Quality Certificates.',
        tag: 'Incoterms & Docs',
      },
    ],
  },
  '/buyers': {
    path: '/buyers',
    label: 'For Buyers',
    headline: 'PROCUREMENT WORKFLOW',
    tagline: 'Looking for a Reliable Coffee Exporter?',
    badge: 'Buyer Guide',
    overview: 'Transparent, structured 6-step procurement journey guiding roasters and importers from initial inquiry to destination port clearance.',
    imageUrl: '/images/lumera/raised-bed-cherries.jpeg',
    ctaLabel: 'Read Buyer Workflow',
    sections: [
      {
        title: 'How to buy',
        desc: '1. Inquiry → 2. Match Requirements → 3. Sample Evaluation → 4. Contract Lock → 5. Pre-Shipment QC → 6. Ocean Shipment.',
        tag: 'Step-by-Step',
      },
      {
        title: 'Request a sample',
        desc: '300g–500g green evaluation samples dispatched via DHL Express worldwide for laboratory roasting and cupping.',
        tag: 'DHL Samples',
      },
      {
        title: 'Buyer questions',
        desc: 'Clear guidance on Minimum Order Quantities (MOQs), L/C & CAD payment mechanisms, and custom buyer packaging.',
        tag: 'Buyer FAQs',
      },
      {
        title: 'Contact our trade team',
        desc: 'Immediate consultation with our trade desk via WhatsApp (+250 722 415 434) and formal proforma offer submission.',
        tag: 'Consultation',
      },
    ],
  },
  '/about': {
    path: '/about',
    label: 'About',
    headline: 'TRUST & RESPONSIBLE EXPORT',
    tagline: 'Exceptional Coffee Begins at Its Origin',
    badge: 'Company Profile',
    overview: 'Our foundational story, mission, vision, ethical producer commitments, and long-term partnership approach.',
    imageUrl: '/images/lumera/espresso-cup.jpeg',
    ctaLabel: 'Read About Lumera',
    sections: [
      {
        title: 'Our story',
        desc: '"At Lumera Coffee, we believe exceptional coffee begins at its origin. We connect coffee regions with buyers around the world."',
        tag: 'Our Story',
      },
      {
        title: 'Mission & vision',
        desc: 'Mission: Reliable sourcing, exceptional quality, responsible export. Vision: Trusted global partner recognized for transparency.',
        tag: 'Mission & Vision',
      },
      {
        title: 'Farmer partnerships',
        desc: 'Direct, premium cash compensation paid at washing stations to reward selective cherry picking and support farming families.',
        tag: 'Farmer Equity',
      },
      {
        title: 'Care for the land',
        desc: 'Eco-pulpers reducing water usage by 80% and natural bio-filtration ponds protecting mountain watersheds.',
        tag: 'Eco-Protection',
      },
    ],
  },
};
