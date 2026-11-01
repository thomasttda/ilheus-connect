import { MapPin, ShoppingBag, Sparkles } from 'lucide-react';


interface HeaderProps {
  activePage: string;
  onNavigate: (page: 'home' | 'delivery' | 'services' | 'news') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenRegister: () => void;
}

export const Header = ({
  activePage,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenRegister,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left: Location indicator */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 transition-colors px-2.5 py-1.5 rounded-full cursor-pointer">
          <MapPin className="w-3.5 h-3.5 text-sky-600" />
          <span className="truncate max-w-[100px] sm:max-w-none">Ilhéus, BA</span>
        </div>

        {/* Center: Small Centered Logo (Requirement: "logo centralizada pequena") */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center cursor-pointer group select-none"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-sm tracking-tighter">IC</span>
            </div>
            <div className="text-center">
              <span className="font-extrabold text-base tracking-tight bg-linear-to-r from-sky-700 to-cyan-600 bg-clip-text text-transparent">
                ILHÉUS
              </span>
              <span className="font-bold text-xs tracking-wider text-slate-800 ml-1">
                CONNECT
              </span>
            </div>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold -mt-0.5">
            Cidade Digital
          </span>
        </div>

        {/* Right: Cart (if delivery) or Quick Action */}
        <div className="flex items-center gap-2">
          {activePage === 'delivery' ? (
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
              title="Ver Carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 text-xs font-semibold bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white px-3 py-1.5 rounded-full shadow-xs hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Anunciar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
