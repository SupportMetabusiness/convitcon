/**
 * Composable để xử lý việc dịch text sử dụng Google Translate API
 */

import axiosInstance from '~/composables/useAxios';

/**
 * Dịch một đoạn text sang ngôn ngữ đích
 * @param text - Text cần dịch
 * @param targetLang - Ngôn ngữ đích (ví dụ: 'vi', 'en', 'fr')
 * @returns Promise<string> - Text đã được dịch
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
        const response = await axiosInstance.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = response.data;
        return data[0][0][0];
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Trả về text gốc nếu có lỗi
    }
};

/**
 * Dịch nhiều text cùng lúc
 * @param texts - Object chứa các text cần dịch
 * @param targetLang - Ngôn ngữ đích
 * @returns Promise<Record<string, string>> - Object chứa các text đã được dịch
 */
export const translateMultipleTexts = async (texts: Record<string, string>, targetLang: string): Promise<Record<string, string>> => {
    const translatedTexts: Record<string, string> = {};

    try {
        // Dịch từng text một cách tuần tự để tránh rate limiting
        for (const [key, text] of Object.entries(texts)) {
            translatedTexts[key] = await translateText(text, targetLang);
            // Thêm delay nhỏ giữa các request
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    } catch (error) {
        console.error('Multiple translation error:', error);
    }

    return translatedTexts;
};

/**
 * Composable chính để sử dụng trong components
 */
export const useTranslation = () => {
    const translatedTexts = ref<Record<string, string>>({});
    const isTranslating = ref(false);

    /**
     * Dịch text và lưu vào cache
     * @param key - Key của text
     * @param text - Text cần dịch
     * @param targetLang - Ngôn ngữ đích
     */
    const translateAndCache = async (key: string, text: string, targetLang: string) => {
        if (translatedTexts.value[key]) {
            return translatedTexts.value[key];
        }

        isTranslating.value = true;
        try {
            const translated = await translateText(text, targetLang);
            translatedTexts.value[key] = translated;
            return translated;
        } finally {
            isTranslating.value = false;
        }
    };

    /**
     * Dịch nhiều text và lưu vào cache
     * @param texts - Object chứa các text cần dịch
     * @param targetLang - Ngôn ngữ đích
     */
    const translateMultipleAndCache = async (texts: Record<string, string>, targetLang: string) => {
        isTranslating.value = true;
        try {
            const translated = await translateMultipleTexts(texts, targetLang);
            translatedTexts.value = { ...translatedTexts.value, ...translated };
            return translated;
        } finally {
            isTranslating.value = false;
        }
    };

    /**
     * Lấy text đã được dịch hoặc text gốc
     * @param key - Key của text
     * @param fallback - Text gốc nếu chưa có bản dịch
     */
    const getTranslatedText = (key: string, fallback: string): string => {
        return translatedTexts.value[key] || fallback;
    };

    /**
     * Xóa cache dịch
     */
    const clearTranslationCache = () => {
        translatedTexts.value = {};
    };

    return {
        translatedTexts: readonly(translatedTexts),
        isTranslating: readonly(isTranslating),
        translateAndCache,
        translateMultipleAndCache,
        getTranslatedText,
        clearTranslationCache
    };
};
