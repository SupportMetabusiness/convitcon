<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <!-- Dynamic Products Section -->
        <div id="products" class="bg-white py-12 sm:py-16 lg:py-24">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="text-center mb-12">
                    <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sản phẩm nổi bật</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">Khám phá bộ sưu tập sản phẩm chất lượng cao của chúng tôi</p>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    <div v-for="i in 3" :key="i" class="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
                        <div class="h-48 sm:h-64 lg:h-80 bg-gray-200"></div>
                        <div class="p-4 sm:p-6 lg:p-8">
                            <div class="h-6 bg-gray-200 rounded mb-3"></div>
                            <div class="h-4 bg-gray-200 rounded mb-6"></div>
                            <div class="h-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

                <!-- No Products State -->
                <div v-else-if="products.length === 0" class="text-center py-12">
                    <div class="bg-orange-50 rounded-2xl p-8 max-w-md mx-auto">
                        <div class="text-6xl mb-4">🛍️</div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Chưa có sản phẩm</h3>
                        <p class="text-gray-600 mb-4">Hãy thêm sản phẩm đầu tiên vào hệ thống</p>
                        <NuxtLink to="/admin" class="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"> Vào Admin Panel </NuxtLink>
                    </div>
                </div>

                <!-- Products Grid -->
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    <div v-for="(product, index) in products" :key="product.id" class="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 flex flex-col h-full">
                        <div class="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
                            <img :src="getProductImage(product)" :alt="product.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <!-- Discount Badge -->
                            <div v-if="product.discount > 0" class="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">{{ product.discount }}% OFF</div>
                            <!-- Stock Badge -->
                            <div v-else-if="product.stock > 0 && product.stock < 10" class="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">{{ product.stock }} RESTANT</div>
                            <!-- New Product Badge -->
                            <div v-else class="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">NOUVEAU</div>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                                {{ product.name }}
                            </h3>
                            <div class="text-gray-600 mb-4 text-sm flex-grow line-clamp-3" v-html="product.description"></div>

                            <!-- Price Section -->
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center space-x-2">
                                    <span class="text-2xl font-bold text-green-600">{{ product.currency === 'EUR' ? '€' : '$' }}{{ getFinalPrice(product).toFixed(2) }}</span>
                                    <span v-if="product.discount > 0" class="text-sm text-gray-500 line-through">{{ product.currency === 'EUR' ? '€' : '$' }}{{ product.price.toFixed(2) }}</span>
                                </div>
                                <div class="text-right">
                                    <div class="text-xs text-gray-500">Stock</div>
                                    <div :class="getStockClass(product.stock)" class="text-sm font-bold">
                                        {{ product.stock }}
                                    </div>
                                </div>
                            </div>

                            <button @click="goToProduct(product)" :disabled="product.stock === 0" class="w-full font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mt-auto" :class="product.stock === 0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'">
                                {{ product.stock === 0 ? 'Hết hàng' : 'Xem chi tiết' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact and Information Section -->
        <div class="bg-gradient-to-br from-gray-50 via-white to-orange-50 py-12 sm:py-16 lg:py-24">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    <!-- Contact Information -->
                    <div class="space-y-8">
                        <div>
                            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">LIÊN HỆ</h2>
                            <div class="space-y-4 text-lg text-gray-700">
                                <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email <a href="mailto:info@ccvmmo1.com" class="text-orange-600 hover:text-orange-700 font-semibold">info@ccvmmo1.com</a> hoặc qua trang liên hệ.</p>
                                <p>Chúng tôi có mặt từ thứ 2 đến thứ 6, từ 9h đến 17h. Trong trường hợp vắng mặt, hãy để lại tin nhắn: <a href="tel:0123456789" class="text-orange-600 hover:text-orange-700 font-semibold">0123 456 789</a></p>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">THÔNG TIN</h3>
                            <div class="space-y-3">
                                <a href="#" class="block text-gray-700 hover:text-orange-600 transition-colors duration-300">Chính sách đổi trả và hoàn tiền</a>
                                <a href="#" class="block text-gray-700 hover:text-orange-600 transition-colors duration-300">Chính sách bảo mật</a>
                                <a href="#" class="block text-gray-700 hover:text-orange-600 transition-colors duration-300">Chính sách vận chuyển</a>
                            </div>
                        </div>
                    </div>

                    <!-- Store Hours and Features -->
                    <div class="space-y-8">
                        <div class="bg-white rounded-2xl p-8 shadow-xl">
                            <h3 class="text-2xl font-bold text-gray-900 mb-6">Ưu điểm của chúng tôi</h3>
                            <div class="space-y-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon :icon="faShippingFast" class="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-900">Miễn phí vận chuyển</h4>
                                        <p class="text-gray-600 text-sm">Đặt hàng trực tuyến và tận hưởng vận chuyển miễn phí</p>
                                    </div>
                                </div>

                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon :icon="faClock" class="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-900">Thời gian linh hoạt</h4>
                                        <p class="text-gray-600 text-sm">Mở cửa 7 ngày/tuần cho sự tiện lợi của bạn</p>
                                    </div>
                                </div>

                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon :icon="faHeadset" class="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-900">Hỗ trợ khách hàng</h4>
                                        <p class="text-gray-600 text-sm">Dịch vụ khách hàng có sẵn từ thứ 2 đến thứ 6</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Business Info Section -->
        <BusinessInfo />
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowDown, faShippingFast, faHeadset, faClock } from '@fortawesome/free-solid-svg-icons';
import BusinessInfo from '~/components/business/BusinessInfo.vue';
import { useLocalization } from '~/composables/useLocalization';

// Reactive data
const loading = ref(true);
const products = ref([]);

// Computed properties
const getFinalPrice = (product) => {
    const price = product.price || 0;
    const discount = product.discount || 0;
    return price * (1 - discount / 100);
};

const getProductImage = (product) => {
    try {
        const images = JSON.parse(product.images || '[]');
        if (images.length > 0) {
            return images[0];
        }
    } catch (error) {
        console.log('Error parsing images:', error);
    }
    // Fallback images based on product name or default
    const name = product.name.toLowerCase();
    if (name.includes('men') || name.includes('man')) {
        return '/img/men.jpg';
    } else if (name.includes('women') || name.includes('woman') || name.includes('girl')) {
        return '/img/woman.jpg';
    } else if (name.includes('winter') || name.includes('coat')) {
        return '/img/winter.jpg';
    }
    return '/img/cotton_short.webp'; // Default fallback
};

const getStockClass = (stock) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 10) return 'text-yellow-600';
    return 'text-green-600';
};

const goToProduct = (product) => {
    if (product.product_url && product.product_url.trim() !== '') {
        // Redirect to external URL
        window.open(product.product_url, '_blank');
    } else {
        // Navigate to internal product page
        navigateTo(`/product/${product.id}`);
    }
};

// Load products from API
const loadProducts = async () => {
    try {
        loading.value = true;
        const response = await $fetch('/api/product/list');
        if (response.success && response.data) {
            // Show up to 6 products on homepage
            products.value = response.data.slice(0, 6);
        } else {
            products.value = [];
        }
    } catch (error) {
        console.error('Error loading products:', error);
        products.value = [];
    } finally {
        loading.value = false;
    }
};

// Load products on mount
onMounted(() => {
    loadProducts();
});

useHead({
    title: 'CCVMMO1 - Website thương mại điện tử',
    meta: [
        {
            name: 'description',
            content: 'Website thương mại điện tử hiện đại với đầy đủ tính năng. Khám phá bộ sưu tập sản phẩm chất lượng cao.'
        }
    ]
});

definePageMeta({
    layout: 'default'
});
</script>
