import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

test("Database Schema & Order Status Transitions", () => {
  const db = new DatabaseSync(":memory:");

  // Create tables
  db.exec(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      cm INTEGER NOT NULL,
      price REAL NOT NULL,
      slices TEXT NOT NULL,
      image TEXT NOT NULL,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_whatsapp TEXT NOT NULL,
      pickup_date TEXT NOT NULL,
      subtotal REAL NOT NULL,
      confirmed_price REAL,
      status TEXT DEFAULT 'Aguardando análise'
    );

    CREATE TABLE order_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id),
      previous_status TEXT,
      new_status TEXT NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Insert product
  const insertProduct = db.prepare("INSERT INTO products (type, cm, price, slices, image) VALUES (?, ?, ?, ?, ?)");
  const pResult = insertProduct.run("round", 20, 145, "20-25 fatias", "/images/bolo_rosas_30cm.jpg");
  assert.strictEqual(pResult.lastInsertRowid, 1);

  // Insert order
  const insertOrder = db.prepare(`
    INSERT INTO orders (order_code, customer_name, customer_whatsapp, pickup_date, subtotal, confirmed_price, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Aguardando análise')
  `);
  const oResult = insertOrder.run("CD-2027-0101", "Luciana", "5524999998888", "2027-04-10", 145, 145);
  const orderId = oResult.lastInsertRowid;

  // Insert initial history
  db.prepare("INSERT INTO order_history (order_id, previous_status, new_status, note) VALUES (?, NULL, ?, ?)")
    .run(orderId, "Aguardando análise", "Pedido criado via site");

  // Transition to Confirmado
  db.prepare("UPDATE orders SET status = ?, confirmed_price = ? WHERE id = ?").run("Confirmado", 145, orderId);
  db.prepare("INSERT INTO order_history (order_id, previous_status, new_status, note) VALUES (?, ?, ?, ?)")
    .run(orderId, "Aguardando análise", "Confirmado", "Data aprovada pela Janaína");

  // Transition to Em produção
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run("Em produção", orderId);
  db.prepare("INSERT INTO order_history (order_id, previous_status, new_status, note) VALUES (?, ?, ?, ?)")
    .run(orderId, "Confirmado", "Em produção", "Bolo em preparação na cozinha");

  // Transition to Pronto para retirada
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run("Pronto para retirada", orderId);
  db.prepare("INSERT INTO order_history (order_id, previous_status, new_status, note) VALUES (?, ?, ?, ?)")
    .run(orderId, "Em produção", "Pronto para retirada", "Embalado e pronto para entrega");

  // Verify status & history count
  const updatedOrder = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  assert.strictEqual(updatedOrder.status, "Pronto para retirada");

  const history = db.prepare("SELECT * FROM order_history WHERE order_id = ? ORDER BY id ASC").all(orderId);
  assert.strictEqual(history.length, 4, "Should have 4 status history transitions recorded");
});

test("PWA Manifest Verification", () => {
  const manifestPath = path.resolve("./public/manifest.webmanifest");
  assert.ok(fs.existsSync(manifestPath), "Manifest file must exist in public/");

  const content = fs.readFileSync(manifestPath, "utf-8");
  const manifest = JSON.parse(content);

  assert.strictEqual(manifest.name, "Cantinho Doce - Janaína Mendes");
  assert.strictEqual(manifest.short_name, "Cantinho Doce");
  assert.strictEqual(manifest.display, "standalone");
  assert.strictEqual(manifest.start_url, "/");
  assert.ok(manifest.icons && manifest.icons.length >= 2, "Manifest must have at least 2 icon sizes");
  assert.ok(manifest.icons.some((i) => i.sizes === "192x192"), "Must include 192x192 icon");
  assert.ok(manifest.icons.some((i) => i.sizes === "512x512"), "Must include 512x512 icon");
});
