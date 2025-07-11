<template>
  <div class="top-links">
    <router-link to="/login" class="q-px-sm text-white">Login</router-link>
    <router-link to="/register" class="q-px-sm text-white">Register</router-link>
  </div>
</template>

<style scoped>
.top-links a:hover {
  opacity: 0.6;
}

.top-links a {
  text-decoration: none;
}
</style>

<script setup lang="ts"></script>
