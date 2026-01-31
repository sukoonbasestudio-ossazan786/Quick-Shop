
export type Currency = 'PKR' | 'USD' | 'AED';

export interface Product {
  id: string;
  name: string;
  description: string;
  itemCode: string;
  price: number;
  imageUrl: string;
  destinationUrl: string; // The URL to redirect to on "Buy Now"
  createdAt?: number;
}

export interface AppSettings {
  googleLoginEnabled: boolean;
  transcriptionEnabled: boolean;
  exchangeRatePKR: number; // 1 USD to PKR
  exchangeRateAED: number; // 1 USD to AED
  adminPin: string;
  adminResetUrl: string;
}

export type ViewState = 'shop' | 'admin' | 'login' | 'user-login';
