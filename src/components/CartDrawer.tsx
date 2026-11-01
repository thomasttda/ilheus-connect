import { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag, MapPin } from 'lucide-react';
import type { CartItem } from '../types';


interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (menuItemId: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>('Pix');
  const [changeFor, setChangeFor] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 5.0 : 0;
  const total = subtotal + deliveryFee;

  const restaurantName = items[0]?.restaurantName || 'Restaurante';
  const restaurantWhatsapp = items[0]?.restaurantWhatsapp || '5573999990001';

  const handleSendToWhatsApp = () => {
    if (!address.trim()) {
      alert('Por favor, informe o seu endereço completo para entrega.');
      return;
    }

    let message = `🛵 *NOVO PEDIDO - ILHÉUS CONNECT*\n`;
    message += `🏪 *Estabelecimento:* ${restaurantName}\n\n`;
    message += `📋 *ITENS DO PEDIDO:*\n`;

    items.forEach((item) => {
      message += `• ${item.quantity}x ${item.menuItem.name} - R$ ${(item.menuItem.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
      if (item.notes) {
        message += `   _Obs: ${item.notes}_\n`;
      }
    });

    message += `\n💵 *Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    message += `🛵 *Taxa de Entrega:* R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
    message += `💰 *TOTAL A PAGAR:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;

    message += `📍 *ENDEREÇO DE ENTREGA:*\n${address} - Bairro: ${neighborhood}\n\n`;
    message += `💳 *FORMA DE PAGAMENTO:* ${paymentMethod}`;
    if (paymentMethod === 'Dinheiro' && changeFor) {
      message += ` (Troco para R$ ${changeFor})`;
    }

    message += `\n\n_Pedido gerado pelo Super App Ilhéus Connect._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${restaurantWhatsapp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-bold">Seu Carrinho</h2>
              <p className="text-[11px] text-slate-400">{restaurantName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors p-1"
                title="Limpar carrinho"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-700">Seu carrinho está vazio</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Escolha pratos deliciosos dos restaurantes locais de Ilhéus para começar seu pedido!
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Items list */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/70"
                >
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 truncate">
                      {item.menuItem.name}
                    </h4>
                    <span className="text-xs font-semibold text-sky-700">
                      R$ {(item.menuItem.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                      className="p-1 rounded text-slate-600 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1 min-w-[16px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                      className="p-1 rounded text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Details */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>Dados para Entrega em Ilhéus</span>
              </div>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Rua, número e complemento *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-sky-500 outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Bairro (ex: Pontal)"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-sky-500 outline-hidden"
                />
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-sky-500 outline-hidden bg-white"
                >
                  <option value="Pix">Pagar via Pix</option>
                  <option value="Cartão">Cartão (na entrega)</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              {paymentMethod === 'Dinheiro' && (
                <div>
                  <input
                    type="text"
                    placeholder="Precisa de troco para quanto? (ex: 100)"
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300"
                  />
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxa de Entrega</span>
                <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>Total</span>
                <span className="text-sky-700">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              Enviar Pedido no WhatsApp (1-Clique)
            </button>
            <p className="text-[10px] text-center text-slate-600 mt-2">
              Seu pedido é enviado formatado diretamente para a cozinha do restaurante. Sem taxas intermediárias!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
