<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">Đang tải...</h2>
                <p class="text-gray-600">Vui lòng đợi trong giây lát</p>
            </div>
        </div>

        <!-- Product not found -->
        <div v-else-if="!product" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
                <p class="text-gray-600 mb-4">Sản phẩm có thể đã bị xóa hoặc không tồn tại</p>
                <NuxtLink to="/" class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"> Về trang chủ </NuxtLink>
            </div>
        </div>

        <!-- Product display -->
        <div v-else>
            <!-- Top Features Bar -->
            <div class="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 py-2 sm:py-4">
                <div class="max-w-7xl mx-auto px-2 sm:px-4">
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

            <!-- Breadcrumb -->
            <div class="max-w-7xl mx-auto px-4 py-4">
                <nav class="flex items-center space-x-2 text-sm">
                    <NuxtLink to="/" class="text-orange-600 hover:text-orange-800 transition-colors">Home</NuxtLink>
                    <FontAwesomeIcon :icon="faChevronRight" class="w-3 h-3 text-gray-400" />
                    <span class="text-gray-600">{{ product.name }}</span>
                </nav>
            </div>

            <!-- Main Product Section -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    <!-- Product Images -->
                    <div class="space-y-4">
                        <div class="relative group">
                            <img :src="currentImage" :alt="product.name" class="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl" />
                            <div v-if="product.discount > 0" class="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse-slow shadow-lg">-{{ product.discount }}%</div>
                            <!-- Image Navigation Arrows -->
                            <button v-if="productImages.length > 1" @click="previousImage" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                                <FontAwesomeIcon :icon="faChevronLeft" class="w-4 h-4" />
                            </button>
                            <button v-if="productImages.length > 1" @click="nextImage" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                                <FontAwesomeIcon :icon="faChevronRight" class="w-4 h-4" />
                            </button>
                        </div>

                        <!-- Thumbnail Images -->
                        <div v-if="productImages.length > 1" class="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2">
                            <button v-for="(image, index) in productImages" :key="index" @click="currentImageIndex = index" :class="['flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300', currentImageIndex === index ? 'border-orange-500 shadow-lg' : 'border-gray-200 hover:border-orange-300']">
                                <img :src="image" :alt="`Product ${index + 1}`" class="w-full h-full object-cover" />
                            </button>
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="space-y-8">
                        <!-- Simple Urgency Component -->
                        <ProductUrgencySimple :productId="productId" :initialStock="product?.stock || 200" :initialViewers="1750" />

                        <!-- Hot Deal Badge -->
                        <div class="flex items-center space-x-2">
                            <div class="flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                <FontAwesomeIcon :icon="faFire" class="w-4 h-4 mr-2" />
                                Hot Deal
                            </div>
                        </div>

                        <!-- Product Title -->
                        <div>
                            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>

                            <!-- Price Section -->
                            <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 space-y-2 sm:space-y-0">
                                <div class="flex items-center space-x-3">
                                    <span class="text-3xl sm:text-4xl font-bold text-green-600">{{ currencySymbol }}{{ finalPrice.toFixed(2) }}</span>
                                    <span v-if="product.discount > 0" class="text-xl sm:text-2xl text-gray-500 line-through">{{ currencySymbol }}{{ product.price.toFixed(2) }}</span>
                                </div>
                                <div v-if="product.discount > 0" class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-bold w-fit">Save {{ product.discount }}%</div>
                            </div>

                            <!-- Rating and Reviews -->
                            <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6 space-y-2 sm:space-y-0">
                                <div class="flex items-center space-x-1">
                                    <div class="flex">
                                        <FontAwesomeIcon v-for="i in 5" :key="i" :icon="faStar" class="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <span class="text-lg font-bold text-gray-900">4.8</span>
                                    <span class="text-gray-600">(2,847 reviews)</span>
                                </div>
                                <div class="flex items-center text-green-600 font-semibold">
                                    <FontAwesomeIcon :icon="faCheck" class="w-4 h-4 mr-2" />
                                    {{ product.stock }} In Stock
                                </div>
                            </div>
                        </div>

                        <!-- Product Options -->
                        <div class="space-y-6">
                            <!-- Size Selection - Only show for clothing products -->
                            <div v-if="product.product_type === 'clothing' && availableSizes.length > 0">
                                <h3 class="text-lg font-semibold text-gray-900 mb-3">Choose Size</h3>
                                <div class="flex space-x-3">
                                    <button v-for="size in availableSizes" :key="size" @click="selectedSize = size" :class="['px-4 py-2 border-2 rounded-lg font-semibold transition-all duration-300', selectedSize === size ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300 text-gray-700 hover:border-orange-300']">
                                        {{ size }}
                                    </button>
                                </div>
                                <p class="text-sm text-gray-600 mt-2">
                                    Selected: <span class="font-semibold">{{ selectedSize }}</span>
                                </p>
                            </div>

                            <!-- Quantity -->
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                                <div class="flex items-center space-x-4">
                                    <div class="flex items-center border-2 border-gray-300 rounded-lg">
                                        <button @click="decreaseQuantity" :disabled="quantity <= 1" class="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                            <FontAwesomeIcon :icon="faMinus" class="w-4 h-4" />
                                        </button>
                                        <span class="px-6 py-3 font-semibold text-lg">{{ quantity }}</span>
                                        <button @click="increaseQuantity" :disabled="quantity >= product.stock" class="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                            <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Buy More Save More Variants -->
                            <div v-if="productVariants.length > 0" class="space-y-4">
                                <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ tv('buyMoreSaveMore') }}</h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div v-for="(variant, index) in productVariants" :key="index" class="relative group">
                                        <div @click="selectVariant(variant)" class="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 rounded-xl p-4 transition-all duration-300 hover:border-orange-400 hover:shadow-lg cursor-pointer transform hover:scale-105" :class="{ 'border-orange-500 bg-gradient-to-br from-orange-100 to-pink-100': quantity === variant.quantity }">
                                            <!-- Variant Badge -->
                                            <div class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">{{ variant.discount }}% OFF</div>

                                            <!-- Variant Title -->
                                            <div class="text-center mb-3">
                                                <h4 class="font-bold text-gray-900 text-sm">{{ tv('buy') }} {{ variant.quantity }} {{ variant.discount }}% {{ tv('off') }} {{ variant.emoji }}</h4>
                                            </div>

                                            <!-- Pricing -->
                                            <div class="text-center space-y-1">
                                                <div class="text-lg font-bold text-green-600">{{ currencySymbol }}{{ getVariantPrice(variant).toFixed(2) }}</div>
                                                <div class="text-sm text-gray-500 line-through">{{ currencySymbol }}{{ (product.price || 0).toFixed(2) }}</div>
                                                <div class="text-xs text-orange-600 font-semibold">{{ tv('save') }} {{ currencySymbol }}{{ getVariantSavings(variant).toFixed(2) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Add to Cart Button -->
                        <button @click="addToCart" :disabled="product.stock === 0" class="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-red-500 hover:to-pink-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center space-x-3 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed animate-shimmer bg-size-200">
                            <FontAwesomeIcon :icon="faShoppingCart" class="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>{{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}</span>
                        </button>
                    </div>
                </div>

                <!-- Product Tabs -->
                <div class="mt-12 sm:mt-16">
                    <div class="border-b border-gray-200">
                        <nav class="flex space-x-4 sm:space-x-8 overflow-x-auto">
                            <button @click="activeTab = 'description'" :class="['py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap', activeTab === 'description' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">Description</button>
                            <button @click="activeTab = 'care'" :class="['py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap', activeTab === 'care' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">Care Instructions</button>
                        </nav>
                    </div>

                    <div class="py-8">
                        <!-- Description Tab -->
                        <div v-if="activeTab === 'description'" class="prose max-w-none">
                            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <FontAwesomeIcon :icon="faInfoCircle" class="w-5 h-5 mr-2 text-orange-500" />
                                Product Description
                            </h3>
                            <div class="text-gray-700 leading-relaxed space-y-4">
                                <!-- Display description content with enhanced styling -->
                                <div v-if="product.description && product.description.trim()" class="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:space-y-2 prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto prose-table:border-collapse prose-table:w-full prose-th:bg-gray-50 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic prose-hr:border-gray-300 prose-hr:my-8" v-html="product.description"></div>
                                <div v-else class="text-gray-500 italic text-center py-8">
                                    <FontAwesomeIcon :icon="faInfoCircle" class="w-8 h-8 mb-2 text-gray-400" />
                                    <p>Chưa có mô tả cho sản phẩm này.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Care Instructions Tab -->
                        <div v-if="activeTab === 'care'" class="prose max-w-none">
                            <h3 class="text-xl font-bold text-gray-900 mb-4">Care Instructions</h3>
                            <div class="bg-orange-50 p-6 rounded-xl border border-orange-200">
                                <p class="text-orange-800">{{ product.care_instructions || 'No special care instructions provided.' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customer Reviews Section -->
                <div class="mt-12 sm:mt-16">
                    <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-2 sm:space-y-0">
                            <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Customer Reviews</h3>
                            <div class="flex items-center space-x-2 sm:space-x-4">
                                <div class="flex items-center space-x-1">
                                    <div class="flex">
                                        <FontAwesomeIcon v-for="i in 5" :key="i" :icon="faStar" class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                                    </div>
                                    <span class="text-lg sm:text-xl font-bold text-gray-900">4.8</span>
                                    <span class="text-sm sm:text-base text-gray-600">(2,847 reviews)</span>
                                </div>
                            </div>
                        </div>

                        <!-- Review Stats -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div class="text-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg sm:rounded-xl">
                                <div class="text-2xl sm:text-3xl font-bold text-green-600">95%</div>
                                <div class="text-xs sm:text-sm text-gray-600">Recommend this product</div>
                            </div>
                            <div class="text-center p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl">
                                <div class="text-2xl sm:text-3xl font-bold text-orange-600">4.8/5</div>
                                <div class="text-xs sm:text-sm text-gray-600">Average rating</div>
                            </div>
                            <div class="text-center p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl">
                                <div class="text-2xl sm:text-3xl font-bold text-purple-600">2,847</div>
                                <div class="text-xs sm:text-sm text-gray-600">Total reviews</div>
                            </div>
                        </div>

                        <!-- All Reviews (Product + Sample) -->
                        <div class="space-y-6">
                            <div v-for="review in allReviews" :key="review.id" class="border-b border-gray-200 pb-6 last:border-b-0">
                                <div class="flex items-start space-x-4">
                                    <div class="flex-shrink-0">
                                        <div class="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {{ review.name.charAt(0) }}
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 class="font-semibold text-gray-900">{{ review.name }}</h4>
                                                <div class="flex items-center space-x-2">
                                                    <div class="flex">
                                                        <FontAwesomeIcon v-for="i in 5" :key="i" :icon="faStar" class="w-4 h-4" :class="i <= (review.rating || 5) ? 'text-yellow-400' : 'text-gray-300'" />
                                                    </div>
                                                    <span class="text-sm text-gray-500">{{ review.date }}</span>
                                                </div>
                                            </div>
                                            <span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">Verified Purchase</span>
                                        </div>
                                        <p class="text-gray-700 mb-3">{{ review.comment }}</p>
                                        <div class="flex items-center space-x-4">
                                            <button class="flex items-center space-x-2 text-sm text-gray-500 hover:text-orange-600 transition-colors">
                                                <FontAwesomeIcon :icon="faThumbsUp" class="w-4 h-4" />
                                                <span>Helpful ({{ review.helpful }})</span>
                                            </button>
                                            <button class="text-sm text-gray-500 hover:text-orange-600 transition-colors">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button class="w-full mt-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">Write a Review</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faShippingFast, faUndo, faGlobe, faCreditCard, faChevronRight, faChevronLeft, faFire, faStar, faCheck, faMinus, faPlus, faShoppingCart, faInfoCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import ProductUrgencySimple from '~/components/product/ProductUrgencySimple.vue';
import { useLocalization } from '~/composables/useLocalization';
import { useCart } from '~/composables/useCart';
import { useCurrencyLanguage } from '~/composables/useCurrencyLanguage';
// DragonEditorViewer is auto-imported by dragon-editor module

const route = useRoute();
const productId = route.params.id;
const { tv } = useLocalization();
const { addToCart: addToCartStore } = useCart();

// Currency-based language detection
const { autoSetLanguageFromProduct } = useCurrencyLanguage();

// Reactive data
const loading = ref(true);
const product = ref(null);
const currentImageIndex = ref(0);
const selectedSize = ref('M');
const selectedColor = ref('Green');
const quantity = ref(1);
const activeTab = ref('description');

// Available options - will be loaded from product data
const availableSizes = ref(['S', 'M', 'L', 'XL']);

// Sample reviews data (default reviews)
const sampleReviews = ref([
    {
        id: 1,
        name: 'Sarah Mitchell',
        date: '2 days ago',
        rating: 5,
        comment: "Amazing quality! The fabric is incredibly soft and the fit is perfect. I've received so many compliments wearing this set. The colors are vibrant and exactly as shown in the pictures. Definitely worth every penny and I'll be ordering more colors soon!",
        helpful: 12
    },
    {
        id: 2,
        name: 'Mike Rodriguez',
        date: '1 week ago',
        rating: 4,
        comment: 'Great set overall, very comfortable for daily wear. The material feels premium and the stitching is solid. Only minor issue is that it runs slightly large, so consider sizing down. The color is exactly as shown and the shipping was fast.',
        helpful: 8
    },
    {
        id: 3,
        name: 'Emma Thompson',
        date: '2 weeks ago',
        rating: 5,
        comment: 'Love this outfit! Perfect for summer activities and casual outings. The breathable fabric keeps me cool all day. Customer service was excellent when I had questions about sizing. Fast shipping and excellent packaging. Highly recommend!',
        helpful: 15
    },
    {
        id: 4,
        name: 'David Chen',
        date: '3 weeks ago',
        rating: 5,
        comment: 'Exceeded my expectations! The quality is outstanding for the price point. Very comfortable and stylish. My wife loved it so much she ordered one for herself. Will definitely be a repeat customer.',
        helpful: 6
    }
]);

// Product reviews from database
const productReviews = ref([]);

// Combined reviews (product reviews + sample reviews)
const allReviews = computed(() => {
    const combined = [...productReviews.value, ...sampleReviews.value];
    // Add unique IDs to avoid conflicts
    return combined.map((review, index) => ({
        ...review,
        id: review.id || `review-${index}`,
        rating: review.rating || 5,
        helpful: review.helpful || 0,
        date: review.date || 'Recently'
    }));
});

// Reviews statistics
const reviewsStats = computed(() => {
    const reviews = allReviews.value;
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + (review.rating || 5), 0) / totalReviews : 4.8;

    return {
        total: totalReviews,
        average: averageRating,
        recommendation: Math.round((reviews.filter((r) => (r.rating || 5) >= 4).length / totalReviews) * 100) || 95
    };
});

// Computed properties
const finalPrice = computed(() => {
    if (!product.value) return 0;
    const price = product.value.price || 0;
    const discount = product.value.discount || 0;
    return price * (1 - discount / 100);
});

const productImages = computed(() => {
    if (!product.value?.images) return ['/img/cotton_short.webp'];
    try {
        const images = JSON.parse(product.value.images);
        return images.length > 0 ? images : ['/img/cotton_short.webp'];
    } catch {
        return ['/img/cotton_short.webp'];
    }
});

const productVariants = computed(() => {
    if (!product.value?.variants) return [];
    try {
        const variants = JSON.parse(product.value.variants);
        return Array.isArray(variants) ? variants : [];
    } catch {
        return [];
    }
});

const currentImage = computed(() => {
    return productImages.value[currentImageIndex.value] || '/img/cotton_short.webp';
});

// Methods
const getStockClass = (stock) => {
    if (stock === 0) return 'text-red-600 font-bold';
    if (stock < 10) return 'text-yellow-600 font-bold';
    return 'text-green-600 font-bold';
};

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
    } else {
        currentImageIndex.value = productImages.value.length - 1;
    }
};

const nextImage = () => {
    if (currentImageIndex.value < productImages.value.length - 1) {
        currentImageIndex.value++;
    } else {
        currentImageIndex.value = 0;
    }
};

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

const increaseQuantity = () => {
    if (quantity.value < product.value.stock) {
        quantity.value++;
    }
};

// Calculate sale price based on quantity and variants
const calculateSalePrice = computed(() => {
    if (!product.value) return 0;

    const basePrice = product.value.price || 0;
    const currentQuantity = quantity.value;

    // Find matching variant for current quantity
    const matchingVariant = productVariants.value.find((variant) => variant.quantity === currentQuantity);

    if (matchingVariant) {
        // Apply variant discount
        return basePrice * (1 - matchingVariant.discount / 100);
    } else {
        // Apply product discount if no variant matches
        const productDiscount = product.value.discount || 0;
        return basePrice * (1 - productDiscount / 100);
    }
});

const addToCart = async () => {
    if (!product.value) return;

    try {
        // Check if current quantity matches a variant
        const currentQuantity = quantity.value;
        const matchingVariant = productVariants.value.find((variant) => variant.quantity === currentQuantity);
        const isVariantPricing = !!matchingVariant;

        // Prepare product data for cart
        const productForCart = {
            id: product.value.id,
            name: product.value.name,
            originalPrice: product.value.price || 0,
            salePrice: calculateSalePrice.value,
            discount: product.value.discount || 0,
            image: productImages.value[0] || '/img/cotton_short.webp',
            currency: product.value.currency || 'USD',
            isVariantPricing: isVariantPricing,
            slug: product.value.slug || product.value.id
        };

        // Add to cart with variants pricing
        addToCartStore(productForCart, selectedColor.value, selectedSize.value, quantity.value);

        // Check Telegram configuration first
        try {
            const telegramConfig = await $fetch('/api/telegram/check-config');

            if (telegramConfig && telegramConfig.configured) {
                // Send Telegram notification
                try {
                    const telegramResponse = await $fetch('/api/telegram/notify-cart', {
                        method: 'POST',
                        body: {
                            product: productForCart,
                            quantity: quantity.value,
                            selectedColor: selectedColor.value,
                            selectedSize: selectedSize.value
                        }
                    });

                    if (telegramResponse && telegramResponse.success) {
                    } else {
                        console.warn('⚠️ Failed to send Telegram notification:', telegramResponse?.error);
                    }
                } catch (telegramError) {
                    console.warn('⚠️ Error sending Telegram notification:', telegramError);
                }
            } else {
                console.log('ℹ️ Telegram not configured:', telegramConfig?.message);
            }
        } catch (telegramConfigError) {
            console.warn('⚠️ Error checking Telegram configuration:', telegramConfigError);
        }

        // Navigate to checkout page after a short delay
        setTimeout(() => {
            navigateTo('/checkout');
        }, 1000);
    } catch (error) {
        console.error('❌ Error adding to cart:', error);
    }
};

// Variants Functions
const getVariantPrice = (variant) => {
    const basePrice = product.value?.price || 0;
    return basePrice * (1 - variant.discount / 100);
};

const getVariantSavings = (variant) => {
    const basePrice = product.value?.price || 0;
    return basePrice * (variant.discount / 100);
};

// Currency symbol
const currencySymbol = computed(() => {
    return product.value?.currency === 'EUR' ? '€' : '$';
});

// Select variant function
const selectVariant = (variant) => {
    quantity.value = variant.quantity;
};

// Convert HTML to Dragon Editor content format for display
const getProductDescriptionContent = (description) => {
    if (!description || description.trim() === '') {
        return [];
    }

    // Parse HTML and convert to Dragon Editor blocks with proper formatting
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    const blocks = [];

    // Process each element in the HTML
    const processElement = (element) => {
        const tagName = element.tagName?.toLowerCase();
        const textContent = element.textContent?.trim();

        if (!textContent) return;

        switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                blocks.push({
                    type: 'heading',
                    level: parseInt(tagName.charAt(1)),
                    textContent: textContent,
                    classList: []
                });
                break;
            case 'p':
                if (textContent) {
                    blocks.push({
                        type: 'text',
                        textContent: textContent,
                        classList: []
                    });
                }
                break;
            case 'ul':
            case 'ol':
                const listItems = Array.from(element.querySelectorAll('li')).map((li) => ({
                    type: 'listItem',
                    textContent: li.textContent?.trim() || '',
                    classList: []
                }));
                if (listItems.length > 0) {
                    blocks.push({
                        type: 'list',
                        element: tagName,
                        child: listItems,
                        classList: []
                    });
                }
                break;
            case 'img':
                blocks.push({
                    type: 'image',
                    src: element.src || '',
                    caption: element.alt || '',
                    maxWidth: 800,
                    classList: []
                });
                break;
            case 'pre':
                const codeElement = element.querySelector('code');
                if (codeElement) {
                    blocks.push({
                        type: 'code',
                        language: codeElement.className?.replace('language-', '') || 'text',
                        textContent: codeElement.textContent || '',
                        classList: []
                    });
                }
                break;
            default:
                // For other elements, treat as text
                if (textContent) {
                    blocks.push({
                        type: 'text',
                        textContent: textContent,
                        classList: []
                    });
                }
                break;
        }
    };

    // Process all child elements
    const bodyElements = doc.body.children;
    if (bodyElements.length > 0) {
        Array.from(bodyElements).forEach(processElement);
    } else {
        // If no structured HTML, treat as plain text with line breaks
        const lines = description.split('\n').filter((line) => line.trim());
        lines.forEach((line) => {
            if (line.trim()) {
                blocks.push({
                    type: 'text',
                    textContent: line.trim(),
                    classList: []
                });
            }
        });
    }

    return blocks.length > 0
        ? blocks
        : [
              {
                  type: 'text',
                  textContent: description.replace(/<[^>]*>/g, ''),
                  classList: []
              }
          ];
};

