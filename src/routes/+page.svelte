<script lang="ts">
  import { onMount } from 'svelte';
  import Glitch from '../components/Glitch.svelte';

  let items: (HTMLElement | null)[] = [];
 


  const images = [
    '/images/1.jpg',
    '/images/2.png',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
  ];

  

  const count = images.length;

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
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
  body {
  margin: 0;
  overflow-x: hidden;
  background: black;
  position: relative;
}

/* 水彩背景容器 */
body::before {
  content: '';
  position: fixed;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 0, 150, 0.2), transparent 60%),
              radial-gradient(circle at 70% 70%, rgba(0, 200, 255, 0.2), transparent 60%),
              radial-gradient(circle at 50% 50%, rgba(255, 255, 0, 0.15), transparent 70%);
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}


  

  .stack {
    position: sticky;
    top: 0;
    height: 100vh;
    transform-style: preserve-3d;
  }

  .item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 200px;
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    transition: transform 0.2s ease;
    transform: translate(-50%, -50%);
    
    transform-style: preserve-3d;
    will-change: transform;
  }
</style>

<!-- 🕶️ 暗色水彩背景層 -->
<div class="fixed inset-0 -z-10 bg-black  bg-center opacity-80 bg-contain bg-no-repeat"
     style="background-image: url('/images/bc.jpg')"></div>




<!-- ✅ 圖片渲染 -->
<div class="relative h-[350vh] [perspective-1500px]">
  <div class="stack">
    {#each images as image, i}
      <div
        bind:this={items[i]}
        class="item"
        style={`background-image: url('${image}')`}
      ></div>
    {/each}
  </div>
</div>



<div class="glitch-section">
  <div class="glitch-gallery">
    <Glitch />
  
  </div>
</div>