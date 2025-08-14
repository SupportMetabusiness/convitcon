// API để lấy và cập nhật thống kê sản phẩm
import db from '~/server/database/db';

export default defineEventHandler(async (event) => {
    const method = getMethod(event);

    if (method === 'GET') {
        try {
            const query = getQuery(event);
            const productId = query.id ? Number(query.id) : 1;

            // Lấy thông tin views
            let viewsData: any = db
                .prepare(
                    `
                SELECT * FROM product_views WHERE product_id = ?
            `
                )
                .get(productId);

            // Nếu chưa có record thì tạo mới
            if (!viewsData) {
                const initialViewers = Math.floor(Math.random() * 500) + 100; // Random từ 100-599
                db.prepare(
                    `
                    INSERT INTO product_views (product_id, viewers_count, last_updated)
                    VALUES (?, ?, datetime('now'))
                `
                ).run(productId, initialViewers);

                viewsData = {
                    product_id: productId,
                    viewers_count: initialViewers,
                    last_updated: new Date().toISOString()
                };
            }

            // Lấy thông tin sale
            let salesData: any = db
                .prepare(
                    `
                SELECT * FROM product_sales WHERE product_id = ?
            `
                )
                .get(productId);

            // Nếu chưa có record thì tạo mới
            if (!salesData) {
                const stockLeft = Math.floor(Math.random() * 300) + 50; // Random từ 50-349
                const saleEndTime = new Date();
                saleEndTime.setHours(saleEndTime.getHours() + Math.floor(Math.random() * 12) + 1); // 1-12 giờ sau

                db.prepare(
                    `
                    INSERT INTO product_sales (product_id, stock_left, sale_end_time, is_hot, is_urgent)
                    VALUES (?, ?, ?, ?, ?)
                `
                ).run(productId, stockLeft, saleEndTime.toISOString(), 1, 1);

                salesData = {
                    product_id: productId,
                    stock_left: stockLeft,
                    sale_end_time: saleEndTime.toISOString(),
                    is_hot: 1,
                    is_urgent: 1
                };
            }

            return {
                success: true,
                data: {
                    views: viewsData,
                    sales: salesData,
                    stock: salesData.stock_left,
                    viewersCount: viewsData.viewers_count,
                    isHot: Boolean(salesData.is_hot),
                    isUrgent: Boolean(salesData.is_urgent),
                    saleEndTime: salesData.sale_end_time
                }
            };
        } catch (error: any) {
            console.error('❌ Error getting product stats:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    if (method === 'POST') {
        try {
            const body = await readBody(event);
            const { productId, action } = body;

            if (action === 'increment_view') {
                // Tăng số lượng người xem
                const currentTime = new Date().toISOString();

                // Kiểm tra xem đã có record chưa
                const existingViews = db
                    .prepare(
                        `
                    SELECT * FROM product_views WHERE product_id = ?
                `
                    )
                    .get(productId);

                if (existingViews) {
                    // Tăng thêm 1-3 người xem (random)
                    const increment = Math.floor(Math.random() * 3) + 1;
                    db.prepare(
                        `
                        UPDATE product_views
                        SET viewers_count = viewers_count + ?,
                            last_updated = ?
                        WHERE product_id = ?
                    `
                    ).run(increment, currentTime, productId);
                } else {
                    // Tạo mới với số lượng random
                    const initialViewers = Math.floor(Math.random() * 500) + 100;
                    db.prepare(
                        `
                        INSERT INTO product_views (product_id, viewers_count, last_updated)
                        VALUES (?, ?, ?)
                    `
                    ).run(productId, initialViewers, currentTime);
                }

                return {
                    success: true,
                    message: 'View count updated'
                };
            }

            if (action === 'decrease_stock') {
                // Giảm stock khi có người mua
                const decrease = Math.floor(Math.random() * 3) + 1; // Giảm 1-3

                db.prepare(
                    `
                    UPDATE product_sales
                    SET stock_left = CASE
                        WHEN stock_left - ? < 10 THEN 10
                        ELSE stock_left - ?
                    END
                    WHERE product_id = ?
                `
                ).run(decrease, decrease, productId);

                return {
                    success: true,
                    message: 'Stock updated'
                };
            }

            return {
                success: false,
                error: 'Invalid action'
            };
        } catch (error: any) {
            console.error('❌ Error updating product stats:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    return {
        success: false,
        error: 'Method not allowed'
    };
});
