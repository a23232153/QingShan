<svelte:head>
  <!-- 贊助廣告腳本（保留原本） -->
  <script src="https://tympanus.net/codrops/adpacks/cda_sponsor.js"></script>

  <!-- ✅ 改為 CDN：GSAP 核心 -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
  <!-- ScrollSmoother requires ScrollTrigger -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js"></script>



 <!-- ✅ 改為 CDN：SplitText -->
  <script src="https://assets.codepen.io/16327/SplitText3.min.js"></script>

  <!-- ✅ 改為 CDN：imagesLoaded -->
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
</script>

<Header headerColor={data?.headerColor ?? 'black'} />
<slot />

<style>



.font-alt {
  font-family: "lores-12", sans-serif;
  font-weight: 400;
}




</style>



