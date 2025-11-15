
import { Order } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const generateWhatsAppMessage = (order: Order): string => {
  if (!order.size || !order.dough || !order.topping) return '';

  const subtotal = order.size.price + order.optionals.reduce((sum, opt) => sum + opt.price, 0);

  let message = `Olá, sou ${order.customer.name} e gostaria de confirmar uma encomenda.\n\n`;
  message += `*— Tipo:* ${order.isChristmasOrder ? 'ENCOMENDA DE NATAL' : 'ENCOMENDA PADRÃO'}\n`;
  if (!order.isChristmasOrder && order.customer.eventType) {
    message += `*— Evento:* ${order.customer.eventType}\n`;
  }
  
  if (order.customer.hasTopper) {
    const topperText = order.customer.hasTopper === 'sim' ? 'Sim' : 'Não';
    message += `*— Terá Topo de Bolo:* ${topperText}\n`;
  }
  if (order.customer.themeDescription) {
    message += `*— Tema/Decoração:* ${order.customer.themeDescription}\n`;
  }

  message += `*— Bolo:* ${order.size.type === 'round' ? 'Redondo' : 'Quadrado'} ${order.size.cm}cm (${order.size.slices})\n`;
  message += `*— Preço base:* ${formatCurrency(order.size.price)}\n`;
  message += `*— Massa:* ${order.dough}\n`;
  message += `*— Recheios:* ${order.fillings.length > 0 ? order.fillings.join(', ') : 'Nenhum'}\n`;
  message += `*— Cobertura:* ${order.topping}\n`;
  
  if (order.optionals.length > 0) {
    const optionalText = order.optionals.map(opt => `${opt.name} (${formatCurrency(opt.price)})`).join(', ');
    message += `*— Opcionais:* ${optionalText}\n`;
  }
  
  message += `*— Subtotal:* ${formatCurrency(subtotal)}\n`;

  if (order.isChristmasOrder) {
    const downPayment = subtotal * 0.5;
    const remaining = subtotal - downPayment;
    message += `*— Entrada (50%):* ${formatCurrency(downPayment)}\n`;
    message += `*— Restante:* ${formatCurrency(remaining)}\n`;
  }

  message += `*— Retirada em:* ${new Date(order.customer.pickupDate + 'T12:00:00').toLocaleDateString('pt-BR')}\n`;
  message += `*— Contato WhatsApp:* ${order.customer.whatsapp}\n\n`;

  if (order.isChristmasOrder) {
    message += `*Observação:* Aguardo instruções para pagamento da entrada. Obrigado!`;
  } else {
    message += `Obrigado!`;
  }

  return message;
};

export const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};