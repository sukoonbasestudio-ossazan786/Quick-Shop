
import React from 'react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';
import { AudioTranscriber } from './AudioTranscriber';

interface ShopProps {
  products: Product[];
  currency: Currency;
  exchangeRatePKR: number;
  exchangeRateAED: number;
  transcriptionEnabled: boolean;
}

export const Shop: React.FC<ShopProps> = ({ 
  products, 
  currency, 
  exchangeRatePKR, 
  exchangeRateAED,
  transcriptionEnabled
}) => {
  return (
    <main className="max-w-7xl mx-auto py-12 px-4 md:px-8">
      {/* Hero Section */}
      <section className="mb-16 bg-emerald-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Sukoon Base <br/>
            <span className="text-emerald-400">Quick Shop Branch.</span>
          </h2>
          <p className="text-emerald-100/80 text-lg mb-8 leading-relaxed">
            Welcome to our premium outlet. Browse our items and pages with instant redirects to target locations. 
            All prices include our standard service tax.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-white/20 backdrop-blur-sm bg-white/5">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold">USD • PKR • AED Supported</span>
            </div>
          </div>
        </div>
      </section>

      {/* Transcription Feature */}
      {transcriptionEnabled && <AudioTranscriber />}

      {/* Product Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-extrabold text-slate-900">Branch Inventory</h3>
          <div className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-lg">
            Fixed Tax: 120 applied
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-emerald-100 text-slate-400">
            No items currently available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                currency={currency}
                exchangeRatePKR={exchangeRatePKR}
                exchangeRateAED={exchangeRateAED}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
