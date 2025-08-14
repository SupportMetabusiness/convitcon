<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-xl font-semibold text-gray-900">Cài Đặt Admin</h1>
        <p class="mt-1 text-sm text-gray-600">Quản lý cài đặt tài khoản và bảo mật</p>
      </div>

      <div class="p-6 space-y-8">
        <!-- Đổi mật khẩu -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Đổi Mật Khẩu</h2>

          <!-- Thông báo -->
          <div v-if="message.text"
               :class="[
                 'p-4 rounded-lg mb-4 flex items-center',
                 message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
               ]"
          >
            <FontAwesomeIcon
              :icon="message.type === 'success' ? faCheckCircle : faExclamationTriangle"
              class="mr-3 flex-shrink-0"
            />
            <span>{{ message.text }}</span>
          </div>

          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div>
              <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                id="current-password"
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div>
              <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                id="new-password"
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              />
            </div>

            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirm-password"
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang cập nhật...
                </span>
                <span v-else>
                  <FontAwesomeIcon :icon="faKey" class="mr-2" />
                  Đổi Mật Khẩu
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Thông tin tài khoản -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Thông Tin Tài Khoản</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600">Tên đăng nhập:</span>
              <span class="text-sm text-gray-900">{{ adminInfo.username || 'Đang tải...' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600">Trạng thái:</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FontAwesomeIcon :icon="faCheckCircle" class="mr-1" />
                Đã đăng nhập
              </span>
            </div>
          </div>
        </div>

        <!-- Hành động bảo mật -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Bảo Mật</h2>
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Đăng xuất khỏi tất cả thiết bị</h3>
              <p class="text-sm text-gray-600">Đăng xuất khỏi tất cả các phiên đăng nhập</p>
            </div>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
            >
              <FontAwesomeIcon :icon="faSignOutAlt" class="mr-2" />
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faKey, faCheckCircle, faExclamationTriangle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

definePageMeta({
  layout: "admin",
  middleware: ['admin-auth']
});

useHead({
  title: "Đổi MK - Admin",
});

const loading = ref(false);
const message = ref({ text: '', type: '' });
const adminInfo = ref({ username: '' });

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const handleChangePassword = async () => {
  if (loading.value) return;

  // Validate form
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.value = { text: 'Mật khẩu mới và xác nhận mật khẩu không khớp', type: 'error' };
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    message.value = { text: 'Mật khẩu mới phải có ít nhất 6 ký tự', type: 'error' };
    return;
  }

  loading.value = true;
  message.value = { text: '', type: '' };

  try {
    const response = await $fetch('/api/admin/auth', {
      method: 'POST',
      body: {
        action: 'change-password',
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }
    });

    if (response.success) {
      message.value = { text: response.message, type: 'success' };
      // Reset form
      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    } else {
      message.value = { text: response.error, type: 'error' };
    }
  } catch (err) {
    message.value = { text: 'Có lỗi xảy ra khi đổi mật khẩu', type: 'error' };
    console.error('Change password error:', err);
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  try {
    await $fetch('/api/admin/auth', { method: 'DELETE' });
    await navigateTo('/admin/login');
  } catch (err) {
    console.error('Logout error:', err);
  }
};

// Lấy thông tin admin
onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/auth', { method: 'GET' });
    if (response.authenticated) {
      adminInfo.value.username = response.username;
    }
  } catch (err) {
    console.error('Get admin info error:', err);
  }
});
</script>
