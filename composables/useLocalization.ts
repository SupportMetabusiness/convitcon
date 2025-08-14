import { ref, computed } from 'vue';
import checkoutTranslations from '~/assets/locales/checkout.json';
import variantsTranslations from '~/assets/locales/variants.json';

interface GeolocationData {
    ip: string;
    country: string;
    countryName: string;
    language: string;
}

interface GeolocationResponse {
    success: boolean;
    data?: GeolocationData;
    error?: string;
}

interface LocalizationState {
    currentLanguage: string;
    detectedCountry: string;
    isLoading: boolean;
    isDetected: boolean;
}

// Global state
const localizationState = ref<LocalizationState>({
    currentLanguage: 'en',
    detectedCountry: 'US',
    isLoading: false,
    isDetected: false
});

const geolocationData = ref<GeolocationData | null>(null);

export const useLocalization = () => {
    // Detect user location and set language
    const detectLocation = async () => {
        if (localizationState.value.isDetected) {
            console.log('🌍 DEBUG: Location already detected, skipping...');
            return;
        }

        try {
            localizationState.value.isLoading = true;
            console.log('🌍 DEBUG: Starting location detection...');

            const response = await $fetch<GeolocationResponse>('/api/geolocation');

            if (response.success && response.data) {
                geolocationData.value = response.data;
                localizationState.value.detectedCountry = response.data.country;
                localizationState.value.currentLanguage = response.data.language;
                localizationState.value.isDetected = true;

                console.log('🌍 DEBUG: Location detected successfully:', {
                    country: response.data.country,
                    language: response.data.language,
                    ip: response.data.ip
                });

                // Save to localStorage for future visits
                if (process.client) {
                    localStorage.setItem('detectedLanguage', response.data.language);
                    localStorage.setItem('detectedCountry', response.data.country);
                }
            } else {
                console.log('⚠️ DEBUG: Location detection failed, using default');
                setDefaultLanguage();
            }
        } catch (error) {
            console.error('🚨 DEBUG: Error detecting location:', error);
            setDefaultLanguage();
        } finally {
            localizationState.value.isLoading = false;
        }
    };

    // Set default language (fallback)
    const setDefaultLanguage = () => {
        localizationState.value.currentLanguage = 'en';
        localizationState.value.detectedCountry = 'US';
        localizationState.value.isDetected = true;

        if (process.client) {
            localStorage.setItem('detectedLanguage', 'en');
            localStorage.setItem('detectedCountry', 'US');
        }
    };

    // Load saved language from localStorage
    const loadSavedLanguage = () => {
        if (process.client) {
            const savedLanguage = localStorage.getItem('detectedLanguage');
            const savedCountry = localStorage.getItem('detectedCountry');

            if (savedLanguage && savedCountry) {
                localizationState.value.currentLanguage = savedLanguage;
                localizationState.value.detectedCountry = savedCountry;
                localizationState.value.isDetected = true;

                console.log('💾 DEBUG: Loaded saved language:', {
                    language: savedLanguage,
                    country: savedCountry
                });

                return true;
            }
        }
        return false;
    };

    // Manually change language
    const setLanguage = (language: string) => {
        localizationState.value.currentLanguage = language;

        if (process.client) {
            localStorage.setItem('userSelectedLanguage', language);
        }

        console.log('🔄 DEBUG: Language manually changed to:', language);
    };

    // Get translation for checkout
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = checkoutTranslations[localizationState.value.currentLanguage as keyof typeof checkoutTranslations];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to English if key not found
                value = checkoutTranslations.en;
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        console.warn(`🚨 Translation key not found: ${key}`);
                        return key; // Return key if translation not found
                    }
                }
                break;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    // Get translation for variants
    const tv = (key: string, params?: Record<string, any>): string => {
        const keys = key.split('.');
        let value: any = variantsTranslations[localizationState.value.currentLanguage as keyof typeof variantsTranslations];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to English if key not found
                value = variantsTranslations.en;
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        console.warn(`🚨 Variants translation key not found: ${key}`);
                        return key; // Return key if translation not found
                    }
                }
                break;
            }
        }

        let result = typeof value === 'string' ? value : key;

        // Replace parameters if provided
        if (params) {
            Object.keys(params).forEach((param) => {
                result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
            });
        }

        return result;
    };

    // Get available languages
    const availableLanguages = computed(() => [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
    ]);

    // Get current language info
    const currentLanguageInfo = computed(() => {
        return availableLanguages.value.find((lang) => lang.code === localizationState.value.currentLanguage) || availableLanguages.value[0];
    });

    // Initialize localization
    const initializeLocalization = async () => {
        console.log('🚀 DEBUG: Initializing localization...');

        // First try to load saved language
        const hasSavedLanguage = loadSavedLanguage();

        // If no saved language, detect location
        if (!hasSavedLanguage) {
            await detectLocation();
        }

        console.log('✅ DEBUG: Localization initialized:', {
            language: localizationState.value.currentLanguage,
            country: localizationState.value.detectedCountry,
            detected: localizationState.value.isDetected
        });
    };

    return {
        // State
        currentLanguage: computed(() => localizationState.value.currentLanguage),
        detectedCountry: computed(() => localizationState.value.detectedCountry),
        isLoading: computed(() => localizationState.value.isLoading),
        isDetected: computed(() => localizationState.value.isDetected),
        geolocationData: computed(() => geolocationData.value),

        // Computed
        availableLanguages,
        currentLanguageInfo,

        // Methods
        detectLocation,
        setLanguage,
        t,
        tv,
        initializeLocalization
    };
};
