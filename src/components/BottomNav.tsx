import { Home, Utensils, Newspaper } from 'lucide-react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: 'home' | 'delivery' | 'services' | 'news') => void;
  cartCount: number;
}

export const BottomNav = ({
  activePage,
  onNavigate,
  cartCount,
}: BottomNavProps) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 select-none animate-fadeIn">
      {/* Floating Pill Dock with 3 circular icons */}
      <nav 
        aria-label="Navegação Flutuante"
        className="flex items-center justify-center gap-4 px-4 py-2 rounded-full bg-linear-to-r from-sky-500 via-sky-600 to-cyan-500 text-white shadow-2xl shadow-sky-600/40 border border-white/30 backdrop-blur-md"
      >
        {/* 1. HOME BUTTON (Redondo / Circular) */}
        <button
          onClick={() => onNavigate('home')}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            activePage === 'home'
              ? 'bg-white text-sky-600 shadow-md scale-110 ring-2 ring-white/50'
              : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
          }`}
          title="Página Inicial"
          aria-label="Página Inicial"
        >
          <Home className="w-5 h-5 stroke-[2.3]" />
        </button>

        {/* 2. FOOD / DELIVERY BUTTON (Redondo / Hero Central) */}
        <button
          onClick={() => onNavigate('delivery')}
          className="relative group cursor-pointer focus:outline-hidden"
          title="Food / Delivery"
          aria-label="Food e Delivery"
        >
          <div
            className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              activePage === 'delivery'
                ? 'bg-white text-sky-600 scale-115 ring-4 ring-white/60 shadow-xl'
                : 'bg-white text-sky-600 hover:scale-108 hover:shadow-xl'
            }`}
          >
            <Utensils className="w-6 h-6 stroke-[2.4]" />
          </div>

          {/* Cart items badge */}
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
              {cartCount}
            </span>
          )}
        </button>

        {/* 3. NEWS BUTTON (Redondo / Circular como os outros) */}
        <button
          onClick={() => onNavigate('news')}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            activePage === 'news'
              ? 'bg-white text-rose-600 shadow-md scale-110 ring-2 ring-white/50'
              : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
          }`}
          title="Notícias da Cidade (News)"
          aria-label="Notícias da Cidade"
        >
          <Newspaper className="w-5 h-5 stroke-[2.3]" />
        </button>
      </nav>
    </div>
  );
};
