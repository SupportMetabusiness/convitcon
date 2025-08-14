export default defineEventHandler(async (event) => {
    const method = getMethod(event);

    if (method === 'GET') {
        try {
            // Trả về cấu hình tracking mặc định
            // Trong thực tế, bạn có thể lưu trong database
            const defaultConfig = {
                facebook: {
                    pixelId: process.env.FACEBOOK_PIXEL_ID || '',
                    enabled: !!process.env.FACEBOOK_PIXEL_ID
                },
                google: {
                    gtag: process.env.GOOGLE_GTAG_ID || '',
                    enabled: !!process.env.GOOGLE_GTAG_ID
                },
                tiktok: {
                    pixelId: process.env.TIKTOK_PIXEL_ID || '',
                    enabled: !!process.env.TIKTOK_PIXEL_ID
                },
                snapchat: {
                    pixelId: process.env.SNAPCHAT_PIXEL_ID || '',
                    enabled: !!process.env.SNAPCHAT_PIXEL_ID
                },
                twitter: {
                    pixelId: process.env.TWITTER_PIXEL_ID || '',
                    enabled: !!process.env.TWITTER_PIXEL_ID
                }
            };

            return {
                success: true,
                data: defaultConfig
            };
        } catch (error) {
            console.error('Error fetching tracking config:', error);
            return {
                success: false,
                error: 'Failed to fetch tracking configuration'
            };
        }
    }

    if (method === 'POST') {
        try {
            const body = await readBody(event);
            const { config } = body;

            // Validate config structure
            if (!config || typeof config !== 'object') {
                return {
                    success: false,
                    error: 'Invalid configuration data'
                };
            }

            // Validate admin token
            const token = getCookie(event, 'admin-token');
            if (!token) {
                return {
                    success: false,
                    error: 'Unauthorized: Admin login required'
                };
            }

            // In a real application, you would save this to database
            // For now, we'll just return success
            console.log('Tracking config updated:', config);

            return {
                success: true,
                message: 'Tracking configuration updated successfully'
            };
        } catch (error) {
            console.error('Error updating tracking config:', error);
            return {
                success: false,
                error: 'Failed to update tracking configuration'
            };
        }
    }

    return {
        success: false,
        error: 'Method not allowed'
    };
});



