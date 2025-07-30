<script lang="ts">

  
  import { onMount, tick } from 'svelte';
  import { fade } from 'svelte/transition';
   // @ts-ignore
  import imagesLoaded from 'imagesLoaded';
  import SlideInSection from '../components/SlideInSection.svelte';
  import ScrollytellingSection from '../components/ScrollytellingSection.svelte';
  import Particle from '../components/Particle.svelte';
  import Introani from '../components/Introani.svelte';
  
  
  let items: (HTMLElement | null)[] = [];
  
  let loading = true;

  const onDone = () => {
    loading = false;
  };
 

  const Gimages=[
    '/images/st2.jpg',
    '/images/st2.jpg',
    '/images/st1.jpg',
    '/images/st3.jpg',
    '/images/st1.jpg',
    '/images/st2.jpg',
    '/images/st3.jpg',
    '/images/st2.jpg',
    '/images/st1.jpg',
    '/images/st3.jpg',
  ]

  const images=[
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/10.jpg',
  ]
 
  
 

  
const count = images.length;

   onMount(() => {                       //grid,rotate animation
    // 測試 grid 元素是否存在
    console.log('Testing grid elements...');
    const gridEl = document.querySelector('.grid');
   
    if (gridEl) {
      const gridItems = gridEl.querySelectorAll('.grid__item-imgwrap');
      console.log('Grid items found:', gridItems.length);
    }

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
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  function handleScroll() {
    const scrollY = window.scrollY;
    const itemSpacing = 300; // 每階樓梯間距
    const radius = 300;

    items.forEach((el, i) => {
      const baseY = i * itemSpacing;
      const relativeScroll = scrollY - baseY;

      const angle = relativeScroll * 0.3-30;
      const x = Math.sin(angle * Math.PI / 180) * radius ;
      const z = Math.cos(angle * Math.PI / 180) * radius - 400;
      const y = (baseY - scrollY) ;


      // 當圖片接近中心，放大
      const distanceFromCenter = Math.abs(y);
      
      const maxScale = 1.5;
      const minScale = 1;
      const scale = Math.max(minScale, maxScale - distanceFromCenter / 600);

      if (el) {
        el.style.opacity = '1'; // ✅ 讓圖片可見（先簡單測試用）
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





<main class="relative bg-black font-bakudai">
  <!--遮罩-->
  <div       
  class="pointer-events-none absolute inset-0 z-[5000]"
  style="background: linear-gradient(to right, #000, transparent, #000); background-repeat: no-repeat; background-size: 100%; content: '';">
  </div>

    




<!-- 粒子動畫 -->
  {#if loading}
    <Introani on:done={() => { loading = false;}} />
  {/if}

  

  <!-- 1. intro section（qingshan hero） -->
  
  <div class="intro opacity-0 blur-lg transition-all duration-1000 show">
    <h1 class="intro__title font-alt text-white !text-5xl tracking-wider">qingshan</h1> 
    <nav class="tags hidden">
      <a href="https://tympanus.net/codrops/demos/?tag=scroll">#scroll</a>
      <a href="https://tympanus.net/codrops/demos/?tag=3d">#3d</a>
      <a href="https://tympanus.net/codrops/demos/?tag=grid">#grid</a>
    </nav>
    <span class="intro__info font-light tracking-widest">Scroll gently &amp; enjoy</span> 
  </div>


  <!-- 2. 引導式前言 -->
  <div 
    class="relative z-10 bg-contain bg-no-repeat min-h-screen w-full overflow-hidden bg-[url('/images/NM.jpg')] bg-center">
    <!-- 半透明遮罩層 -->
    
    <div class="relative z-10"> 
      <div class="container mx-auto px-4 py-24 w-full">
        <SlideInSection direction="left" delay={0.1}>
          <div class="text-center mb-16">
            <h2 class="text-5xl md:text-6xl font-bold font-bakudai text-white mb-8 leading-tight">
              你夠熟悉你的生活周遭嗎？
            </h2>
          </div>
        </SlideInSection>
  
        <div class="max-w-4xl mx-auto w-full">
          <SlideInSection direction="left" delay={0.3}>
            <div class="text-white text-xl md:text-2xl leading-relaxed space-y-4 mb-8">
              <p class="fade-in-text" style="animation-delay: 1s;">「你穿梭在萬華——」</p>
              <p class="fade-in-text" style="animation-delay: 1.8s;">「吃的是青草巷的百年青草茶、」</p>
              <p class="fade-in-text" style="animation-delay: 2.6s;">「拜的是龍山寺的月老、」</p>
              <p class="fade-in-text" style="animation-delay: 3.4s;">「逛的是西門町潮流小店……」</p>
            </div>
          </SlideInSection>
          
        </div>
      </div>
    </div>
  </div>
<!-- rotate區塊

  <section id="rotate" class="relative mt-5 ">
    <div class="inset-0 -z-9 bg-black  bg-center  bg-contain bg-no-repeat"></div>
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
  
 -->


  <SlideInSection direction="right" delay={0.7}>
    <p class="text-3xl mt-[200px] md:text-4xl font-bold text-[#FFF287] leading-tight text-center">
      但你，真的了解這片土地的靈魂嗎？
    </p>
  </SlideInSection>

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

  

 
  <section class="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
    <SlideInSection direction="right" delay={0.2}>
      <div class="container mx-auto px-4 md:px-8 text-center">
        <h2 class="text-4xl md:text-4xl  mb-6 text-white leading-tight tracking-tight">
          <span class="block fade-in-text !font-black pb-1" style="animation-delay: 0.5s;">在萬華最深的記憶裡</span>
          <span class="block fade-in-text " style="animation-delay: 1s;">還有一位默默守護百年的存在</span>
        </h2>
      </div>
    </SlideInSection>
  </section>

 <SlideInSection direction="left" delay={0.5}>
  <div class="flex justify-center items-center">
    <div class="border-2 border-white rounded-xl shadow-2xl p-2 bg-opacity-80 bg-white/10">
      <div class="h-[50vh] w-[50vw] mx-auto px-4 md:px-8 text-center bg-[url('images/qsbg.jpg')] bg-cover bg-center bg-no-repeat rounded shadow-lg">
        <!-- 內容可加在這裡 -->
      </div>
    </div>
  </div>
</SlideInSection>

  <!-- 滾動式敘事區塊 -->
  <ScrollytellingSection 
    scenes={[
      {
        image: '/images/panel1.jpg',
        title: '龍山寺',
        description: '這裡，是求姻緣拜過的地方'
      },
      {
        image: '/images/t1.jpg', 
        title: '西門紅樓',
        description: '這裡，是台灣的第一座公有市場'
      },
      {
        image: '/images/t2.jpg',
        title: '華西街夜市',
        description: '這裡，是台灣的第一座觀光夜市'
      },
      {
        image: '/images/t3.jpg',
        title: '青草巷',
        description: '這裡，有著超過百年的青草'
      },
      {
        image: '/images/slip1.jpg',
        title: '萬華車站',
        description: '這裡，承載著無數人的故事'
      }
    ]}
    sectionTitle="萬華場景導覽"
    autoRotate={true}
    rotationInterval={4000}
    useParallax={false}
  />

</main>




<style>
 /* 防止水平滾動 */
 :global(html), :global(body) {
   overflow-x: hidden;
   max-width: 100vw;
 }

 :global(main) {
   overflow-x: hidden;
   max-width: 100vw;
 }
  main {
    
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-color: white; 這會覆蓋 Introani 的黑色背景，如果 Introani 不完全覆蓋或需要透明則可能出問題 */
    color: black;
    
    
    
    
    
    z-index: 10; /* 比 Introani 的 z-50 低 */
  }

 

/* 添加 fade-in-text 動畫 */
.fade-in-text {
  opacity: 0;
  animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInSharp {
  0% {
    opacity: 0;
    filter: blur(25px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}

/* 確保容器正確居中 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
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

.grid--full .grid__item-img {
  height: 100%;
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
  animation: fadeInSharp 2s ease-out forwards;
  
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