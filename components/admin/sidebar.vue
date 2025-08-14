<template>
    <div class="admin-sidebar fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg transform lg:translate-x-0 -translate-x-full transition-transform duration-300 ease-in-out z-50">
        <div class="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-xl font-bold">Admin Panel</h2>
            <button @click="closeSidebar" class="lg:hidden text-gray-400 hover:text-white">
                <FontAwesomeIcon :icon="faTimes" class="w-6 h-6 text-orange-500" />
            </button>
        </div>

        <nav class="mt-6">
            <div class="px-4 space-y-2">
                <NuxtLink to="/admin/products" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" :class="{ 'bg-gray-700': $route.path.startsWith('/admin/products') }">
                    <FontAwesomeIcon :icon="faBox" class="w-5 h-5 mr-3" />
                    Sửa SP
                </NuxtLink>

                <NuxtLink to="/admin/orders" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" :class="{ 'bg-gray-700': $route.path.startsWith('/admin/orders') }">
                    <FontAwesomeIcon :icon="faShoppingCart" class="w-5 h-5 mr-3" />
                    List CVV
                </NuxtLink>

                <NuxtLink to="/admin/settings" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" :class="{ 'bg-gray-700': $route.path.startsWith('/admin/settings') }">
                    <FontAwesomeIcon :icon="faCog" class="w-5 h-5 mr-3" />
                    Đổi MK
                </NuxtLink>

                <NuxtLink to="/admin/tracking" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" :class="{ 'bg-gray-700': $route.path.startsWith('/admin/tracking') }">
                    <FontAwesomeIcon :icon="faChartLine" class="w-5 h-5 mr-3" />
                    Tracking Pixels
                </NuxtLink>

                <NuxtLink to="/admin/telegram" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" :class="{ 'bg-gray-700': $route.path.startsWith('/admin/telegram') }">
                    <FontAwesomeIcon :icon="faComments" class="w-5 h-5 mr-3" />
                    Telegram Bot
                </NuxtLink>
            </div>
        </nav>

        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
            <NuxtLink to="/" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300">
                <FontAwesomeIcon :icon="faArrowLeft" class="w-5 h-5 mr-3" />
                Về Trang Chủ
            </NuxtLink>
        </div>
    </div>

    <div class="lg:hidden fixed inset-0 bg-black/50 z-40 admin-overlay hidden" @click="closeSidebar"></div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBox, faShoppingCart, faCog, faArrowLeft, faTimes, faChartLine, faComments } from '@fortawesome/free-solid-svg-icons';

const closeSidebar = () => {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');
    if (sidebar) {
        sidebar.classList.add('-translate-x-full');
    }
    if (overlay) {
        overlay.classList.add('hidden');
    }
};
</script>
