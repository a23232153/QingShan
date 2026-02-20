<script lang="ts">
  import { onMount } from "svelte";

  export let image: string = "";
  export let title: string = "";
  export let subtitle: string = "";
  export let height: string = "h-[100dvh]";

  let heroSection: HTMLElement;
  let bgElement: HTMLElement;
  let bgLoaded = false;

  onMount(() => {
    let ticking = false;

    // Lazy load background-image via IntersectionObserver
    const lazyObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        bgLoaded = true;
        lazyObs.disconnect();
      }
    }, { rootMargin: '200px' });
    if (heroSection) lazyObs.observe(heroSection);

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroSection && bgElement) {
            const rect = heroSection.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            const sectionHeight = rect.height;

            // 檢查是否在視窗內
            if (rect.bottom > 0 && rect.top < viewHeight) {
              
              // 1. 計算進度 (0 ~ 1)
              const ratio = (viewHeight - rect.top) / (viewHeight + sectionHeight);

              // 2. 設定最大移動幅度 (Percentage)
              const range = 20; 

              // 3. 計算位移
              const yPercent = -range + (ratio * range * 2);

              bgElement.style.transform = `translate3d(0, ${yPercent.toFixed(2)}%, 0)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      lazyObs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  });
</script>

<section
  bind:this={heroSection}
  class={`relative ${height} w-full overflow-hidden text-white text-center bg-black flex flex-col items-center justify-center`}
>
  <div
    bind:this={bgElement}
    class="absolute top-[-25%] left-0 w-full h-[150%] bg-cover bg-center bg-no-repeat pointer-events-none will-change-transform"
    style={bgLoaded ? `background-image: url(${image});` : ''}
  ></div>

  <div class="relative z-10 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto">
    {#if title}
      <h1 class="text-4xl md:text-6xl font-bold leading-tight drop-shadow-xl mb-4">
        {title}
      </h1>
    {/if}
    {#if subtitle}
      <p class="text-lg md:text-2xl drop-shadow-md">{subtitle}</p>
    {/if}
  </div>
</section>