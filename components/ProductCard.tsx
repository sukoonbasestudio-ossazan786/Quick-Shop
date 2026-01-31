
import React from 'react';
import { Product, Currency } from '../types';
import { PRODUCT_TAX } from '../constants';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  exchangeRatePKR: number;
  exchangeRateAED: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  currency, 
  exchangeRatePKR,
  exchangeRateAED 
}) => {
  const getPrice = () => {
    let rate = 1;
    if (currency === 'PKR') rate = exchangeRatePKR;
    if (currency === 'AED') rate = exchangeRateAED;
    
    // Add 120 tax as requested
    const basePriceConverted = product.price * rate;
    return basePriceConverted + PRODUCT_TAX;
  };

  const displayPrice = getPrice().toLocaleString(undefined, {
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: 2
  });

  const currencySymbol = currency === 'PKR' ? 'Rs.' : currency === 'AED' ? 'AED' : '$';

  const handleBuyNow = () => {
    if (product.destinationUrl) {
      window.open(product.destinationUrl, '_blank');
    } else {
      alert("Redirect location not configured for this item.");
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-50">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-emerald-800 border border-emerald-100 shadow-sm">
          {product.itemCode}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed h-10">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total + Tax</span>
            <span className="text-xl font-bold text-emerald-600">
              {currencySymbol} {displayPrice}
            </span>
          </div>
          
          <button 
            onClick={handleBuyNow}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 transition-all flex items-center gap-2"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
