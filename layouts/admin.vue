<template>
  <div class="min-h-screen bg-gray-100">
    <AdminSidebar />
    <div class="lg:ml-64 transition-all duration-300">
      <AdminHeader />
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from "~/components/admin/sidebar.vue";
import AdminHeader from "~/components/admin/header.vue";
</script>
