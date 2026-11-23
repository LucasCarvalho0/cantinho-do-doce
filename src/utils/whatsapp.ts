import type { CartItem, OrderCheckoutData } from "../types.ts";

export const WHATSAPP_NUMBER = "5524999679906";

export const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

export const generateCartWhatsAppMessage = (
  items: CartItem[],
  checkout: OrderCheckoutData,
  total: number
): string => {
  let message = `🍰 *SOLICITAÇÃO DE ENCOMENDA — CANTINHO DOCE* 🍰\n`;
  message += `_Confeitaria Artesanal por Janaína Mendes_\n\n`;

  message += `Olá, Janaína! Meu nome é *${checkout.customerName}* e gostaria de solicitar a seguinte encomenda:\n\n`;

  message += `🛒 *ITENS DO PEDIDO (${items.length}):*\n`;
  message += `──────────────────────\n`;

  let hasReferenceImage = false;

  items.forEach((item, index) => {
    message += `*${index + 1}. ${item.name}* (Qtd: ${item.quantity}x)\n`;
    message += `• *Tamanho:* ${item.customization.size.name} (${item.customization.size.slices})\n`;

    if (item.customization.dough) {
      message += `• *Massa:* ${item.customization.dough}\n`;
    }

    if (item.customization.fillings && item.customization.fillings.length > 0) {
      message += `• *Recheios:* ${item.customization.fillings.join(" + ")}\n`;
    }

    if (item.customization.topping) {
      message += `• *Cobertura:* ${item.customization.topping}\n`;
    }

    if (item.customization.optionals && item.customization.optionals.length > 0) {
      const opts = item.customization.optionals
        .map((o) => `${o.name} (+${formatCurrency(o.price)})`)
        .join(", ");
      message += `• *Opcionais:* ${opts}\n`;
    }

    if (item.customization.themeDescription) {
      message += `• *Tema/Decoração:* ${item.customization.themeDescription}\n`;
    }

    if (item.customization.customText) {
      message += `• *Texto no Bolo:* "${item.customization.customText}"\n`;
    }

    if (item.customization.hasTopper) {
      hasReferenceImage = true;
      message += `• *Topo de Bolo:* Sim (Foto de referência enviada pelo cliente nesta conversa) 📸\n`;
      if (item.customization.topperNotes) {
        message += `  ↳ *Detalhes do Topo:* ${item.customization.topperNotes}\n`;
      }
    } else if (item.customization.hasTopper === false) {
      message += `• *Topo de Bolo:* Não (Sem topo de bolo)\n`;
    }

    if (item.customization.referenceImagePreview) {
      hasReferenceImage = true;
      message += `• *Foto de Referência:* [Anexada pelo cliente nesta conversa] 📸\n`;
    }

    if (item.customization.desiredDate) {
      message += `• *Data Desejada do Item:* ${item.customization.desiredDate}\n`;
    }

    if (item.customization.notes) {
      message += `• *Obs do Item:* ${item.customization.notes}\n`;
    }

    message += `• *Valor do Item:* ${formatCurrency(item.totalPrice)}\n\n`;
  });

  message += `──────────────────────\n`;
  message += `💰 *VALOR TOTAL ESTIMADO:* *${formatCurrency(total)}*\n\n`;

  message += `📋 *DADOS PARA RETIRADA / ENTREGA:*\n`;
  message += `• *Cliente:* ${checkout.customerName}\n`;
  message += `• *WhatsApp:* ${checkout.customerPhone}\n`;
  message += `• *Modalidade:* ${
    checkout.deliveryType === "entrega" ? "🚗 Entrega a Domicílio" : "📍 Retirada no Cantinho Doce"
  }\n`;

  if (checkout.deliveryType === "entrega" && checkout.address) {
    message += `• *Endereço de Entrega:* ${checkout.address}\n`;
  } else {
    message += `• *Local de Retirada:* Rua Quatorze, 34 - Cidade Jardim Itatiaia, Itatiaia - RJ\n`;
  }

  const formattedDate = new Date(checkout.pickupDate + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  message += `• *Data:* ${formattedDate}\n`;
  message += `• *Período Preferido:* ${checkout.timePeriod === "manha" ? "Manhã (09h às 12h)" : "Tarde (14h às 18h)"}\n`;

  if (checkout.notes) {
    message += `• *Observações Gerais:* ${checkout.notes}\n`;
  }

  if (hasReferenceImage) {
    message += `\n📸 *ATENÇÃO SOBRE A IMAGEM:* Enviei uma foto de referência aqui em anexo para ajudar a ilustrar o modelo desejado!\n`;
  }

  message += `\n⚠️ *IMPORTANTE:* _Compreendo que esta mensagem é uma solicitação inicial de encomenda e que a confirmação depende da verificação de disponibilidade da sua agenda e do valor final._\n\n`;
  message += `Aguardo seu retorno para combinarmos tudo com muito carinho! 💕`;

  return message;
};

export const openCartWhatsApp = (
  items: CartItem[],
  checkout: OrderCheckoutData,
  total: number
) => {
  const message = generateCartWhatsAppMessage(items, checkout, total);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const openWhatsApp = (customMessage?: string, phone = WHATSAPP_NUMBER) => {
  const defaultText = encodeURIComponent(
    "Olá Janaína, vim pelo site do Cantinho Doce e gostaria de tirar uma dúvida sobre encomendas!"
  );
  const text = customMessage ? encodeURIComponent(customMessage) : defaultText;
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
};

export const generateWhatsAppMessage = (
  orderOrText: any,
  _customer?: any,
  orderCode?: string
): string => {
  if (typeof orderOrText === "string") {
    return encodeURIComponent(orderOrText);
  }
  const order = orderOrText;
  const isChristmas = !!order?.isChristmasOrder;
  const basePrice = order?.size?.price || order?.cake?.price || 0;
  const optPrice = (order?.optionals || []).reduce((acc: number, o: any) => acc + (o.price || 0), 0);
  const total = order?.subtotal || (basePrice + optPrice);

  let msg = `🍰 *SOLICITAÇÃO DE ENCOMENDA — CANTINHO DOCE* 🍰\n`;
  if (orderCode) msg += `*Código do Pedido:* #${orderCode}\n`;
  if (isChristmas) msg += `🎄 *Especial de Natal & Fim de Ano 2027*\n`;
  msg += `\n`;

  if (order?.customer) {
    const fullName = `${order.customer.name || ""} ${order.customer.surname || ""}`.trim();
    msg += `*Cliente:* ${fullName}\n`;
    if (order.customer.whatsapp) msg += `*WhatsApp:* ${order.customer.whatsapp}\n`;
    if (order.customer.pickupDate) msg += `*Data de Retirada:* ${order.customer.pickupDate}\n`;
  }

  msg += `\n*DETALHES DO BOLO:*\n`;
  const sizeName = order?.size?.cm ? `${order.size.cm}cm` : order?.cake?.cm ? `${order.cake.cm}cm` : "";
  const slices = order?.size?.slices || order?.cake?.slices || "";
  msg += `• *Tamanho:* ${sizeName} (${slices})\n`;
  if (order?.dough) msg += `• *Massa:* ${order.dough}\n`;
  if (order?.fillings && order.fillings.length > 0) {
    msg += `• *Recheios:* ${order.fillings.join(" + ")}\n`;
  }
  if (order?.topping) msg += `• *Cobertura:* ${order.topping}\n`;
  if (order?.optionals && order.optionals.length > 0) {
    const optNames = order.optionals.map((o: any) => `${o.name} (+${formatCurrency(o.price)})`).join(", ");
    msg += `• *Opcionais:* ${optNames}\n`;
  }
  if (order?.customer?.hasTopper === "sim") {
    msg += `• *Topo de Bolo Personalizado:* Sim 🎂\n`;
    if (order.customer.topperNotes) {
      msg += `  ↳ *Detalhes do Topo:* ${order.customer.topperNotes}\n`;
    }
    if (order.customer.topperImageName) {
      msg += `  ↳ *Foto de Inspiração do Topo:* Anexada (${order.customer.topperImageName}) 📸\n`;
    }
  }
  if (order?.customer?.themeDescription) {
    msg += `• *Tema / Cores do Evento:* ${order.customer.themeDescription}\n`;
  }

  msg += `\n──────────────────────\n`;
  msg += `💰 *Subtotal:* ${formatCurrency(total)}\n`;

  if (isChristmas) {
    const downPayment = total * 0.5;
    const remaining = total - downPayment;
    msg += `💵 *Sinal de Reserva (50%):* ${formatCurrency(downPayment)}\n`;
    msg += `💵 *Restante na Retirada:* ${formatCurrency(remaining)}\n`;
  }

  msg += `\n⚠️ *IMPORTANTE:* Esta solicitação está sujeita à confirmação de disponibilidade da confeiteira Janaína Mendes.`;

  return msg;
};
