import { getTelegramConfig } from '~/server/utils/telegram';

export default defineEventHandler(async (event) => {
    try {
        // Kiểm tra cấu hình Telegram từ database
        const config = await getTelegramConfig();

        if (config && config.bot_token && config.chat_id) {
            return {
                configured: true,
                message: 'Telegram is configured'
            };
        } else {
            return {
                configured: false,
                message: 'Telegram bot token or chat ID not configured in database'
            };
        }
    } catch (error) {
        console.error('Error checking Telegram config:', error);
        return {
            configured: false,
            message: 'Error checking Telegram configuration',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
});
