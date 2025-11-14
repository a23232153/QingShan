<script lang="ts">
  import { onMount } from "svelte";

  export let image: string = ""; // 背景圖片路徑
  export let title: string = "";
  export let subtitle: string = "";
  export let height: string = "h-screen"; // 高度，預設全螢幕

  let scrollY = 0; // 初始偏移
  let heroSection: HTMLElement;

  onMount(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroSection) {
            const rect = heroSection.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            const baseY = -(rect.height * 0.15);
            const multiplier = rect.height * 0.4;

            // 3. 最大偏移量也設為相對值 (例如元素高度的 50%)
            const maxScroll = rect.height * 0.5;

            if (rect.top < viewHeight && rect.bottom > 0) {
              const ratio =
                (viewHeight - rect.top) / (viewHeight + rect.height);
              scrollY = baseY + Math.min(ratio * multiplier, maxScroll);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // 初始計算

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });
</script>

<svelte:head>
  <style>
    :global(html, body) {
      margin: 0;
      padding: 0;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
    :global(*) {
      box-sizing: border-box;
    }
    :global(main, div:not(.absolute)) {
      overflow-y: visible !important;
      height: auto;
    }
  </style>
</svelte:head>

<section
  bind:this={heroSection}
  id="hero"
  class={`relative ${height} overflow-hidden text-white text-center bg-black`}
>
  <!-- 背景圖，視差滑動 -->
  <div
    class="absolute top-0 left-0 w-full h-[120%] bg-contain bg-center bg-no-repeat z-0"
    style={`transform: translateY(${scrollY}px); background-image: url(${image});`}
  ></div>

  <!-- Hero 內容 -->
  <div class="relative z-10 flex flex-col items-center justify-center h-full px-6">
    <h1 class="md:text-6xl font-bold leading-tight drop-shadow-xl">
      {title}
    </h1>
    <p class="mt-8 text-lg md:text-2xl">{subtitle}</p>
  </div>
</section>
