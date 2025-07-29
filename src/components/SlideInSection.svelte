<script lang="ts">
  import { onMount } from 'svelte';
  
  // Props
  export let direction: 'left' | 'right' = 'left';
  export let delay: number = 0;
  export let threshold: number = 0.3;
  export let rootMargin: string = '0px 0px -50px 0px';
  
  let element: HTMLElement;
  let observer: IntersectionObserver;
  
  onMount(() => {
    // 設置初始狀態 - 減少滑動距離避免超出視窗
    if (element) {
      const offset = direction === 'left' ? -50 : 50; // 從 100px 減少到 50px
      element.style.opacity = '0';
      element.style.transform = `translateX(${offset}px)`;
      element.style.transition = `all 1.2s ease-out ${delay}s`;
    }
    
    // 創建 Intersection Observer
    const options = {
      threshold,
      rootMargin
    };
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 使用 entry.target 而不是 element 變數
        const targetElement = entry.target as HTMLElement;
        
        if (entry.isIntersecting) {
          // 進入視窗時執行動畫
          targetElement.style.opacity = '1';
          targetElement.style.transform = 'translateX(0)';
        } else {
          // 離開視窗時回到初始狀態
          const offset = direction === 'left' ? -50 : 50; // 從 100px 減少到 50px
          targetElement.style.opacity = '0';
          targetElement.style.transform = `translateX(${offset}px)`;
        }
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

<div bind:this={element} class="slide-in-section ">
  <slot />
</div>

<style>
  .slide-in-section {
    will-change: transform, opacity;
    width: 100%;
    max-width: 100%;
    display: block;
    overflow: visible; /* 改為 visible 讓內容可以正常顯示 */
    /* 確保動畫樣式不被覆蓋 */
    transition: all 1.2s ease-out !important;
    position: relative;
    z-index: 1;
    /* 確保不會超出父容器 */
    box-sizing: border-box;
  }
  
  
  
  /* 響應式設計 */
  @media (max-width: 768px) {
    .slide-in-section {
      padding: 0 1rem;
    }
  }
</style>

