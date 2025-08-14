import { getTelegramConfig } from '~/server/utils/telegram';

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        });
    }

    try {
        console.log('🧪 DEBUG: Starting detailed Telegram test...');

        // Kiểm tra cấu hình Telegram
        const config = await getTelegramConfig();
        console.log('📋 DEBUG: Telegram config:', config);

        if (!config || !config.bot_token || !config.chat_id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Telegram configuration not found or incomplete'
            });
        }

        // Test bot token bằng cách gọi getMe API
        console.log('🔍 DEBUG: Testing bot token...');
        const botInfoResponse = await fetch(`https://api.telegram.org/bot${config.bot_token}/getMe`);

        if (!botInfoResponse.ok) {
            const botError = await botInfoResponse.json();
            console.error('❌ DEBUG: Bot token test failed:', botError);
            throw createError({
                statusCode: 400,
                statusMessage: `Invalid bot token: ${botError.description || 'Unknown error'}`
            });
        }

        const botInfo = await botInfoResponse.json();
        console.log('✅ DEBUG: Bot info:', botInfo);

        // Test chat_id bằng cách gửi message test
        console.log('📱 DEBUG: Testing chat_id...');
        const testMessage = `
🧪 <b>TELEGRAM BOT TEST</b>

✅ <b>Bot Name:</b> <code>${botInfo.result.first_name}</code>
🆔 <b>Bot Username:</b> <code>@${botInfo.result.username}</code>
💬 <b>Chat ID:</b> <code>${config.chat_id}</code>
🕐 <b>Test Time:</b> <code>${new Date().toLocaleString('vi-VN')}</code>

🎉 <b>Test successful!</b> Your Telegram bot is working correctly.
        `.trim();

        const telegramUrl = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: config.chat_id,
                text: testMessage,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ DEBUG: Send message failed:', errorData);

            let errorMessage = 'Failed to send test message';
            if (errorData.error_code === 400) {
                errorMessage = 'Bad Request - Check chat_id format';
            } else if (errorData.error_code === 401) {
                errorMessage = 'Unauthorized - Check bot_token';
            } else if (errorData.error_code === 403) {
                errorMessage = 'Forbidden - Bot may be blocked by user or not added to chat';
            } else if (errorData.error_code === 404) {
                errorMessage = 'Not Found - Check chat_id';
            }

            throw createError({
                statusCode: 400,
                statusMessage: errorMessage
            });
        }

        const result = await response.json();
        console.log('✅ DEBUG: Test message sent successfully:', result);

        return {
            success: true,
            message: 'Test Telegram notification sent successfully!',
            botInfo: {
                name: botInfo.result.first_name,
                username: botInfo.result.username,
                chatId: config.chat_id
            }
        };
    } catch (error: any) {
        console.error('🚨 DEBUG: Error in detailed test Telegram API:', error);

        if (error.statusCode === 400) {
            throw createError({
                statusCode: 400,
                statusMessage: error.statusMessage || 'Telegram configuration error'
            });
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to test Telegram notification. Please check your configuration.'
        });
    }
});
