<template>
    <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
                <h1 class="text-xl font-semibold text-gray-900">Quản Lý Tracking Pixels</h1>
                <p class="mt-1 text-sm text-gray-600">Cấu hình tracking pixels cho Facebook, Google, TikTok, Snapchat và Twitter</p>
            </div>

            <div class="p-6">
                <!-- Thông báo -->
                <div v-if="message.text" :class="['p-4 rounded-lg mb-6 flex items-center', message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200']">
                    <FontAwesomeIcon :icon="message.type === 'success' ? faCheckCircle : faExclamationTriangle" class="mr-3 flex-shrink-0" />
                    <span>{{ message.text }}</span>
                </div>

                <form @submit.prevent="handleSave" class="space-y-8">
                    <!-- Facebook Pixel -->
                    <div class="bg-blue-50 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                    <span class="text-white font-bold text-sm">FB</span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">Facebook Pixel</h3>
                                    <p class="text-sm text-gray-600">Theo dõi conversions trên Facebook và Instagram</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="config.facebook.enabled" class="sr-only peer" />
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <input type="text" v-model="config.facebook.pixelId" placeholder="Nhập Facebook Pixel ID (VD: 123456789012345)" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" :disabled="!config.facebook.enabled" />
                    </div>

                    <!-- Google Analytics -->
                    <div class="bg-red-50 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                                    <span class="text-white font-bold text-sm">GA</span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">Google Analytics</h3>
                                    <p class="text-sm text-gray-600">Theo dõi hành vi người dùng và conversions</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="config.google.enabled" class="sr-only peer" />
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                        <input type="text" v-model="config.google.gtag" placeholder="Nhập Google Analytics ID (VD: GA-XXXXXXXXX-X)" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" :disabled="!config.google.enabled" />
                    </div>

                    <!-- TikTok Pixel -->
                    <div class="bg-gray-50 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                                    <span class="text-white font-bold text-sm">TT</span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">TikTok Pixel</h3>
                                    <p class="text-sm text-gray-600">Theo dõi conversions từ TikTok Ads</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="config.tiktok.enabled" class="sr-only peer" />
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                            </label>
                        </div>
                        <input type="text" v-model="config.tiktok.pixelId" placeholder="Nhập TikTok Pixel ID" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent" :disabled="!config.tiktok.enabled" />
                    </div>

                    <!-- Snapchat Pixel -->
                    <div class="bg-yellow-50 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                                    <span class="text-gray-800 font-bold text-sm">SC</span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">Snapchat Pixel</h3>
                                    <p class="text-sm text-gray-600">Theo dõi conversions từ Snapchat Ads</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="config.snapchat.enabled" class="sr-only peer" />
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                            </label>
                        </div>
                        <input type="text" v-model="config.snapchat.pixelId" placeholder="Nhập Snapchat Pixel ID" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" :disabled="!config.snapchat.enabled" />
                    </div>

                    <!-- Twitter Pixel -->
                    <div class="bg-blue-50 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center mr-3">
                                    <span class="text-white font-bold text-sm">TW</span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">Twitter Pixel</h3>
                                    <p class="text-sm text-gray-600">Theo dõi conversions từ Twitter Ads</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="config.twitter.enabled" class="sr-only peer" />
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"></div>
                            </label>
                        </div>
                        <input type="text" v-model="config.twitter.pixelId" placeholder="Nhập Twitter Pixel ID" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" :disabled="!config.twitter.enabled" />
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button type="button" @click="loadConfig" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                            <FontAwesomeIcon :icon="faRefresh" class="mr-2" />
                            Tải Lại
                        </button>

                        <button type="submit" :disabled="loading" class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                            <span v-if="loading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang lưu...
                            </span>
                            <span v-else>
                                <FontAwesomeIcon :icon="faSave" class="mr-2" />
                                Lưu Cấu Hình
                            </span>
                        </button>
                    </div>
                </form>

                <!-- Help section -->
                <div class="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h4 class="font-medium text-blue-900 mb-2">💡 Hướng dẫn:</h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>• Facebook Pixel ID: Tìm trong Facebook Business Manager > Events Manager</li>
                        <li>• Google Analytics: Tạo property mới hoặc sử dụng existing GA4 tracking ID</li>
                        <li>• TikTok Pixel: Tìm trong TikTok Ads Manager > Events > Manage</li>
                        <li>• Snapchat Pixel: Tìm trong Snapchat Ads Manager > Events Manager</li>
                        <li>• Twitter Pixel: Tìm trong Twitter Ads Manager > Conversion tracking</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheckCircle, faExclamationTriangle, faSave, faRefresh } from '@fortawesome/free-solid-svg-icons';

definePageMeta({
    layout: 'admin',
    middleware: ['admin-auth']
});

useHead({
    title: 'Tracking Pixels - Admin'
});

const loading = ref(false);
const message = ref({ text: '', type: '' });

const config = ref({
    facebook: {
        pixelId: '',
        enabled: false
    },
    google: {
        gtag: '',
        enabled: false
    },
    tiktok: {
        pixelId: '',
        enabled: false
    },
    snapchat: {
        pixelId: '',
        enabled: false
    },
    twitter: {
        pixelId: '',
        enabled: false
    }
});

const { saveConfig: saveTrackingConfig } = useTracking();

const loadConfig = async () => {
    try {
        const response = await $fetch('/api/admin/tracking', { method: 'GET' });
        if (response.success) {
            config.value = { ...config.value, ...response.data };
        }
    } catch (error) {
        message.value = { text: 'Không thể tải cấu hình tracking', type: 'error' };
        console.error('Load config error:', error);
    }
};

const handleSave = async () => {
    if (loading.value) return;

    loading.value = true;
    message.value = { text: '', type: '' };

    try {
        // Save to server
        const response = await $fetch('/api/admin/tracking', {
            method: 'POST',
            body: { config: config.value }
        });

        if (response.success) {
            // Save to client-side tracking
            await saveTrackingConfig(config.value);

            message.value = { text: 'Cấu hình tracking đã được lưu thành công!', type: 'success' };

            // Reload page to reinitialize tracking
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            message.value = { text: response.error || 'Không thể lưu cấu hình', type: 'error' };
        }
    } catch (error) {
        message.value = { text: 'Có lỗi xảy ra khi lưu cấu hình', type: 'error' };
        console.error('Save config error:', error);
    } finally {
        loading.value = false;
    }
};

// Load config on mount
onMounted(() => {
    loadConfig();
});
</script>



