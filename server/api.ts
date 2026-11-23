import type { IncomingMessage, ServerResponse } from "node:http";
import { db } from "./db.ts";
import { hashPassword, verifyPassword, createToken, verifyToken } from "./auth.ts";

// Rate limiting in-memory store for login attempts
const loginAttempts: Map<string, { count: number; resetAt: number }> = new Map();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (now > record.resetAt) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= 5;
}

function registerFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, resetAt: now + 10 * 60 * 1000 };
  record.count += 1;
  loginAttempts.set(ip, record);
}

function clearFailedAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// Helpers
async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 2 * 1024 * 1024) {
        // 2MB limit
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  });
  res.end(JSON.stringify(data));
}

function extractAuthToken(req: IncomingMessage): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  return null;
}

function generateOrderCode(): string {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const year = 2027;
  return `CD-${year}-${randomPart}`;
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;
  const method = req.method?.toUpperCase();
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

  if (!pathname.startsWith("/api/")) {
    return false;
  }

  try {
    // ----------------------------------------------------
    // AUTH ROUTES
    // ----------------------------------------------------
    if (pathname === "/api/auth/login" && method === "POST") {
      if (isRateLimited(ip)) {
        sendJson(res, 429, { error: "Muitas tentativas. Tente novamente em 10 minutos." });
        return true;
      }

      const body = await parseBody(req);
      const { username, password } = body;

      if (!username || !password) {
        sendJson(res, 400, { error: "Usuário e senha são obrigatórios." });
        return true;
      }

      const user = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username) as any;
      if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
        registerFailedAttempt(ip);
        sendJson(res, 401, { error: "Usuário ou senha incorretos." });
        return true;
      }

      clearFailedAttempts(ip);
      const token = createToken(user.id, user.username, user.role);

      sendJson(res, 200, {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      });
      return true;
    }

    if (pathname === "/api/auth/me" && method === "GET") {
      const token = extractAuthToken(req);
      const payload = token ? verifyToken(token) : null;
      if (!payload) {
        sendJson(res, 401, { error: "Não autenticado." });
        return true;
      }

      const user = db.prepare("SELECT id, username, name, role FROM admin_users WHERE id = ?").get(payload.userId);
      if (!user) {
        sendJson(res, 401, { error: "Usuário não encontrado." });
        return true;
      }

      sendJson(res, 200, { user });
      return true;
    }

    if (pathname === "/api/auth/change-password" && method === "POST") {
      const token = extractAuthToken(req);
      const payload = token ? verifyToken(token) : null;
      if (!payload) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const body = await parseBody(req);
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword || newPassword.length < 6) {
        sendJson(res, 400, { error: "Nova senha deve ter pelo menos 6 caracteres." });
        return true;
      }

      const user = db.prepare("SELECT * FROM admin_users WHERE id = ?").get(payload.userId) as any;
      if (!user || !verifyPassword(currentPassword, user.password_hash, user.salt)) {
        sendJson(res, 400, { error: "Senha atual incorreta." });
        return true;
      }

      const { hash, salt } = hashPassword(newPassword);
      db.prepare("UPDATE admin_users SET password_hash = ?, salt = ? WHERE id = ?").run(hash, salt, user.id);

      sendJson(res, 200, { message: "Senha alterada com sucesso!" });
      return true;
    }

    // ----------------------------------------------------
    // SETTINGS ROUTES
    // ----------------------------------------------------
    if (pathname === "/api/settings" && method === "GET") {
      const rows = db.prepare("SELECT key, value FROM settings").all() as any[];
      const settings: Record<string, string> = {};
      for (const row of rows) {
        settings[row.key] = row.value;
      }
      sendJson(res, 200, settings);
      return true;
    }

    if (pathname === "/api/settings" && method === "PUT") {
      const token = extractAuthToken(req);
      if (!token || !verifyToken(token)) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const body = await parseBody(req);
      const upsert = db.prepare(`
        INSERT INTO settings (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `);

      for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
          upsert.run(key, value);
        }
      }

      sendJson(res, 200, { message: "Configurações salvas com sucesso!" });
      return true;
    }

    // ----------------------------------------------------
    // PRODUCTS ROUTES
    // ----------------------------------------------------
    if (pathname === "/api/products" && method === "GET") {
      const isChristmas = url.searchParams.get("christmas");
      let query = "SELECT * FROM products WHERE is_active = 1";
      const params: any[] = [];

      if (isChristmas === "1" || isChristmas === "true") {
        query += " AND is_christmas = 1";
      }

      query += " ORDER BY type ASC, cm ASC";
      const products = db.prepare(query).all(...params);
      sendJson(res, 200, products);
      return true;
    }

    if (pathname === "/api/products/all" && method === "GET") {
      const token = extractAuthToken(req);
      if (!token || !verifyToken(token)) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const products = db.prepare("SELECT * FROM products ORDER BY is_active DESC, type ASC, cm ASC").all();
      sendJson(res, 200, products);
      return true;
    }

    if (pathname === "/api/products" && method === "POST") {
      const token = extractAuthToken(req);
      if (!token || !verifyToken(token)) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const b = await parseBody(req);
      if (!b.type || !b.cm || !b.price || !b.slices || !b.image) {
        sendJson(res, 400, { error: "Campos obrigatórios faltando." });
        return true;
      }

      const insert = db.prepare(`
        INSERT INTO products (type, cm, price, slices, image, title, description, category, is_active, is_christmas)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(
        b.type,
        Number(b.cm),
        Number(b.price),
        b.slices,
        b.image,
        b.title || `Bolo ${b.type === "round" ? "Redondo" : "Quadrado"} ${b.cm}cm`,
        b.description || "",
        b.category || "bolos",
        b.is_active !== undefined ? Number(b.is_active) : 1,
        b.is_christmas ? 1 : 0
      );

      sendJson(res, 201, { id: result.lastInsertRowid, message: "Produto cadastrado!" });
      return true;
    }

    if (pathname.startsWith("/api/products/") && method === "PUT") {
      const token = extractAuthToken(req);
      if (!token || !verifyToken(token)) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const id = Number(pathname.split("/")[3]);
      const b = await parseBody(req);

      const update = db.prepare(`
        UPDATE products SET
          type = COALESCE(?, type),
          cm = COALESCE(?, cm),
          price = COALESCE(?, price),
          slices = COALESCE(?, slices),
          image = COALESCE(?, image),
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          category = COALESCE(?, category),
          is_active = COALESCE(?, is_active),
          is_christmas = COALESCE(?, is_christmas),
          updated_at = datetime('now', 'localtime')
        WHERE id = ?
      `);

      update.run(
        b.type,
        b.cm ? Number(b.cm) : null,
        b.price ? Number(b.price) : null,
        b.slices,
        b.image,
        b.title,
        b.description,
        b.category,
        b.is_active !== undefined ? Number(b.is_active) : null,
        b.is_christmas !== undefined ? Number(b.is_christmas) : null,
        id
      );

      sendJson(res, 200, { message: "Produto atualizado com sucesso!" });
      return true;
    }

    if (pathname.startsWith("/api/products/") && method === "DELETE") {
      const token = extractAuthToken(req);
      if (!token || !verifyToken(token)) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const id = Number(pathname.split("/")[3]);
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      sendJson(res, 200, { message: "Produto removido!" });
      return true;
    }

    // ----------------------------------------------------
    // GALLERY ROUTES
    // ----------------------------------------------------
    if (pathname === "/api/gallery" && method === "GET") {
      const category = url.searchParams.get("category");
      let query = "SELECT * FROM gallery WHERE is_active = 1";
      const params: any[] = [];
      if (category && category !== "all") {
        query += " AND category = ?";
        params.push(category);
      }
      query += " ORDER BY id DESC";
      const items = db.prepare(query).all(...params);
      sendJson(res, 200, items);
      return true;
    }

    // ----------------------------------------------------
    // ORDERS ROUTES
    // ----------------------------------------------------
    // 1. Create order (public)
    if (pathname === "/api/orders" && method === "POST") {
      const b = await parseBody(req);
      const customer = b.customer || {};

      if (!customer.name || !customer.whatsapp || !customer.pickupDate) {
        sendJson(res, 400, { error: "Nome, WhatsApp e data de retirada são obrigatórios." });
        return true;
      }

      if (!b.size || !b.dough || !b.topping) {
        sendJson(res, 400, { error: "Tamanho, massa e cobertura devem ser selecionados." });
        return true;
      }

      const orderCode = generateOrderCode();
      const optionalsTotal = (b.optionals || []).reduce((sum: number, opt: any) => sum + (Number(opt.price) || 0), 0);
      const subtotal = Number(b.size.price) + optionalsTotal;
      const isChristmas = b.isChristmasOrder ? 1 : 0;
      const downPayment = isChristmas ? subtotal * 0.5 : 0;
      const remaining = isChristmas ? subtotal * 0.5 : subtotal;

      const insertOrder = db.prepare(`
        INSERT INTO orders (
          order_code, customer_name, customer_surname, customer_whatsapp, pickup_date,
          event_type, has_topper, theme_description, is_christmas,
          cake_type, cake_cm, cake_slices, cake_price,
          dough, fillings, topping, optionals,
          subtotal, down_payment, remaining, confirmed_price,
          payment_method, status, admin_notes
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, 'Aguardando análise', ''
        )
      `);

      const result = insertOrder.run(
        orderCode,
        customer.name.trim(),
        (customer.surname || "").trim(),
        customer.whatsapp.trim(),
        customer.pickupDate,
        customer.eventType || "Outros",
        customer.hasTopper || "não",
        customer.themeDescription || "",
        isChristmas,
        b.size.type || "round",
        Number(b.size.cm) || 20,
        b.size.slices || "",
        Number(b.size.price) || 0,
        b.dough,
        JSON.stringify(b.fillings || []),
        b.topping,
        JSON.stringify(b.optionals || []),
        subtotal,
        downPayment,
        remaining,
        subtotal, // Initial estimated confirmed price
        isChristmas ? "PIX (Entrada 50%)" : "A combinar na retirada"
      );

      const orderId = result.lastInsertRowid;

      // Record initial history
      db.prepare(`
        INSERT INTO order_history (order_id, previous_status, new_status, note)
        VALUES (?, NULL, 'Aguardando análise', 'Pedido registrado pelo cliente via site.')
      `).run(orderId);

      sendJson(res, 201, {
        orderId,
        orderCode,
        subtotal,
        downPayment,
        remaining,
        status: "Aguardando análise",
        message: "Solicitação de encomenda registrada com sucesso!",
      });
      return true;
    }

    // 2. Track order by code (public)
    if (pathname.startsWith("/api/orders/track/") && method === "GET") {
      const code = decodeURIComponent(pathname.split("/")[4] || "").trim().toUpperCase();
      if (!code) {
        sendJson(res, 400, { error: "Código do pedido não informado." });
        return true;
      }

      const order = db.prepare("SELECT * FROM orders WHERE order_code = ?").get(code) as any;
      if (!order) {
        sendJson(res, 404, { error: "Pedido não encontrado com este código." });
        return true;
      }

      const history = db.prepare("SELECT * FROM order_history WHERE order_id = ? ORDER BY id ASC").all(order.id);

      sendJson(res, 200, {
        order: {
          id: order.id,
          order_code: order.order_code,
          customer_name: order.customer_name,
          pickup_date: order.pickup_date,
          cake_type: order.cake_type,
          cake_cm: order.cake_cm,
          status: order.status,
          confirmed_price: order.confirmed_price,
          subtotal: order.subtotal,
          is_christmas: order.is_christmas,
          created_at: order.created_at,
        },
        history,
      });
      return true;
    }

    // 3. List orders (Admin)
    if (pathname === "/api/orders" && method === "GET") {
      const token = extractAuthToken(req);
      if (!token || !verifyToken(token)) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const statusFilter = url.searchParams.get("status");
      const search = url.searchParams.get("search");

      let query = "SELECT * FROM orders WHERE 1=1";
      const params: any[] = [];

      if (statusFilter && statusFilter !== "all") {
        query += " AND status = ?";
        params.push(statusFilter);
      }

      if (search) {
        query += " AND (order_code LIKE ? OR customer_name LIKE ? OR customer_whatsapp LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      query += " ORDER BY pickup_date ASC, id DESC";

      const orders = db.prepare(query).all(...params);
      sendJson(res, 200, orders);
      return true;
    }

    // 4. Get order details + history (Admin)
    if (pathname.startsWith("/api/orders/") && method === "GET") {
      const token = extractAuthToken(req);
      if (!token || !verifyToken(token)) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const id = Number(pathname.split("/")[3]);
      const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;
      if (!order) {
        sendJson(res, 404, { error: "Pedido não encontrado." });
        return true;
      }

      const history = db.prepare("SELECT * FROM order_history WHERE order_id = ? ORDER BY id ASC").all(id);
      sendJson(res, 200, { order, history });
      return true;
    }

    // 5. Update order status and details (Admin)
    if (pathname.startsWith("/api/orders/") && pathname.endsWith("/status") && method === "PATCH") {
      const token = extractAuthToken(req);
      if (!token || !verifyToken(token)) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const id = Number(pathname.split("/")[3]);
      const b = await parseBody(req);
      const currentOrder = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;

      if (!currentOrder) {
        sendJson(res, 404, { error: "Pedido não encontrado." });
        return true;
      }

      const newStatus = b.status || currentOrder.status;
      const note = b.note || `Status alterado para "${newStatus}".`;
      const confirmedPrice = b.confirmedPrice !== undefined ? Number(b.confirmedPrice) : currentOrder.confirmed_price;
      const paymentMethod = b.paymentMethod !== undefined ? b.paymentMethod : currentOrder.payment_method;
      const adminNotes = b.adminNotes !== undefined ? b.adminNotes : currentOrder.admin_notes;

      // Update order
      db.prepare(`
        UPDATE orders SET
          status = ?,
          confirmed_price = ?,
          payment_method = ?,
          admin_notes = ?,
          updated_at = datetime('now', 'localtime')
        WHERE id = ?
      `).run(newStatus, confirmedPrice, paymentMethod, adminNotes, id);

      // Record history
      db.prepare(`
        INSERT INTO order_history (order_id, previous_status, new_status, note)
        VALUES (?, ?, ?, ?)
      `).run(id, currentOrder.status, newStatus, note);

      sendJson(res, 200, { message: "Pedido atualizado com sucesso!" });
      return true;
    }

    // ----------------------------------------------------
    // METRICS / DASHBOARD ROUTE (Admin)
    // ----------------------------------------------------
    if (pathname === "/api/admin/metrics" && method === "GET") {
      const token = extractAuthToken(req);
      if (!token || !verifyToken(token)) {
        sendJson(res, 401, { error: "Acesso não autorizado." });
        return true;
      }

      const counts = db.prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Aguardando análise' THEN 1 ELSE 0 END) as pendingAnalysis,
          SUM(CASE WHEN status = 'Aguardando confirmação' THEN 1 ELSE 0 END) as pendingConfirmation,
          SUM(CASE WHEN status = 'Confirmado' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'Pagamento pendente' THEN 1 ELSE 0 END) as pendingPayment,
          SUM(CASE WHEN status = 'Em produção' THEN 1 ELSE 0 END) as inProduction,
          SUM(CASE WHEN status = 'Pronto para retirada' THEN 1 ELSE 0 END) as readyForPickup,
          SUM(CASE WHEN status = 'Finalizado' THEN 1 ELSE 0 END) as finalized,
          SUM(CASE WHEN status = 'Cancelado' THEN 1 ELSE 0 END) as cancelled,
          SUM(CASE WHEN status NOT IN ('Cancelado') THEN confirmed_price ELSE 0 END) as totalRevenueConfirmed,
          SUM(CASE WHEN status NOT IN ('Cancelado') THEN subtotal ELSE 0 END) as totalRevenueEstimated
        FROM orders
      `).get() as any;

      // Next 7 days upcoming orders
      const upcomingOrders = db.prepare(`
        SELECT id, order_code, customer_name, customer_whatsapp, pickup_date, cake_type, cake_cm, status, confirmed_price
        FROM orders
        WHERE pickup_date >= date('now', 'localtime')
          AND status NOT IN ('Finalizado', 'Cancelado')
        ORDER BY pickup_date ASC
        LIMIT 10
      `).all();

      // Orders by date for calendar view
      const calendarData = db.prepare(`
        SELECT pickup_date, count(*) as count, status
        FROM orders
        WHERE pickup_date IS NOT NULL
        GROUP BY pickup_date, status
      `).all();

      sendJson(res, 200, {
        metrics: counts || {},
        upcomingOrders: upcomingOrders || [],
        calendarData: calendarData || [],
      });
      return true;
    }

    // Unmatched API route
    sendJson(res, 404, { error: `Endpoint API não encontrado: ${pathname}` });
    return true;
  } catch (err: any) {
    console.error("API Error:", err);
    sendJson(res, 500, { error: "Erro interno no servidor." });
    return true;
  }
}
