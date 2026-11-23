import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./auth.ts";

// Database storage directory
const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "cantinho.db");
export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance and concurrency
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Initialize Schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      cm INTEGER NOT NULL,
      price REAL NOT NULL,
      slices TEXT NOT NULL,
      image TEXT NOT NULL,
      title TEXT,
      description TEXT,
      category TEXT DEFAULT 'bolos',
      is_active INTEGER DEFAULT 1,
      is_christmas INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_surname TEXT NOT NULL,
      customer_whatsapp TEXT NOT NULL,
      pickup_date TEXT NOT NULL,
      event_type TEXT,
      has_topper TEXT,
      theme_description TEXT,
      is_christmas INTEGER DEFAULT 0,
      cake_type TEXT,
      cake_cm INTEGER,
      cake_slices TEXT,
      cake_price REAL,
      dough TEXT,
      fillings TEXT,
      topping TEXT,
      optionals TEXT,
      subtotal REAL NOT NULL,
      down_payment REAL DEFAULT 0,
      remaining REAL DEFAULT 0,
      confirmed_price REAL,
      payment_method TEXT DEFAULT 'PIX',
      status TEXT DEFAULT 'Aguardando análise',
      admin_notes TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS order_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      previous_status TEXT,
      new_status TEXT NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      src TEXT NOT NULL,
      category TEXT NOT NULL,
      alt TEXT NOT NULL,
      is_active INTEGER DEFAULT 1
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  // 1. Seed Admin User if none exists
  const existingAdmin = db.prepare("SELECT id FROM admin_users WHERE username = ?").get("janaina");
  if (!existingAdmin) {
    const { hash, salt } = hashPassword("cantinhodoce2027");
    const insertAdmin = db.prepare(
      "INSERT INTO admin_users (username, password_hash, salt, name, role) VALUES (?, ?, ?, ?, ?)"
    );
    insertAdmin.run("janaina", hash, salt, "Janaína Mendes", "admin");
    console.log(" seeded default admin: janaina");
  }

  // 2. Seed Settings
  const defaultSettings: Record<string, string> = {
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
    about_text: "O Cantinho Doce nasceu da paixão da confeiteira Janaína Mendes em transformar açúcar, farinha e dedicação em momentos inesquecíveis. Cada bolo é preparado de maneira 100% artesanal, com ingredientes selecionados, massas macias, recheios fartos e acabamento impecável para aniversários, casamentos, 15 anos e ocasiões especiais."
  };

  const getSetting = db.prepare("SELECT key FROM settings WHERE key = ?");
  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");

  for (const [key, value] of Object.entries(defaultSettings)) {
    if (!getSetting.get(key)) {
      insertSetting.run(key, value);
    }
  }

  // 3. Seed Products if empty
  const productCount = (db.prepare("SELECT count(*) as count FROM products").get() as any)?.count || 0;
  if (productCount === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (type, cm, price, slices, image, title, description, category, is_active, is_christmas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);

    // Real Round Cakes
    const roundCakes = [
      { cm: 15, price: 110, slices: "10-15 fatias", image: "/images/bolo_rosas_30cm.jpg", title: "Bolo Redondo 15cm", desc: "Perfeito para pequenas celebrações e aniversários íntimos." },
      { cm: 20, price: 145, slices: "20-25 fatias", image: "/images/bolo_enfermagem_20cm.jpg", title: "Bolo Redondo 20cm", desc: "Tamanho mais pedido para comemorações familiares e amigos." },
      { cm: 25, price: 185, slices: "30-35 fatias", image: "/images/bolo_oreo_25cm.jpg", title: "Bolo Redondo 25cm", desc: "Ideal para festas com bastante variedade de recheios saborosos." },
      { cm: 28, price: 220, slices: "40-45 fatias", image: "/images/bolo_vermelho_28cm.jpg", title: "Bolo Redondo 28cm", desc: "Excelente para eventos com até 45 convidados, estrutura perfeita." },
      { cm: 30, price: 235, slices: "50-55 fatias", image: "/images/bolo_rosas_30cm_realista.jpg", title: "Bolo Redondo 30cm", desc: "Grande destaque da mesa principal com acabamento nobre." },
    ];

    for (const c of roundCakes) {
      insertProduct.run("round", c.cm, c.price, c.slices, c.image, c.title, c.desc, "bolos", 0);
    }

    // Real Square Cakes
    const squareCakes = [
      { cm: 20, price: 155, slices: "30 fatias", image: "/images/bolo_vasco_realista.jpg", title: "Bolo Quadrado 20cm", desc: "Fácil de fatiar e servir, ótimo rendimento para festas." },
      { cm: 25, price: 200, slices: "45 fatias", image: "/images/bolo_brahma_30cm.jpg", title: "Bolo Quadrado 25cm", desc: "Estrutura retangular firme, ideal para temas corporativos e esportivos." },
      { cm: 30, price: 265, slices: "60 fatias", image: "/images/bolo_morango_25cm.jpg", title: "Bolo Quadrado 30cm", desc: "Maior rendimento para grandes comemorações e confraternizações." },
    ];

    for (const c of squareCakes) {
      insertProduct.run("square", c.cm, c.price, c.slices, c.image, c.title, c.desc, "bolos", 0);
    }

    // Christmas Special Cake offerings
    insertProduct.run("round", 20, 160, "20-25 fatias", "/images/bolo_vermelho_28cm.jpg", "Bolo Natalino Especial Redondo 20cm", "Decoração exclusiva de Natal com frutas vermelhas e laços festivos.", "natal", 1);
    insertProduct.run("round", 25, 205, "30-35 fatias", "/images/bolo_morango_realista.jpg", "Bolo Natalino Especial Redondo 25cm", "Massa fofinha, recheio especial natalino e cobertura temática comemorativa.", "natal", 1);
    insertProduct.run("square", 25, 220, "45 fatias", "/images/bolo_branco_dourado_festa.jpg", "Torta de Festa Natalina Quadrada 25cm", "Combinação perfeita para a ceia de Natal de toda a família.", "natal", 1);
  }

  // 4. Seed Gallery if empty
  const galleryCount = (db.prepare("SELECT count(*) as count FROM gallery").get() as any)?.count || 0;
  if (galleryCount === 0) {
    const insertGallery = db.prepare("INSERT INTO gallery (src, category, alt) VALUES (?, ?, ?)");
    const realGalleryItems = [
      { src: "/images/bolo_casamento_realista.jpg", category: "casamento", alt: "Bolo de casamento elegante com flores brancas artesanais" },
      { src: "/images/bolo_princesa_realista.jpg", category: "infantil", alt: "Bolo de aniversário infantil temático de princesa" },
      { src: "/images/bolo_morango_realista.jpg", category: "elegantes", alt: "Bolo sofisticado com cobertura de morangos frescos" },
      { src: "/images/bolo_heineken_realista.jpg", category: "festas", alt: "Bolo festivo temático decorado para comemorações" },
      { src: "/images/bolo_casamento01_realista.jpg", category: "casamento", alt: "Bolo de noiva clássico de múltiplos andares" },
      { src: "/images/bolo_hulk.jpg", category: "infantil", alt: "Bolo infantil temático de heróis com modelagem decorativa" },
      { src: "/images/bolo_roxo_elegante.jpg", category: "elegantes", alt: "Bolo contemporâneo em tons de roxo e lavanda com texturas" },
      { src: "/images/bolo_amstel_realista.jpg", category: "festas", alt: "Bolo comemorativo com detalhes artísticos artesanais" },
      { src: "/images/Bolo_Moana_Realista_Profissional.jpg", category: "infantil", alt: "Bolo infantil Moana decorado com riqueza de detalhes" },
      { src: "/images/Bolo_Branco_Flores_Profissional.jpg", category: "casamento", alt: "Bolo de casamento clássico com cascata de flores" },
      { src: "/images/Bolo_Rosa_Borboletas_Profissional.jpg", category: "elegantes", alt: "Bolo delicado rosa com borboletas e pérolas de açúcar" },
      { src: "/images/bolo_branco_dourado_festa.jpg", category: "festas", alt: "Bolo festa branco e dourado para comemoração especial" },
      { src: "/images/bolo_naked_frutas_realista.jpg", category: "elegantes", alt: "Bolo naked cake com frutas frescas da estação" },
      { src: "/images/bolo_homem_aranha_realista.jpg", category: "infantil", alt: "Bolo temático Homem Aranha para aniversário" }
    ];

    for (const item of realGalleryItems) {
      insertGallery.run(item.src, item.category, item.alt);
    }
  }
}

// Call initialization
initDatabase();
