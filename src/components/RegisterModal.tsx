import { useState } from 'react';
import { X, CheckCircle, Store, Wrench, Send } from 'lucide-react';


interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [type, setType] = useState<'service' | 'restaurant'>('service');
  const [name, setName] = useState('');
  const [professionOrCategory, setProfessionOrCategory] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      type,
      name,
      professionOrCategory,
      whatsapp,
      neighborhood,
      description,
    };
    onSuccess(data);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-sky-600 to-cyan-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
            Cidade Digital Ilhéus
          </span>
          <h2 className="text-xl font-extrabold">Cadastre seu Negócio ou Serviço</h2>
          <p className="text-xs text-sky-100 mt-1">
            Receba clientes de Ilhéus todos os dias diretamente no seu WhatsApp!
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Cadastro Enviado com Sucesso!</h3>
            <p className="text-xs text-slate-600 mt-2 max-w-sm">
              Sua solicitação foi registrada no portal Ilhéus Connect. Nossa equipe entrará em contato para liberar o selo verificado.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Selection between Professional and Restaurant */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                O que você deseja cadastrar?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('service')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    type === 'service'
                      ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Wrench className="w-4 h-4 text-sky-600" />
                  Profissional Autônomo
                </button>
                <button
                  type="button"
                  onClick={() => setType('restaurant')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    type === 'restaurant'
                      ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-4 h-4 text-amber-600" />
                  Restaurante / Comércio
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {type === 'service' ? 'Seu Nome Completo' : 'Nome do Restaurante / Estabelecimento'} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'service' ? 'Ex: João Carlos Eletricista' : 'Ex: Pizzaria Gabriela'}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-hidden"
              />
            </div>

            {/* Profession / Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {type === 'service' ? 'Profissão / Especialidade' : 'Tipo de Culinária'} *
              </label>
              <input
                type="text"
                required
                value={professionOrCategory}
                onChange={(e) => setProfessionOrCategory(e.target.value)}
                placeholder={type === 'service' ? 'Ex: Eletricista Residencial, Pintor, Mecânico' : 'Ex: Lanches, Pizzas, Comida Baiana'}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-hidden"
              />
            </div>

            {/* WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(73) 99999-9999"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-hidden"
                />
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bairro / Região em Ilhéus *
                </label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Pontal, Centro, Malhado"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-hidden"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Breve Descrição dos Serviços ou Diferenciais
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte sobre sua experiência, serviços realizados, formas de pagamento aceitas..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Concluir Cadastro Grátis
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
