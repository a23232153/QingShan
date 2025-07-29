<script lang="ts">
  import { onMount } from 'svelte';
  import SlideInSection from './SlideInSection.svelte';

  // Props 
  export let scenes: Array<{
    image: string;
    title: string;
    description: string;
  }> = [];

  export let sectionTitle: string = '萬華場景導覽';
  export let autoRotate: boolean = true;
  export let rotationInterval: number = 4000;
  export let useParallax: boolean = false;

  let currentSceneIndex = 0;
  let isVisible = false;
  let sectionRef: HTMLElement;
  let scenesSectionRef: HTMLElement;
  let rotationTimer: number;

  // 預設場景（如果沒有傳入 scenes）
  const defaultScenes = [
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
  ];

  // 使用傳入的 scenes 或預設場景
  $: displayScenes = scenes.length > 0 ? scenes : defaultScenes;

  onMount(() => {
    // 監聽場景區塊的可見性
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

    if (scenesSectionRef) {
      observer.observe(scenesSectionRef);
    }

    return () => {
      observer.disconnect();
      stopSceneRotation();
    };
  });

  function startSceneRotation() {
    if (rotationTimer || !autoRotate) return;
    
    rotationTimer = window.setInterval(() => {
      currentSceneIndex = (currentSceneIndex + 1) % displayScenes.length;
    }, rotationInterval);
  }

  function stopSceneRotation() {
    if (rotationTimer) {
      clearInterval(rotationTimer);
      rotationTimer = 0;
    }
  }

  function goToScene(index: number) {
    currentSceneIndex = index;
    // 重置計時器
    stopSceneRotation();
    if (autoRotate) {
      startSceneRotation();
    }
  }
</script>

<section bind:this={sectionRef} class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden w-full">
  <!-- 萬華場景導覽 -->
  <div bind:this={scenesSectionRef} class="bg-black relative z-20 w-full overflow-hidden">
    <div class="container mx-auto px-4 py-24 w-full">
      <!-- 區塊標題 -->
      <SlideInSection direction="left" delay={0.1}>
        <h3 class="text-4xl md:text-5xl font-black text-white text-center mb-16 tracking-tight">
          {sectionTitle}
        </h3>
      </SlideInSection>
      <div class="relative max-w-4xl mx-auto h-96 md:h-[500px] overflow-hidden rounded-3xl shadow-2xl w-full">
        {#each displayScenes as scene, index}
          <div 
            class="absolute inset-0 opacity-0 scale-75 transition-all duration-1000 ease-out {currentSceneIndex === index ? 'opacity-100 scale-100' : ''}"
            style="animation-delay: {index * 0.2}s;"
          >
            <div class="relative w-full h-full overflow-hidden">
              <img src={scene.image} alt={scene.title} class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            </div>
            <div class="absolute bottom-0 inset-x-0 p-8 text-white translate-y-5 opacity-0 transition-all duration-600 delay-300 {currentSceneIndex === index ? 'translate-y-0 opacity-100' : ''}">
              <h4 class="text-3xl md:text-4xl font-black mb-2 drop-shadow-lg tracking-tight">{scene.title}</h4>
              <p class="text-lg md:text-xl leading-relaxed drop-shadow font-light">{scene.description}</p>
            </div>
          </div>
        {/each}
      </div>
      <!-- 場景指示器 -->
      <div class="flex justify-center gap-4 mt-8">
        {#each displayScenes as _, index}
          <button 
            class="w-3 h-3 rounded-full border-none cursor-pointer transition-all duration-300 {currentSceneIndex === index ? 'bg-amber-400 scale-110' : 'bg-white/30 hover:bg-white/60'}"
            on:click={() => goToScene(index)}
            aria-label="切換到場景 {index + 1}"
          ></button>
        {/each}
      </div>
      <!-- 導航按鈕 -->
      <div class="absolute top-1/2 inset-x-0 -translate-y-1/2 flex justify-between px-8 pointer-events-none">
        <button 
          class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 border-2 border-white/30 text-white text-2xl md:text-3xl cursor-pointer transition-all duration-300 pointer-events-auto flex items-center justify-center hover:bg-white/30 hover:border-white/50 hover:scale-110"
          on:click={() => goToScene((currentSceneIndex - 1 + displayScenes.length) % displayScenes.length)}
          aria-label="上一個場景"
        >
          ‹
        </button>
        <button 
          class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 border-2 border-white/30 text-white text-2xl md:text-3xl cursor-pointer transition-all duration-300 pointer-events-auto flex items-center justify-center hover:bg-white/30 hover:border-white/50 hover:scale-110"
          on:click={() => goToScene((currentSceneIndex + 1) % displayScenes.length)}
          aria-label="下一個場景"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  /* 只保留無法用 Tailwind 實現的動畫 */
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