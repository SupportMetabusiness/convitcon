// Utility functions to get device and IP information

interface DeviceInfo {
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    deviceType: string;
    isMobile: boolean;
    userAgent: string;
}

interface LocationInfo {
    country: string;
    countryName: string;
    city: string;
    region: string;
    timezone: string;
    isp: string;
}

interface FullDeviceInfo {
    ip: string;
    location: LocationInfo;
    device: DeviceInfo;
    headers: {
        userAgent: string;
        acceptLanguage: string;
        referer: string;
    };
    timestamp: string;
}

// Get client IP from event
export const getClientIPFromEvent = (event: any): string => {
    const forwarded = getHeader(event, 'x-forwarded-for');
    const realIp = getHeader(event, 'x-real-ip');
    const socketIp = event.node.req.socket?.remoteAddress;

    // Parse x-forwarded-for if it exists (may contain multiple IPs)
    if (forwarded) {
        const ips = forwarded.split(',').map((ip: string) => ip.trim());
        return ips[0]; // Return the first IP
    }

    return realIp || socketIp || '127.0.0.1';
};

// Parse User Agent for device info
export const parseUserAgent = (userAgent: string): DeviceInfo => {
    const ua = userAgent.toLowerCase();

    // Detect browser
    let browser = 'Unknown';
    let browserVersion = 'Unknown';

    if (ua.includes('chrome/') && !ua.includes('edg/')) {
        browser = 'Chrome';
        const match = ua.match(/chrome\/([0-9.]+)/);
        browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('firefox/')) {
        browser = 'Firefox';
        const match = ua.match(/firefox\/([0-9.]+)/);
        browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
        browser = 'Safari';
        const match = ua.match(/version\/([0-9.]+)/);
        browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('edg/')) {
        browser = 'Edge';
        const match = ua.match(/edg\/([0-9.]+)/);
        browserVersion = match ? match[1] : 'Unknown';
    }

    // Detect OS
    let os = 'Unknown';
    let osVersion = 'Unknown';

    if (ua.includes('windows nt')) {
        os = 'Windows';
        const match = ua.match(/windows nt ([0-9.]+)/);
        if (match) {
            const version = match[1];
            switch (version) {
                case '10.0':
                    osVersion = '10/11';
                    break;
                case '6.3':
                    osVersion = '8.1';
                    break;
                case '6.2':
                    osVersion = '8';
                    break;
                case '6.1':
                    osVersion = '7';
                    break;
                default:
                    osVersion = version;
            }
        }
    } else if (ua.includes('mac os x')) {
        os = 'macOS';
        const match = ua.match(/mac os x ([0-9_]+)/);
        osVersion = match ? match[1].replace(/_/g, '.') : 'Unknown';
    } else if (ua.includes('linux')) {
        os = 'Linux';
    } else if (ua.includes('android')) {
        os = 'Android';
        const match = ua.match(/android ([0-9.]+)/);
        osVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
        os = ua.includes('ipad') ? 'iPadOS' : 'iOS';
        const match = ua.match(/os ([0-9_]+)/);
        osVersion = match ? match[1].replace(/_/g, '.') : 'Unknown';
    }

    // Detect device type
    const isMobile = /mobile|android|iphone|ipad|phone|tablet/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);

    let deviceType = 'Desktop';
    if (isTablet) {
        deviceType = 'Tablet';
    } else if (isMobile) {
        deviceType = 'Mobile';
    }

    return {
        browser,
        browserVersion,
        os,
        osVersion,
        deviceType,
        isMobile,
        userAgent
    };
};

// Get location info from IP
export const getLocationFromIP = async (ip: string): Promise<LocationInfo> => {
    // Default data for localhost/development
    const defaultLocation: LocationInfo = {
        country: 'VN',
        countryName: 'Viet Nam',
        city: 'Ho Chi Minh City',
        region: 'Ho Chi Minh',
        timezone: 'Asia/Ho_Chi_Minh',
        isp: 'Local Network'
    };

    // For localhost/development, return default
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return defaultLocation;
    }

    try {
        const geoResponse = (await $fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,timezone,isp,query`)) as any;

        if (geoResponse.status === 'success') {
            return {
                country: geoResponse.countryCode || 'VN',
                countryName: geoResponse.country || 'Viet Nam',
                city: geoResponse.city || 'Unknown',
                region: geoResponse.regionName || 'Unknown',
                timezone: geoResponse.timezone || 'Asia/Ho_Chi_Minh',
                isp: geoResponse.isp || 'Unknown'
            };
        }
    } catch (error) {
        console.warn('⚠️ Geolocation API failed:', error);
    }

    return defaultLocation;
};

// Get full device info from event
export const getFullDeviceInfo = async (event: any): Promise<FullDeviceInfo> => {
    try {
        const ip = getClientIPFromEvent(event);
        const userAgent = getHeader(event, 'user-agent') || '';
        const acceptLanguage = getHeader(event, 'accept-language') || '';
        const referer = getHeader(event, 'referer') || '';

        const deviceInfo = parseUserAgent(userAgent);
        const locationInfo = await getLocationFromIP(ip);

        return {
            ip,
            location: locationInfo,
            device: deviceInfo,
            headers: {
                userAgent,
                acceptLanguage,
                referer
            },
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('🚨 Error getting device info:', error);

        // Return default data on error
        return {
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
        };
    }
};
