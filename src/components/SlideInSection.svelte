<script lang="ts">
  import { onMount } from 'svelte';

  // Props
  export let direction: 'left' | 'right' = 'left';
  export let delay: number = 0;
  export let threshold: number = 0.3;
  export let rootMargin: string = '0px 0px 50px 0px';
  export let duration: number = 1.5;
  export let offset: number = 50;
  export let once: boolean = true; // 新增：預設動畫只執行一次

  let element: HTMLElement;
  let isVisible = false; // 使用狀態變數控制，而非直接操作 DOM

  onMount(() => {
    // 檢查使用者是否設定了「減少動態效果」
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      isVisible = true;
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
          // 如果設定只執行一次，觸發後就停止觀察
          if (once) observer.unobserve(element);
        } else {
          // 如果 once 為 false，離開視窗時會隱藏，再次進入會重播動畫
          if (!once) isVisible = false;
        }
      });
    }, {
      threshold,
      rootMargin
    });

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  });

  // 計算動態樣式
  $: xValue = direction === 'left' ? -offset : offset;
  $: transformStyle = isVisible ? 'translateX(0)' : `translateX(${xValue}px)`;
  $: opacityStyle = isVisible ? 1 : 0;
  // 將 transition 的定義整合在 style 字串中
  $: transitionStyle = `opacity ${duration}s ease-in-out ${delay}s, transform ${duration}s ease-in-out ${delay}s`;

</script>

<div 
  bind:this={element} 
  class="slide-in-section text-center"
  style="
    opacity: {opacityStyle}; 
    transform: {transformStyle}; 
    transition: {transitionStyle};
  "
>
  <slot />
</div>

<style>
  .slide-in-section {
    /* 移除這裡的 transition，改由行內樣式控制以支援動態 duration/delay */
    will-change: transform, opacity;
    width: 100%;
    max-width: 100%;
    display: block;
    /* overflow: visible 是雙面刃，若動畫造成水平捲軸出現，需改為 hidden 或注意父層設定 */
    overflow: visible; 
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