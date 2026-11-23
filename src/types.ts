import type { Product, ProductCategory, ProductOption, ProductSize } from "./data/products.ts";

export type { Product, ProductCategory, ProductOption, ProductSize };

export interface CartItemCustomization {
  size: ProductSize;
  dough?: string;
  fillings?: string[];
  topping?: string;
  optionals: ProductOption[];
  customText?: string;
  themeDescription?: string;
  referenceImageName?: string;
  referenceImagePreview?: string;
  hasTopper?: boolean;
  topperNotes?: string;
  topperImageName?: string;
  topperImagePreview?: string;
  desiredDate?: string;
  notes?: string;
}

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  category: ProductCategory;
  image: string;
  customization: CartItemCustomization;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderCheckoutData {
  customerName: string;
  customerPhone: string;
  deliveryType?: "retirada" | "entrega";
  address?: string;
  pickupDate: string;
  timePeriod: "manha" | "tarde";
  notes?: string;
}

// Backward-compatible types for existing components and constants
export type CakeType = "round" | "square" | "christmas" | "other";

export interface Cake {
  id?: number;
  type: CakeType;
  cm: number;
  price: number;
  slices: string;
  image: string;
  title?: string;
  description?: string;
  category?: string;
  is_active?: number;
  is_christmas?: number;
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
  topperNotes?: string;
  topperImageName?: string;
  topperImagePreview?: string;
  themeDescription?: string;
}

export type OrderStatus =
  | "Aguardando análise"
  | "Aguardando confirmação"
  | "Confirmado"
  | "Pagamento pendente"
  | "Em produção"
  | "Pronto para retirada"
  | "Finalizado"
  | "Cancelado";

export interface Order {
  id?: number;
  orderCode?: string;
  isChristmasOrder: boolean;
  size: Cake | null;
  dough: "Branca" | "Chocolate" | null;
  fillings: string[];
  topping: string | null;
  optionals: Optional[];
  customer: Customer;
  subtotal?: number;
  downPayment?: number;
  remaining?: number;
  confirmedPrice?: number;
  paymentMethod?: string;
  status?: OrderStatus;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderHistoryItem {
  id: number;
  order_id: number;
  previous_status: OrderStatus | null;
  new_status: OrderStatus;
  note: string;
  created_at: string;
}

export type GalleryCategory =
  | "all"
  | "infantil"
  | "casamento"
  | "elegantes"
  | "festas";

export interface GalleryItem {
  id?: number;
  src: string;
  category: GalleryCategory;
  alt: string;
  is_active?: number;
}

export interface ConfectionerySettings {
  store_name?: string;
  confectioner_name?: string;
  whatsapp_number?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  cep?: string;
  maps_url?: string;
  instagram_url?: string;
  pickup_hours?: string;
  payment_methods?: string;
  christmas_active?: string;
  christmas_title?: string;
  christmas_notice?: string;
  about_text?: string;
  [key: string]: string | undefined;
}

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface DashboardMetrics {
  total: number;
  pendingAnalysis: number;
  pendingConfirmation: number;
  confirmed: number;
  pendingPayment: number;
  inProduction: number;
  readyForPickup: number;
  finalized: number;
  cancelled: number;
  totalRevenueConfirmed: number;
  totalRevenueEstimated: number;
}
