
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

  const draw = async (left?: File, right?: File) => {
    const [leftImage, rightImage] = await Promise.all([loadImage(left), loadImage(right)])
    const [x, y, w, h] = [0, 0, 100, 100];
    const leftColor = 'red';
    const rightColor = 'orange'
    const leftCanvas = document.querySelector<HTMLCanvasElement>('#left')!;
    const rightCanvas = document.querySelector<HTMLCanvasElement>('#right')!;
    leftCanvas.width = 100;
    leftCanvas.height = 100;
    rightCanvas.width = 100;
    rightCanvas.height = 100;
    const leftCtx = leftCanvas.getContext('2d')!;
    const rightCtx = rightCanvas.getContext('2d')!;
    if (!leftImage) {
      leftCtx.fillStyle = leftColor;
      leftCtx.fillRect(x, y, w, h);
    }
    else {
      leftCtx.drawImage(leftImage, 0, 0)
    }
    if (!rightImage) {
      rightCtx.fillStyle = rightColor
      rightCtx.fillRect(x, y, w, h)
    }
    else {
      leftCtx.drawImage(rightImage, 0, 0)
    }
    values.forEach((v) => {
      const canvas = document.querySelector<HTMLCanvasElement>(`#${v}`)!;
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d')!;
      if (!leftImage) {
        ctx.fillStyle = leftColor;
        ctx.fillRect(x, y, w, h);
      } else {
        leftCtx.drawImage(leftImage, 0, 0)
      }
      ctx.globalCompositeOperation = v;
      if (!rightImage) {
        ctx.fillStyle = rightColor
        ctx.fillRect(w / 2, h / 2, w, h)
      } else {
        leftCtx.drawImage(rightImage, 0, 0)
      }
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
        source-left
      </div>
      <div className="right-container">
        <input type='file' id="right-input" />
        <canvas id='right'></canvas>
        source-right
      </div>
      {
        values.map((v) => {
          return <div className="glo"><canvas id={v}></canvas> {v} </div>
        })
      }</div>
  </div>
}

export default GlobalCompositeOperation;
