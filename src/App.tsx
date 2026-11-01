import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { DeliveryPage } from './pages/DeliveryPage';
import { ServicesPage } from './pages/ServicesPage';
import { NewsPage } from './pages/NewsPage';
import { RestaurantModal } from './components/RestaurantModal';
import { ProfessionalModal } from './components/ProfessionalModal';
import { CartDrawer } from './components/CartDrawer';
import { RegisterModal } from './components/RegisterModal';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import type { Restaurant, Professional, MenuItem, CartItem } from './types';
import {
  getStoredTopBanners,
  saveStoredTopBanners,
  getStoredSecBanners,
  saveStoredSecBanners,
  getStoredRestaurants,
  saveStoredRestaurants,
  getStoredProfessionals,
  saveStoredProfessionals,
  getStoredNews,
  saveStoredNews,
} from './data/storage';
import type { NewsArticle } from './data/storage';
import type { BannerItem } from './types';
import { CheckCircle2 } from 'lucide-react';

// Detect current route (hash-based, no router dependency)
const getRoute = () => {
  const path = window.location.pathname.toLowerCase();
  if (path === '/admin_sec') return 'admin';
  return 'public';
};

export function App() {
  const [route, setRoute] = useState<'public' | 'admin'>(getRoute());
  const [adminAuthenticated, setAdminAuthenticated] = useState(
    () => sessionStorage.getItem('ic_admin_auth') === 'true'
  );

  // Listen for browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => setRoute(getRoute());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ── Global state (loaded from localStorage so Admin edits are reflected ──
  const [topBanners, setTopBanners] = useState<BannerItem[]>(() => getStoredTopBanners());
  const [secBanners, setSecBanners] = useState<BannerItem[]>(() => getStoredSecBanners());
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => getStoredRestaurants());
  const [professionals, setProfessionals] = useState<Professional[]>(() => getStoredProfessionals());
  const [news, setNews] = useState<NewsArticle[]>(() => getStoredNews());

  // Persist every change from admin
  const handleUpdateTopBanners = (banners: BannerItem[]) => {
    setTopBanners(banners);
    saveStoredTopBanners(banners);
  };
  const handleUpdateSecBanners = (banners: BannerItem[]) => {
    setSecBanners(banners);
    saveStoredSecBanners(banners);
  };
  const handleUpdateRestaurants = (list: Restaurant[]) => {
    setRestaurants(list);
    saveStoredRestaurants(list);
  };
  const handleUpdateProfessionals = (list: Professional[]) => {
    setProfessionals(list);
    saveStoredProfessionals(list);
  };
  const handleUpdateNews = (list: NewsArticle[]) => {
    setNews(list);
    saveStoredNews(list);
  };

  // ── Public app state ──────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState<'home' | 'delivery' | 'services' | 'news'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (item: MenuItem, restaurant: Restaurant) => {
    setCartItems((prev) => {
      const existingRestId = prev[0]?.restaurantId;
      let updated = [...prev];
      if (existingRestId && existingRestId !== restaurant.id) {
        if (!confirm(`Seu carrinho já contém itens de outro restaurante. Deseja limpá-lo para adicionar itens de ${restaurant.name}?`)) {
          return prev;
        }
        updated = [];
      }
      const existingIndex = updated.findIndex((ci) => ci.menuItem.id === item.id);
      if (existingIndex >= 0) {
        updated[existingIndex].quantity += 1;
      } else {
        updated.push({
          menuItem: item,
          quantity: 1,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantWhatsapp: restaurant.whatsapp,
        });
      }
      return updated;
    });
    showToast(`"${item.name}" adicionado ao carrinho!`);
  };

  const handleUpdateQuantity = (menuItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.menuItem.id === menuItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Carrinho esvaziado.');
  };

  const handleRegisterSuccess = (data: any) => {
    if (data.type === 'service') {
      const newProf: Professional = {
        id: `prof-${Date.now()}`,
        name: data.name,
        profession: data.professionOrCategory,
        category: 'outros',
        rating: 5.0,
        reviewCount: 1,
        experienceYears: 1,
        whatsapp: data.whatsapp.replace(/\D/g, '') || '5573999999999',
        phone: data.whatsapp,
        neighborhoods: [data.neighborhood || 'Ilhéus'],
        bio: data.description || 'Profissional recém-cadastrado na Cidade Digital.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        portfolioImages: [],
        isVerified: true,
        completedJobsCount: 1,
      };
      handleUpdateProfessionals([newProf, ...professionals]);
      showToast('Seu perfil profissional foi cadastrado com sucesso!');
    } else {
      const newRest: Restaurant = {
        id: `rest-${Date.now()}`,
        name: data.name,
        category: data.professionOrCategory,
        rating: 5.0,
        reviewCount: 1,
        deliveryTime: '30-50 min',
        deliveryFee: 5.0,
        minOrder: 20.0,
        logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        whatsapp: data.whatsapp.replace(/\D/g, '') || '5573999999999',
        address: `${data.neighborhood || 'Centro'}, Ilhéus`,
        neighborhood: data.neighborhood || 'Centro',
        isOpen: true,
        menu: [
          {
            id: `item-${Date.now()}`,
            name: 'Prato Especial da Casa',
            description: data.description || 'Especialidade deliciosa preparada na hora.',
            price: 29.90,
            imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
            category: 'Especiais',
            popular: true,
          },
        ],
      };
      handleUpdateRestaurants([newRest, ...restaurants]);
      showToast('Seu estabelecimento foi cadastrado no Delivery!');
    }
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // ── ADMIN ROUTE ───────────────────────────────────────────────────────────
  if (route === 'admin') {
    if (!adminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setAdminAuthenticated(true)}
          onExit={() => {
            window.history.pushState({}, '', '/');
            setRoute('public');
          }}
        />
      );
    }

    return (
      <AdminDashboard
        topBanners={topBanners}
        secBanners={secBanners}
        restaurants={restaurants}
        professionals={professionals}
        news={news}
        onUpdateTopBanners={handleUpdateTopBanners}
        onUpdateSecBanners={handleUpdateSecBanners}
        onUpdateRestaurants={handleUpdateRestaurants}
        onUpdateProfessionals={handleUpdateProfessionals}
        onUpdateNews={handleUpdateNews}
        onLogout={() => {
          sessionStorage.removeItem('ic_admin_auth');
          setAdminAuthenticated(false);
        }}
        onViewSite={() => {
          window.history.pushState({}, '', '/');
          setRoute('public');
        }}
      />
    );
  }

  // ── PUBLIC ROUTE ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl backdrop-blur-xs flex items-center gap-2 animate-fadeIn border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-3">
        {activePage === 'home' && (
          <HomePage
            topBanners={topBanners}
            secBanners={secBanners}
            restaurants={restaurants}
            professionals={professionals}
            onNavigate={setActivePage}
            onSelectRestaurant={setSelectedRestaurant}
            onSelectProfessional={setSelectedProfessional}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {activePage === 'delivery' && (
          <DeliveryPage
            restaurants={restaurants}
            onSelectRestaurant={setSelectedRestaurant}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {activePage === 'services' && (
          <ServicesPage
            professionals={professionals}
            onSelectProfessional={setSelectedProfessional}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {activePage === 'news' && (
          <NewsPage news={news} />
        )}
      </main>

      <footer className="hidden sm:block border-t border-slate-200/80 bg-white py-6 mt-12 text-center text-xs text-slate-500 pb-20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sky-700">ILHÉUS CONNECT</span>
            <span>• Cidade Digital</span>
          </div>
          <p>© 2026 Ilhéus Connect - Todos os direitos reservados.</p>
        </div>
      </footer>

      <BottomNav
        activePage={activePage}
        onNavigate={setActivePage}
        cartCount={totalCartCount}
      />

      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={Boolean(selectedRestaurant)}
        onClose={() => setSelectedRestaurant(null)}
        onAddToCart={handleAddToCart}
      />

      <ProfessionalModal
        professional={selectedProfessional}
        isOpen={Boolean(selectedProfessional)}
        onClose={() => setSelectedProfessional(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
}

export default App;
