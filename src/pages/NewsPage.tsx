import { useState } from 'react';
import { Newspaper, Calendar, MapPin, Share2, Sun } from 'lucide-react';
import type { NewsArticle } from '../data/storage';

interface NewsPageProps {
  news: NewsArticle[];
}

export const NewsPage = ({ news }: NewsPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas as Notícias' },
    { id: 'Cultura', label: '🎭 Cultura & Festivais' },
    { id: 'Economia', label: '💼 Economia & Negócios' },
    { id: 'Turismo', label: '🏖️ Turismo & Praias' },
    { id: 'Utilidade', label: '📢 Utilidade Pública' },
  ];

  const filteredNews =
    selectedCategory === 'all'
      ? news
      : news.filter((item) => item.category === selectedCategory);

  return (
    <div className="w-full space-y-5 pb-28">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-red-600 via-rose-600 to-orange-500 rounded-3xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Newspaper className="w-5 h-5 text-rose-200" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-100">
            Ilhéus News & Acontecimentos
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">Notícias da Cidade Digital</h2>
        <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-md">
          Fique por dentro de eventos culturais, turismo, economia e utilidades de Ilhéus em tempo real.
        </p>

        {/* Quick Weather / City Highlight Bar */}
        <div className="mt-4 p-3 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-300" />
            <span>Ilhéus hoje: 29°C Ensolarado</span>
          </div>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
            Costa do Cacau
          </span>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow-sm scale-105'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-rose-300 hover:shadow-lg transition-all group flex flex-col sm:flex-row"
          >
            <div className="relative sm:w-56 h-44 sm:h-auto overflow-hidden bg-slate-100 shrink-0">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                {item.category}
              </span>
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </span>
                  <span>•</span>
                  <span>{item.readTime}</span>
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Ilhéus, BA
                </span>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: item.title, text: item.summary, url: window.location.href });
                    } else {
                      alert('Link copiado!');
                    }
                  }}
                  className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors font-medium p-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
