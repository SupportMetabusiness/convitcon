<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 relative">
        <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, #f97316 2px, transparent 2px), radial-gradient(circle at 75% 75%, #ea580c 1px, transparent 1px); background-size: 50px 50px"></div>
        </div>
        <div class="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 py-2 sm:py-4 relative backdrop-blur-sm">
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
                <div class="flex flex-wrap justify-center lg:grid lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 text-white">
                    <div class="flex items-center gap-1 sm:gap-3 group cursor-pointer hover:bg-white/10 p-1 sm:p-3 rounded-xl transition-all duration-300">
                        <div class="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0">
                            <FontAwesomeIcon :icon="faShippingFast" class="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-xs sm:text-sm">Free Shipping</div>
                            <div class="text-xs text-orange-100 hidden sm:block">On all orders over $30</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 sm:gap-3 group cursor-pointer hover:bg-white/10 p-1 sm:p-3 rounded-xl transition-all duration-300">
                        <div class="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0">
                            <FontAwesomeIcon :icon="faUndo" class="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-xs sm:text-sm">30 Day Return</div>
                            <div class="text-xs text-orange-100 hidden sm:block">30 day money back guarantee</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 sm:gap-3 group cursor-pointer hover:bg-white/10 p-1 sm:p-3 rounded-xl transition-all duration-300">
                        <div class="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0">
                            <FontAwesomeIcon :icon="faGlobe" class="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-xs sm:text-sm">International Warranty</div>
                            <div class="text-xs text-orange-100 hidden sm:block">Offered in the country of usage</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 sm:gap-3 group cursor-pointer hover:bg-white/10 p-1 sm:p-3 rounded-xl transition-all duration-300">
                        <div class="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0">
                            <FontAwesomeIcon :icon="faCreditCard" class="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-xs sm:text-sm">100% Secure Payment</div>
                            <div class="text-xs text-orange-100 hidden sm:block">PayPal / MasterCard / Visa</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 relative">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div class="max-w-7xl mx-auto px-4 py-4 relative z-10">
                <nav class="flex items-center space-x-2 text-sm animate-fade-in-up">
                    <NuxtLink to="/" class="text-gray-500 hover:text-orange-600 transition-colors duration-300 hover:scale-105">Home</NuxtLink>
                    <FontAwesomeIcon :icon="faChevronRight" class="w-3 h-3 text-gray-400" />
                    <span class="text-gray-900 font-medium">{{ product.name || 'Loading...' }}</span>
                </nav>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16 relative z-10">
            <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>

            <div v-else>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                    <div class="space-y-4 animate-fade-in-up">
                        <ProductGallery :images="productImages" :selectedColor="selectedColor" />
                    </div>
                    <div class="space-y-6 animate-fade-in-delayed">
                        <!-- Simple Urgency Component -->
                        <ProductUrgencySimple :productId="product.id || 1" :initialStock="product.stock || 200" :initialViewers="1750" />

                        <ProductInfo :product="product" :selectedColor="selectedColor" :selectedSize="selectedSize" :quantity="quantity" @update:color="selectedColor = $event" @update:size="selectedSize = $event" @update:quantity="quantity = $event" @add-to-cart="handleAddToCart" />
                    </div>
                </div>

                <div class="mt-12 lg:mt-16 animate-fade-in-up">
                    <ProductTabs :product="product" />
                </div>
                <div class="mt-12 lg:mt-16">
                    <ProductReviews />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronRight, faShippingFast, faUndo, faGlobe, faCreditCard } from '@fortawesome/free-solid-svg-icons';

import ProductGallery from '~/components/product/ProductGallery.vue';
import ProductInfo from '~/components/product/ProductInfo.vue';
import ProductTabs from '~/components/product/ProductTabs.vue';
import ProductReviews from '~/components/product/ProductReviews.vue';
import ProductUrgencySimple from '~/components/product/ProductUrgencySimple.vue';

const selectedColor = ref('Green');
const selectedSize = ref('M');

const { data: productData, pending } = await useFetch('/api/admin/product', {
    server: true,
    transform: (response) => {
        if (response.success && response.data) {
            return response.data;
        }
        return null;
    }
});

const quantity = ref(1);

watch(
    productData,
    (newData) => {
        if (newData?.quantity) {
            quantity.value = Number(newData.quantity) || 1;
        }
    },
    { immediate: true }
);

const product = computed(() => {
    if (!productData.value) {
        return {
            id: null,
            name: '',
            description: '',
            price: 0,
            discount: 0,
            care_instructions: '',
            images: '[]',
            stock: 0,
            quantity: 1,
            originalPrice: 0,
            salePrice: 0,
            colors: ['Green', 'Blue', 'Red', 'Yellow'],
            sizes: ['S', 'M', 'L', 'XL'],
            features: [],
            careInstructions: []
        };
    }

    const data = productData.value;
    const price = Number(data.price) || 0;
    const discount = Number(data.discount) || 0;

    return {
        id: data.id,
        name: data.name || '',
        description: data.description || '',
        price,
        discount,
        care_instructions: data.care_instructions || '',
        images: data.images || '[]',
        stock: Number(data.stock) || 0,
        quantity: Number(data.quantity) || 1,
        originalPrice: price,
        salePrice: price - (price * discount) / 100,
        colors: ['Green', 'Blue', 'Red', 'Yellow'],
        sizes: ['S', 'M', 'L', 'XL'],
        features: [],
        careInstructions: data.care_instructions ? data.care_instructions.split('\n') : [],
        product_url: data.product_url || ''
    };
});

const productImages = computed(() => {
    if (!productData.value?.images) {
        return ['/img/cotton_short.webp'];
    }

    try {
        const images = JSON.parse(productData.value.images);
        return images.length > 0 ? images : ['/img/cotton_short.webp'];
    } catch {
        return ['/img/cotton_short.webp'];
    }
});

const { addToCart } = useCart();

const handleAddToCart = async () => {
    try {
        const productWithImage = {
            ...product.value,
            image: productImages.value[0]
        };

        // Add to cart
        addToCart(productWithImage, selectedColor.value, selectedSize.value, quantity.value);

        // Check Telegram configuration first
        const telegramConfig = await $fetch('/api/telegram/check-config');

        if (telegramConfig.configured) {
            // Send Telegram notification
            const telegramResponse = await $fetch('/api/telegram/notify-cart', {
                method: 'POST',
                body: {
                    product: productWithImage,
                    quantity: quantity.value,
                    selectedColor: selectedColor.value,
                    selectedSize: selectedSize.value
                }
            });

            if (telegramResponse.success) {
            } else {
                console.warn('⚠️ Failed to send Telegram notification:', telegramResponse.error);
            }
        } else {
            console.log('ℹ️ Telegram not configured:', telegramConfig.message);
        }

        // Navigate to checkout page after a short delay
        setTimeout(() => {
            navigateTo('/checkout');
        }, 1000);
    } catch (error) {
        console.error('❌ Error adding to cart:', error);
    }
};

useHead(() => ({
    title: product.value.name ? `${product.value.name} - ${product.value.salePrice}€` : 'Product',
    meta: [
        {
            name: 'description',
            content: product.value.description || 'Premium quality product with great discount.'
        }
    ]
}));

definePageMeta({
    layout: 'default'
});
</script>
