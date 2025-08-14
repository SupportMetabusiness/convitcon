<template>
    <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
                <h1 class="text-xl font-semibold text-gray-900">Cấu Hình Telegram Bot</h1>
                <p class="mt-1 text-sm text-gray-600">Thiết lập bot Telegram để nhận thông báo khi khách hàng thêm sản phẩm vào giỏ hàng</p>
            </div>

            <div class="p-6">
                <!-- Thông báo -->
                <div v-if="message.text" :class="['p-4 rounded-lg mb-6 flex items-center', message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200']">
                    <FontAwesomeIcon :icon="message.type === 'success' ? faCheckCircle : faExclamationTriangle" class="mr-3 flex-shrink-0" />
                    <span>{{ message.text }}</span>
                </div>

                <form @submit.prevent="saveTelegramConfig" class="space-y-6">
                    <!-- Bot Token -->
                    <div>
                        <label for="bot-token" class="block text-sm font-medium text-gray-700 mb-2"> Bot Token </label>
                        <input id="bot-token" v-model="telegramConfig.bot_token" type="text" placeholder="Nhập Bot Token (VD: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <p class="mt-1 text-xs text-gray-500">Tạo bot mới bằng cách chat với @BotFather trên Telegram</p>
                    </div>

                    <!-- Chat ID -->
                    <div>
                        <label for="chat-id" class="block text-sm font-medium text-gray-700 mb-2"> Chat ID </label>
                        <input id="chat-id" v-model="telegramConfig.chat_id" type="text" placeholder="Nhập Chat ID (VD: -1001234567890 hoặc 123456789)" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <p class="mt-1 text-xs text-gray-500">Lấy Chat ID bằng cách chat với @userinfobot hoặc thêm bot vào group</p>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button type="button" @click="loadTelegramConfig" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                            <FontAwesomeIcon :icon="faRefresh" class="mr-2" />
                            Tải Lại
                        </button>

                        <div class="flex space-x-3">
                            <button type="button" @click="testTelegramBot" :disabled="loading || !telegramConfig.bot_token || !telegramConfig.chat_id" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                                <FontAwesomeIcon :icon="faPaperPlane" class="mr-2" />
                                Test Bot
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
                    </div>
                </form>

                <!-- Hướng dẫn -->
                <div class="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h4 class="font-medium text-blue-900 mb-3">📋 Hướng dẫn thiết lập:</h4>
                    <ol class="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                        <li>Mở Telegram và tìm kiếm <strong>@BotFather</strong></li>
                        <li>Gửi lệnh <code>/newbot</code> để tạo bot mới</li>
                        <li>Đặt tên và username cho bot của bạn</li>
                        <li>Copy <strong>Bot Token</strong> mà BotFather cung cấp</li>
                        <li>Tìm kiếm <strong>@userinfobot</strong> để lấy Chat ID của bạn</li>
                        <li>Hoặc thêm bot vào group và lấy Group Chat ID</li>
                        <li>Nhập thông tin vào form trên và nhấn <strong>"Test Bot"</strong> để kiểm tra</li>
                        <li>Nếu test thành công, nhấn <strong>"Lưu Cấu Hình"</strong></li>
                    </ol>
                </div>

                <!-- Troubleshooting -->
                <div class="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h4 class="font-medium text-yellow-900 mb-3">🔧 Khắc phục sự cố:</h4>
                    <ul class="text-sm text-yellow-800 space-y-2 list-disc list-inside">
                        <li><strong>Lỗi "Invalid bot token":</strong> Kiểm tra lại Bot Token từ @BotFather</li>
                        <li><strong>Lỗi "Bad Request - Check chat_id format":</strong> Chat ID phải là số (VD: 123456789 hoặc -1001234567890)</li>
                        <li><strong>Lỗi "Forbidden - Bot may be blocked":</strong> Đảm bảo bot đã được thêm vào chat/group</li>
                        <li><strong>Lỗi "Not Found - Check chat_id":</strong> Kiểm tra lại Chat ID bằng @userinfobot</li>
                        <li><strong>Bot không nhận được tin nhắn:</strong> Đảm bảo bot có quyền gửi tin nhắn trong chat</li>
                    </ul>
                </div>

                <!-- Tính năng -->
                <div class="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 class="font-medium text-green-900 mb-2">✨ Tính năng:</h4>
                    <ul class="text-sm text-green-800 space-y-1">
                        <li>• Thông báo khi khách hàng thêm sản phẩm vào giỏ hàng</li>
                        <li>• Thông báo khi có đơn hàng mới</li>
                        <li>• Thông báo cập nhật trạng thái thanh toán</li>
                        <li>• Hiển thị thông tin chi tiết sản phẩm và khách hàng</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheckCircle, faExclamationTriangle, faSave, faRefresh, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

