<template>
    <div id="app">
        <NuxtRouteAnnouncer />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup>
import { useTracking } from '~/composables/useTracking';

const { loadConfig, initializeTracking, trackPageView } = useTracking();

// Initialize tracking on app startup
onMounted(async () => {
    try {
        await loadConfig();
        initializeTracking();

        // Track initial page view
        trackPageView();
    } catch (error) {
        console.error('Error initializing tracking:', error);
    }
});

// Track page views on route changes
const route = useRoute();
watch(
    () => route.fullPath,
    (newPath) => {
        nextTick(() => {
            trackPageView(newPath);
        });
    }
);
</script>

<style>
@import '~/assets/css/main.css';
</style>
