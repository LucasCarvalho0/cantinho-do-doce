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
    const isChristmas = !!order.isChristmasOrder;
    const baseSubtotal = order.subtotal || order.size?.price || 0;
    const downPayment = isChristmas ? baseSubtotal * 0.5 : 0;
    const remaining = baseSubtotal - downPayment;
    const fallbackCode = `CD-2027-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const payload = {
        ...order,
        subtotal: baseSubtotal,
      };

      const res = await request<{
        orderId: number;
        orderCode: string;
        subtotal: number;
        downPayment: number;
        remaining: number;
        status: OrderStatus;
        message: string;
      }>("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res && res.orderCode) {
        try {
          const raw = localStorage.getItem("cantinho_saved_orders");
          const list = raw ? JSON.parse(raw) : [];
          list.unshift({ code: res.orderCode, ...order, createdAt: new Date().toISOString() });
          localStorage.setItem("cantinho_saved_orders", JSON.stringify(list.slice(0, 50)));
        } catch {}
        return res;
      }
    } catch (err) {
      console.warn("Backend request skipped or static host (Vercel). Using client resilient order:", err);
    }

    // Always succeed locally so customer is NEVER blocked from ordering via WhatsApp
    const fallbackResult = {
      orderId: Date.now(),
      orderCode: fallbackCode,
      subtotal: baseSubtotal,
      downPayment,
      remaining,
      status: "Pendente" as OrderStatus,
      message: "Solicitação gerada com sucesso",
    };

    try {
      const raw = localStorage.getItem("cantinho_saved_orders");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({ code: fallbackCode, ...order, orderCode: fallbackCode, createdAt: new Date().toISOString() });
      localStorage.setItem("cantinho_saved_orders", JSON.stringify(list.slice(0, 50)));
    } catch {}

    return fallbackResult;
  },

  async trackOrder(orderCode: string): Promise<{ order: any; history: any[] }> {
    try {
      return await request(`/api/orders/track/${encodeURIComponent(orderCode)}`);
    } catch {
      // Local storage fallback for tracking
      try {
        const raw = localStorage.getItem("cantinho_saved_orders");
        if (raw) {
          const list = JSON.parse(raw);
          const found = list.find((o: any) => o.code === orderCode || o.orderCode === orderCode);
          if (found) {
            return {
              order: {
                id: found.id || 1,
                order_code: found.code || found.orderCode,
                customer_name: `${found.customer?.name || ""} ${found.customer?.surname || ""}`.trim(),
                customer_whatsapp: found.customer?.whatsapp || "",
                pickup_date: found.customer?.pickupDate || "",
                cake_type: found.size?.slices || "Bolo Personalizado",
                dough: found.dough || "",
                fillings: found.fillings?.join(", ") || "",
                topping: found.topping || "",
                subtotal: found.subtotal || 0,
                down_payment: found.downPayment || 0,
                remaining_payment: found.remaining || found.subtotal || 0,
                status: "Pendente",
                created_at: found.createdAt || new Date().toISOString(),
              },
              history: [
                {
                  id: 1,
                  order_id: 1,
                  previous_status: null,
                  new_status: "Pendente",
                  note: "Solicitação enviada para o WhatsApp da confeiteira",
                  created_at: found.createdAt || new Date().toISOString(),
                },
              ],
            };
          }
        }
      } catch {}
      throw new Error("Pedido não encontrado");
    }
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
