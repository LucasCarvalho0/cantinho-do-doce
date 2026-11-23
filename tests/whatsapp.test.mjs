import { test } from "node:test";
import assert from "node:assert/strict";
import { generateWhatsAppMessage, formatCurrency } from "../src/utils/whatsapp.ts";

test("WhatsApp Message Generator - Standard Order", () => {
  const order = {
    isChristmasOrder: false,
    size: {
      type: "round",
      cm: 20,
      price: 145,
      slices: "20-25 fatias",
      image: "/images/bolo_enfermagem_20cm.jpg",
    },
    dough: "Chocolate",
    fillings: ["Ninho", "Brigadeiro"],
    topping: "Ganache",
    optionals: [{ name: "Morango", price: 25 }],
    customer: {
      name: "Mariana",
      surname: "Silva",
      whatsapp: "(24) 99888-7766",
      pickupDate: "2027-05-15",
      eventType: "Aniversário Adulto",
      hasTopper: "sim",
      themeDescription: "Dourado e lilás",
    },
  };

  const message = generateWhatsAppMessage(order, undefined, "CD-2027-1001");

  assert.ok(message.includes("CD-2027-1001"), "Should include order code");
  assert.ok(message.includes("Mariana Silva"), "Should include customer name");
  assert.ok(message.includes("Chocolate"), "Should include selected dough");
  assert.ok(message.includes("Ninho + Brigadeiro"), "Should include selected fillings");
  assert.ok(message.includes("Morango"), "Should include optionals");
  assert.ok(message.includes("170,00"), "Subtotal should be 145 + 25 = 170");
  assert.ok(message.includes("IMPORTANTE"), "Should warn that order is pending confirmation");
});

test("WhatsApp Message Generator - Christmas Order with 50% down-payment", () => {
  const order = {
    isChristmasOrder: true,
    size: {
      type: "round",
      cm: 25,
      price: 205,
      slices: "30-35 fatias",
      image: "/images/bolo_morango_realista.jpg",
    },
    dough: "Branca",
    fillings: ["Creme Belga", "Doce de Leite"],
    topping: "Chantilly",
    optionals: [],
    customer: {
      name: "Carlos",
      surname: "Eduardo",
      whatsapp: "(24) 99111-2233",
      pickupDate: "2027-12-24",
      hasTopper: "não",
    },
  };

  const message = generateWhatsAppMessage(order, undefined, "CD-2027-9999");

  assert.ok(message.includes("Especial de Natal"), "Should state Christmas order");
  assert.ok(message.includes("Sinal de Reserva (50%)"), "Should calculate 50% entry");
  assert.ok(message.includes("102,50"), "50% of 205 is 102.50");
  assert.ok(message.includes("Restante na Retirada"), "Should calculate remaining balance");
});

test("Currency Formatter", () => {
  assert.strictEqual(formatCurrency(145), "R$\u00a0145,00");
  assert.strictEqual(formatCurrency(265.5), "R$\u00a0265,50");
});
