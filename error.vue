<template>
  <NuxtLayout name="default">
    <div
      class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex flex-col justify-center items-center px-4 relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-red-400/5"
      ></div>
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-3xl opacity-10 animate-pulse-glow"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-3xl opacity-10 animate-pulse-glow"
      ></div>

      <div class="text-center relative z-10 max-w-2xl mx-auto">
        <div class="mb-8 animate-fade-in-up">
          <div class="relative group inline-block">
            <div
              class="absolute -inset-4 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse-glow"
            ></div>
            <div
              class="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
            >
              <FontAwesomeIcon
                :icon="getErrorIcon()"
                class="text-4xl sm:text-5xl text-white group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        <h1
          class="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-delayed"
        >
          <span
            class="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient"
          >
            {{ error.statusCode }}
          </span>
        </h1>

        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 animate-slide-in-left"
        >
          {{ getErrorTitle() }}
        </h2>

        <p
          class="text-lg sm:text-xl text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed animate-slide-in-right"
        >
          {{ getErrorMessage() }}
        </p>

        <div
          class="flex flex-col sm:flex-row gap-4 justify-center animate-stagger-in"
        >
          <NuxtLink
            to="/"
            class="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-red-500 hover:to-pink-500 text-white font-bold text-lg rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 animate-shimmer bg-size-200"
          >
            <FontAwesomeIcon
              :icon="faHome"
              class="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300"
            />
            Go Home
          </NuxtLink>

          <button
            @click="handleError"
            class="group inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-orange-50 text-gray-900 font-bold text-lg rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FontAwesomeIcon
              :icon="faRefresh"
              class="mr-3 w-5 h-5 group-hover:scale-110 group-hover:rotate-180 transition-all duration-500"
            />
            Try Again
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHome,
  faRefresh,
  faSearch,
  faServer,
  faLock,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  error: Object,
});

const getErrorTitle = () => {
  switch (props.error?.statusCode) {
    case 404:
      return "Page Not Found";
    case 500:
      return "Server Error";
    case 403:
      return "Access Denied";
    default:
      return "Something Went Wrong";
  }
};

const getErrorMessage = () => {
  switch (props.error?.statusCode) {
    case 404:
      return "The page you are looking for does not exist or has been moved.";
    case 500:
      return "The server encountered an error. Please try again later.";
    case 403:
      return "You do not have permission to access this page.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

const getErrorIcon = () => {
  switch (props.error?.statusCode) {
    case 404:
      return faSearch;
    case 500:
      return faServer;
    case 403:
      return faLock;
    default:
      return faExclamationTriangle;
  }
};

const handleError = () => {
  clearError({ redirect: "/" });
};

useHead({
  title: `Error ${props.error?.statusCode || "500"}`,
  meta: [{ name: "robots", content: "noindex" }],
});
</script>
