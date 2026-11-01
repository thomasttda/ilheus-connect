import { useState } from 'react';
import { Search, Star, Wrench, ShieldCheck, MapPin, MessageSquare, Plus } from 'lucide-react';
import type { Professional } from '../types';


interface ServicesPageProps {
  professionals: Professional[];
  onSelectProfessional: (professional: Professional) => void;
  onOpenRegister: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  professionals,
  onSelectProfessional,
  onOpenRegister,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos os Serviços' },
    { id: 'eletrica', label: '⚡ Eletricista' },
    { id: 'construcao', label: '🧱 Pedreiro / Obras' },
    { id: 'pintura', label: '🎨 Pintor' },
    { id: 'mecanica', label: '🔧 Mecânico' },
    { id: 'hidraulica', label: '🚰 Encanador' },
    { id: 'refrigera', label: '❄️ Ar Condicionado' },
  ];

  const filteredProfessionals = professionals.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.neighborhoods.some((n) => n.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || prof.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleQuickWhatsApp = (e: React.MouseEvent, prof: Professional) => {
    e.stopPropagation();
    const text = `Olá ${prof.name}! Vi seu perfil no app *Ilhéus Connect* (Serviços Gerais) e gostaria de fazer um orçamento para o serviço de ${prof.profession}.`;
    const url = `https://wa.me/${prof.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full space-y-5 pb-20">
      {/* Top Banner & Search */}
      <div className="bg-linear-to-r from-sky-600 via-sky-700 to-cyan-600 rounded-3xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-5 h-5 text-cyan-200" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-100">
            Guia de Profissionais
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">Serviços Gerais em Ilhéus</h2>
        <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-md">
          Eletricistas, pedreiros, mecânicos, pintores e técnicos de confiança com atendimento direto no seu bairro.
        </p>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por eletricista, pedreiro, mecânico, bairro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm shadow-md outline-hidden placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white shadow-sm scale-105'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-800">
          {filteredProfessionals.length} {filteredProfessionals.length === 1 ? 'profissional disponível' : 'profissionais disponíveis'}
        </h3>
        <button
          onClick={onOpenRegister}
          className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Meu Serviço
        </button>
      </div>

      {/* Professionals Grid */}
      {filteredProfessionals.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700">Nenhum profissional encontrado</h4>
          <p className="text-xs text-slate-500 mt-1">
            Experimente buscar por outra palavra-chave ou escolha outra categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProfessionals.map((prof) => (
            <div
              key={prof.id}
              onClick={() => onSelectProfessional(prof)}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 hover:border-sky-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Header Profile Info */}
                <div className="flex items-start gap-3">
                  <img
                    src={prof.avatarUrl}
                    alt={prof.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md truncate">
                        {prof.profession}
                      </span>
                      {prof.isVerified && (
                        <span title="Profissional Verificado">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900 group-hover:text-sky-700 transition-colors mt-0.5">
                      {prof.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {prof.rating} ({prof.reviewCount})
                      </span>
                      <span>•</span>
                      <span>{prof.experienceYears} anos exp.</span>
                    </div>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-600 line-clamp-2 mt-3 font-normal">
                  {prof.bio}
                </p>

                {/* Neighborhoods tags */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-[11px]">
                    {prof.neighborhoods.slice(0, 3).join(', ')}
                    {prof.neighborhoods.length > 3 ? '...' : ''}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectProfessional(prof)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors text-center"
                >
                  Ver Portfólio
                </button>
                <button
                  onClick={(e) => handleQuickWhatsApp(e, prof)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
