<script setup lang="ts">
import Spectrogram from "@/components/Spectrogram.vue";
</script>

<template>
  <main>
    <Spectrogram
      :canvas-width="800"
      :canvas-height="800"
      :bar-width="1"
      :min-frequency="20"
      :max-frequency="2000"
      :fft-size="2048"
    ></Spectrogram>
  </main>
</template>

<style scoped>
canvas {
  background-color: black;
}
</style>
