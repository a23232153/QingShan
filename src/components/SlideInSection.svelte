<script lang="ts">
  import { onMount } from 'svelte';
  
  // Props
  export let direction: 'left' | 'right' = 'left';
  export let delay: number = 0;
  export let threshold: number = 0.3;
  export let rootMargin: string = '0px 0px 50px 0px';
  export let duration: number = 1.5;
  export let offset: number = 50; // 新增 offset prop，預設 50px
  
  let element: HTMLElement;
  let observer: IntersectionObserver;
  
  // 計算初始偏移量
  const getOffset = () => (direction === 'left' ? -offset : offset);
  
  // 設置元素樣式
  const setElementStyles = (isVisible: boolean) => {
    if (element) {
      element.style.opacity = isVisible ? '1' : '0';
      element.style.transform = isVisible ? 'translateX(0)' : `translateX(${getOffset()}px)`;
      element.style.transition = `all ${duration}s ease-in-out ${delay}s`;
    }
  };
  
  onMount(() => {
    // 初始設置
    setElementStyles(false);
    
    // 創建 Intersection Observer
    const options = {
      threshold,
      rootMargin
    };
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setElementStyles(entry.isIntersecting);
      });
    }, options);
    
    if (element) {
      observer.observe(element);
    }
    
    // 清理
    return () => {
      if (observer) observer.disconnect();
    };
  });
</script>

<div bind:this={element} class="slide-in-section">
  <slot />
</div>

<style>
  .slide-in-section {
    will-change: transform, opacity;
    width: 100%;
    max-width: 100%;
    display: block;
    overflow: visible;
    transition: all 2.0s ease-in-out;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
  }
  
  @media (max-width: 768px) {
    .slide-in-section {
      padding: 0 1rem;
    }
  }
</style>