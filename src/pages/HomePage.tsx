import { BannerRoll } from '../components/BannerRoll';
import { MenuRoll } from '../components/MenuRoll';
import { menuCategories } from '../data/mockData';
import type { Restaurant, Professional, BannerItem } from '../types';
import { Star, Clock, ArrowRight, ShieldCheck, Wrench, UtensilsCrossed, Sparkles } from 'lucide-react';


interface HomePageProps {
  topBanners: BannerItem[];
  secBanners: BannerItem[];
  restaurants: Restaurant[];
  professionals: Professional[];
  onNavigate: (page: 'home' | 'delivery' | 'services' | 'news') => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onSelectProfessional: (professional: Professional) => void;
  onOpenRegister: () => void;
}

export const HomePage = ({
  topBanners,
  secBanners,
  restaurants,
  professionals,
  onNavigate,
  onSelectRestaurant,
  onSelectProfessional,
  onOpenRegister,
}: HomePageProps) => {
  const handleBannerClick = (banner: BannerItem) => {
    if (banner.targetPage === 'delivery') {
      onNavigate('delivery');
    } else if (banner.targetPage === 'services') {
      onNavigate('services');
    } else if (banner.targetPage === 'register') {
      onOpenRegister();
    }
  };

  const handleMenuSelect = (pageId: 'home' | 'delivery' | 'services' | 'pharmacy' | 'news', id: string) => {
    if (pageId === 'delivery') {
      onNavigate('delivery');
    } else if (pageId === 'services') {
      onNavigate('services');
    } else if (pageId === 'news') {
      onNavigate('news');
    } else if (id === 'register') {
      onOpenRegister();
    } else {
      onNavigate('services');
    }
  };

  return (
    <div className="w-full space-y-6 pb-20">
      {/* 1. BANNER ROLL 1 (Publicidades Principais e Destaques da Cidade) */}
      <section className="pt-2">
        <BannerRoll
          banners={topBanners}
          badgePrefix="PUBLICIDADE PRINCIPAL"
          onBannerClick={handleBannerClick}
          className="shadow-sm"
        />
      </section>

      {/* 2. MENU ROLL (Navegação com páginas Delivery, Serviços Gerais, ...) */}
      <section>
        <MenuRoll
          categories={menuCategories}
          activePage="home"
          onSelectCategory={handleMenuSelect}
        />
      </section>

      {/* 3. BANNER ROLL 2 (Abaixo do menu - Segundo Roll com Oportunidades & Patrocínios) */}
      <section>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Oportunidades & Patrocinadores Locais
          </span>
          <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-full">
            Destaques
          </span>
        </div>
        <BannerRoll
          banners={secBanners}
          autoPlayInterval={5500}
          badgePrefix="DESTAQUE LOCAL"
          onBannerClick={handleBannerClick}
          className="border-sky-100 shadow-xs"
        />
      </section>

      {/* 4. DESTAQUES DO DELIVERY */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
              <UtensilsCrossed className="w-4 h-4 text-amber-500" />
              Restaurantes Mais Pedidos em Ilhéus
            </h3>
            <p className="text-xs text-slate-500">
              Faça seu pedido rápido e receba quentinho
            </p>
          </div>
          <button
            onClick={() => onNavigate('delivery')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {restaurants.slice(0, 2).map((rest) => (
            <div
              key={rest.id}
              onClick={() => onSelectRestaurant(rest)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group flex gap-3"
            >
              <img
                src={rest.logoUrl}
                alt={rest.name}
                className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  {rest.category}
                </span>
                <h4 className="font-bold text-sm text-slate-800 truncate mt-0.5 group-hover:text-sky-700 transition-colors">
                  {rest.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> {rest.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {rest.deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DESTAQUES DE SERVIÇOS GERAIS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-sky-600" />
              Profissionais Recomendados da Cidade
            </h3>
            <p className="text-xs text-slate-500">
              Eletricistas, pedreiros, encanadores e pintores com avaliações reais
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            Ver catálogo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {professionals.slice(0, 2).map((prof) => (
            <div
              key={prof.id}
              onClick={() => onSelectProfessional(prof)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group flex gap-3"
            >
              <img
                src={prof.avatarUrl}
                alt={prof.name}
                className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded truncate">
                    {prof.profession}
                  </span>
                  {prof.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-800 truncate mt-0.5 group-hover:text-sky-700 transition-colors">
                  {prof.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> {prof.rating}
                  </span>
                  <span>•</span>
                  <span>{prof.experienceYears} anos exp.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BANNER FIXO INCENTIVANDO NOVOS ANUNCIANTES */}
      <section className="bg-linear-to-r from-slate-900 to-sky-950 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-slate-800">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-sky-500/30 text-sky-300 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3" /> Faça Parte da Cidade Digital
          </div>
          <h4 className="text-base sm:text-lg font-bold">Quer divulgar seu comércio ou serviço aqui?</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Conecte-se com milhares de pessoas de Ilhéus no maior portal digital local.
          </p>
        </div>
        <button
          onClick={onOpenRegister}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-linear-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-md transition-all shrink-0 cursor-pointer"
        >
          Quero me Cadastrar
        </button>
      </section>
    </div>
  );
};
