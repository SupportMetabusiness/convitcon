export default defineNuxtRouteMiddleware(async (to, from) => {
    // Chỉ áp dụng cho các route admin
    if (!to.path.startsWith('/admin')) {
        return;
    }

    // Cho phép truy cập trang đăng nhập admin
    if (to.path === '/admin/login') {
        return;
    }

    // Kiểm tra xác thực
    try {
        const authStatus = await $fetch('/api/admin/auth', {
            method: 'GET'
        });

        if (!authStatus.authenticated) {
            return navigateTo('/admin/login');
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return navigateTo('/admin/login');
    }
});
