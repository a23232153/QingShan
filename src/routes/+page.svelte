<svelte:head>
  <!-- 網頁標題與描述 -->
  <title>艋舺青山宮</title>
  <meta name="description" content="探索艋舺青山宮的歷史與靈安尊王的信仰起源，體驗年度暗訪夜巡的神秘氛圍，深入了解艋舺文化與人們心中守護的信念。" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph / Facebook -->
  <meta property="og:title" content="艋舺青山宮｜沉浸式文化體驗與歷史探索" />
  <meta property="og:description" content="探索艋舺青山宮的歷史與靈安尊王的信仰起源，體驗年度暗訪夜巡的神秘氛圍，深入了解艋舺文化與人們心中守護的信念。" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://qing-shan.vercel.app" />
  <meta property="og:image" content="https://qing-shan.vercel.app/images/qsbg.jpg" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="艋舺青山宮｜沉浸式文化體驗與歷史探索" />
  <meta name="twitter:description" content="探索艋舺青山宮的歷史與靈安尊王的信仰起源，體驗年度暗訪夜巡的神秘氛圍，深入了解艋舺文化與人們心中守護的信念。" />
  <meta name="twitter:image" content="https://qing-shan.vercel.app/images/qsbg.jpg" />

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
    {JSON.stringify(schema)}
  </script>

  
  
</svelte:head>




