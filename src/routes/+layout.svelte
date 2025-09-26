<svelte:head>


<link rel="preload" href="/fonts/Bakudai-Medium.woff2" as="font" type="font/woff2" crossorigin>



  <!-- ✅ 改為 CDN：GSAP 核心 -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
<script src="https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js"></script>
  

  <script src="/js/lenis.min.js"></script>
  <script src="/js/smoothscroll.js"></script>


  <script type="module" src="/js/index.js"></script>
</svelte:head>


<script lang="">
// @ts-nocheck

  
  import '../app.css';
  import Header from '../components/Header.svelte';
  export let data;
  import AiChat from '../components/AIChat.svelte';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

  injectSpeedInsights();

  
</script>

<Header headerColor={data?.headerColor ?? 'black'} />

<slot />

<style>








</style>





