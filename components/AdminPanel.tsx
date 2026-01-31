
import React, { useState, useEffect } from 'react';
import { Product, AppSettings } from '../types';
import { uploadToCloudinary } from '../services/cloudinary';
import { firebaseService } from '../services/firebase';

interface AdminPanelProps {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ settings, updateSettings, onLogout }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'settings'>('inventory');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    itemCode: '',
    price: '',
    destinationUrl: '',
    image: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await firebaseService.getProducts();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert('Please select an image');

    setIsUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(formData.image);
      const newProduct: Omit<Product, 'id'> = {
        name: formData.name,
        description: formData.description,
        itemCode: formData.itemCode,
        price: parseFloat(formData.price),
        imageUrl: imageUrl,
        destinationUrl: formData.destinationUrl,
        createdAt: Date.now()
      };

      await firebaseService.saveProduct(newProduct);
      loadProducts();
      setFormData({ name: '', description: '', itemCode: '', price: '', destinationUrl: '', image: null });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save to Firebase');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    await firebaseService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Sukoon Base Admin</h1>
            <p className="text-slate-500">Manage Quick Shop Branch Pages & Items</p>
          </div>
          <button onClick={onLogout} className="text-rose-600 hover:text-rose-700 font-bold text-sm flex items-center gap-1">
            Logout
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex border-b border-slate-100 bg-emerald-50/30">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'inventory' ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-slate-400'}`}
            >
              PAGES & PRODUCTS
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'settings' ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-slate-400'}`}
            >
              SHOP SETTINGS
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'inventory' ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Active Items ({products.length})</h2>
                  <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200"
                  >
                    {isAdding ? 'Cancel' : '+ Add New Page'}
                  </button>
                </div>

                {isAdding && (
                  <form onSubmit={handleSubmit} className="mb-12 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Page/Item Name" required
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                      />
                      <input 
                        type="text" placeholder="Item Code" required
                        value={formData.itemCode} onChange={e => setFormData({...formData, itemCode: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                      />
                      <input 
                        type="url" placeholder="Redirect URL (Admin URL Location)" required
                        value={formData.destinationUrl} onChange={e => setFormData({...formData, destinationUrl: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 md:col-span-2"
                      />
                      <textarea 
                        placeholder="Short Description" required
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 md:col-span-2 h-20"
                      />
                      <input 
                        type="number" placeholder="Base Price (USD)" step="0.01" required
                        value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                      />
                      <input 
                        type="file" accept="image/*" required
                        onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})}
                        className="w-full text-sm text-slate-500"
                      />
                    </div>
                    <button 
                      type="submit" disabled={isUploading}
                      className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading to Cloudinary & Firebase...' : 'Publish to Website'}
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {products.map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100">
                      <img src={p.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{p.name}</h4>
                        <div className="text-xs text-slate-400">Target: {p.destinationUrl}</div>
                      </div>
                      <button onClick={() => handleDelete(p.id)} className="text-rose-400 hover:text-rose-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-12">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Currency Exchange Rates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">USD TO PKR RATE</label>
                      <input 
                        type="number" value={settings.exchangeRatePKR}
                        onChange={e => updateSettings({ exchangeRatePKR: parseFloat(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">USD TO AED RATE</label>
                      <input 
                        type="number" value={settings.exchangeRateAED}
                        onChange={e => updateSettings({ exchangeRateAED: parseFloat(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                  <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Security & Admin Access
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-rose-400 uppercase tracking-widest">Change Admin PIN</label>
                      <input 
                        type="password" value={settings.adminPin}
                        onChange={e => updateSettings({ adminPin: e.target.value })}
                        className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-rose-500 outline-none"
                        placeholder="New PIN Code"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-rose-400 uppercase tracking-widest">Reset Support URL</label>
                      <input 
                        type="url" value={settings.adminResetUrl}
                        onChange={e => updateSettings({ adminResetUrl: e.target.value })}
                        className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-rose-500 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-rose-500 font-medium italic">
                    Note: Changes to the Admin PIN take effect immediately. Keep your reset URL secure.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <div className="font-bold text-slate-800">Google Customer Login</div>
                      <div className="text-xs text-slate-500">Allow users to log in with Gmail</div>
                    </div>
                    <button 
                      onClick={() => updateSettings({ googleLoginEnabled: !settings.googleLoginEnabled })}
                      className={`w-14 h-8 rounded-full transition-colors relative ${settings.googleLoginEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.googleLoginEnabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <div className="font-bold text-slate-800">AI Audio Transcription</div>
                      <div className="text-xs text-slate-500">Enable voice-to-text search support</div>
                    </div>
                    <button 
                      onClick={() => updateSettings({ transcriptionEnabled: !settings.transcriptionEnabled })}
                      className={`w-14 h-8 rounded-full transition-colors relative ${settings.transcriptionEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.transcriptionEnabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
