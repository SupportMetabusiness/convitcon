/**
 * Composable để tự động dịch dựa trên vị trí địa lý
 */

/**
 * Composable chính kết hợp geo location và translation
 */
export const useAutoTranslation = () => {
    const { geoData, isLoading: geoLoading, countryCode, countryName, language: detectedLanguage, fetchGeoData } = useGeoLocation();
    const { translatedTexts, isTranslating, translateMultipleAndCache, getTranslatedText, clearTranslationCache } = useTranslation();
    
    const isInitialized = ref(false);
    const currentLanguage = ref('en');

    /**
     * Khởi tạo auto translation
     */
    const initializeAutoTranslation = async () => {
        if (isInitialized.value) return;

        try {
            // Lấy thông tin địa lý
            await fetchGeoData();
            
            // Xác định ngôn ngữ từ quốc gia
            const targetLang = detectedLanguage.value;
            
            if (targetLang && targetLang !== 'en') {
                currentLanguage.value = targetLang;
                console.log(`Auto-detected language: ${targetLang} for country: ${countryName.value}`);
            }
            
            isInitialized.value = true;
        } catch (error) {
            console.error('Failed to initialize auto translation:', error);
        }
    };

    /**
     * Dịch các text checkout
     */
    const translateCheckoutTexts = async () => {
        if (currentLanguage.value === 'en') {
            return {};
        }

        const checkoutTexts: Record<string, string> = {
            title: 'Checkout - Complete Your Order',
            invoiceDetails: 'Invoice Details',
            firstName: 'First Name',
            lastName: 'Last Name',
            countryRegion: 'Country/Region',
            streetAddress: 'Street Address',
            apartment: 'Apartment, suite, etc.',
            postalCode: 'Postal Code',
            city: 'City',
            state: 'State/Province',
            phoneOptional: 'Phone (Optional)',
            email: 'Email',
            paymentInformation: 'Payment Information',
            selectPaymentMethod: 'Select Payment Method',
            cardNumber: 'Card Number',
            expiryDate: 'Expiry Date',
            cvv: 'CVV',
            cardholderName: 'Cardholder Name',
            orderSummary: 'Order Summary',
            subtotal: 'Subtotal',
            shipping: 'Shipping',
            tax: 'Tax',
            total: 'Total',
            free: 'Free',
            completeOrder: 'Complete Order',
            securePayment: 'Secure Payment',
            continueShopping: 'Continue Shopping',
            firstNamePlaceholder: 'Enter your first name',
            lastNamePlaceholder: 'Enter your last name',
            selectCountry: 'Select your country',
            streetPlaceholder: 'Enter your street address',
            apartmentPlaceholder: 'Apartment, suite, etc. (optional)',
            postalCodePlaceholder: 'Enter postal code',
            cityPlaceholder: 'Enter your city',
            statePlaceholder: 'Enter state/province',
            cardholderPlaceholder: 'Enter cardholder name',
            cartEmpty: 'Your cart is empty',
            purchaseSuccessful: 'Purchase Successful!',
            verificationCode: 'Verification Code',
            enterSixCharCode: 'Enter the 6-character code',
            invalidCode: 'Invalid verification code',
            verifyCode: 'Verify Code',
            verifyingCode: 'Verifying Code...',
            verifyingWait: 'Please wait while we verify your code',
            thankYouOrder: 'Thank you for your order!',
            detectingLocation: 'Detecting your location...',
            'steps.shopping': 'Shopping Cart',
            'steps.shipping': 'Shipping & Payment',
            'steps.confirmation': 'Confirmation'
        };

        try {
            // Sử dụng API endpoint thay vì gọi trực tiếp Google Translate
            const response = await $fetch('/api/translate', {
                method: 'POST',
                body: {
                    texts: checkoutTexts,
                    targetLang: currentLanguage.value
                }
            });

            if (response.success && response.translatedTexts) {
                // Cập nhật cache với các text đã được dịch
                Object.entries(response.translatedTexts).forEach(([key, value]) => {
                    // Sử dụng translateMultipleAndCache để cập nhật cache
                    translateMultipleAndCache({ [key]: value }, currentLanguage.value);
                });
                console.log('Checkout texts translated successfully');
            }
        } catch (error) {
            console.error('Failed to translate checkout texts:', error);
        }
    };

    /**
     * Lấy text đã được dịch với fallback
     */
    const t = (key: string, fallback: string): string => {
        return getTranslatedText(key, fallback);
    };

    /**
     * Lấy text đã được dịch cho các key nested
     */
    const tNested = (key: string, fallback: string): string => {
        const fullKey = key.includes('.') ? key : key;
        return getTranslatedText(fullKey, fallback);
    };

    /**
     * Thay đổi ngôn ngữ
     */
    const setLanguage = async (lang: string) => {
        if (lang === currentLanguage.value) return;
        
        currentLanguage.value = lang;
        clearTranslationCache();
        
        if (lang !== 'en') {
            await translateCheckoutTexts();
        }
    };

    /**
     * Kiểm tra xem có đang dịch không
     */
    const isTranslatingAny = computed(() => geoLoading.value || isTranslating.value);

    /**
     * Lấy thông tin ngôn ngữ hiện tại
     */
    const languageInfo = computed(() => ({
        current: currentLanguage.value,
        detected: detectedLanguage.value,
        country: countryName.value,
        countryCode: countryCode.value
    }));

    return {
        // State
        isInitialized: readonly(isInitialized),
        currentLanguage: readonly(currentLanguage),
        isTranslatingAny,

        // Computed
        languageInfo,
        geoData: readonly(geoData),
        countryCode,
        countryName,
        detectedLanguage,

        // Methods
        initializeAutoTranslation,
        translateCheckoutTexts,
        t,
        tNested,
        setLanguage,
        clearTranslationCache
    };
};
