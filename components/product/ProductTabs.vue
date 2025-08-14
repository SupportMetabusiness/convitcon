<template>
  <div class="space-y-6 sm:space-y-8 animate-fade-in-delayed">
    <div
      class="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-200 hover:border-orange-400"
    >
      <nav
        class="flex bg-gradient-to-r from-gray-50 to-white border-b border-gray-200"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 py-4 sm:py-5 px-4 sm:px-6 text-center font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative group"
          :class="
            activeTab === tab.id
              ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-red-50 scale-105'
              : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
          "
        >
          {{ tab.label }}
          <div
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"
          />
        </button>
      </nav>

      <div class="p-6 lg:p-8">
        <div v-if="activeTab === 'description'" class="space-y-6">
          <div
            class="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border-2 border-gray-300 hover:border-orange-400 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3
              class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
            >
              <div
                class="w-10 h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center"
              >
                <FontAwesomeIcon
                  :icon="faFileText"
                  class="w-5 h-5 text-orange-600"
                />
              </div>
              Product Description
            </h3>
            <p
              class="text-gray-700 leading-relaxed text-base whitespace-pre-line"
            >
              {{ product.description }}
            </p>
          </div>

          <div
            v-if="product.features && product.features.length > 0"
            class="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border-2 border-gray-300 hover:border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div
                class="w-10 h-10 bg-gradient-to-r from-gray-200 to-slate-200 rounded-full flex items-center justify-center"
              >
                <FontAwesomeIcon
                  :icon="faCheck"
                  class="w-5 h-5 text-gray-700"
                />
              </div>
              Key Features
            </h4>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li
                v-for="feature in product.features"
                :key="feature"
                class="flex items-start gap-3 p-3 rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105"
              >
                <div
                  class="w-8 h-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mt-0.5"
                >
                  <FontAwesomeIcon
                    :icon="faCheckCircle"
                    class="w-4 h-4 text-orange-600"
                  />
                </div>
                <span class="text-gray-700 font-medium">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div v-else-if="activeTab === 'care'" class="space-y-6">
          <div
            class="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border-2 border-gray-300 hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3
              class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
            >
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center"
              >
                <FontAwesomeIcon
                  :icon="faInfoCircle"
                  class="w-5 h-5 text-blue-600"
                />
              </div>
              Care Instructions
            </h3>
            <div class="space-y-3">
              <div
                v-for="instruction in product.careInstructions"
                :key="instruction"
                class="flex items-start gap-3 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
              >
                <div
                  class="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mt-1"
                >
                  <FontAwesomeIcon
                    :icon="faInfoCircle"
                    class="w-4 h-4 text-blue-600"
                  />
                </div>
                <span class="text-gray-700 font-medium leading-relaxed">{{
                  instruction
                }}</span>
              </div>
            </div>

            <div
              class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-lg"
            >
              <div class="text-blue-800 font-medium flex items-start gap-3">
                <div
                  class="w-8 h-8 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full flex items-center justify-center mt-0.5"
                >
                  <FontAwesomeIcon
                    :icon="faLightbulb"
                    class="w-4 h-4 text-blue-700"
                  />
                </div>
                <span>
                  <strong class="text-blue-900">Pro Tip:</strong> Following
                  these care instructions will help maintain the quality and
                  extend the life of your garment.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCheck,
  faCheckCircle,
  faInfoCircle,
  faLightbulb,
  faFileText,
} from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  product: Object,
});

const activeTab = ref("description");

const tabs = [
  { id: "description", label: "Description" },
  { id: "care", label: "Care Instructions" },
];
</script>
