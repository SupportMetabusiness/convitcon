<template>
    <div class="space-y-6 sm:space-y-8 animate-fade-in-delayed">
        <div class="space-y-4">
            <div class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold animate-bounce-gentle shadow-lg">
                <FontAwesomeIcon :icon="faFire" class="w-4 h-4 animate-flicker" />
                Hot Deal
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {{ product.name }}
            </h1>

            <div class="flex flex-wrap items-center gap-4 mb-4">
                <div class="flex items-center gap-3">
                    <span class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">€{{ product.salePrice }}</span>
                    <span class="text-xl sm:text-2xl text-gray-500 line-through">€{{ product.originalPrice }}</span>
                </div>
                <div class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse-slow">Save {{ product.discount }}%</div>
            </div>

            <div class="flex items-center gap-3 text-sm text-gray-600">
                <div class="flex items-center">
                    <FontAwesomeIcon v-for="i in 5" :key="i" :icon="faStar" class="w-4 h-4" :class="i <= 4 ? 'text-yellow-400' : 'text-gray-300'" />
                </div>
                <span class="font-medium text-gray-900">4.8</span>
                <span>(2,847 reviews)</span>
                <span v-if="product.stock > 0" class="text-blue-600 font-medium">✓ {{ product.stock }} In Stock</span>
                <span v-else class="text-red-600 font-medium">✗ Out of Stock</span>
            </div>
        </div>

        <div class="space-y-6">
            <div>
                <h3 class="block text-lg font-bold text-gray-900 mb-4">Choose Color</h3>
                <div class="flex gap-3">
                    <button v-for="color in product.colors" :key="color" @click="$emit('update:color', color)" class="w-14 h-14 rounded-full border-3 transition-all duration-300 flex items-center justify-center transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl" :class="selectedColor === color ? 'border-orange-500 ring-4 ring-orange-200 scale-110' : 'border-gray-300 hover:border-orange-400'">
                        <div class="w-10 h-10 rounded-full shadow-inner" :class="getColorClass(color)"></div>
                    </button>
                </div>
                <p class="text-sm text-gray-600 mt-2">
                    Selected:
                    <span class="font-medium text-gray-900">{{ selectedColor }}</span>
                </p>
            </div>

            <div>
                <h3 class="block text-lg font-bold text-gray-900 mb-4">Choose Size</h3>
                <div class="grid grid-cols-5 gap-3">
                    <button v-for="size in product.sizes" :key="size" @click="$emit('update:size', size)" class="py-3 px-4 border-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl" :class="selectedSize === size ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-800 scale-105' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'">
                        {{ size }}
                    </button>
                </div>
                <p class="text-sm text-gray-600 mt-2">
                    Selected:
                    <span class="font-medium text-gray-900">{{ selectedSize }}</span>
                </p>
            </div>

            <div>
                <h3 class="block text-lg font-bold text-gray-900 mb-4">Quantity</h3>
                <div class="flex items-center bg-white border-2 border-gray-300 hover:border-orange-400 rounded-xl w-36 shadow-lg hover:shadow-xl transition-all duration-300">
                    <button @click="decreaseQuantity" class="flex items-center justify-center w-12 h-12 hover:bg-orange-50 transition-all duration-300 rounded-l-xl group" :disabled="quantity <= 1" :class="quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''">
                        <FontAwesomeIcon :icon="faMinus" class="w-4 h-4 text-gray-600 group-hover:text-orange-600 transition-colors" />
                    </button>
                    <div class="flex-1 text-center py-3 font-bold text-xl text-gray-900 bg-gray-50">
                        {{ quantity }}
                    </div>
                    <button @click="increaseQuantity" class="flex items-center justify-center w-12 h-12 hover:bg-orange-50 transition-all duration-300 rounded-r-xl group" :disabled="quantity >= product.stock" :class="quantity >= product.stock ? 'opacity-50 cursor-not-allowed' : ''">
                        <FontAwesomeIcon :icon="faPlus" class="w-4 h-4 text-gray-600 group-hover:text-orange-600 transition-colors" />
                    </button>
                </div>
                <p v-if="quantity >= product.stock" class="text-sm text-red-600 mt-2 font-medium">Maximum available: {{ product.stock }} units</p>
            </div>
        </div>

        <div class="space-y-4">
            <button v-if="product.product_url" @click="buyNow" :disabled="product.stock === 0" class="w-full font-bold py-4 sm:py-5 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl border-2 flex items-center justify-center transform hover:scale-105 hover:-translate-y-1" :class="product.stock === 0 ? 'bg-gray-400 border-gray-400 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-green-500'">
                <FontAwesomeIcon :icon="faExternalLinkAlt" class="w-5 h-5 mr-3" />
                {{ product.stock === 0 ? 'Out of Stock' : 'Mua Ngay' }}
            </button>

            <button @click="$emit('add-to-cart')" :disabled="product.stock === 0" class="w-full font-bold py-4 sm:py-5 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl border-2 flex items-center justify-center" :class="product.stock === 0 ? 'bg-gray-400 border-gray-400 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-orange-500'">
                <FontAwesomeIcon :icon="faShoppingCart" class="w-5 h-5 mr-3" />
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faStar, faMinus, faPlus, faShoppingCart, faFire, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
    product: Object,
    selectedColor: String,
    selectedSize: String,
    quantity: Number
});

const emit = defineEmits(['update:color', 'update:size', 'update:quantity', 'add-to-cart']);

const getColorClass = (color) => {
    const colorMap = {
        Blue: 'bg-blue-500',
        Green: 'bg-green-500',
        Red: 'bg-red-500',
        Yellow: 'bg-yellow-500'
    };
    return colorMap[color] || 'bg-gray-400';
};

const decreaseQuantity = () => {
    if (props.quantity > 1) {
        emit('update:quantity', props.quantity - 1);
    }
};

const increaseQuantity = () => {
    if (props.quantity < props.product.stock) {
        emit('update:quantity', props.quantity + 1);
    }
};

const buyNow = () => {
    if (props.product.product_url && props.product.stock > 0) {
        window.open(props.product.product_url, '_blank');
    }
};
</script>
