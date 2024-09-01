// canvas context lib

interface BrushOpts {
  strokeStyle: string | CanvasGradient | CanvasPattern;
  fillStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
}

interface AudioOpts {
  minFrequency: number; // 最小可展示频率
  maxFrequency: number; // 最大可展示频率
  minDecibels: number; // 最小可展示分贝
  maxDecibels: number; // 最大可展示分贝
  fftSize: number; // FFT 大小，可以间接计算出柱子数量，柱子数量(频率 bin) = fftSize / 2
}

interface SpectrumStyleOpts {
  radius: number; // 圆半径
  canvasWidth: number; // 画布宽度
  canvasHeight: number; // 画布高度
  maxBarHeight: number; // 柱子最大高度
}

// 设置笔刷的样式，包括描边颜色、填充颜色、线宽，默认为黑色描边、黑色填充、线宽为 1
function setBrush(
  ctx: CanvasRenderingContext2D,
  { strokeStyle = "black", fillStyle = "black", lineWidth = 1 }: BrushOpts,
) {
  ctx.strokeStyle = strokeStyle;
  ctx.fillStyle = fillStyle;
  ctx.lineWidth = lineWidth;
}

// 将画布清空并将绘制坐标原点为画布正中心
function moveToCenter(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
) {
  // 重置坐标系原点并绘制圆形边框
  ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置变换
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
}

// 以画笔所在处为原点绘制一个半径为 r 的圆，并将画笔移动回原点
function drawCircle(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.moveTo(0, 0);
}

export type { BrushOpts, AudioOpts, SpectrumStyleOpts };
export { setBrush, moveToCenter, drawCircle };