definePageMeta({
    layout: 'admin',
    middleware: ['admin-auth']
});

useHead({
    title: 'Telegram Bot - Admin'
});

const loading = ref(false);
const message = ref({ text: '', type: '' });

const telegramConfig = ref({
    id: 0,
    bot_token: '',
    chat_id: ''
});

const loadTelegramConfig = async () => {
    try {
        const response = await $fetch('/api/admin/telegram/config', { method: 'GET' });
        if (response.success) {
            telegramConfig.value = { ...telegramConfig.value, ...response.data };
        }
    } catch (error) {
        message.value = { text: 'Không thể tải cấu hình Telegram', type: 'error' };
        console.error('Load config error:', error);
    }
};

const saveTelegramConfig = async () => {
    if (loading.value) return;

    loading.value = true;
    message.value = { text: '', type: '' };

    try {
        const response = await $fetch('/api/admin/telegram/config', {
            method: 'PUT',
            body: {
                bot_token: telegramConfig.value.bot_token,
                chat_id: telegramConfig.value.chat_id
            }
        });

        if (response.success) {
            message.value = { text: response.message, type: 'success' };
        } else {
            message.value = { text: 'Không thể lưu cấu hình', type: 'error' };
        }
    } catch (error) {
        message.value = { text: 'Có lỗi xảy ra khi lưu cấu hình', type: 'error' };
        console.error('Save config error:', error);
    } finally {
        loading.value = false;
    }
};

const testTelegramBot = async () => {
    if (loading.value) return;

    loading.value = true;
    message.value = { text: '', type: '' };

    console.log('🔍 DEBUG: Starting test bot...');
    console.log('📋 DEBUG: Current config:', telegramConfig.value);

    // Test đơn giản trước
    message.value = { text: 'Đang test bot...', type: 'success' };

    try {
        // Test với API mới có thông tin chi tiết
        console.log('📡 DEBUG: Calling API...');

        let response;
        try {
            response = await $fetch('/api/admin/telegram/test-detailed', {
                method: 'POST'
            });
        } catch (apiError) {
            console.log('⚠️ DEBUG: New API failed, trying old API...');
            // Fallback to old API
            response = await $fetch('/api/admin/telegram/test', {
                method: 'POST'
            });
        }

        console.log('✅ DEBUG: API response:', response);

        if (response.success) {
            message.value = {
                text: `Test thành công! Bot: ${response.botInfo.name} (@${response.botInfo.username}) - Chat ID: ${response.botInfo.chatId}`,
                type: 'success'
            };
        } else {
            message.value = { text: response.error || 'Test thất bại', type: 'error' };
        }
    } catch (error) {
        console.error('❌ DEBUG: Test bot error:', error);

        // Hiển thị thông báo lỗi chi tiết
        if (error.statusMessage) {
            message.value = { text: `Lỗi: ${error.statusMessage}`, type: 'error' };
        } else if (error.data?.statusMessage) {
            message.value = { text: `Lỗi: ${error.data.statusMessage}`, type: 'error' };
        } else {
            message.value = { text: 'Có lỗi xảy ra khi test bot. Vui lòng kiểm tra console để biết chi tiết.', type: 'error' };
        }
    } finally {
        loading.value = false;
        console.log('🏁 DEBUG: Test bot completed');
    }
};

// Load config on mount
onMounted(() => {
    loadTelegramConfig();
});
</script>
