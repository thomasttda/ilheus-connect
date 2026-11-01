import { UtensilsCrossed, Wrench, Pill, Newspaper, Sparkles } from 'lucide-react';
import type { MenuCategory } from '../types';


interface MenuRollProps {
  categories: MenuCategory[];
  activePage: string;
  onSelectCategory: (pageId: 'home' | 'delivery' | 'services' | 'pharmacy' | 'news', id: string) => void;
}

export const MenuRoll: React.FC<MenuRollProps> = ({
  categories,
  activePage,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Pill':
        return <Pill className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Newspaper':
        return <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
          <span>Serviços da Cidade</span>
          <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
            Navegue
          </span>
        </h2>
        <span className="text-xs text-slate-600 font-medium hidden sm:inline">
          Deslize para ver mais ➔
        </span>
      </div>

      {/* Horizontal Scrollable Menu Roll */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1 -mx-1 scroll-smooth">
        {categories.map((cat) => {
          const isActive = activePage === cat.pageId;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.pageId, cat.id)}
              className={`relative flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 select-none group text-left ${
                isActive
                  ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-600/20 scale-[1.02]'
                  : 'bg-white border-slate-200/90 hover:border-sky-300 hover:shadow-md text-slate-800'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : `bg-linear-to-br ${cat.color} text-white`
                }`}
              >
                {getIcon(cat.iconName)}
              </div>

              {/* Text Info */}
              <div className="flex flex-col min-w-[90px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight whitespace-nowrap">
                    {cat.name}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? 'text-sky-100' : 'text-slate-600'
                  }`}
                >
                  {cat.pageId === 'delivery'
                    ? 'Restaurantes'
                    : cat.pageId === 'services'
                    ? 'Profissionais'
                    : 'Acessar'}
                </span>
              </div>

              {/* Badge */}
              {cat.badge && (
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-white/30 text-white'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
