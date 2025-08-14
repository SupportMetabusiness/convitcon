import db, { type Product } from '~/server/database/db';

export default defineEventHandler(async (event) => {
    const method = event.method;

    try {
        if (method === 'GET') {
            const stmt = db.prepare('SELECT * FROM product ORDER BY id DESC');
            const products = stmt.all() as Product[];

            return {
                success: true,
                data: products
            };
        }

        if (method === 'POST') {
            const body = (await readBody(event)) as any;

            const insertStmt = db.prepare(`
        INSERT INTO product (name, description, price, discount, care_instructions, images, stock, slug, sizes, product_type, variants, currency, reviews)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            const result = insertStmt.run(body.name ?? '', body.description ?? '', parseFloat(body.price?.toString() || '0'), parseInt(body.discount?.toString() || '0'), body.care_instructions ?? '', body.images ?? '[]', parseInt(body.stock?.toString() || '0'), body.slug ?? '', body.sizes ?? '[]', body.product_type ?? 'clothing', body.variants ?? '[]', body.currency ?? 'USD', body.reviews ?? '[]');

            return {
                success: true,
                message: 'Thêm sản phẩm thành công',
                data: { id: result.lastInsertRowid }
            };
        }

        if (method === 'PUT') {
            const body = (await readBody(event)) as any;

            if (!body.id) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'ID sản phẩm là bắt buộc'
                });
            }

            const updateStmt = db.prepare(`
        UPDATE product
        SET name = ?, description = ?, price = ?, discount = ?,
            care_instructions = ?, images = ?, stock = ?, slug = ?, sizes = ?, product_type = ?, variants = ?, currency = ?, reviews = ?
        WHERE id = ?
      `);

            const result = updateStmt.run(body.name ?? '', body.description ?? '', parseFloat(body.price?.toString() || '0'), parseInt(body.discount?.toString() || '0'), body.care_instructions ?? '', body.images ?? '[]', parseInt(body.stock?.toString() || '0'), body.slug ?? '', body.sizes ?? '[]', body.product_type ?? 'clothing', body.variants ?? '[]', body.currency ?? 'USD', body.reviews ?? '[]', body.id);

            if (result.changes === 0) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Không tìm thấy sản phẩm'
                });
            }

            return {
                success: true,
                message: 'Cập nhật sản phẩm thành công'
            };
        }

        if (method === 'DELETE') {
            const body = (await readBody(event)) as any;

            if (!body.id) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'ID sản phẩm là bắt buộc'
                });
            }

            const deleteStmt = db.prepare('DELETE FROM product WHERE id = ?');
            const result = deleteStmt.run(body.id);

            if (result.changes === 0) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Không tìm thấy sản phẩm'
                });
            }

            return {
                success: true,
                message: 'Xóa sản phẩm thành công'
            };
        }

        throw createError({
            statusCode: 405,
            statusMessage: 'Phương thức không được phép'
        });
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: (error as Error).message || 'Lỗi server'
        });
    }
});
