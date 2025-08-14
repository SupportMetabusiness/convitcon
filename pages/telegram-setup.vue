<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">🤖 Cấu Hình Telegram Bot</h1>
                <p class="text-lg text-gray-600">Thiết lập bot Telegram để nhận thông báo khi khách hàng thêm sản phẩm vào giỏ hàng</p>
            </div>

            <!-- Status Card -->
            <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Trạng Thái Cấu Hình</h2>
                    <button @click="checkConfig" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">🔄 Kiểm Tra</button>
                </div>

                <div v-if="configStatus" class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <div :class="['w-4 h-4 rounded-full', configStatus.configured ? 'bg-green-500' : 'bg-red-500']"></div>
                        <span class="font-semibold">{{ configStatus.message }}</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex items-center space-x-2">
                            <div :class="['w-3 h-3 rounded-full', configStatus.hasBotToken ? 'bg-green-500' : 'bg-red-500']"></div>
                            <span>Bot Token: {{ configStatus.hasBotToken ? '✅ Đã cấu hình' : '❌ Chưa cấu hình' }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div :class="['w-3 h-3 rounded-full', configStatus.hasChatId ? 'bg-green-500' : 'bg-red-500']"></div>
                            <span>Chat ID: {{ configStatus.hasChatId ? '✅ Đã cấu hình' : '❌ Chưa cấu hình' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Setup Form -->
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Cấu Hình Bot</h2>

                <form @submit.prevent="saveConfig" class="space-y-6">
                    <!-- Bot Token -->
                    <div>
                        <label for="bot-token" class="block text-sm font-semibold text-gray-700 mb-2"> Bot Token </label>
                        <input id="bot-token" v-model="telegramConfig.bot_token" type="text" placeholder="Nhập Bot Token (VD: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300" required />
                        <p class="mt-2 text-sm text-gray-500">Tạo bot mới bằng cách chat với @BotFather trên Telegram</p>
                    </div>

                    <!-- Chat ID -->
                    <div>
                        <label for="chat-id" class="block text-sm font-semibold text-gray-700 mb-2"> Chat ID </label>
                        <input id="chat-id" v-model="telegramConfig.chat_id" type="text" placeholder="Nhập Chat ID (VD: -1001234567890 hoặc 123456789)" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300" required />
                        <p class="mt-2 text-sm text-gray-500">ID của chat/group nơi bạn muốn nhận thông báo</p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap gap-4">
                        <button type="submit" :disabled="saving" class="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ saving ? 'Đang lưu...' : '💾 Lưu Cấu Hình' }}
                        </button>

                        <button type="button" @click="loadConfig" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300">📥 Tải Cấu Hình</button>

                        <button type="button" @click="testBot" :disabled="testing || !telegramConfig.bot_token || !telegramConfig.chat_id" class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ testing ? 'Đang test...' : '🧪 Test Bot' }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Instructions -->
            <div class="bg-white rounded-2xl shadow-xl p-8 mt-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">📋 Hướng Dẫn Cấu Hình</h2>

                <div class="space-y-6">
                    <div class="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <h3 class="text-lg font-semibold text-blue-800 mb-3">Bước 1: Tạo Bot Telegram</h3>
                        <ol class="list-decimal list-inside space-y-2 text-blue-700">
                            <li>Mở Telegram và tìm kiếm <strong>@BotFather</strong></li>
                            <li>Gửi lệnh <code>/newbot</code></li>
                            <li>Đặt tên cho bot (VD: "My Store Bot")</li>
                            <li>Đặt username cho bot (VD: "mystore_bot")</li>
                            <li>BotFather sẽ trả về Bot Token - hãy copy và paste vào ô Bot Token ở trên</li>
                        </ol>
                    </div>

                    <div class="bg-green-50 p-6 rounded-xl border border-green-200">
                        <h3 class="text-lg font-semibold text-green-800 mb-3">Bước 2: Lấy Chat ID</h3>
                        <ol class="list-decimal list-inside space-y-2 text-green-700">
                            <li>Tìm kiếm bot vừa tạo và bắt đầu chat</li>
                            <li>Gửi lệnh <code>/start</code></li>
                            <li>Gửi bất kỳ tin nhắn nào</li>
                            <li>Truy cập: <code>https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates</code></li>
                            <li>Tìm <code>"chat":{"id":</code> trong response - số đó chính là Chat ID</li>
                        </ol>
                    </div>

                    <div class="bg-orange-50 p-6 rounded-xl border border-orange-200">
                        <h3 class="text-lg font-semibold text-orange-800 mb-3">Bước 3: Test Bot</h3>
                        <p class="text-orange-700">Sau khi cấu hình xong, nhấn nút "Test Bot" để kiểm tra xem bot có hoạt động không. Nếu thành công, bạn sẽ nhận được tin nhắn test trong Telegram.</p>
                    </div>
                </div>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="message" class="mt-8 p-4 rounded-xl" :class="message.type === 'success' ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'">
                {{ message.text }}
            </div>
        </div>
    </div>
</template>

<script setup>
const telegramConfig = ref({
    bot_token: '',
    chat_id: ''
});

const configStatus = ref(null);
const saving = ref(false);
const testing = ref(false);
const message = ref(null);

// Check current configuration
const checkConfig = async () => {
    try {
        const response = await $fetch('/api/telegram/check-config');
        configStatus.value = response;
    } catch (error) {
        console.error('Error checking config:', error);
        message.value = { text: 'Lỗi khi kiểm tra cấu hình', type: 'error' };
    }
};

// Load existing configuration
const loadConfig = async () => {
    try {
        const response = await $fetch('/api/admin/telegram/config');
        if (response.success && response.data) {
            telegramConfig.value = response.data;
            message.value = { text: 'Đã tải cấu hình thành công', type: 'success' };
        }
    } catch (error) {
        console.error('Error loading config:', error);
        message.value = { text: 'Lỗi khi tải cấu hình', type: 'error' };
    }
};

// Save configuration
const saveConfig = async () => {
    try {
        saving.value = true;
        const response = await $fetch('/api/admin/telegram/config', {
            method: 'PUT',
            body: {
                bot_token: telegramConfig.value.bot_token,
                chat_id: telegramConfig.value.chat_id
            }
        });

        if (response.success) {
            message.value = { text: 'Lưu cấu hình thành công!', type: 'success' };
            await checkConfig(); // Refresh status
        } else {
            message.value = { text: 'Lỗi khi lưu cấu hình', type: 'error' };
        }
    } catch (error) {
        console.error('Error saving config:', error);
        message.value = { text: 'Lỗi khi lưu cấu hình', type: 'error' };
    } finally {
        saving.value = false;
    }
};

// Test bot
const testBot = async () => {
    try {
        testing.value = true;
        const response = await $fetch('/api/telegram/notify-cart', {
            method: 'POST',
            body: {
                product: {
                    name: '🧪 Test Product',
                    salePrice: '0.00€',
                    slug: 'test'
                },
                quantity: 1,
                selectedColor: 'Test',
                selectedSize: 'Test'
            }
        });

        if (response.success) {
            message.value = { text: '✅ Test thành công! Kiểm tra Telegram để xem thông báo.', type: 'success' };
        } else {
            message.value = { text: `❌ Test thất bại: ${response.error}`, type: 'error' };
        }
    } catch (error) {
        console.error('Error testing bot:', error);
        message.value = { text: 'Lỗi khi test bot', type: 'error' };
    } finally {
        testing.value = false;
    }
};

// Auto-check config on page load
onMounted(() => {
    checkConfig();
    loadConfig();
});

// Clear message after 5 seconds
watch(message, (newMessage) => {
    if (newMessage) {
        setTimeout(() => {
            message.value = null;
        }, 5000);
    }
});

useHead(() => ({
    title: 'Cấu Hình Telegram Bot - Admin'
}));
</script>



