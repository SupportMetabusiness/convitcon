<template>
    <header class="bg-white flex justify-between w-full p-4 items-center shadow-sm border-b border-gray-200">
        <div class="flex items-center">
            <button @click="toggleSidebar" class="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100">
                <FontAwesomeIcon :icon="faBars" class="w-6 h-6 text-orange-500" />
            </button>
            <h1 class="text-xl lg:text-2xl font-semibold text-gray-900">
                {{ pageTitle }}
            </h1>
        </div>
        <button @click="handleLogout" class="group relative overflow-hidden bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 px-4 lg:px-6 py-2 lg:py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-0.5 bg-size-200 animate-gradient">
            <span class="relative z-10 flex items-center space-x-2">
                <FontAwesomeIcon :icon="faSignOutAlt" class="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-12" />
                <span class="hidden sm:inline">Đăng Xuất</span>
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        </button>
    </header>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const route = useRoute();

const pageTitle = computed(() => {
    const path = route.path;
    if (path.startsWith('/admin/products')) return 'Sửa SP';
    if (path.startsWith('/admin/orders')) return 'List CVV';
    if (path.startsWith('/admin/settings')) return 'Đổi MK';
    if (path.startsWith('/admin/tracking')) return 'Tracking Pixels';
    if (path.startsWith('/admin/telegram')) return 'Telegram Bot';
    return 'Admin Dashboard';
});

const toggleSidebar = () => {
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
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
</script>
