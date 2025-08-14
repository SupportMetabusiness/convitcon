import { fileURLToPath } from 'url';

export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: false },
    modules: ['dragon-editor', '@nuxtjs/tailwindcss', '@vueuse/nuxt'],
    alias: {
        '~': fileURLToPath(new URL('.', import.meta.url))
    },
    app: {
        head: {
            titleTemplate: '%s - Flash Deals',
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
            charset: 'utf-8'
        }
    },
    css: ['~/assets/css/main.css'],
    ssr: true,
    routeRules: {
        '/': { ssr: false },
        '/product/**': { ssr: true },
        '/admin/**': { ssr: false }
    },
    typescript: {
        strict: true,
        typeCheck: false
    },
    imports: {
        autoImport: true,
        dirs: ['composables/**']
    },
    tailwindcss: {
        cssPath: '~/assets/css/main.css',
        configPath: 'tailwind.config.js',
        exposeConfig: false,
        viewer: true
    },
    vite: {
        optimizeDeps: {
            exclude: ['shiki']
        },
        ssr: {
            noExternal: ['shiki']
        }
    },
    nitro: {
        experimental: {
            wasm: true
        }
    },
    runtimeConfig: {
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
        telegramChatId: process.env.TELEGRAM_CHAT_ID
    }
});
