
import { AppSettings } from './types';

export const INITIAL_SETTINGS: AppSettings = {
  googleLoginEnabled: true,
  transcriptionEnabled: false,
  exchangeRatePKR: 280,
  exchangeRateAED: 3.67,
  adminPin: 'SUKOON36549801',
  adminResetUrl: 'https://sukoonbase.com/admin-recovery'
};

export const ADMIN_AUTH = {
  pin: 'SUKOON36549801'
};

export const SUPPORT_LINKS = {
  maleEmail: 'sukoonbase@hotmail.com',
  femaleSnapchat: 'sukoonbase0786',
};

export const PRODUCT_TAX = 120;

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Sukoon Premium Item',
    description: 'A flagship product from Sukoon Base.',
    itemCode: 'SKN-001',
    price: 15,
    imageUrl: 'https://picsum.photos/seed/skn/400/400',
    destinationUrl: 'https://sukoonbase.com'
  }
];
