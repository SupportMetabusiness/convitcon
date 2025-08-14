<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <h2 class="mt-6 text-3xl font-extrabold text-white">Đăng Nhập Admin</h2>
                <p class="mt-2 text-sm text-gray-300">Vui lòng đăng nhập để truy cập bảng điều khiển</p>
            </div>

            <!-- Thông báo tài khoản mặc định -->
            <div v-if="showDefaultAccount" class="bg-blue-600 border border-blue-500 rounded-lg p-4">
                <div class="flex items-center">
                    <FontAwesomeIcon :icon="faInfoCircle" class="text-blue-200 mr-3" />
                    <div class="text-blue-100">
                        <p class="font-medium">Tài khoản mặc định đã được tạo:</p>
                        <p class="text-sm mt-1">
                            <strong>Tên đăng nhập:</strong> {{ defaultCredentials.username }}<br />
                            <strong>Mật khẩu:</strong> {{ defaultCredentials.password }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Thông báo lỗi -->
            <div v-if="error" class="bg-red-600 border border-red-500 rounded-lg p-4">
                <div class="flex items-center">
                    <FontAwesomeIcon :icon="faExclamationTriangle" class="text-red-200 mr-3" />
                    <span class="text-red-100">{{ error }}</span>
                </div>
            </div>

            <!-- Form đăng nhập -->
            <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
                <div class="space-y-4">
                    <div>
                        <label for="username" class="sr-only">Tên đăng nhập</label>
                        <input id="username" v-model="form.username" type="text" required class="relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Tên đăng nhập" />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Mật khẩu</label>
                        <input id="password" v-model="form.password" type="password" required class="relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Mật khẩu" />
                    </div>
                </div>

                <div class="flex flex-col space-y-3">
                    <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                        <span v-if="loading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang đăng nhập...
                        </span>
                        <span v-else>Đăng Nhập</span>
                    </button>

                    <button type="button" @click="createDefaultAccount" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Tạo Tài Khoản Admin Mặc Định</button>
                </div>
            </form>

            <div class="text-center">
                <NuxtLink to="/" class="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors duration-200"> ← Về Trang Chủ </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

definePageMeta({
    layout: false,
    middleware: []
});

useHead({
    title: 'Đăng Nhập Admin'
});

const loading = ref(false);
const error = ref('');
const showDefaultAccount = ref(false);
const defaultCredentials = ref({ username: '', password: '' });

const form = reactive({
    username: '',
    password: ''
});

const handleLogin = async () => {
    if (loading.value) return;

    loading.value = true;
    error.value = '';

    try {
        const response = await $fetch('/api/admin/auth', {
            method: 'POST',
            body: {
                action: 'login',
                username: form.username,
                password: form.password
            }
        });

        if (response.success) {
            await navigateTo('/admin');
        } else {
            error.value = response.error || 'Đăng nhập thất bại';
        }
    } catch (err) {
        error.value = 'Có lỗi xảy ra khi đăng nhập';
        console.error('Login error:', err);
    } finally {
        loading.value = false;
    }
};

const createDefaultAccount = async () => {
    if (loading.value) return;

    loading.value = true;
    error.value = '';
    showDefaultAccount.value = false;

    try {
        const response = await $fetch('/api/admin/auth', {
            method: 'POST',
            body: {
                action: 'create-default'
            }
        });

        if (response.success) {
            showDefaultAccount.value = true;
            defaultCredentials.value = response.credentials;
            // Auto fill form
            form.username = response.credentials.username;
            form.password = response.credentials.password;
        } else {
            error.value = response.error || 'Không thể tạo tài khoản mặc định';
        }
    } catch (err) {
        error.value = 'Có lỗi xảy ra khi tạo tài khoản';
        console.error('Create default account error:', err);
    } finally {
        loading.value = false;
    }
};

// Kiểm tra xem đã đăng nhập chưa
onMounted(async () => {
    try {
        const response = await $fetch('/api/admin/auth', { method: 'GET' });
        if (response.authenticated) {
            await navigateTo('/admin');
        }
    } catch (err) {
        // Ignore error, user is not authenticated
    }
});
</script>
