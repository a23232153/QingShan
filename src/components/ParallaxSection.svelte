<script lang="ts">
  import { onMount } from "svelte";

  export let image: string = "";
  export let title: string = "";
  export let subtitle: string = "";
  export let height: string = "h-[100dvh]";

  let heroSection: HTMLElement;
  let bgElement: HTMLElement;

  onMount(() => {
    let ticking = false;

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
              // 我們圖片高 150%，上下各有 25% 的緩衝
              // 為了讓效果明顯，我們用掉其中 20% 的空間來移動
              // 這表示圖片會有總共 40% (20*2) 的大幅度位移，非常有感
              const range = 20; 

              // 3. 計算位移
              // 當 ratio 0 -> 1，位置從 -20% 移動到 +20%
              // 這會讓圖片在往下滑時「慢慢往下沉」，產生強烈景深
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
    style={`background-image: url(${image});`}
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