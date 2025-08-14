import { getTelegramConfig } from '~/server/utils/telegram';
import { getFullDeviceInfo } from '~/server/utils/device-info';
import axios from 'axios';

export default defineEventHandler(async (event: any) => {
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        });
    }

    try {
        const body = await readBody(event);
        const { product, quantity, selectedColor, selectedSize } = body;

        // Validate required fields
        if (!product || !quantity) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing required fields'
            });
        }

        // Get device and IP information
        const deviceInfo = await getFullDeviceInfo(event);

        // Get Telegram config
        const config = await getTelegramConfig();
        if (!config || !config.bot_token || !config.chat_id) {
            console.log('⚠️ Telegram config not found or incomplete');
            return {
                success: false,
                error: 'Telegram not configured'
            };
        }

        // Create message with device info
        let deviceInfoText = '';
        if (deviceInfo) {
            deviceInfoText = `

📱 <b>THÔNG TIN THIẾT BỊ & IP</b>
🌍 <b>IP:</b> <code>${deviceInfo.ip}</code>
📍 <b>Vị trí:</b> <code>${deviceInfo.location.city}, ${deviceInfo.location.region}, ${deviceInfo.location.countryName}</code>
🏢 <b>ISP:</b> <code>${deviceInfo.location.isp}</code>
💻 <b>Thiết bị:</b> <code>${deviceInfo.device.deviceType}</code>
🌐 <b>Trình duyệt:</b> <code>${deviceInfo.device.browser} ${deviceInfo.device.browserVersion}</code>
🖥️ <b>Hệ điều hành:</b> <code>${deviceInfo.device.os} ${deviceInfo.device.osVersion}</code>
📱 <b>Mobile:</b> <code>${deviceInfo.device.isMobile ? 'Có' : 'Không'}</code>
🕰️ <b>Timezone:</b> <code>${deviceInfo.location.timezone}</code>`;
        }

        const message = `
🛒 <b>SẢN PHẨM ĐƯỢC THÊM VÀO GIỎ HÀNG</b>

📦 <b>Tên sản phẩm:</b> <code>${product.name}</code>
💰 <b>Giá:</b> <code>${product.salePrice}€</code>
🔢 <b>Số lượng:</b> <code>${quantity}</code>
${selectedColor ? `🎨 <b>Màu sắc:</b> <code>${selectedColor}</code>` : ''}
${selectedSize ? `📏 <b>Kích thước:</b> <code>${selectedSize}</code>` : ''}
🕐 <b>Thời gian:</b> <code>${new Date().toLocaleString('vi-VN')}</code>${deviceInfoText}

🌐 <b>URL sản phẩm:</b> <code>http://160.30.44.174/product/${product.slug || product.id}</code>
        `.trim();

        const telegramUrl = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;

        try {
            await axios.post(
                telegramUrl,
                {
                    chat_id: config.chat_id,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Add to cart notification sent to Telegram');

            return {
                success: true,
                message: 'Notification sent successfully'
            };
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                console.error('❌ Telegram API error:', error.response?.data);
            } else {
                console.error('❌ Telegram API error:', error);
            }
            return {
                success: false,
                error: 'Failed to send Telegram notification'
            };
        }
    } catch (error) {
        console.error('🚨 Error sending add to cart notification:', error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
});
