<template>
  <div class="space-y-4 animate-fade-in-up">
    <div
      class="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square group backdrop-blur-sm"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"
      ></div>
      <div
        class="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse-glow"
      ></div>
      <div
        class="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-orange-300 to-pink-300 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
      ></div>
      <img
        :src="currentImage"
        :alt="'Product'"
        class="relative w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 shadow-2xl rounded-2xl sm:rounded-3xl z-10"
        :style="{ filter: getColorFilter(selectedColor) }"
        @error="handleImageError"
      />

      <div
        class="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-full text-sm sm:text-base font-bold shadow-lg animate-pulse-slow transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500"
      >
        -60%
      </div>

      <button
        v-if="images.length > 1"
        @click="previousImage"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 z-10"
      >
        <FontAwesomeIcon
          :icon="faChevronLeft"
          class="w-5 h-5 text-gray-700 hover:text-orange-600 transition-colors duration-300"
        />
      </button>

      <button
        v-if="images.length > 1"
        @click="nextImage"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 z-10"
      >
        <FontAwesomeIcon
          :icon="faChevronRight"
          class="w-5 h-5 text-gray-700 hover:text-orange-600 transition-colors duration-300"
        />
      </button>
    </div>

    <div
      v-if="images.length > 1"
      class="grid grid-cols-4 gap-3 sm:gap-4 animate-stagger-in"
    >
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="setCurrentImage(index)"
        class="relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl group"
        :class="
          currentImageIndex === index
            ? 'border-orange-500 ring-2 ring-orange-200 scale-105'
            : 'border-transparent hover:border-orange-300'
        "
      >
        <img
          :src="image"
          :alt="`Product thumbnail ${index + 1}`"
          class="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
          :style="{ filter: getColorFilter(selectedColor) }"
          @error="handleImageError"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  images: {
    type: Array,
    default: () => [""],
  },
  selectedColor: {
    type: String,
    default: "Green",
  },
});

const currentImageIndex = ref(0);

const currentImage = computed(() => {
  return props.images[currentImageIndex.value] || "/img/placeholder.svg";
});

const setCurrentImage = (index) => {
  currentImageIndex.value = index;
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length;
};

const previousImage = () => {
  currentImageIndex.value =
    currentImageIndex.value === 0
      ? props.images.length - 1
      : currentImageIndex.value - 1;
};

const handleImageError = (event) => {
  event.target.src = "";
};

const getColorFilter = (color) => {
  const colorFilters = {
    Blue: "none",
    Green: "hue-rotate(250deg) saturate(1.3)",
    Red: "hue-rotate(140deg) saturate(4)",
    Yellow: "hue-rotate(180deg) saturate(1.2) brightness(1.1)",
  };
  return colorFilters[color] || "none";
};
</script>
