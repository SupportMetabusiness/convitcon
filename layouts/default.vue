<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "~/components/globals/header.vue";
import Footer from "~/components/globals/footer.vue";
</script>
