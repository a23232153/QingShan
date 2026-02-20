<script lang>
  // @ts-nocheck

  import { page } from "$app/stores";
  import "../app.css";
  import Header from "../components/Header.svelte";
  export let data;
  import AiChat from "../components/AIChat.svelte";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

  injectSpeedInsights();

  $: showHeader = !$page.data.hideHeader;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "青山 qingshan",
    description:
      "艋舺青山宮位於台北萬華，是歷史悠久的信仰與文化中心，以靈安尊王信仰與艋舺文化聞名。",
    image: "https://qing-shan.vercel.app/images/qsbg.png",
    url: "https://qing-shan.vercel.app/",
    address: {
      "@type": "PostalAddress",
      addressLocality: "台北市萬華區",
      addressCountry: "台灣",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.0367,
      longitude: 121.4993,
    },
    sameAs: [
      "https://zh.wikipedia.org/wiki/艋舺青山宮",
      "https://www.facebook.com/qingshanpalace",
      "https://www.instagram.com/qingshan.ics/",
    ],
  };

  const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(schemaData)}<\/script>`;
</script>

<svelte:head>
  <title>青山 qingshan</title>

  <link
    rel="preload"
    href="/fonts/Bakudai-Medium.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- ✅ 改為 CDN：GSAP 核心 -->
  <script
    defer
    src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"
  ></script>

  <script
    defer
    src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"
  ></script>
  <script
    defer
    src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js"
  ></script>
  <script
    defer
    src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"
  ></script>
  <script
    defer
    src="https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js"
  ></script>

  <script defer src="/js/lenis.min.js"></script>
  <script defer src="/js/smoothscroll.js"></script>

  {@html jsonLdScript}
</svelte:head>

{#if showHeader}
  <Header />
{/if}

<slot />

<style>
</style>
