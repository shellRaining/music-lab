<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <nav>
    <RouterLink to="/">Spectrogram</RouterLink>
    <RouterLink to="/circle">Circular Spectrogram</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  justify-content: center;
  margin: 20px 0;

  a {
    margin: 0 10px;
  }
}
</style>
