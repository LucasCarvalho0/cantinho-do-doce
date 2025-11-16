import { Order } from "../types";
import { WHATSAPP_NUMBER } from "../constants";

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

export const generateWhatsAppMessage = (order: Order): string => {
  if (!order.size || !order.dough || !order.topping) return "";

  const subtotal =
    order.size.price + order.optionals.reduce((sum, opt) => sum + opt.price, 0);

  let message = `🍰 *NOVA ENCOMENDA - CANTINHO DO DOCE* 🍰\n\n`;
  message += `Olá! Sou *${order.customer.name} ${order.customer.surname}* e gostaria de confirmar uma encomenda.\n\n`;

  message += `*📋 DETALHES DO PEDIDO:*\n`;
  message += `• *Tipo:* ${
    order.isChristmasOrder ? "🎄 ENCOMENDA DE NATAL" : "📦 ENCOMENDA PADRÃO"
  }\n`;

  if (!order.isChristmasOrder && order.customer.eventType) {
    message += `• *Evento:* ${order.customer.eventType}\n`;
  }

  if (order.customer.hasTopper) {
    const topperText = order.customer.hasTopper === "sim" ? "✅ Sim" : "❌ Não";
    message += `• *Topo de Bolo:* ${topperText}\n`;
  }

  if (order.customer.themeDescription) {
    message += `• *Tema/Decoração:* ${order.customer.themeDescription}\n`;
  }

  message += `\n*🎂 BOLO ESCOLHIDO:*\n`;
  message += `• *Formato:* ${
    order.size.type === "round" ? "Redondo" : "Quadrado"
  } ${order.size.cm}cm\n`;
  message += `• *Fatias:* ${order.size.slices}\n`;
  message += `• *Preço base:* ${formatCurrency(order.size.price)}\n`;
  message += `• *Massa:* ${order.dough}\n`;
  message += `• *Recheios:* ${
    order.fillings.length > 0 ? order.fillings.join(" + ") : "Nenhum"
  }\n`;
  message += `• *Cobertura:* ${order.topping}\n`;

  if (order.optionals.length > 0) {
    const optionalText = order.optionals
      .map((opt) => `${opt.name} (${formatCurrency(opt.price)})`)
      .join(", ");
    message += `• *Opcionais:* ${optionalText}\n`;
  }

  message += `\n*💰 VALORES:*\n`;
  message += `• *Subtotal:* ${formatCurrency(subtotal)}\n`;

  if (order.isChristmasOrder) {
    const downPayment = subtotal * 0.5;
    const remaining = subtotal - downPayment;
    message += `• *Entrada (50%):* ${formatCurrency(downPayment)}\n`;
    message += `• *Restante:* ${formatCurrency(remaining)}\n`;
  }

  message += `\n*📅 DADOS PARA RETIRADA:*\n`;
  message += `• *Data de Retirada:* ${new Date(
    order.customer.pickupDate + "T12:00:00"
  ).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}\n`;
  message += `• *Contato WhatsApp:* ${order.customer.whatsapp}\n`;
  message += `• *Endereço de Retirada:* Rua Quatorze, 34 - Cidade Jardim Itatiaia, Itatiaia - RJ\n`;

  message += `\n*📍 LOCALIZAÇÃO:*\n`;
  message += `https://maps.google.com/?q=Rua+Quatorze,34,Cidade+Jardim+Itatiaia,Itatiaia,RJ\n`;

  if (order.isChristmasOrder) {
    message += `\n*🎄 OBSERVAÇÃO PARA NATAL:*\n`;
    message += `A encomenda só fica reservada após confirmação do pagamento da entrada de 50%. Aguardo instruções para pagamento. Obrigada!`;
  } else {
    message += `\n*💝 AGRADECIMENTO:*\n`;
    message += `Obrigada pela preferência! Seu bolo será feito com todo carinho e dedicação. Te aguardamos!`;
  }

  return message;
};

export const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, "_blank", "noopener,noreferrer");
};
