  <link rel="stylesheet" href="https://use.typekit.net/pxn8wdc.css">

<script lang="ts">
  
  
  import { onMount, tick } from 'svelte';
   // @ts-ignore
  import imagesLoaded from 'imagesloaded';
 
 

  let items: (HTMLElement | null)[] = [];
  $: console.log('items:', items);
 


  const images = [
    '/images/1.jpg',
    '/images/2.png',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
  ];

  const Gimages=[
    '/images/grid1.jpg',
    '/images/grid2.jpg',
    '/images/grid3.jpg',
    '/images/grid4.jpg',
    '/images/grid5.jpg',
    '/images/grid6.jpg',
    '/images/grid7.jpg',
    '/images/grid8.jpg',
    '/images/grid9.jpg',
    '/images/grid10.jpg',
  ]

  

  const count = images.length;

   onMount(() => {
    (async () => {
      await tick();
      const gridEl = document.querySelector('.grid');
      const rotateEl = document.querySelector('#rotate');

      if (gridEl) {
        imagesLoaded(gridEl, { background: true }, () => {
          window.addEventListener('scroll', handleScroll);
          handleScroll();
        });
      }
      if (rotateEl) {
        imagesLoaded(rotateEl, { background: true }, () => {
          // 如果有需要針對 rotate 區塊做額外處理可加
        });
      }
    })();

    // 清理
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function handleScroll() {
    const scrollY = window.scrollY;
    const itemSpacing = 300; // 每階樓梯間距
    const radius = 300;

    items.forEach((el, i) => {
      const baseY = i * itemSpacing;
      const relativeScroll = scrollY - baseY;

      const angle = relativeScroll * 0.3;
      const x = Math.sin(angle * Math.PI / 180) * radius;
      const z = Math.cos(angle * Math.PI / 180) * radius - 400;
      const y = (baseY - scrollY) ;


      // 當圖片接近中心，放大
      const distanceFromCenter = Math.abs(y);
      
      const maxScale = 1.5;
      const minScale = 1;
      const scale = Math.max(minScale, maxScale - distanceFromCenter / 600);

      if (el) {
        el.style.transform = `
          scale(${scale})
          translateX(${x}px)
          translateY(${y}px)
          translateZ(${z}px)
          
          rotateY(${angle}deg)
          translate(-50%, -50%)`;
      }
    });
  }

  

</script>

<style>
 .font-alt {
  font-family: "lores-12", sans-serif;
  font-weight: 400;
}

.grid {
  padding: 20vh 0;
  width: var(--grid-width);
  max-width: var(--grid-max-width);
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  position: relative;
  display: grid;
  gap: var(--grid-gap);
  margin-top: 20vh;
  margin-bottom: 10vh;

  --grid-width: 100%;
  --grid-max-width: 300px;
  --grid-item-ratio: 1.2;
  --grid-item-radius: 4px;
  --grid-gap: 2rem;
  --grid-columns: 2;
  --grid-columns-full: 7;
  --grid-rows-full: 5;
  --grid-item-translate: 0px;
  --grid-item-height: auto;
}

.grid__item {
  margin: 0;
  position: relative;
  z-index: 1;
  perspective: 800px;
  will-change: transform, opacity;
}

.grid__item > .grid__item-img,
.grid__item-imgwrap {
  width: 100%;
  aspect-ratio: var(--grid-item-ratio);
  height: var(--grid-item-height);
  border-radius: var(--grid-item-radius);
  transform-style: preserve-3d;
}

.grid__item-imgwrap {
  position: relative;
  overflow: hidden;
  will-change: filter;
  height: var(--grid-item-height); /* 加這行 */
  --grid-item-translate: 0px;
}

.grid__item-img {
  background-size: cover;
  background-position: 50% 20%;
  backface-visibility: hidden;
  will-change: transform;
  height: 200px;
  
  
}

.grid__item-imgwrap > .grid__item-img {
  position: absolute;
  top: calc(-1 * var(--grid-item-translate));
  left: calc(-1 * var(--grid-item-translate));
  height: calc(100% + var(--grid-item-translate) * 2);
  width: calc(100% + var(--grid-item-translate) * 2);
}

.intro {
  height: calc(100vh - 4rem);
  text-align: center;
  justify-items: center;
  display: grid;
  align-content: start;
  margin-bottom: 30vh;
  grid-auto-rows: 1fr;
  --color-bg: #000;
  gap: 1.5rem;
  background: linear-gradient(to bottom, var(--color-bg), rgba(0,0,0,0.4), var(--color-bg)), url(/images/bg.jpg) no-repeat 50% -10%;
  background-size: cover;
  
}

.intro__title {
  margin: 0;
  line-height: .9;
  align-self: end;
  margin: 0;
  font-weight: 400;
  text-transform: uppercase;
  font-size: clamp(2rem,6vw,4rem);
  
}

.intro__info {
  max-width: 12ch;
  margin-bottom: 4rem;
  padding-bottom: 1rem;
  line-height: 1.2;
  opacity: 0.4;
  position: relative;
  align-self: end;
  text-transform: uppercase;
  font-size: 13px;
  align-self: end;
}

.intro__info::after {
  content: "";
  width: 1px;
  height: 4rem;
  background: linear-gradient(to bottom, #fff, black);
  position: absolute;
  top: 100%;
  left: 50%;
}

  
</style>



<main class="relative">


  <div
    class="pointer-events-none absolute inset-0 z-[5000]"
    style="background: linear-gradient(to right, #000, transparent, #000); background-repeat: no-repeat; background-size: 100%; content: '';">
  </div>

  <div class="intro "> 
      <h1 class="intro__title font-alt text-white !text-5xl ">qingshan</h1> 
      <nav class="tags hidden">
        <a href="https://tympanus.net/codrops/demos/?tag=scroll">#scroll</a>
        <a href="https://tympanus.net/codrops/demos/?tag=3d">#3d</a>
        <a href="https://tympanus.net/codrops/demos/?tag=grid">#grid</a>
      </nav>
      <span class="intro__info">Scroll gently &amp; enjoy</span> 
    </div>

<!-- 旋轉區塊 -->
<section id="rotate">
    <div class=" fixed inset-0 -z-9 bg-black  bg-center  bg-contain bg-no-repeat"></div>
      <div class="relative h-[350vh] [perspective-1500px]">
        <div class="sticky top-0 h-screen [transform-style: preserve-3d] ">
          {#each images as image, i}
            <div class="absolute top-1/2 left-1/2 w-[300px] h-[200px] bg-cover bg-center rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-linear [transform:translate(-50%,-50%)] [transform-style:preserve-3d] will-change-transform"
              bind:this={items[i]} 
              style={`background-image: url('${image}')`}
            ></div>
          {/each}
      </div>
    </div>
 </section>

 <!-- grid動畫-->
<section class=" place-items-center w-full relative">
  <div class="grid ">
    {#each Gimages as image}
      <figure class="grid__item">
        <div class="grid__item-imgwrap">
          <div class="grid__item-img" style={`background-image: url('${image}')`}></div>
        </div>
      </figure>
    {/each}
  </div>
</section>

</main>
