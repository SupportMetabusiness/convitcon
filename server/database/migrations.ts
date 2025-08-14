import db from './db';

// Migration script để tạo các bảng cần thiết
const migrations = [
    // Tạo bảng product_images nếu chưa có
    `
    CREATE TABLE IF NOT EXISTS product_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
    )
    `,

    // Tạo bảng product_variants nếu chưa có
    `
    CREATE TABLE IF NOT EXISTS product_variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        discount INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
    )
    `,

    // Thêm dữ liệu mẫu cho sản phẩm nếu chưa có
    `
    INSERT OR IGNORE INTO product (id, name, description, price, discount, stock, slug, currency)
    VALUES (34, 'Cotton Short Sleeve T-Shirt', 'Comfortable cotton t-shirt with short sleeves', 29.99, 15, 100, 'cotton-short-sleeve-tshirt', 'USD')
    `,

    // Thêm hình ảnh mẫu cho sản phẩm
    `
    INSERT OR IGNORE INTO product_images (product_id, image_url)
    VALUES (34, '/img/cotton_short.webp')
    `,

    // Thêm variants mẫu cho sản phẩm
    `
    INSERT OR IGNORE INTO product_variants (product_id, quantity, discount)
    VALUES
        (34, 1, 15),
        (34, 2, 20),
        (34, 3, 25),
        (34, 5, 30)
    `
];

// Chạy migrations
migrations.forEach((migration, index) => {
    try {
        db.exec(migration);
    } catch (error) {
        // Migration already exists or error, ignore
    }
});