onMounted(async () => {
    try {
        loading.value = true;

        // Fetch product data using public API
        const response = await $fetch(`/api/product/${productId}`);

        if (response && response.success && response.data) {
            product.value = response.data;

            // Auto-detect and set language based on product currency
            await autoSetLanguageFromProduct(productId);

            // Load sizes from product data
            if (response.data.sizes) {
                try {
                    const productSizes = JSON.parse(response.data.sizes);
                    if (Array.isArray(productSizes) && productSizes.length > 0) {
                        availableSizes.value = productSizes;
                    }
                } catch (error) {
                    console.error('Error parsing product sizes:', error);
                }
            }

            // Load reviews from product data
            if (response.data.reviews) {
                try {
                    const reviews = JSON.parse(response.data.reviews);
                    if (Array.isArray(reviews)) {
                        productReviews.value = reviews;
                        console.log('Loaded product reviews:', reviews);
                    }
                } catch (error) {
                    console.error('Error parsing product reviews:', error);
                    productReviews.value = [];
                }
            } else {
                productReviews.value = [];
            }
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
    } finally {
        loading.value = false;
    }
});

useHead(() => ({
    title: product.value ? `${product.value.name} - Sản phẩm` : 'Sản phẩm',
    meta: [
        {
            name: 'description',
            content: product.value?.description || 'Chi tiết sản phẩm'
        }
    ]
}));
</script>
