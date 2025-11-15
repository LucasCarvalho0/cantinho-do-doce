import { Cake, Optional, GalleryCategory } from "./types";

export const WHATSAPP_NUMBER = "5524999679906"; // Substitua pelo número real com código do país

export const ROUND_CAKES: Cake[] = [
  {
    type: "round",
    cm: 15,
    price: 110,
    slices: "10-15 fatias",
    image: "/images/morango.png",
  },
  {
    type: "round",
    cm: 20,
    price: 145,
    slices: "20-25 fatias",
    image: "/images/20cm.jpg",
  },
  {
    type: "round",
    cm: 25,
    price: 185,
    slices: "30-35 fatias",
    image: "/images/25cm.jpg",
  },
  {
    type: "round",
    cm: 28,
    price: 220,
    slices: "40-45 fatias",
    image: "/images/28cm.jpg",
  },
  {
    type: "round",
    cm: 30,
    price: 235,
    slices: "50-55 fatias",
    image: "/images/30cm.jpg",
  },
];

export const SQUARE_CAKES: Cake[] = [
  {
    type: "square",
    cm: 20,
    price: 155,
    slices: "30 fatias",
    image: "/images/bolo-quadrado1.png",
  },
  {
    type: "square",
    cm: 25,
    price: 200,
    slices: "45 fatias",
    image: "/images/quadrado25cm.jpg",
  },
  {
    type: "square",
    cm: 30,
    price: 265,
    slices: "60 fatias",
    image: "/images/quadrado30cm.jpg",
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
  "Outros",
];

export const GALLERY_ITEMS: {
  src: string;
  category: GalleryCategory;
  alt: string;
}[] = [
  {
    src: "/images/casamento.png",
    category: "casamento",
    alt: "Bolo de casamento elegante com flores",
  },
  {
    src: "/images/infantil.png",
    category: "infantil",
    alt: "Bolo de aniversário infantil temático",
  },
  {
    src: "/images/morango.png",
    category: "elegantes",
    alt: "Bolo sofisticado para adultos",
  },
  {
    src: "/images/festa01.png",
    category: "festas",
    alt: "Bolo festivo com confeitos coloridos",
  },
  {
    src: "/images/casamento01.png",
    category: "casamento",
    alt: "Bolo de casamento de múltiplos andares",
  },
  {
    src: "/images/Hulk..png",
    category: "infantil",
    alt: "Bolo de personagem para festa infantil",
  },
  {
    src: "/images/elegante02.png.png",
    category: "elegantes",
    alt: "Bolo de design moderno para adultos",
  },
  {
    src: "/images/festa02.png",
    category: "festas",
    alt: "Bolo de comemoração corporativa",
  },
];
