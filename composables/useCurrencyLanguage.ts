export const useCurrencyLanguage = () => {
    const { setLanguage } = useLocalization();

    // Currency to language mapping
    const currencyLanguageMap = {
        USD: { language: 'en', country: 'US' },
        EUR: { language: 'fr', country: 'FR' }
    };

    /**
     * Auto-detect and set language based on product currency
     */
    const autoSetLanguageFromProduct = async (productId: string | number) => {
        try {
            // Fetch product details to get currency
            const response = (await $fetch(`/api/product/${productId}`)) as any;
            const product = response;

            if (product && product.currency) {
                const languageConfig = currencyLanguageMap[product.currency as keyof typeof currencyLanguageMap];

                if (languageConfig) {
                    console.log(`🌍 Auto-setting language to ${languageConfig.language} based on currency ${product.currency}`);
                    setLanguage(languageConfig.language);
                }
            }
        } catch (error) {
            console.error('Error auto-setting language from product:', error);
        }
    };

    /**
     * Auto-detect and set language based on admin default currency
     */
    const autoSetLanguageFromAdmin = async () => {
        try {
            // Fetch admin default currency setting
            const response = (await $fetch('/api/admin/settings')) as any;
            const settings = response;

            if (settings && settings.defaultCurrency) {
                const languageConfig = currencyLanguageMap[settings.defaultCurrency as keyof typeof currencyLanguageMap];

                if (languageConfig) {
                    console.log(`🌍 Auto-setting language to ${languageConfig.language} based on admin currency ${settings.defaultCurrency}`);
                    setLanguage(languageConfig.language);
                }
            }
        } catch (error) {
            console.error('Error auto-setting language from admin:', error);
        }
    };

    /**
     * Auto-detect and set language based on cart items currency
     */
    const autoSetLanguageFromCart = async () => {
        try {
            const { cartItems } = useCart();

            if (cartItems.value.length > 0) {
                // Get currency from first item in cart
                const firstItemCurrency = cartItems.value[0].currency;
                const languageConfig = currencyLanguageMap[firstItemCurrency as keyof typeof currencyLanguageMap];

                if (languageConfig) {
                    console.log(`🌍 Auto-setting language to ${languageConfig.language} based on cart currency ${firstItemCurrency}`);
                    setLanguage(languageConfig.language);
                }
            }
        } catch (error) {
            console.error('Error auto-setting language from cart:', error);
        }
    };

    return {
        autoSetLanguageFromProduct,
        autoSetLanguageFromAdmin,
        autoSetLanguageFromCart,
        currencyLanguageMap
    };
};
