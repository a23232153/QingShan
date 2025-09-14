<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  

  // Props 
  export let scenes: Array<{
    image: string;
    title: string;
    description: string;
    duration?: number;
    textClass?: string;
  }> = [];

  export let sectionTitle: string = '萬華場景導覽';
  export let showSectionTitle: boolean = true;
  export let autoRotate: boolean = true;
  export let rotationInterval: number = 4000;
  export let showIndicator: boolean = true;
  
  
  export let heroHeight: string = 'h-screen';
  export let heroWidth: string = 'w-full';
  export let carouselHeight: string = 'h-screen'; // 新增 prop 控制輪播區域高度

  let currentSceneIndex = 0;
  let isVisible = false;
  let sectionRef: HTMLElement;
  
  let rotationTimer: number;

  // 預設場景（如果沒有傳入 scenes）
  const defaultScenes = [

    
    {
      image: '/images/scene5.jpg',
      title: '',
      description: '萬華區曾被稱為艋舺\n為台北最早的開發地區\n人來人往間\n萬般華美的在地信仰\n悄然浮現',
      duration: 8000,
      textClass: 'top-30 right-40 items-end text-left' // 右下角
    },
    {
      image: '/images/scene4.jpg',
      title: '',
      description: '從萬華車站走下\n穿梭在華西街夜市\n看著人潮湧動',
      duration: 6000,
      textClass: 'absolute bottom-5 left-1/2 -translate-x-1/2 text-center' // 底部中央


    },
    {
      image: '/images/scene7.jpg',
      title: '',
      description: '走著走著\n抬頭一望\n龍山寺\n這是艋舺人的在地信仰',
      duration: 4500,
      textClass: 'bottom-15 right-10 items-end text-left' // 左上
    },
    
    
    {
      image: '/images/scene3.jpg',
      title: '',
      description: '往旁邊小巷一走\n喝著百年青草茶\n再繼續前行',
      duration: 4000,
      textClass: 'absolute bottom-5 left-1/2 -translate-x-1/2 text-center' 
    },
    {
      image: '/images/牌樓.jpg',
      title: '',
      description: '看到台北第一街\n艋舺青山宮乍現\n但你真的了解這片土地的在地信仰嗎？',      
      duration: 8000,
      textClass: 'absolute bottom-5 left-1/2 -translate-x-1/2 text-center' 
    },
   
    
  ];

  // 使用傳入的 scenes 或預設場景
  $: displayScenes = scenes.length > 0 ? scenes : defaultScenes;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible = true;
            if (autoRotate) {
              startSceneRotation();
            }
          } else {
            isVisible = false;
            stopSceneRotation();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef) {
      observer.observe(sectionRef);
    }

    return () => {
      observer.disconnect();
      stopSceneRotation();
    };
  });

  function startSceneRotation() {
     stopSceneRotation();
    if (rotationTimer || !autoRotate) return;
    
    const currentScene = displayScenes[currentSceneIndex];
    const duration = currentScene.duration ?? 4000; 

     rotationTimer = window.setTimeout(() => {
      currentSceneIndex = (currentSceneIndex + 1) % displayScenes.length;
      startSceneRotation(); // 👈 遞迴呼叫，依序播放
    }, duration);
  }


  function stopSceneRotation() {
    if (rotationTimer) {
      clearInterval(rotationTimer);
      rotationTimer = 0;
    }
  }

  function goToScene(index: number) {
    currentSceneIndex = index;
    stopSceneRotation();
    if (autoRotate) {
      startSceneRotation();
    }
  }


  
</script>

<section bind:this={sectionRef} class="{heroHeight} {heroWidth} bg-black overflow-hidden">
  
    <div class="mx-auto h-full w-full">
      {#if showSectionTitle}  
        
          <h3 class="text-4xl md:text-5xl font-black text-white text-center  tracking-tight">
            {sectionTitle}
          </h3>  
      {/if}

      <div class="relative  {carouselHeight} w-full overflow-hidden rounded-3xl shadow-2xl">
        {#each displayScenes as scene, index}
          <div 
            class="absolute inset-0 opacity-0  transition-all duration-1000 ease-out {currentSceneIndex === index ? 'opacity-100 scale-100' : ''}"
            style="animation-delay: {index * 0.2}s;"
          >
            <div class="relative w-full h-full overflow-hidden">
              <img src={scene.image} alt={scene.title} class="w-full h-full object-cover object-center" />

              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            </div>
            <div  
            class={`absolute  p-8 text-white/80 flex flex-col transition-all duration-600 ${scene.textClass ?? ''}`}
> <!--文字區域-->
            <h4 
              class="whitespace-pre-line text-3xl md:text-3xl font-black mb-2 drop-shadow-lg tracking-tight
              {index === displayScenes.length - 1 
                ? (currentSceneIndex === index ? 'translate-y-0 opacity-100 transition-all duration-700' : 'translate-y-5 opacity-0') 
                : ''}"
            >
              {scene.title}
            </h4>
            <p class="whitespace-pre-line text-xl md:text-2xl leading-relaxed drop-shadow font-light z-100000">
              {scene.description}
            </p>
          </div>

          </div>
        {/each}
      </div>


      {#if showIndicator}
        <div class="flex justify-center gap-4 mt-8">
          {#each displayScenes as _, index}
            <button 
            class="w-3 h-3 rounded-full border-none cursor-pointer transition-all duration-300 {currentSceneIndex === index ? 'bg-amber-400 scale-110' : 'bg-white/30 hover:bg-white/60'}"
            on:click={() => goToScene(index)}
            aria-label="切換到場景 {index + 1}"
          ></button>
        {/each}
      </div>
      {/if}
    
  </div>
</section>

<style>
  .fade-in-text {
    opacity: 0;
    animation: fadeInUp 0.8s ease-out forwards;
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
</style>