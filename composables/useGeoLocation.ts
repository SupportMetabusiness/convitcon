import { ref, computed, readonly } from 'vue';

/**
 * Composable để lấy thông tin địa lý từ IP và xác định ngôn ngữ
 */

/**
 * Interface cho thông tin địa lý
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

/**
 * Mapping từ mã quốc gia sang mã ngôn ngữ
 */
const countryToLanguage: Record<string, string> = {
    AE: 'ar', AL: 'sq', AM: 'hy', AR: 'ar', AT: 'de', AU: 'en', AZ: 'az',
    BD: 'bn', BE: 'nl', BG: 'bg', BH: 'ar', BR: 'pt', CA: 'en', CH: 'de',
    CL: 'es', CN: 'zh', CO: 'es', CZ: 'cs', DE: 'de', DK: 'da', EE: 'et',
    ES: 'es', ET: 'am', FI: 'fi', FO: 'fo', FR: 'fr', GB: 'en', GE: 'ka',
    GL: 'kl', GR: 'el', HK: 'zh', HR: 'hr', HU: 'hu', ID: 'id', IL: 'he',
    IN: 'hi', IR: 'fa', IS: 'is', IT: 'it', JP: 'ja', KE: 'sw', KG: 'ky',
    KH: 'km', KR: 'ko', KW: 'ar', KZ: 'kk', LA: 'lo', LK: 'si', LT: 'lt',
    LV: 'lv', MM: 'my', MN: 'mn', MO: 'zh', MT: 'mt', MX: 'es', MY: 'ms',
    NG: 'ha', NL: 'nl', NO: 'no', NP: 'ne', OM: 'ar', PE: 'es', PH: 'tl',
    PK: 'ur', PL: 'pl', PR: 'es', PT: 'pt', QA: 'ar', RO: 'ro', RS: 'sr',
    RU: 'ru', RW: 'rw', SA: 'ar', SE: 'sv', SG: 'zh-SG', SK: 'sk', SO: 'so',
    TH: 'th', TJ: 'tg', TR: 'tr', TW: 'zh', TZ: 'sw', UA: 'uk', US: 'en',
    UY: 'es', UZ: 'uz', VE: 'es', VN: 'vi', ZA: 'zu'
};

/**
 * Lấy thông tin địa lý từ IP
 * @returns Promise<GeoLocation>
 */
const getGeoData = async (): Promise<GeoLocation> => {
    try {
        const response = await $fetch('https://get.geojs.io/v1/ip/geo.json');
        return response as GeoLocation;
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
 * @param countryCode - Mã quốc gia (ví dụ: 'VN', 'US')
 * @returns string - Mã ngôn ngữ (ví dụ: 'vi', 'en')
 */
const getLanguageFromCountry = (countryCode: string): string => {
    return countryToLanguage[countryCode.toUpperCase()] || 'en';
};

/**
 * Composable chính để sử dụng trong components
 */
export const useGeoLocation = () => {
    const geoData = ref<GeoLocation | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Computed properties
    const countryCode = computed(() => geoData.value?.country_code || 'US');
    const countryName = computed(() => geoData.value?.country || 'United States');
    const city = computed(() => geoData.value?.city || 'Unknown');
    const region = computed(() => geoData.value?.region || 'Unknown');
    const ip = computed(() => geoData.value?.ip || 'Unknown');
    const language = computed(() => getLanguageFromCountry(countryCode.value));

    /**
     * Lấy thông tin địa lý
     */
    const fetchGeoData = async (): Promise<GeoLocation | null> => {
        // Kiểm tra cache trước
        if (geoData.value) {
            return geoData.value;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const data = await getGeoData();
            geoData.value = data;
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch geo data';
            error.value = errorMessage;
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Reset dữ liệu địa lý
     */
    const resetGeoData = () => {
        geoData.value = null;
        error.value = null;
    };

    /**
     * Lấy ngôn ngữ dựa trên quốc gia hiện tại
     */
    const getDetectedLanguage = (): string => {
        return language.value;
    };

    /**
     * Kiểm tra xem có phải là ngôn ngữ tiếng Việt không
     */
    const isVietnamese = computed(() => language.value === 'vi');

    /**
     * Kiểm tra xem có phải là ngôn ngữ tiếng Anh không
     */
    const isEnglish = computed(() => language.value === 'en');

    return {
        // State
        geoData: readonly(geoData),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Computed
        countryCode,
        countryName,
        city,
        region,
        ip,
        language,
        isVietnamese,
        isEnglish,

        // Methods
        fetchGeoData,
        resetGeoData,
        getDetectedLanguage
    };
};
