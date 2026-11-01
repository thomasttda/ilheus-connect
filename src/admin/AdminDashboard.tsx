import { useState } from 'react';
import type { BannerItem, Restaurant, Professional, MenuItem } from '../types';
import type { NewsArticle } from '../data/storage';
import {
  LayoutDashboard,
  Images,
  UtensilsCrossed,
  Wrench,
  Newspaper,
  Plus,
  Trash2,
  Edit3,
  LogOut,
  Save,
  X,
  CheckCircle,
  Eye,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Phone
} from 'lucide-react';
import { initialNews } from '../data/storage';
import { topBanners as defaultTopBanners, secondaryBanners as defaultSecBanners, restaurantsData as defaultRestaurants, professionalsData as defaultProfessionals } from '../data/mockData';


interface AdminDashboardProps {
  topBanners: BannerItem[];
  secBanners: BannerItem[];
  restaurants: Restaurant[];
  professionals: Professional[];
  news: NewsArticle[];
  onUpdateTopBanners: (banners: BannerItem[]) => void;
  onUpdateSecBanners: (banners: BannerItem[]) => void;
  onUpdateRestaurants: (restaurants: Restaurant[]) => void;
  onUpdateProfessionals: (professionals: Professional[]) => void;
  onUpdateNews: (news: NewsArticle[]) => void;
  onLogout: () => void;
  onViewSite: () => void;
}

