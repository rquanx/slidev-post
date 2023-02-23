
import { ref, watchPostEffect } from 'vue'
import './global-composite-operation.css'

const values: GlobalCompositeOperation[] = ["color", "color-burn", "color-dodge", "copy", "darken", "destination-atop", "destination-in", "destination-out", "destination-over", "difference", "exclusion", "hard-light", "hue", "lighten", "lighter", "luminosity", "multiply", "overlay", "saturation", "screen", "soft-light", "source-atop", "source-in", "source-out", "source-over", "xor"];
const GlobalCompositeOperation = () => {
  const leftFile = ref<File>();
  const rightFile = ref<File>();

  const loadImage = (file?: File) => {
    return new Promise<HTMLImageElement | undefined>((res) => {
      if (!file) {
        res(undefined);
      }
      const img = new Image();
      img.onload = function () {
        res(img);
      }
      img.src = URL.createObjectURL(file!);
    })
  }

  const drawScaleImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, w: number, h: number, dx = x, dy = y) => {
    const wRatio = image.width / w;
    const hRatio = image.height / h;
    const ratio = wRatio > hRatio ? wRatio : hRatio;
    ctx.drawImage(image, x, y, w * ratio, h * ratio, dx, dy, w, h)
  }

  const drawRectOrImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement | undefined, color: string, x: number, y: number, w: number, h: number, dx = x, dy = y) => {
    if (!image) {
      ctx.fillStyle = color;
      ctx.fillRect(dx, dy, w, h);
    }
    else {
      drawScaleImage(ctx, image, x, y, w, h, dx, dy)
    }
  }

  const draw = async (left?: File, right?: File) => {
    const [leftImage, rightImage] = await Promise.all([loadImage(left), loadImage(right)])
    const [x, y, w, h] = [0, 0, 100, 100];
    const leftColor = 'red';
    const rightColor = 'orange'
    const leftCanvas = document.querySelector<HTMLCanvasElement>('#left')!;
    const rightCanvas = document.querySelector<HTMLCanvasElement>('#right')!;
    leftCanvas.width = w;
    leftCanvas.height = h;
    rightCanvas.width = w;
    rightCanvas.height = h;
    const leftCtx = leftCanvas.getContext('2d')!;
    const rightCtx = rightCanvas.getContext('2d')!;
    drawRectOrImage(leftCtx, leftImage, leftColor, x, y, w, h);
    drawRectOrImage(rightCtx, rightImage, rightColor, x, y, w, h);
    values.forEach((v) => {
      const canvas = document.querySelector<HTMLCanvasElement>(`#${v}`)!;
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d')!;
      drawRectOrImage(ctx, leftImage, leftColor, x, y, w, h)
      ctx.globalCompositeOperation = v;
      drawRectOrImage(ctx, rightImage, rightColor, x, y, w, h, w / 2, h / 2)
    })
  }

  watchPostEffect(() => {
    draw(leftFile.value, rightFile.value);
  })

  return <div className="container">
    <div className='display'>
      <div className="left-container">
        <input type='file' id="left-input" onChange={(e) => {
          // @ts-ignore
          const file = e.target?.files?.[0] as File;
          leftFile.value = file;
        }} />
        <canvas id="left"></canvas>
        left
      </div>
      <div className="right-container">
        <input type='file' id="right-input" onChange={(e) => {
          // @ts-ignore
          const file = e.target?.files?.[0] as File;
          rightFile.value = file;
        }} />
        <canvas id='right'></canvas>
        right
      </div>
      {
        values.map((v) => {
          return <div className="glo"><canvas id={v}></canvas> {v} </div>
        })
      }</div>
  </div>
}

export default GlobalCompositeOperation;