<script lang="ts">

  
  import { onMount, tick } from 'svelte';
  
   // @ts-ignore
  
  import SlideInSection from '../components/SlideInSection.svelte';
  import ScrollytellingSection from '../components/ScrollytellingSection.svelte';
  
  import Introani from '../components/Introani.svelte';
  
  //import Ani from '../components/Ani.svelte';
  //import ImgZoom from '../components/ImgZoom.svelte';

  import ImgCursor from '../components/ImgCursor.svelte';
  import LastScene from '../components/LastScene.svelte';
  import ParallaxSection from '../components/ParallaxSection.svelte';

 
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "艋舺青山宮",
    "url": "https://qing-shan.vercel.app/",
    "description": "探索艋舺青山宮的歷史與文化，透過沉浸式互動體驗感受古老廟宇的魅力與故事。"
  };

  
  
  let items: (HTMLElement | null)[] = [];

  const sceneitems: { text: string; direction: "left" | "right" }[] = [
  { text: '「是一座還在呼吸的文化舞台」', direction: 'left' },
  { text: '「 而在這片舞台的中心」', direction: 'right' },
  { text: '「有一座承載著在地信仰與世代情感的宮廟」', direction: 'left' },
  { text: '', direction: 'right' }
];
  
  let loading = true;

  const onDone = () => {
    loading = false;
  };
 

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
    const el = document.querySelector('.blurset');
    

  if (!el) {
    console.warn('❌ blurset not found in DOM at mount');
    return;
  }

    const gridEl = document.querySelector('.grid');


   
  gsap.registerPlugin(ScrollTrigger);

   setTimeout(() => { 
    gsap.fromTo(
      ".blurset",
      {
        filter: "blur(10px)",
        opacity: 0
      },
      {
        scrollTrigger: {
          trigger: ".blurset",
          start: "top 80%",
          once: true
        },
        filter: "blur(0px)",
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        
      }
    );
    }, 4500);


  gsap.utils.toArray('.blurani').forEach(el => {
  gsap.fromTo(
    el as HTMLElement, // 這裡加上型別轉換
    { filter: "blur(10px)", opacity: 0 },
    {
      scrollTrigger: {
        trigger: el as HTMLElement,
        start: "top 90%",
        once: true
      },
      filter: "blur(0px)",
      opacity: 1,
      duration: 2,
      ease: "power2.out"
    }
  );
});
    

    if (gridEl) {
      const gridItems = gridEl.querySelectorAll('.grid__item-imgwrap');
      console.log('Grid items found:', gridItems.length);
    }

    (async () => {
      await tick();
    const gridEl = document.querySelector('.grid') as HTMLElement | null;
    const rotateEl = document.querySelector('#rotate') as HTMLElement | null;
      if (gridEl) {
      window.imagesLoaded(gridEl, { background: true }, () => {
        window.addEventListener('scroll', handleScroll);
        handleScroll();
      });
    }
    if (rotateEl) {
      window.imagesLoaded(rotateEl, { background: true }, () => {
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
        el.style.opacity = '1';
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



  {#if loading}
    <Introani on:done={onDone} />
  {/if}



<main class="relative bg-black font-bakudai-md min-h-screen overflow-x-hidden">

  <!--遮罩-
  <div       
  class="pointer-events-none absolute inset-0 z-5000"
  style="background: linear-gradient(to right, #000, transparent, #000); background-repeat: no-repeat; background-size: 100%; content: '';">
  </div>
  -->





  
  <!-- 1. 輪播 -->
<div class="relative blurset w-[100vw] h-[93vh] mt-[7vh]">
  <ScrollytellingSection showIndicator={false} showSectionTitle={false}
    heroHeight="h-[93vh]" heroWidth="w-full" carouselHeight="h-full"/>
</div>


<SlideInSection direction="right" delay={0}>
    <h1 class="text-3xl mt-50 md:text-4xl mb-50 font-bold text-yellow-500 leading-tight text-center">
      讓我們帶你認識萬華的靈魂
    </h1>
</SlideInSection>

<h1 class="absolute translate-999"> 艋舺青山宮、靈安尊王、暗訪

</h1>



<div class="mb-24 mt-30">
  <ImgCursor/>
</div>




 
   
<div class="relative z-10 blurani bg-contain bg-no-repeat min-h-screen w-full overflow-hidden mt-[50vh]">
    
    <div class="container mx-auto px-4 mt-16 w-full bg-contain bg-no-repeat bg-center min-h-[60vh] flex items-center justify-center">
      <img src="/images/scene9.jpg" alt="艋舺青山宮" class="w-[40vw] h-[50vh] container object-contain" />

      
    </div>

    
    {#each  sceneitems as item, i}
      <section class="py-12 flex  bg-black bg-opacity-80 ">
        <SlideInSection direction={item.direction} delay={0.5} rootMargin={`-${50 * i}px 0px 100px 0px`} threshold={0.5}>
          <div class="max-w-4xl mx-auto text-white text-2xl md:text-4xl leading-relaxed">
            <p class="fade-in-text">{item.text}</p>
          </div>
        </SlideInSection>
      </section>
    {/each}
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


  <SlideInSection direction="right" delay={0}>
    <p class="text-3xl mt-50 mb-50 md:text-5xl font-bold text-[#FFF287] leading-tight text-center">
      艋舺青山宮
    </p>
  </SlideInSection>


<div class="blurani mt-16 mb-32 w-full bg-[url('/images/門口.jpg')] bg-cover bg-no-repeat bg-center min-h-[60vh] flex items-center justify-center ">
      <SlideInSection direction="left" delay={0.25} rootMargin="0px 0px 200px 0px" threshold={0.5}>
        <div class="text-center ">
          
          <div class="w-full absolute  h-[35vh] flex items-end justify-start overflow-hidden rounded-xl shadow-lg ">
            <img 
              src="/images/google-map.jpg" 
              alt="艋舺青山宮地圖" 
              class="h-full w-[35vh] object-contain rounded-full shadow-lg  "
            />
            </div>
        </div>
      </SlideInSection>
</div>

  


   <!-- grid動畫-
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
  </section>  -->

  <ParallaxSection 
    title="歡迎參拜艋舺青山宮"
    subtitle=""
    height="h-screen" 
    image="/images/正殿.jpg" 
     />

     <ParallaxSection 
    
    height="h-screen" 
    image="/images/grid6.jpg"
     />

     <ParallaxSection 
    
    height="h-screen" 
    image="/images/grid8.jpg"
     />








 <!-- 
  <section class=" h-[70vh]  flex items-center justify-center bg-black relative overflow-hidden">
    <SlideInSection direction="right" delay={0.2}>
      <div class="container mx-auto px-4 md:px-8 text-center">
        <h2 class="text-4xl md:text-4xl  mb-6 text-white leading-tight tracking-tight">
          <span class="block fade-in-text !font-black pb-1" style="animation-delay: 0.5s;">在萬華最深的記憶裡</span>
          <span class="block fade-in-text " style="animation-delay: 0.5s;">還有一位默默守護百年的存在</span>
        </h2>
      </div>
    </SlideInSection>
  </section>
  part3.-->


 <div class="relative">

  <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" class="relative z-10">
    <path fill="white" d="M0,160L60,176C120,192,240,224,360,213.3C480,203,600,149,720,138.7C840,128,960,160,1080,181.3C1200,203,1320,213,1380,218.7L1440,224L1440,320L0,320Z"></path>
  </svg>

 
  <LastScene/>


     <div  class="absolute flex items-center justify-center group z-10000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 ">
      
      <div class="absolute  flex items-center justify-center">
        <div class="w-40 h-40 rounded-full border border-white"></div>
      </div>

     
      <a href="/qingshan"
        
        class="relative z-10 flex items-center justify-center w-32 h-32 rounded-full bg-white text-black font-semibold
                transition-transform duration-500 ease-in-out group-hover:scale-125  hover:text-black">
        參拜青山
      </a>
    </div>

    <p class="absolute bottom-10 w-full text-center text-black text-sm md:text-base">
      世新111級 資傳畢展
    </p>
  </div> 

</main>




<style>

  body::-webkit-scrollbar {
    display: none;
}
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
    
    color: black;
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

.blurset {
  filter: blur(10px);
  opacity: 0;
  will-change: filter, opacity;
}

</style>