export const AdminDashboard = ({
  topBanners,
  secBanners,
  restaurants,
  professionals,
  news,
  onUpdateTopBanners,
  onUpdateSecBanners,
  onUpdateRestaurants,
  onUpdateProfessionals,
  onUpdateNews,
  onLogout,
  onViewSite,
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'banners' | 'delivery' | 'services' | 'news'>('overview');
  const [notification, setNotification] = useState<string | null>(null);

  // Modal states for editing
  const [editingBanner, setEditingBanner] = useState<{ item: BannerItem; isSecondary: boolean } | null>(null);
  const [isNewBanner, setIsNewBanner] = useState(false);

  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isNewRestaurant, setIsNewRestaurant] = useState(false);

  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [isNewProfessional, setIsNewProfessional] = useState(false);

  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);

  // Manage Menu item inside restaurant
  const [selectedRestForMenu, setSelectedRestForMenu] = useState<Restaurant | null>(null);
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 25,
    category: 'Geral',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetDefaults = () => {
    if (confirm('Atenção: deseja restaurar todos os dados originais da plataforma?')) {
      onUpdateTopBanners(defaultTopBanners);
      onUpdateSecBanners(defaultSecBanners);
      onUpdateRestaurants(defaultRestaurants);
      onUpdateProfessionals(defaultProfessionals);
      onUpdateNews(initialNews);
      notify('Dados originais restaurados com sucesso!');
    }
  };

  // BANNER HANDLERS
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    if (editingBanner.isSecondary) {
      if (isNewBanner) {
        onUpdateSecBanners([...secBanners, { ...editingBanner.item, id: `sb-${Date.now()}` }]);
      } else {
        onUpdateSecBanners(secBanners.map((b) => (b.id === editingBanner.item.id ? editingBanner.item : b)));
      }
    } else {
      if (isNewBanner) {
        onUpdateTopBanners([...topBanners, { ...editingBanner.item, id: `b-${Date.now()}` }]);
      } else {
        onUpdateTopBanners(topBanners.map((b) => (b.id === editingBanner.item.id ? editingBanner.item : b)));
      }
    }
    setEditingBanner(null);
    notify('Banner salvo com sucesso!');
  };

  const handleDeleteBanner = (id: string, isSecondary: boolean) => {
    if (!confirm('Deseja realmente excluir este banner?')) return;
    if (isSecondary) {
      onUpdateSecBanners(secBanners.filter((b) => b.id !== id));
    } else {
      onUpdateTopBanners(topBanners.filter((b) => b.id !== id));
    }
    notify('Banner removido!');
  };

  // RESTAURANT HANDLERS
  const handleSaveRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRestaurant) return;

    if (isNewRestaurant) {
      const created: Restaurant = {
        ...editingRestaurant,
        id: `rest-${Date.now()}`,
        menu: editingRestaurant.menu || [],
      };
      onUpdateRestaurants([created, ...restaurants]);
    } else {
      onUpdateRestaurants(restaurants.map((r) => (r.id === editingRestaurant.id ? editingRestaurant : r)));
    }
    setEditingRestaurant(null);
    notify('Restaurante salvo com sucesso!');
  };

  const handleDeleteRestaurant = (id: string) => {
    if (!confirm('Deseja excluir este restaurante do delivery?')) return;
    onUpdateRestaurants(restaurants.filter((r) => r.id !== id));
    notify('Restaurante excluído!');
  };

  const handleToggleRestOpen = (id: string) => {
    onUpdateRestaurants(
      restaurants.map((r) => (r.id === id ? { ...r, isOpen: !r.isOpen } : r))
    );
    notify('Status de funcionamento alterado!');
  };

  // MENU DISH HANDLERS
  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestForMenu || !newMenuItem.name) return;

    const dish: MenuItem = {
      id: `dish-${Date.now()}`,
      name: newMenuItem.name,
      description: newMenuItem.description || '',
      price: Number(newMenuItem.price) || 0,
      category: newMenuItem.category || 'Geral',
      imageUrl: newMenuItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    };

    const updated = {
      ...selectedRestForMenu,
      menu: [...selectedRestForMenu.menu, dish],
    };

    onUpdateRestaurants(restaurants.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedRestForMenu(updated);
    setNewMenuItem({
      name: '',
      description: '',
      price: 25,
      category: 'Geral',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    });
    notify('Prato adicionado ao cardápio!');
  };

  const handleDeleteDish = (dishId: string) => {
    if (!selectedRestForMenu) return;
    const updated = {
      ...selectedRestForMenu,
      menu: selectedRestForMenu.menu.filter((d) => d.id !== dishId),
    };
    onUpdateRestaurants(restaurants.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedRestForMenu(updated);
    notify('Prato removido do cardápio!');
  };

  // PROFESSIONAL HANDLERS
  const handleSaveProfessional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfessional) return;

    if (isNewProfessional) {
      const created: Professional = {
        ...editingProfessional,
        id: `prof-${Date.now()}`,
        rating: editingProfessional.rating || 5.0,
        reviewCount: editingProfessional.reviewCount || 1,
        completedJobsCount: editingProfessional.completedJobsCount || 10,
        portfolioImages: editingProfessional.portfolioImages || [],
      };
      onUpdateProfessionals([created, ...professionals]);
    } else {
      onUpdateProfessionals(professionals.map((p) => (p.id === editingProfessional.id ? editingProfessional : p)));
    }
    setEditingProfessional(null);
    notify('Profissional salvo com sucesso!');
  };

  const handleDeleteProfessional = (id: string) => {
    if (!confirm('Deseja remover este profissional do catálogo?')) return;
    onUpdateProfessionals(professionals.filter((p) => p.id !== id));
    notify('Profissional removido!');
  };

  // NEWS HANDLERS
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    if (isNewNews) {
      const created: NewsArticle = {
        ...editingNews,
        id: `news-${Date.now()}`,
        date: editingNews.date || 'Hoje',
        readTime: editingNews.readTime || '2 min de leitura',
      };
      onUpdateNews([created, ...news]);
    } else {
      onUpdateNews(news.map((n) => (n.id === editingNews.id ? editingNews : n)));
    }
    setEditingNews(null);
    notify('Notícia salva com sucesso!');
  };

  const handleDeleteNews = (id: string) => {
    if (!confirm('Deseja excluir esta notícia?')) return;
    onUpdateNews(news.filter((n) => n.id !== id));
    notify('Notícia excluída!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-sky-500 to-cyan-400 flex items-center justify-center font-extrabold text-white text-base shadow-md">
            IC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Painel Administrativo
              </span>
              <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                ADMIN_SEC
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Ilhéus Connect • Cidade Digital
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onViewSite}
            className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Site Público</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Content Area with Sidebar Nav Tabs */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-1 bg-slate-950/60 p-3 rounded-3xl border border-slate-800/80 h-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Images className="w-4 h-4" />
            <div className="flex-1 flex justify-between items-center">
              <span>Banners Publicitários</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                {topBanners.length + secBanners.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <div className="flex-1 flex justify-between items-center">
              <span>Delivery & Restaurantes</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                {restaurants.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'services'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <div className="flex-1 flex justify-between items-center">
              <span>Serviços Gerais</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                {professionals.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'news'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <div className="flex-1 flex justify-between items-center">
              <span>Notícias da Cidade</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                {news.length}
              </span>
            </div>
          </button>

          <div className="pt-3 mt-3 border-t border-slate-800/80">
            <button
              onClick={handleResetDefaults}
              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/20 rounded-xl transition-colors cursor-pointer"
              title="Restaurar dados de demonstração"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Dados Originais</span>
            </button>
          </div>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-white">Visão Geral do Sistema</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Resumo das operações, cadastros e publicidades da Cidade Digital em tempo real.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-3xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Restaurantes
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">
                    {restaurants.length}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                    {restaurants.filter((r) => r.isOpen).length} abertos agora
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-3xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Profissionais
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-sky-400 mt-1 block">
                    {professionals.length}
                  </span>
                  <span className="text-[11px] text-sky-300 font-semibold mt-1 block">
                    {professionals.filter((p) => p.isVerified).length} com selo verificado
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-3xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Banners Ativos
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1 block">
                    {topBanners.length + secBanners.length}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                    2 carrosséis na Home
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-3xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Notícias / Eventos
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-rose-400 mt-1 block">
                    {news.length}
                  </span>
                  <span className="text-[11px] text-rose-300 font-semibold mt-1 block">
                    Atualizadas em Ilhéus
                  </span>
                </div>
              </div>

              {/* Quick instructions */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6">
                <h3 className="font-extrabold text-sm text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  Instruções de Gerenciamento da Cidade Digital
                </h3>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Todas as alterações feitas aqui são salvas no armazenamento local e aparecem <strong>instantaneamente</strong> para os moradores e clientes.</li>
                  <li>Você pode adicionar fotos com links normais da internet (ex: Unsplash, Imgur, ou do próprio restaurante).</li>
                  <li>No menu <strong>Delivery</strong>, você pode abrir ou fechar restaurantes com 1 clique e gerenciar os pratos do cardápio.</li>
                  <li>No menu <strong>Serviços Gerais</strong>, você pode cadastrar eletricistas, mecânicos, pedreiros e definir o WhatsApp direto de atendimento.</li>
                  <li>Para acessar este painel a qualquer momento, digite <code className="bg-slate-800 text-sky-300 px-2 py-0.5 rounded">/admin_sec</code> no final da URL do seu navegador.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: BANNERS ROLL */}
          {activeTab === 'banners' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white">Gerenciador de Banners Publicitários</h2>
                  <p className="text-xs text-slate-400">
                    Edite os dois carrosséis de slides (Banner Roll 1 e Banner Roll 2) da Home.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsNewBanner(true);
                      setEditingBanner({
                        isSecondary: false,
                        item: {
                          id: '',
                          title: 'Nova Campanha Comercial',
                          subtitle: 'Descrição atrativa da publicidade',
                          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
                          tag: 'PUBLICIDADE',
                          badgeColor: 'bg-sky-600',
                          ctaText: 'Ver Detalhes',
                          targetPage: 'delivery',
                        },
                      });
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Novo no Roll 1 (Principal)
                  </button>
                  <button
                    onClick={() => {
                      setIsNewBanner(true);
                      setEditingBanner({
                        isSecondary: true,
                        item: {
                          id: '',
                          title: 'Anuncie Conosco',
                          subtitle: 'Espaço reservado para patrocinadores locais',
                          imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80',
                          tag: 'PATROCÍNIO',
                          badgeColor: 'bg-indigo-600',
                          ctaText: 'Fale Conosco',
                          targetPage: 'register',
                        },
                      });
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Novo no Roll 2 (Secundário)
                  </button>
                </div>
              </div>

              {/* Banner Roll 1 Section */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase text-sky-400 tracking-wider">
                  Banner Roll 1 (Topo - Principal) • {topBanners.length} slides
                </span>
                <div className="grid grid-cols-1 gap-3">
                  {topBanners.map((banner) => (
                    <div
                      key={banner.id}
                      className="bg-slate-950/70 border border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-20 h-14 rounded-xl object-cover shrink-0 border border-slate-800"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-sky-400 uppercase">
                            {banner.tag || 'DESTAQUE'}
                          </span>
                          <h4 className="font-bold text-sm text-white truncate">
                            {banner.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {banner.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setIsNewBanner(false);
                            setEditingBanner({ item: banner, isSecondary: false });
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id, false)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banner Roll 2 Section */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <span className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">
                  Banner Roll 2 (Abaixo do Menu - Oportunidades & Patrocínios) • {secBanners.length} slides
                </span>
                <div className="grid grid-cols-1 gap-3">
                  {secBanners.map((banner) => (
                    <div
                      key={banner.id}
                      className="bg-slate-950/70 border border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-20 h-14 rounded-xl object-cover shrink-0 border border-slate-800"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase">
                            {banner.tag || 'PATROCÍNIO'}
                          </span>
                          <h4 className="font-bold text-sm text-white truncate">
                            {banner.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {banner.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setIsNewBanner(false);
                            setEditingBanner({ item: banner, isSecondary: true });
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id, true)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DELIVERY RESTAURANTS */}
          {activeTab === 'delivery' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white">Restaurantes do Delivery</h2>
                  <p className="text-xs text-slate-400">
                    Cadastre restaurantes, configure o WhatsApp de pedidos e edite o cardápio.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsNewRestaurant(true);
                    setEditingRestaurant({
                      id: '',
                      name: '',
                      category: 'Hamburgueria',
                      rating: 5.0,
                      reviewCount: 1,
                      deliveryTime: '30-45 min',
                      deliveryFee: 5.0,
                      minOrder: 20.0,
                      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
                      bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
                      whatsapp: '5573999999999',
                      address: 'Av. Soares Lopes, Ilhéus',
                      neighborhood: 'Centro',
                      isOpen: true,
                      menu: [],
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Restaurante
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {restaurants.map((rest) => (
                  <div
                    key={rest.id}
                    className="bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={rest.logoUrl}
                        alt={rest.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-800"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">
                            {rest.category}
                          </span>
                          <button
                            onClick={() => handleToggleRestOpen(rest.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                              rest.isOpen
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {rest.isOpen ? '● Aberto Agora' : '○ Fechado'}
                          </button>
                        </div>
                        <h4 className="font-bold text-base text-white mt-1 truncate">
                          {rest.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {rest.neighborhood}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Phone className="w-3.5 h-3.5" /> WhatsApp: {rest.whatsapp}
                          </span>
                          <span>•</span>
                          <span>{rest.menu.length} pratos no cardápio</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedRestForMenu(rest)}
                        className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cardápio ({rest.menu.length})
                      </button>
                      <button
                        onClick={() => {
                          setIsNewRestaurant(false);
                          setEditingRestaurant(rest);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors cursor-pointer"
                        title="Editar Restaurante"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRestaurant(rest.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GENERAL SERVICES (PROFESSIONALS) */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white">Serviços Gerais (Profissionais)</h2>
                  <p className="text-xs text-slate-400">
                    Cadastre eletricistas, pedreiros, encanadores, mecânicos e aprove selos de verificação.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsNewProfessional(true);
                    setEditingProfessional({
                      id: '',
                      name: '',
                      profession: 'Eletricista Residencial',
                      category: 'eletrica',
                      rating: 5.0,
                      reviewCount: 1,
                      experienceYears: 5,
                      whatsapp: '5573988880000',
                      phone: '(73) 98888-0000',
                      neighborhoods: ['Centro', 'Pontal'],
                      bio: 'Profissional pontual e qualificado para serviços em toda Ilhéus.',
                      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                      portfolioImages: [],
                      isVerified: true,
                      completedJobsCount: 20,
                      priceStartingAt: 80,
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Profissional
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {professionals.map((prof) => (
                  <div
                    key={prof.id}
                    className="bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={prof.avatarUrl}
                        alt={prof.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-800"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-md">
                            {prof.profession}
                          </span>
                          {prof.isVerified && (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Verificado
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-base text-white mt-1 truncate">
                          {prof.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Phone className="w-3.5 h-3.5" /> WhatsApp: {prof.whatsapp}
                          </span>
                          <span>•</span>
                          <span>{prof.experienceYears} anos de experiência</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">★ {prof.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setIsNewProfessional(false);
                          setEditingProfessional(prof);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProfessional(prof.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NEWS */}
          {activeTab === 'news' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white">Notícias & Eventos de Ilhéus</h2>
                  <p className="text-xs text-slate-400">
                    Publique matérias, festivais culturais e informes de utilidade pública.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsNewNews(true);
                    setEditingNews({
                      id: '',
                      title: 'Nova Notícia ou Evento na Cidade',
                      category: 'Cultura',
                      date: 'Hoje',
                      imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
                      summary: 'Resumo da notícia que será exibida para os munícipes no app...',
                      readTime: '2 min de leitura',
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Publicar Notícia
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-16 rounded-2xl object-cover shrink-0 border border-slate-800"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-base text-white mt-1 truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setIsNewNews(false);
                          setEditingNews(item);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: EDIT/NEW BANNER */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingBanner(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">
              {isNewBanner ? 'Adicionar Novo Banner' : 'Editar Banner'} ({editingBanner.isSecondary ? 'Roll 2' : 'Roll 1'})
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Título do Banner</label>
                <input
                  type="text"
                  required
                  value={editingBanner.item.title}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      item: { ...editingBanner.item, title: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subtítulo / Descrição</label>
                <textarea
                  rows={2}
                  value={editingBanner.item.subtitle}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      item: { ...editingBanner.item, subtitle: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tag / Badge</label>
                  <input
                    type="text"
                    value={editingBanner.item.tag || ''}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        item: { ...editingBanner.item, tag: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Texto do Botão CTA</label>
                  <input
                    type="text"
                    value={editingBanner.item.ctaText || ''}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        item: { ...editingBanner.item, ctaText: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL da Imagem</label>
                <input
                  type="url"
                  required
                  value={editingBanner.item.imageUrl}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      item: { ...editingBanner.item, imageUrl: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Destino ao Clicar</label>
                <select
                  value={editingBanner.item.targetPage || 'delivery'}
                  onChange={(e: any) =>
                    setEditingBanner({
                      ...editingBanner,
                      item: { ...editingBanner.item, targetPage: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="delivery">Página de Delivery</option>
                  <option value="services">Página de Serviços Gerais</option>
                  <option value="register">Modal de Cadastro / Anúncio</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Salvar Banner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/NEW RESTAURANT */}
      {editingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingRestaurant(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">
              {isNewRestaurant ? 'Cadastrar Novo Restaurante' : 'Editar Restaurante'}
            </h3>

            <form onSubmit={handleSaveRestaurant} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Estabelecimento *</label>
                <input
                  type="text"
                  required
                  value={editingRestaurant.name}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Categoria / Culinária *</label>
                  <input
                    type="text"
                    required
                    value={editingRestaurant.category}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp para Pedidos *</label>
                  <input
                    type="text"
                    required
                    value={editingRestaurant.whatsapp}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, whatsapp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tempo Médio</label>
                  <input
                    type="text"
                    value={editingRestaurant.deliveryTime}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, deliveryTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Taxa Entrega (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingRestaurant.deliveryFee}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, deliveryFee: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Avaliação</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingRestaurant.rating}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, rating: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Bairro em Ilhéus</label>
                  <input
                    type="text"
                    value={editingRestaurant.neighborhood}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, neighborhood: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={editingRestaurant.address}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL da Imagem da Logo</label>
                <input
                  type="url"
                  value={editingRestaurant.logoUrl}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, logoUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL da Imagem de Capa (Banner)</label>
                <input
                  type="url"
                  value={editingRestaurant.bannerUrl}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, bannerUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Salvar Restaurante
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANAGE RESTAURANT MENU */}
      {selectedRestForMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedRestForMenu(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">
              Cardápio de {selectedRestForMenu.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Adicione pratos, lanches e bebidas que estarão disponíveis para os clientes pedirem.
            </p>

            {/* Form to add dish */}
            <form onSubmit={handleAddDish} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 mb-4 shrink-0">
              <span className="text-xs font-bold text-amber-300 block">Adicionar Novo Item ao Cardápio</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nome do prato *"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  className="col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="Preço R$ *"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Categoria (ex: Burgers, Sobremesas)"
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="url"
                  placeholder="URL da Imagem do Prato"
                  value={newMenuItem.imageUrl}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, imageUrl: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <textarea
                rows={1}
                placeholder="Descrição dos ingredientes..."
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <button
                type="submit"
                className="py-1.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ml-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Prato
              </button>
            </form>

            {/* List of current dishes */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {selectedRestForMenu.menu.map((dish) => (
                <div
                  key={dish.id}
                  className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-white truncate block">{dish.name}</span>
                      <span className="text-slate-400 text-[11px] truncate block">{dish.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="font-bold text-amber-400">
                      R$ {dish.price.toFixed(2).replace('.', ',')}
                    </span>
                    <button
                      onClick={() => handleDeleteDish(dish.id)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/NEW PROFESSIONAL */}
      {editingProfessional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProfessional(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">
              {isNewProfessional ? 'Cadastrar Novo Profissional' : 'Editar Profissional'}
            </h3>

            <form onSubmit={handleSaveProfessional} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={editingProfessional.name}
                  onChange={(e) => setEditingProfessional({ ...editingProfessional, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Profissão / Título *</label>
                  <input
                    type="text"
                    required
                    value={editingProfessional.profession}
                    onChange={(e) => setEditingProfessional({ ...editingProfessional, profession: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp para Contato *</label>
                  <input
                    type="text"
                    required
                    value={editingProfessional.whatsapp}
                    onChange={(e) => setEditingProfessional({ ...editingProfessional, whatsapp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Anos de Exp.</label>
                  <input
                    type="number"
                    value={editingProfessional.experienceYears}
                    onChange={(e) => setEditingProfessional({ ...editingProfessional, experienceYears: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">A partir de (R$)</label>
                  <input
                    type="number"
                    value={editingProfessional.priceStartingAt || ''}
                    onChange={(e) => setEditingProfessional({ ...editingProfessional, priceStartingAt: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Avaliação</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingProfessional.rating}
                    onChange={(e) => setEditingProfessional({ ...editingProfessional, rating: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Biografia e Especialidades</label>
                <textarea
                  rows={2}
                  value={editingProfessional.bio}
                  onChange={(e) => setEditingProfessional({ ...editingProfessional, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL da Foto de Perfil</label>
                <input
                  type="url"
                  value={editingProfessional.avatarUrl}
                  onChange={(e) => setEditingProfessional({ ...editingProfessional, avatarUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={editingProfessional.isVerified}
                  onChange={(e) => setEditingProfessional({ ...editingProfessional, isVerified: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <label htmlFor="verified" className="text-xs text-slate-300 font-bold cursor-pointer">
                  Conceder Selo de Identidade Verificada
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Salvar Profissional
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/NEW NEWS */}
      {editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingNews(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">
              {isNewNews ? 'Publicar Nova Matéria' : 'Editar Notícia'}
            </h3>

            <form onSubmit={handleSaveNews} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Título da Notícia *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Categoria *</label>
                  <select
                    value={editingNews.category}
                    onChange={(e: any) => setEditingNews({ ...editingNews, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Cultura">Cultura</option>
                    <option value="Economia">Economia</option>
                    <option value="Turismo">Turismo</option>
                    <option value="Utilidade">Utilidade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Data / Horário</label>
                  <input
                    type="text"
                    value={editingNews.date}
                    onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Resumo / Conteúdo</label>
                <textarea
                  rows={3}
                  required
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL da Foto de Capa</label>
                <input
                  type="url"
                  required
                  value={editingNews.imageUrl}
                  onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Salvar Notícia
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
