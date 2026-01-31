
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Shop } from './components/Shop';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { UserLogin } from './components/UserLogin';
import { Product, Currency, AppSettings, ViewState } from './types';
import { INITIAL_SETTINGS } from './constants';
import { firebaseService } from './services/firebase';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('shop');
  const [currency, setCurrency] = useState<Currency>('PKR');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateUpdate((user) => {
      setIsUserAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const initData = async () => {
      const data = await firebaseService.getProducts();
      setProducts(data);
    };
    initData();
  }, [view]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleNavigate = (target: ViewState) => {
    if (target === 'admin' && !isAdminAuthenticated) {
      setView('login');
    } else {
      setView(target);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserLoginToggle = async () => {
    if (isUserAuthenticated) {
      if (confirm("Are you sure you want to sign out?")) {
        await firebaseService.logout();
      }
    } else {
      setView('user-login');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        return (
          <AdminLogin 
            onSuccess={() => {
              setIsAdminAuthenticated(true);
              setView('admin');
            }} 
            onCancel={() => setView('shop')}
            currentPin={settings.adminPin}
          />
        );
      case 'user-login':
        return (
          <UserLogin 
            onSuccess={() => {
              setView('shop');
            }}
            onCancel={() => setView('shop')}
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            settings={settings} 
            updateSettings={updateSettings} 
            onLogout={() => {
              setIsAdminAuthenticated(false);
              setView('shop');
            }}
          />
        );
      case 'shop':
      default:
        return (
          <Shop 
            products={products} 
            currency={currency} 
            exchangeRatePKR={settings.exchangeRatePKR} 
            exchangeRateAED={settings.exchangeRateAED}
            transcriptionEnabled={settings.transcriptionEnabled}
          />
        );
    }
  };

  const hideLayout = view === 'login' || view === 'user-login';

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {!hideLayout && (
        <Navbar 
          currency={currency} 
          setCurrency={setCurrency} 
          currentView={view}
          onNavigate={handleNavigate}
          isAdminAuthenticated={isAdminAuthenticated}
          isUserAuthenticated={isUserAuthenticated}
          onUserLoginToggle={handleUserLoginToggle}
        />
      )}
      
      <div className="flex-grow bg-slate-50">
        {renderContent()}
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
