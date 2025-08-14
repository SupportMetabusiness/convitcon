import { getFullDeviceInfo } from '~/server/utils/device-info';

export default defineEventHandler(async (event) => {
    try {
        const deviceInfo = await getFullDeviceInfo(event);
        
        console.log('✅ DEBUG: Device info collected:', deviceInfo);
        
        return {
            success: true,
            data: deviceInfo
        };

    } catch (error) {
        console.error('🚨 DEBUG: Device info error:', error);
        
        return {
            success: false,
            error: 'Failed to get device info',
            data: {
                ip: '127.0.0.1',
                location: {
                    country: 'VN',
                    countryName: 'Viet Nam',
                    city: 'Unknown',
                    region: 'Unknown',
                    timezone: 'Asia/Ho_Chi_Minh',
                    isp: 'Unknown'
                },
                device: {
                    browser: 'Unknown',
                    browserVersion: 'Unknown',
                    os: 'Unknown',
                    osVersion: 'Unknown',
                    deviceType: 'Desktop',
                    isMobile: false,
                    userAgent: ''
                },
                headers: {
                    userAgent: '',
                    acceptLanguage: '',
                    referer: ''
                },
                timestamp: new Date().toISOString()
            }
        };
    }
});


