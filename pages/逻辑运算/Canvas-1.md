---
clicks: 4
---

# Canvas-GlobalCompositeOperation

<div grid="~ cols-2 gap-10">

<div class="pt-25">

```ts {all|4-5|7-8|6|all}
const ctx = canvas.getContext('2d')!;
canvas.width = 150;
canvas.height = 150;
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);
ctx.globalCompositeOperation = 'destination-in';
ctx.fillStyle = 'orange';
ctx.fillRect(50, 50, 100, 100);
```
</div>

<div class="ml-40">
  <img class="h20 mt-10" v-click=1 src="https://fastly.jsdelivr.net/gh/rquanx/my-statics@master/images/16770014980961677001497367.png"/>
  <img class="h20 mt-10" v-click=2 src="https://fastly.jsdelivr.net/gh/rquanx/my-statics@master/images/16770014304621677001430425.png"/>
  <img class="h20 mt-10" v-click=3 src="https://fastly.jsdelivr.net/gh/rquanx/my-statics@master/images/16770014420941677001441299.png"/>
</div>

</div>

