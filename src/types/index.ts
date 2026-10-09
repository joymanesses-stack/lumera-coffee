export interface CoffeeProduct {
  id: string;
  name: string;
  category: 'Specialty Arabica' | 'Premium Washed' | 'Natural & Sun-Dried' | 'Fine Robusta';
  grade: string;
  variety: string;
  origin: string;
  altitude: string;
  process: string;
  cupScore?: number;
  cupProfile: string[];
  screenSize: string;
  moisture: string;
  waterActivity?: string;
  defectCount: string;
  packaging: string;
  bagWeight: string;
  moq: string;
  availability: string;
  harvestSeason: string;
  description: string;
  sensoryScores: {
    aroma: number;
    flavor: number;
    acidity: number;
    body: number;
    balance: number;
    aftertaste: number;
  };
  imageUrl: string;
  featured?: boolean;
}

export interface QuoteFormState {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  businessType: 'Importer' | 'Roaster' | 'Distributor' | 'Broker' | 'Private Label / Manufacturer';
  coffeeType: string;
  quantityRequired: string;
  incoterm: 'FOB (Free on Board)' | 'CIF (Cost, Insurance & Freight)' | 'CFR (Cost and Freight)' | 'Sample Lot Request';
  destinationPort: string;
  preferredPackaging: string;
  targetShippingMonth: string;
  requestSamples: boolean;
  message: string;
}
