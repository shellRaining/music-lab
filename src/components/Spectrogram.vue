<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  canvasWidth: number; // 画布宽度
  canvasHeight: number; // 画布高度
  barWidth: number; // 每根柱子的宽度
  minFrequency: number; // 最小可展示频率
  maxFrequency: number; // 最大可展示频率
  fftSize: number; // FFT 大小，可以间接计算出柱子数量，柱子数量(频率 bin) = fftSize / 2
}>();
const canvasEl = ref<HTMLCanvasElement | null>(null);

async function render() {
  if (!canvasEl.value) return;
  const ctx = canvasEl.value.getContext("2d");
  if (!ctx) return;

  // 创建音频上下文并加载音频
  const audioContext = new AudioContext();
  const musicBuffer = await fetch("/music.flac")
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer));

  // 初始化相应节点
  const sourceNode = audioContext.createBufferSource();
  const analyserNode = audioContext.createAnalyser();
  sourceNode.buffer = musicBuffer;
  analyserNode.fftSize = 2048;
  sourceNode.connect(analyserNode);
  analyserNode.connect(audioContext.destination);
  sourceNode.start();

  // 计算频谱柱子数量和间隔
  const barFrequencyRange = audioContext.sampleRate / analyserNode.fftSize;
  const barCnt = Math.floor(
    (props.maxFrequency - props.minFrequency) / barFrequencyRange,
  );
  const barsTotalWidth = barCnt * props.barWidth;
  const barInterval = (canvasEl.value.width - barsTotalWidth) / barCnt;

  function draw() {
    if (!canvasEl.value || !ctx) return;

    const dataArray = new Uint8Array(barCnt);
    analyserNode.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
    const barWidth = props.barWidth;
    let x = 0;

    for (let i = 0; i < barCnt; i++) {
      const barHeight = dataArray[i];
      ctx.fillRect(x, canvasEl.value.height - barHeight, barWidth, barHeight);
      x += barWidth + barInterval;
    }

    requestAnimationFrame(draw);
  }

  ctx.fillStyle = "rgb(255,255,255, 0.5)";
  draw();
}
</script>

<template>
  <canvas
    ref="canvasEl"
    @click="render"
    :width="canvasWidth"
    :height="canvasHeight"
  ></canvas>
</template>

<style scoped></style>
