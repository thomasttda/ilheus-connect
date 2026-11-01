import { X, Star, CheckCircle2, ShieldCheck, MapPin, Briefcase, MessageSquare, Phone, Award } from 'lucide-react';
import type { Professional } from '../types';


interface ProfessionalModalProps {
  professional: Professional | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfessionalModal: React.FC<ProfessionalModalProps> = ({
  professional,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !professional) return null;

  const handleWhatsApp = () => {
    const text = `Olá ${professional.name}! Encontrei seu perfil no app *Ilhéus Connect* (Serviços Gerais) e gostaria de solicitar um orçamento para o serviço de ${professional.profession}.`;
    const url = `https://wa.me/${professional.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${professional.phone}`, '_self');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Background */}
        <div className="bg-linear-to-r from-sky-600 via-sky-700 to-cyan-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={professional.avatarUrl}
              alt={professional.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/80 shadow-lg bg-slate-100 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base sm:text-xl font-bold truncate">
                  {professional.name}
                </span>
                {professional.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-white/25 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-cyan-300 fill-cyan-300" />
                    VERIFICADO
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-sky-100 mt-0.5 font-medium">
                {professional.profession}
              </p>
              <div className="flex items-center gap-3 text-xs mt-2 text-white/90">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {professional.rating} ({professional.reviewCount} avaliações)
                </span>
                <span>•</span>
                <span>{professional.experienceYears} anos de exp.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Metrics summary */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div>
              <span className="block text-xs font-bold text-slate-800">
                {professional.completedJobsCount}+
              </span>
              <span className="text-[10px] text-slate-500">Serviços Feitos</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="block text-xs font-bold text-emerald-600">
                100%
              </span>
              <span className="text-[10px] text-slate-500">Satisfação</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-sky-700">
                {professional.priceStartingAt ? `R$ ${professional.priceStartingAt}` : 'A Combinar'}
              </span>
              <span className="text-[10px] text-slate-500">A partir de</span>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-sky-600" />
              Sobre o Profissional
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {professional.bio}
            </p>
          </div>

          {/* Neighborhoods served */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-600" />
              Bairros e Regiões de Atendimento em Ilhéus
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {professional.neighborhoods.map((n, i) => (
                <span
                  key={i}
                  className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-lg font-medium"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio gallery */}
          {professional.portfolioImages.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" />
                Fotos de Trabalhos Realizados
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {professional.portfolioImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Trabalho ${idx + 1}`}
                    className="w-full h-28 object-cover rounded-xl border border-slate-200 hover:opacity-95 transition-opacity"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Trust badge */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-900 block">Profissional com Identidade Verificada</span>
              <span className="text-emerald-700">
                Cadastro validado pela plataforma Ilhéus Connect para sua segurança.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Contact Buttons */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          <button
            onClick={handleCall}
            className="p-3.5 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Fazer ligação comum"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            Chamar no WhatsApp (Orçamento Grátis)
          </button>
        </div>
      </div>
    </div>
  );
};
