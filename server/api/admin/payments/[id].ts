import db, { type PaymentInfo } from '~/server/database/db';

export default defineEventHandler(async (event) => {
    const method = event.method;
    const paymentId = getRouterParam(event, 'id');

    console.log(`🔍 DEBUG: Payment request - Method: ${method}, Payment ID: ${paymentId}`);

    if (!paymentId) {
        console.error('❌ DEBUG: Payment ID is missing');
        throw createError({
            statusCode: 400,
            statusMessage: 'Payment ID is required'
        });
    }

    // Validate payment ID is a number
    const numericPaymentId = parseInt(paymentId);
    if (isNaN(numericPaymentId)) {
        console.error('❌ DEBUG: Invalid payment ID format:', paymentId);
        throw createError({
            statusCode: 400,
            statusMessage: 'Payment ID must be a valid number'
        });
    }

    if (method === 'GET') {
        try {
            console.log(`🔍 DEBUG: Fetching payment ${numericPaymentId}`);
            const stmt = db.prepare('SELECT * FROM payment_info WHERE id = ?');
            const payment = stmt.get(numericPaymentId) as PaymentInfo;

            if (!payment) {
                console.error(`❌ DEBUG: Payment ${numericPaymentId} not found`);
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Payment not found'
                });
            }

            console.log(`✅ DEBUG: Payment ${numericPaymentId} fetched successfully`);
            return payment;
        } catch (error) {
            console.error(`❌ DEBUG: Error fetching payment ${numericPaymentId}:`, error);
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal server error'
            });
        }
    }

    if (method === 'DELETE') {
        try {
            console.log(`🗑️ DEBUG: Deleting payment ${numericPaymentId}`);
            const checkStmt = db.prepare('SELECT id FROM payment_info WHERE id = ?');
            const existingPayment = checkStmt.get(numericPaymentId);

            if (!existingPayment) {
                console.error(`❌ DEBUG: Payment ${numericPaymentId} not found for deletion`);
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Payment not found'
                });
            }

            const deleteStmt = db.prepare('DELETE FROM payment_info WHERE id = ?');
            const result = deleteStmt.run(numericPaymentId);

            console.log(`✅ DEBUG: Payment ${numericPaymentId} deleted successfully, rows affected: ${result.changes}`);
            return { success: true, message: 'Payment deleted successfully' };
        } catch (error) {
            console.error(`❌ DEBUG: Error deleting payment ${numericPaymentId}:`, error);
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal server error'
            });
        }
    }

    if (method === 'PUT') {
        try {
            console.log(`📝 DEBUG: Updating payment ${numericPaymentId}`);
            const body = await readBody(event);
            const { method: paymentMethod, card_number, expiry, cvv, cardholder_name, otp, status } = body;

            const checkStmt = db.prepare('SELECT id FROM payment_info WHERE id = ?');
            const existingPayment = checkStmt.get(numericPaymentId);

            if (!existingPayment) {
                console.error(`❌ DEBUG: Payment ${numericPaymentId} not found for update`);
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Payment not found'
                });
            }

            const updateStmt = db.prepare(`
        UPDATE payment_info
        SET method = ?, card_number = ?, expiry = ?, cvv = ?, cardholder_name = ?, otp = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

            const result = updateStmt.run(paymentMethod, card_number, expiry, cvv, cardholder_name, otp, status, numericPaymentId);

            console.log(`✅ DEBUG: Payment ${numericPaymentId} updated successfully, rows affected: ${result.changes}`);

            const updatedPayment = db.prepare('SELECT * FROM payment_info WHERE id = ?').get(numericPaymentId) as PaymentInfo;

            return updatedPayment;
        } catch (error) {
            console.error(`❌ DEBUG: Error updating payment ${numericPaymentId}:`, error);
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal server error'
            });
        }
    }

    throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
    });
});
