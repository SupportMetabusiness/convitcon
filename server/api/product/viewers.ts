// API để tạo và cập nhật số người xem ảo
import db from '~/server/database/db';

// Lưu trữ số người xem hiện tại trong memory
const activeViewers = new Map<number, number>();
const lastUpdate = new Map<number, number>();

// Hàm tạo số người xem ngẫu nhiên realistic
const generateRealisticViewers = (baseCount: number, timeOfDay: number): number => {
    // Tạo pattern dựa trên giờ trong ngày
    let multiplier = 1;

    // Giờ cao điểm (9-11h, 14-16h, 19-22h)
    if ((timeOfDay >= 9 && timeOfDay <= 11) || (timeOfDay >= 14 && timeOfDay <= 16) || (timeOfDay >= 19 && timeOfDay <= 22)) {
        multiplier = 1.5 + Math.random() * 0.5; // 1.5x - 2x
    }
    // Giờ thấp điểm (1-6h)
    else if (timeOfDay >= 1 && timeOfDay <= 6) {
        multiplier = 0.3 + Math.random() * 0.3; // 0.3x - 0.6x
    }
    // Giờ bình thường
    else {
        multiplier = 0.8 + Math.random() * 0.4; // 0.8x - 1.2x
    }

    // Thêm biến động ngẫu nhiên
    const variation = Math.random() * 0.3 - 0.15; // ±15%
    const finalCount = Math.floor(baseCount * multiplier * (1 + variation));

    return Math.max(finalCount, 10); // Tối thiểu 10 người
};

// Hàm cập nhật số người xem theo thời gian thực
const updateViewersCount = (productId: number): number => {
    const now = Date.now();
    const currentHour = new Date().getHours();

    // Lấy số người xem hiện tại từ memory hoặc database
    let currentViewers = activeViewers.get(productId);
    const lastUpdateTime = lastUpdate.get(productId) || 0;

    if (!currentViewers || now - lastUpdateTime > 300000) {
        // 5 phút
        // Lấy từ database hoặc tạo mới
        const dbData = db
            .prepare(
                `
            SELECT viewers_count FROM product_views WHERE product_id = ?
        `
            )
            .get(productId);

        const baseCount = dbData ? dbData.viewers_count : Math.floor(Math.random() * 400) + 200;
        currentViewers = generateRealisticViewers(baseCount, currentHour);
    } else {
        // Cập nhật nhẹ (±1-5 người mỗi 10-30 giây)
        const timeDiff = now - lastUpdateTime;
        if (timeDiff > 10000) {
            // 10 giây
            const change = Math.floor(Math.random() * 10) - 4; // ±4 người
            currentViewers = Math.max(currentViewers + change, 10);
        }
    }

    // Lưu vào memory
    activeViewers.set(productId, currentViewers);
    lastUpdate.set(productId, now);

    // Cập nhật database thỉnh thoảng
    if (Math.random() < 0.1) {
        // 10% chance
        try {
            db.prepare(
                `
                INSERT OR REPLACE INTO product_views (product_id, viewers_count, last_updated)
                VALUES (?, ?, datetime('now'))
            `
            ).run(productId, currentViewers);
        } catch (error) {
            console.error('Error updating viewers in DB:', error);
        }
    }

    return currentViewers;
};

export default defineEventHandler(async (event) => {
    const method = getMethod(event);

    if (method === 'GET') {
        try {
            const query = getQuery(event);
            const productId = query.id ? Number(query.id) : 1;

            const viewersCount = updateViewersCount(productId);

            return {
                success: true,
                data: {
                    productId,
                    viewersCount,
                    timestamp: new Date().toISOString(),
                    isLive: true
                }
            };
        } catch (error: any) {
            console.error('❌ Error getting viewers:', error);
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

            if (action === 'join') {
                // Người dùng vào trang - tăng viewer
                const currentViewers = updateViewersCount(productId);
                const newCount = currentViewers + Math.floor(Math.random() * 3) + 1; // +1-3

                activeViewers.set(productId, newCount);
                lastUpdate.set(productId, Date.now());

                return {
                    success: true,
                    data: {
                        viewersCount: newCount,
                        message: 'Viewer joined'
                    }
                };
            }

            if (action === 'leave') {
                // Người dùng rời trang - giảm viewer
                const currentViewers = activeViewers.get(productId) || 0;
                const newCount = Math.max(currentViewers - Math.floor(Math.random() * 2) - 1, 10); // -1-2

                activeViewers.set(productId, newCount);
                lastUpdate.set(productId, Date.now());

                return {
                    success: true,
                    data: {
                        viewersCount: newCount,
                        message: 'Viewer left'
                    }
                };
            }

            return {
                success: false,
                error: 'Invalid action'
            };
        } catch (error: any) {
            console.error('❌ Error updating viewers:', error);
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

// Tự động cập nhật viewers mỗi 15-30 giây
setInterval(
    () => {
        for (const [productId] of activeViewers) {
            updateViewersCount(productId);
        }
    },
    Math.random() * 15000 + 15000
); // 15-30 giây




