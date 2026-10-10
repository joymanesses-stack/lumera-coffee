export interface CoffeeProduct {
  id: string;
  name: string;
  category: 'Green Coffee' | 'Roasted Coffee';
  format: string;
  grade: string;
  variety: string;
  origin: string;
  altitude: string;
  process: string;
  cupScore?: number;
  cupProfile?: string[];
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
  imageUrl: string;
  featured?: boolean;
}

export interface QuoteFormState {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  businessType: 'Importer' | 'Roaster' | 'Distributor' | 'Retailer' | 'Hospitality' | 'Other';
  coffeeType: string;
  quantityRequired: string;
  incoterm: 'To be discussed' | 'FOB (Free on Board)' | 'CIF (Cost, Insurance & Freight)' | 'CFR (Cost and Freight)' | 'Sample Lot Request';
  destinationPort: string;
  preferredPackaging: string;
  targetShippingMonth: string;
  requestSamples: boolean;
  message: string;
}
