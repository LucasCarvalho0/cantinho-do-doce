import {
  Cake,
  Order,
  OrderStatus,
  GalleryItem,
  ConfectionerySettings,
  AdminUser,
  DashboardMetrics,
} from "../types";
import { ROUND_CAKES, SQUARE_CAKES, GALLERY_ITEMS } from "../constants";

const TOKEN_KEY = "cantinho_admin_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro na requisição: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // ---------------- AUTH ----------------
  async login(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const data = await request<{ token: string; user: AdminUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  logout() {
    setStoredToken(null);
  },

  async getMe(): Promise<{ user: AdminUser } | null> {
    const token = getStoredToken();
    if (!token) return null;
    try {
      return await request<{ user: AdminUser }>("/api/auth/me");
    } catch {
      setStoredToken(null);
      return null;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return request("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // ---------------- SETTINGS ----------------
  async getSettings(): Promise<ConfectionerySettings> {
    try {
      return await request<ConfectionerySettings>("/api/settings");
    } catch (err) {
      console.warn("Could not load remote settings, using defaults.", err);
      return {
        store_name: "Cantinho Doce",
        confectioner_name: "Janaína Mendes",
        whatsapp_number: "5524999679906",
        address: "Rua Quatorze, nº 34",
        neighborhood: "Cidade Jardim Itatiaia",
        city: "Itatiaia - RJ",
        cep: "27580-000",
        maps_url: "https://maps.google.com/?q=Rua+Quatorze,34,Cidade+Jardim+Itatiaia,Itatiaia,RJ",
        instagram_url: "https://www.instagram.com/cakecantinho/",
        pickup_hours: "Segunda a Sábado: 09h às 19h | Domingo: 09h às 12h",
        payment_methods: "PIX, Cartão de Crédito/Débito e Dinheiro",
        christmas_active: "true",
        christmas_title: "Especial Encomendas de Natal 2027",
        christmas_notice: "Para encomendas de Natal, pedimos 50% de entrada no ato da confirmação para garantir a reserva de data.",
      };
    }
  },

  async updateSettings(settings: ConfectionerySettings): Promise<{ message: string }> {
    return request("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // ---------------- PRODUCTS ----------------
  async getProducts(isChristmas?: boolean): Promise<Cake[]> {
    try {
      const url = isChristmas ? "/api/products?christmas=1" : "/api/products";
      const products = await request<Cake[]>(url);
      if (products && products.length > 0) return products;
      throw new Error("No products returned");
    } catch (err) {
      console.warn("Could not load products from API, falling back to cached constants.", err);
      return [...ROUND_CAKES, ...SQUARE_CAKES];
    }
  },

  async getAllProductsAdmin(): Promise<Cake[]> {
    return request<Cake[]>("/api/products/all");
  },

  async createProduct(product: Partial<Cake>): Promise<{ id: number; message: string }> {
    return request("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  async updateProduct(id: number, product: Partial<Cake>): Promise<{ message: string }> {
    return request(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },

  async deleteProduct(id: number): Promise<{ message: string }> {
    return request(`/api/products/${id}`, {
      method: "DELETE",
    });
  },

  // ---------------- GALLERY ----------------
  async getGallery(category?: string): Promise<GalleryItem[]> {
    try {
      const url = category && category !== "all" ? `/api/gallery?category=${category}` : "/api/gallery";
      const items = await request<GalleryItem[]>(url);
      if (items && items.length > 0) return items;
      throw new Error("No gallery items");
    } catch {
      return GALLERY_ITEMS;
    }
  },

  // ---------------- ORDERS ----------------
  async createOrder(order: Order): Promise<{
    orderId: number;
    orderCode: string;
    subtotal: number;
    downPayment: number;
    remaining: number;
    status: OrderStatus;
    message: string;
  }> {
    return request("/api/orders", {
      method: "POST",
      body: JSON.stringify(order),
    });
  },

  async trackOrder(orderCode: string): Promise<{ order: any; history: any[] }> {
    return request(`/api/orders/track/${encodeURIComponent(orderCode)}`);
  },

  async getOrders(status?: string, search?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    return request(`/api/orders?${params.toString()}`);
  },

  async getOrderDetails(id: number): Promise<{ order: any; history: any[] }> {
    return request(`/api/orders/${id}`);
  },

  async updateOrderStatus(
    id: number,
    data: {
      status?: OrderStatus;
      note?: string;
      confirmedPrice?: number;
      paymentMethod?: string;
      adminNotes?: string;
    }
  ): Promise<{ message: string }> {
    return request(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // ---------------- DASHBOARD METRICS ----------------
  async getAdminMetrics(): Promise<{
    metrics: DashboardMetrics;
    upcomingOrders: any[];
    calendarData: any[];
  }> {
    return request("/api/admin/metrics");
  },
};
