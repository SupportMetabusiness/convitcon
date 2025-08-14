export default defineEventHandler(async (event) => {
    if (getMethod(event) !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        });
    }

    try {
        const body = await readBody(event);
        const { bot_token, chat_id } = body;

        if (!bot_token || !chat_id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bot token and chat ID are required'
            });
        }

        // Import database
        const db = await import('~/server/database/db').then((m) => m.default);

        // Insert or update telegram settings
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO telegram_settings (id, bot_token, chat_id)
            VALUES (1, ?, ?)
        `);

        stmt.run(bot_token, chat_id);

        return {
            success: true,
            message: 'Telegram configuration updated successfully'
        };
    } catch (error: any) {
        console.error('Error setting up Telegram:', error);

        if (error.statusCode) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        });
    }
});
