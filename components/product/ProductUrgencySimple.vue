<template>
    <div class="space-y-3 mb-6">
        <!-- Hurry! Only X Left in stock -->
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span class="text-gray-800 text-sm">
                <span class="font-semibold">Hurry! Only</span>
                <span class="font-bold text-orange-600 mx-1">{{ stockLeft }}</span>
                <span class="font-semibold">Left in stock</span>
            </span>
        </div>

        <!-- People are viewing this right now -->
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-800 text-sm">
                <span class="font-bold text-green-600">{{ viewersCount }}</span>
                <span class="font-semibold ml-1">People are viewing this right now</span>
            </span>
        </div>

        <!-- Last Minute - Sale end in -->
        <div class="text-gray-800 text-sm">
            <span class="font-semibold">Last Minute - Sale end in</span>
            <span class="font-bold text-red-600 ml-1">{{ formatTime(timeLeft.minutes) }}:{{ formatTime(timeLeft.seconds) }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
    productId: {
        type: [Number, String],
        default: 1
    },
    initialStock: {
        type: Number,
        default: 200
    },
    initialViewers: {
        type: Number,
        default: 1750 // Random between 1500-2000
    }
});

// Reactive state
const stockLeft = ref(props.initialStock);
const viewersCount = ref(props.initialViewers);
const saleEndTime = ref(null);
const currentTime = ref(new Date());
const isStockUpdating = ref(false);
const isViewerUpdating = ref(false);

// Intervals
let viewerInterval = null;
let stockInterval = null;
let timeInterval = null;

// Computed property for time left
const timeLeft = computed(() => {
    if (!saleEndTime.value) {
        return { hours: 0, minutes: 9, seconds: 59 }; // Default fallback - shows 09:59
    }

    const now = currentTime.value;
    const end = new Date(saleEndTime.value);
    const diff = end - now;

    if (diff <= 0) {
        // Reset sale end time when it expires (extend for another 10 minutes)
        saleEndTime.value = new Date(Date.now() + 10 * 60 * 1000);
        return { hours: 0, minutes: 9, seconds: 59 };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
});

// Format time to always show 2 digits
const formatTime = (time) => {
    return (time || 0).toString().padStart(2, '0');
};

// Update viewers count
const updateViewersCount = () => {
    isViewerUpdating.value = true;

    // Random change ±5-15 people (more dynamic for higher numbers)
    const change = Math.floor(Math.random() * 30) - 15;
    const newCount = Math.max(viewersCount.value + change, 1500);

    // Keep it realistic between 1500-2000
    viewersCount.value = Math.min(newCount, 2000);

    setTimeout(() => {
        isViewerUpdating.value = false;
    }, 500);
};

// Update stock occasionally
const updateStock = () => {
    if (stockLeft.value <= 10) return;

    isStockUpdating.value = true;

    // Occasionally decrease stock by 1-2
    const shouldDecrease = Math.random() < 0.2; // 20% chance
    if (shouldDecrease) {
        const decrease = Math.floor(Math.random() * 2) + 1;
        stockLeft.value = Math.max(stockLeft.value - decrease, 10);
    }

    setTimeout(() => {
        isStockUpdating.value = false;
    }, 500);
};

// Try to load real data from API
const loadDataFromAPI = async () => {
    try {
        // Try to get viewers data
        const viewersResponse = await $fetch('/api/product/viewers', {
            params: { id: props.productId }
        });

        if (viewersResponse.success) {
            // Ensure viewers count is within our desired range (1500-2000)
            const apiViewers = viewersResponse.data.viewersCount;
            viewersCount.value = Math.max(Math.min(apiViewers, 2000), 1500);
        }

        // Try to get product stats
        const statsResponse = await $fetch('/api/product/stats', {
            params: { id: props.productId }
        });

        if (statsResponse.success) {
            stockLeft.value = statsResponse.data.stock || stockLeft.value;
        }
    } catch (error) {
        console.log('⚠️ Using fallback values for simple urgency component');
        // Set random viewers between 1500-2000 as fallback
        viewersCount.value = Math.floor(Math.random() * 500) + 1500;
    }
};

onMounted(async () => {
    // Load data from API
    await loadDataFromAPI();

    // Set sale end time (10 minutes from now)
    saleEndTime.value = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update current time every second for real-time countdown
    currentTime.value = new Date();
    timeInterval = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);

    // Update viewers every 12-25 seconds
    viewerInterval = setInterval(updateViewersCount, Math.random() * 13000 + 12000);

    // Update stock every 180-400 seconds (3-7 minutes)
    stockInterval = setInterval(updateStock, Math.random() * 220000 + 180000);
});

onUnmounted(() => {
    if (viewerInterval) clearInterval(viewerInterval);
    if (stockInterval) clearInterval(stockInterval);
    if (timeInterval) clearInterval(timeInterval);
});
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>
