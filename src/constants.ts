import type { Cake, Optional, GalleryCategory } from "./types.ts";

export const WHATSAPP_NUMBER = "5524999679906";

export const ROUND_CAKES: Cake[] = [
  {
    type: "round",
    cm: 15,
    price: 110,
    slices: "10-15 fatias",
    image: "/images/bolo_rosas_30cm.jpg",
  },
  {
    type: "round",
    cm: 20,
    price: 145,
    slices: "20-25 fatias",
    image: "/images/bolo_enfermagem_20cm.jpg",
  },
  {
    type: "round",
    cm: 25,
    price: 185,
    slices: "30-35 fatias",
    image: "/images/bolo_oreo_25cm.jpg",
  },
  {
    type: "round",
    cm: 28,
    price: 220,
    slices: "40-45 fatias",
    image: "/images/bolo_vermelho_28cm.jpg",
  },
  {
    type: "round",
    cm: 30,
    price: 235,
    slices: "50-55 fatias",
    image: "/images/bolo_rosas_30cm_realista.jpg",
  },
];

export const SQUARE_CAKES: Cake[] = [
  {
    type: "square",
    cm: 20,
    price: 155,
    slices: "30 fatias",
    image: "/images/bolo_vasco_realista.jpg",
  },
  {
    type: "square",
    cm: 25,
    price: 200,
    slices: "45 fatias",
    image: "/images/bolo_brahma_30cm.jpg",
  },
  {
    type: "square",
    cm: 30,
    price: 265,
    slices: "60 fatias",
    image: "/images/bolo_morango_25cm.jpg",
  },
];

export const DOUGHS = ["Branca", "Chocolate"];

export const FILLINGS = [
  "Doce de Leite",
  "Brigadeiro",
  "Ninho",
  "Beijinho",
  "Paçoca",
  "Oreo",
  "Creme Belga",
  "Mousse de Maracujá",
  "Mousse de Limão",
];

export const TOPPINGS = ["Chantilly", "Ganache"];

export const OPTIONALS: Optional[] = [
  { name: "Nozes", price: 15 },
  { name: "Ameixa", price: 12 },
  { name: "Cereja", price: 12 },
  { name: "Creme Cheese", price: 20 },
  { name: "Morango", price: 25 },
  { name: "Abacaxi", price: 15 },
];

export const EVENT_TYPES = [
  "Casamento",
  "Aniversário Adulto",
  "Aniversário Infantil",
  "15 Anos",
  "Formatura",
  "Corporativo",
  "Outros",
];

export const GALLERY_ITEMS: {
  src: string;
  category: GalleryCategory;
  alt: string;
}[] = [
  {
    src: "/images/bolo_casamento_realista.jpg",
    category: "casamento",
    alt: "Bolo de casamento elegante com flores brancas",
  },
  {
    src: "/images/bolo_princesa_realista.jpg",
    category: "infantil",
    alt: "Bolo de aniversário infantil temático colorido",
  },
  {
    src: "/images/bolo_morango_realista.jpg",
    category: "elegantes",
    alt: "Bolo sofisticado para adultos com morangos",
  },
  {
    src: "/images/bolo_heineken_realista.jpg",
    category: "festas",
    alt: "Bolo festivo com confeitos coloridos e decorativo",
  },
  {
    src: "/images/bolo_casamento01_realista.jpg",
    category: "casamento",
    alt: "Bolo de casamento de múltiplos andares clássico",
  },
  {
    src: "/images/bolo_hulk.jpg",
    category: "infantil",
    alt: "Bolo de personagem Hulk para festa infantil",
  },
  {
    src: "/images/bolo_roxo_elegante.jpg",
    category: "elegantes",
    alt: "Bolo de design moderno para eventos adultos",
  },
  {
    src: "/images/bolo_amstel_realista.jpg",
    category: "festas",
    alt: "Bolo de comemoração corporativa elegante",
  },
  {
    src: "/images/Bolo_Moana_Realista_Profissional.jpg",
    category: "infantil",
    alt: "Bolo infantil com tema de super-heróis",
  },
  {
    src: "/images/Bolo_Branco_Flores_Profissional.jpg",
    category: "casamento",
    alt: "Bolo de noiva romântico com detalhes em pasta americana",
  },
  {
    src: "/images/Bolo_Rosa_Borboletas_Profissional.jpg",
    category: "elegantes",
    alt: "Bolo sofisticado para aniversário adulto",
  },
  {
    src: "/images/bolo_branco_dourado_festa.jpg",
    category: "festas",
    alt: "Bolo colorido para festa de aniversário",
  },
];
