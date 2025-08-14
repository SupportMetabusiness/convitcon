import db, { type TelegramSettings } from '~/server/database/db';

export default defineEventHandler(async (event) => {
    const method = event.method;

    try {
        if (method === 'GET') {
            const stmt = db.prepare('SELECT * FROM telegram_settings LIMIT 1');
            const settings = stmt.get() as TelegramSettings | undefined;

            return {
                success: true,
                data: settings ?? {
                    id: 0,
                    bot_token: '',
                    chat_id: ''
                }
            };
        }

        if (method === 'PUT') {
            const body = await readBody(event);

            const checkStmt = db.prepare('SELECT id FROM telegram_settings LIMIT 1');
            const existingSettings = checkStmt.get() as Pick<TelegramSettings, 'id'> | undefined;

            if (existingSettings) {
                const updateStmt = db.prepare(`
                    UPDATE telegram_settings
                    SET bot_token = ?, chat_id = ?
                    WHERE id = ?
                `);

                updateStmt.run(body.bot_token ?? '', body.chat_id ?? '', existingSettings.id);
            } else {
                const insertStmt = db.prepare(`
                    INSERT INTO telegram_settings (bot_token, chat_id)
                    VALUES (?, ?)
                `);

                insertStmt.run(body.bot_token ?? '', body.chat_id ?? '');
            }

            return {
                success: true,
                message: 'Lưu cấu hình Telegram thành công'
            };
        }

        throw createError({
            statusCode: 405,
            statusMessage: '???'
        });
    } catch {}
});
