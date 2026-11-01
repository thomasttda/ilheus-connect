import { useState } from 'react';
import { X, Star, Clock, Bike, Plus, Check } from 'lucide-react';
import type { Restaurant, MenuItem } from '../types';


interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, restaurant: Restaurant) => void;
}

export const RestaurantModal: React.FC<RestaurantModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  if (!isOpen || !restaurant) return null;

  const categories = ['all', ...Array.from(new Set(restaurant.menu.map((m) => m.category)))];

  const filteredMenu =
    selectedCategory === 'all'
      ? restaurant.menu
      : restaurant.menu.filter((m) => m.category === selectedCategory);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item, restaurant);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Banner and Close */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={restaurant.bannerUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Restaurant Header Info */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3 text-white">
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-white shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md uppercase tracking-wider">
                {restaurant.category}
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold truncate drop-shadow-sm mt-0.5">
                {restaurant.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-200 mt-1">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {restaurant.rating} ({restaurant.reviewCount})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {restaurant.deliveryTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5" />
                  R$ {restaurant.deliveryFee.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="p-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 bg-slate-50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'Cardápio Completo' : cat}
            </button>
          ))}
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-xs transition-all bg-white"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-slate-800 truncate">
                    {item.name}
                  </h4>
                  {item.popular && (
                    <span className="text-[9px] bg-rose-100 text-rose-700 font-extrabold px-1.5 py-0.5 rounded-md">
                      MAIS PEDIDO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-normal">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-extrabold text-sm sm:text-base text-sky-700">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </span>
                  <button
                    onClick={() => handleAdd(item)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      addedItemId === item.id
                        ? 'bg-emerald-600 text-white scale-105'
                        : 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white'
                    }`}
                  >
                    {addedItemId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Adicionado!
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Pedir
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
