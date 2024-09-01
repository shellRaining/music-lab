<script setup lang="ts">
import CircularSpectrogram from "@/components/CircularSpectrogram.vue";

const brushOpts = {
  lineWidth: 2,
  storkeStyle: "rgba(0, 0, 0, 1)",
  fillStyle: "rgba(0, 0, 0, 0.5)",
};
const audioOpts = {
  fftSize: 8192 * 2,
  minFrequency: 20,
  maxFrequency: 2000,
};
const spectrumStyleOpts = {
  radius: 200,
  maxBarHeight: 200,
  canvasWidth: 600,
  canvasHeight: 800,
};
</script>

<template>
  <main class="spectrogram-container">
    <div class="background-image"></div>
    <div class="canvas-wrapper">
      <CircularSpectrogram
        music-url="/航迹云.flac"
        :brush-opts="brushOpts"
        :audio-opts="audioOpts"
        :spectrum-style-opts="spectrumStyleOpts"
      ></CircularSpectrogram>
    </div>
  </main>
</template>

<style scoped>
.spectrogram-container {
  position: relative;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/森林小径的尽头.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1;
}

.canvas-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
