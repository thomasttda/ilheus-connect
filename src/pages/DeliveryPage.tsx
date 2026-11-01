import { useState } from 'react';
import { Search, Star, Clock, Bike, UtensilsCrossed, Sparkles } from 'lucide-react';
import type { Restaurant } from '../types';


interface DeliveryPageProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onOpenRegister: () => void;
}

export const DeliveryPage: React.FC<DeliveryPageProps> = ({
  restaurants,
  onSelectRestaurant,
  onOpenRegister,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'Hamburgueria', label: '🍔 Burgers' },
    { id: 'Pizzas', label: '🍕 Pizzas' },
    { id: 'Comida Típica', label: '🍲 Típica Baiana' },
    { id: 'Açaí & Sucos', label: '🥤 Açaí & Sucos' },
  ];

  const filteredRestaurants = restaurants.filter((rest) => {
    const matchesSearch =
      rest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rest.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rest.menu.some((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || rest.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full space-y-5 pb-20">
      {/* Top Banner & Title */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <UtensilsCrossed className="w-5 h-5 text-amber-200" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-100">
            Delivery Ilhéus
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">Restaurantes & Lanchonetes</h2>
        <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-md">
          Peça diretamente dos estabelecimentos de Ilhéus, sem intermediários caros e com entrega rápida.
        </p>

        {/* Search bar inside header */}
        <div className="relative mt-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar restaurante, hambúrguer, pizza, moqueca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm shadow-md outline-hidden placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Categories Filter Roll */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-white shadow-sm scale-105'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Restaurant List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-800">
            {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'estabelecimento encontrado' : 'estabelecimentos encontrados'}
          </h3>
          <button
            onClick={onOpenRegister}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Cadastrar Restaurante
          </button>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
            <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700">Nenhum restaurante encontrado</h4>
            <p className="text-xs text-slate-500 mt-1">
              Tente buscar por outro termo ou mude a categoria acima.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => onSelectRestaurant(restaurant)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-amber-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
              >
                {/* Banner with cover */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <img
                    src={restaurant.bannerUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  
                  {/* Status tag */}
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                    {restaurant.isOpen ? 'Aberto Agora' : 'Fechado'}
                  </span>

                  {/* Logo overlay */}
                  <img
                    src={restaurant.logoUrl}
                    alt={restaurant.name}
                    className="absolute -bottom-2 left-3 w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                  />
                </div>

                {/* Details */}
                <div className="p-4 pt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {restaurant.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {restaurant.rating} ({restaurant.reviewCount})
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                      {restaurant.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {restaurant.address}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {restaurant.deliveryTime}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-sky-700">
                      <Bike className="w-3.5 h-3.5" />
                      {restaurant.deliveryFee === 0 ? 'Grátis' : `R$ ${restaurant.deliveryFee.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
