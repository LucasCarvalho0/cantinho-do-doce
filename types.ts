export interface Cake {
  type: "round" | "square";
  cm: number;
  price: number;
  slices: string;
  image: string;
}

export interface Optional {
  name: string;
  price: number;
}

export interface Customer {
  name: string;
  surname: string;
  whatsapp: string;
  pickupDate: string;
  eventType?: string;
  hasTopper?: "sim" | "não";
  themeDescription?: string;
}

export interface Order {
  isChristmasOrder: boolean;
  size: Cake | null;
  dough: "Branca" | "Chocolate" | null;
  fillings: string[];
  topping: string | null;
  optionals: Optional[];
  customer: Customer;
}

export type GalleryCategory =
  | "all"
  | "infantil"
  | "casamento"
  | "elegantes"
  | "festas";
