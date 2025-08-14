<template>
  <header class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-[70px]">
        <NuxtLink to="/" class="flex items-center">
          <img
            src="/img/logo.webp"
            alt="Flash Deals Logo"
            class="h-12 w-auto object-contain"
          />
        </NuxtLink>

        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="text-gray-700 hover:text-orange-500 font-medium flex items-center gap-2 transition-colors"
          >
            <FontAwesomeIcon :icon="faHome" class="w-4 h-4" />
            Home
          </NuxtLink>
          <NuxtLink
            to="/#"
            class="text-gray-700 hover:text-orange-500 font-medium flex items-center gap-2 transition-colors"
          >
            <FontAwesomeIcon :icon="faEnvelope" class="w-4 h-4" />
            Contact
          </NuxtLink>
        </nav>

        <div class="flex items-center space-x-4">
          <button
            class="p-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <FontAwesomeIcon :icon="faSearch" class="w-5 h-5" />
          </button>

          <NuxtLink
            to="/checkout"
            class="p-2 text-gray-600 hover:text-orange-500 relative transition-colors"
          >
            <FontAwesomeIcon :icon="faShoppingCart" class="w-5 h-5" />
            <ClientOnly>
              <span
                v-if="itemCount > 0"
                class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                >{{ itemCount }}</span
              >
              <template #fallback>
                <span
                  class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center opacity-0"
                  >0</span
                >
              </template>
            </ClientOnly>
          </NuxtLink>

          <button
            class="p-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <FontAwesomeIcon :icon="faUser" class="w-5 h-5" />
          </button>
          <button
            class="md:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <FontAwesomeIcon :icon="faBars" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHome,
  faEnvelope,
  faSearch,
  faShoppingCart,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const { itemCount } = useCart();
</script>
