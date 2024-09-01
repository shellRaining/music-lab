<script setup lang="ts">
import { computed, ref } from "vue";
import { drawCircle, moveToCenter, setBrush } from "./lib";
import type { AudioOpts, BrushOpts, SpectrumStyleOpts } from "./lib";

const props = defineProps<{
  brushOpts?: Partial<BrushOpts>;
  audioOpts?: Partial<AudioOpts>;
  spectrumStyleOpts?: Partial<SpectrumStyleOpts>;
  musicUrl: string;
}>();
const canvasEl = ref<HTMLCanvasElement | null>(null);

// 使用 computed 计算属性来获取完整的 brushOpts 和 audioOpts
const brushOpts = computed(() => {
  return {
    lineWidth: 2,
    strokeStyle: "rgba(255, 255, 255, 0.5)",
    fillStyle: "rgba(255, 255, 255, 0.5)",
    ...props.brushOpts,
  };
});
const audioOpts = computed(() => {
  return {
    fftSize: 4096,
    minFrequency: 20,
    maxFrequency: 2000,
    minDecibels: -90,
    maxDecibels: -10,
    ...props.audioOpts,
  };
});
const spectrumStyleOpts = computed(() => {
  return {
    radius: 200,
    maxBarHeight: 200,
    canvasWidth: 600,
    canvasHeight: 600,
    ...props.spectrumStyleOpts,
  };
});

// 音频上下文和分析器
let audioContext: AudioContext;
let analyserNode: AnalyserNode;

// 初始化音频
async function initAudio() {
  audioContext = new AudioContext();
  const musicBuffer = await fetch(props.musicUrl)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer));

  const sourceNode = audioContext.createBufferSource();
  analyserNode = audioContext.createAnalyser();
  sourceNode.buffer = musicBuffer;
  analyserNode.fftSize = audioOpts.value.fftSize;
  analyserNode.minDecibels = audioOpts.value.minDecibels;
  analyserNode.maxDecibels = audioOpts.value.maxDecibels;
  sourceNode.connect(analyserNode);
  analyserNode.connect(audioContext.destination);
  sourceNode.start();
}

function normalizeDecibels(
  decibelValue: number,
  minDecibels: number,
  maxDecibels: number,
): number {
  decibelValue = Math.max(minDecibels, Math.min(maxDecibels, decibelValue));
  const normalized = (decibelValue - minDecibels) / (maxDecibels - minDecibels);
  return Math.pow(normalized, 3);
}

// 绘制单个柱子
function drawBar(
  ctx: CanvasRenderingContext2D,
  i: number,
  barRotateAngle: number,
  decibelValue: number,
) {
  // 进行归一化避免柱子向内部绘制
  const normalizedHeight = normalizeDecibels(
    decibelValue,
    analyserNode.minDecibels,
    analyserNode.maxDecibels,
  );
  const barHeight = normalizedHeight * spectrumStyleOpts.value.maxBarHeight;

  const angle = barRotateAngle * i;
  const startX = Math.cos(angle) * spectrumStyleOpts.value.radius;
  const startY = Math.sin(angle) * spectrumStyleOpts.value.radius;
  const endX = Math.cos(angle) * (spectrumStyleOpts.value.radius + barHeight);
  const endY = Math.sin(angle) * (spectrumStyleOpts.value.radius + barHeight);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

// 主绘制函数
function draw(
  ctx: CanvasRenderingContext2D,
  barCnt: number,
  barRotateAngle: number,
) {
  moveToCenter(
    ctx,
    spectrumStyleOpts.value.canvasWidth,
    spectrumStyleOpts.value.canvasHeight,
  );
  drawCircle(ctx, spectrumStyleOpts.value.radius);

  const dataArray = new Float32Array(barCnt);
  analyserNode.getFloatFrequencyData(dataArray);

  for (let i = 0; i < barCnt; i++) {
    drawBar(ctx, i, barRotateAngle, dataArray[i]);
  }

  requestAnimationFrame(() => draw(ctx, barCnt, barRotateAngle));
}

// 计算柱子数量
function getBarCnt(
  sampleRate: number,
  fftSize: number,
  minFrequency: number,
  maxFrequency: number,
) {
  const barFrequencyRange = sampleRate / fftSize;
  return Math.floor((maxFrequency - minFrequency) / barFrequencyRange);
}

let playing = false;

// 主渲染函数
async function render() {
  if (!canvasEl.value || playing) return;
  const ctx = canvasEl.value.getContext("2d");
  if (!ctx) return;

  await initAudio();
  const barCnt = getBarCnt(
    audioContext.sampleRate,
    audioOpts.value.fftSize,
    audioOpts.value.minFrequency,
    audioOpts.value.maxFrequency,
  );
  const barRotateAngle = (2 * Math.PI) / barCnt;
  setBrush(ctx, brushOpts.value);
  draw(ctx, barCnt, barRotateAngle);
  playing = true;
  canvasEl.value.style.opacity = "1";
}
</script>

<template>
  <canvas
    ref="canvasEl"
    @click="render"
    :width="spectrumStyleOpts.canvasWidth"
    :height="spectrumStyleOpts.canvasHeight"
    aria-label="Audio spectrum visualization"
  ></canvas>
</template>

<style scoped>
canvas {
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
</style>
