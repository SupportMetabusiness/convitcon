/**
 * API endpoint để lấy thông tin địa lý từ IP
 */

interface GeoLocation {
    country_code: string;
    country: string;
    city: string;
    region: string;
    latitude: string;
    longitude: string;
    timezone: string;
    ip: string;
}

interface GeolocationResponse {
    success: boolean;
    data?: {
        ip: string;
        country: string;
        countryName: string;
        language: string;
    };
    error?: string;
}

/**
 * Mapping từ mã quốc gia sang mã ngôn ngữ
 */
const countryToLanguage: Record<string, string> = {
    AE: 'ar',
    AL: 'sq',
    AM: 'hy',
    AR: 'ar',
    AT: 'de',
    AU: 'en',
    AZ: 'az',
    BD: 'bn',
    BE: 'nl',
    BG: 'bg',
    BH: 'ar',
    BR: 'pt',
    CA: 'en',
    CH: 'de',
    CL: 'es',
    CN: 'zh',
    CO: 'es',
    CZ: 'cs',
    DE: 'de',
    DK: 'da',
    EE: 'et',
    ES: 'es',
    ET: 'am',
    FI: 'fi',
    FO: 'fo',
    FR: 'fr',
    GB: 'en',
    GE: 'ka',
    GL: 'kl',
    GR: 'el',
    HK: 'zh',
    HR: 'hr',
    HU: 'hu',
    ID: 'id',
    IL: 'he',
    IN: 'hi',
    IR: 'fa',
    IS: 'is',
    IT: 'it',
    JP: 'ja',
    KE: 'sw',
    KG: 'ky',
    KH: 'km',
    KR: 'ko',
    KW: 'ar',
    KZ: 'kk',
    LA: 'lo',
    LK: 'si',
    LT: 'lt',
    LV: 'lv',
    MM: 'my',
    MN: 'mn',
    MO: 'zh',
    MT: 'mt',
    MX: 'es',
    MY: 'ms',
    NG: 'ha',
    NL: 'nl',
    NO: 'no',
    NP: 'ne',
    OM: 'ar',
    PE: 'es',
    PH: 'tl',
    PK: 'ur',
    PL: 'pl',
    PR: 'es',
    PT: 'pt',
    QA: 'ar',
    RO: 'ro',
    RS: 'sr',
    RU: 'ru',
    RW: 'rw',
    SA: 'ar',
    SE: 'sv',
    SG: 'zh-SG',
    SK: 'sk',
    SO: 'so',
    TH: 'th',
    TJ: 'tg',
    TR: 'tr',
    TW: 'zh',
    TZ: 'sw',
    UA: 'uk',
    US: 'en',
    UY: 'es',
    UZ: 'uz',
    VE: 'es',
    VN: 'vi',
    ZA: 'zu'
};

import axiosInstance from '~/server/utils/axios-config';

/**
 * Lấy thông tin địa lý từ IP
 */
const getGeoData = async (): Promise<GeoLocation> => {
    try {
        const response = await axiosInstance.get('https://get.geojs.io/v1/ip/geo.json');
        return response.data as GeoLocation;
    } catch (error) {
        console.error('Failed to fetch geo data:', error);
        // Trả về dữ liệu mặc định nếu có lỗi
        return {
            country_code: 'US',
            country: 'United States',
            city: 'Unknown',
            region: 'Unknown',
            latitude: '0',
            longitude: '0',
            timezone: 'UTC',
            ip: 'unknown'
        };
    }
};

/**
 * Xác định ngôn ngữ dựa trên mã quốc gia
 */
const getLanguageFromCountry = (countryCode: string): string => {
    return countryToLanguage[countryCode.toUpperCase()] || 'en';
};

export default defineEventHandler(async (): Promise<GeolocationResponse> => {
    try {
        const geoData = await getGeoData();

        const language = getLanguageFromCountry(geoData.country_code);

        return {
            success: true,
            data: {
                ip: geoData.ip,
                country: geoData.country_code,
                countryName: geoData.country,
                language: language
            }
        };
    } catch (error) {
        console.error('Geolocation API error:', error);
        return {
            success: false,
            error: 'Failed to fetch geolocation data'
        };
    }
});
