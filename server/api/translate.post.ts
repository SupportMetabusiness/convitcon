/**
 * API endpoint để dịch text sử dụng Google Translate
 */

interface TranslateRequest {
    texts: Record<string, string>;
    targetLang: string;
}

interface TranslateResponse {
    success: boolean;
    translatedTexts?: Record<string, string>;
    error?: string;
}

import axiosInstance from '~/server/utils/axios-config';

/**
 * Dịch một đoạn text sang ngôn ngữ đích
 */
const translateText = async (text: string, targetLang: string): Promise<string> => {
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
 */
const translateMultipleTexts = async (texts: Record<string, string>, targetLang: string): Promise<Record<string, string>> => {
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

export default defineEventHandler(async (event): Promise<TranslateResponse> => {
    try {
        const body = await readBody<TranslateRequest>(event);

        if (!body.texts || !body.targetLang) {
            return {
                success: false,
                error: 'Missing required fields: texts and targetLang'
            };
        }

        // Kiểm tra ngôn ngữ đích hợp lệ
        const validLanguages = ['vi', 'en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'th'];
        if (!validLanguages.includes(body.targetLang)) {
            return {
                success: false,
                error: 'Invalid target language'
            };
        }

        // Dịch các text
        const translatedTexts = await translateMultipleTexts(body.texts, body.targetLang);

        return {
            success: true,
            translatedTexts
        };
    } catch (error) {
        console.error('Translation API error:', error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
});
