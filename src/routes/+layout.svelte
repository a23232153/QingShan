<svelte:head>
  <script src="https://tympanus.net/codrops/adpacks/cda_sponsor.js"></script>
  <script src="/js/gsap.min.js"></script>
  <script src="/js/ScrollTrigger.min.js"></script>
  <script src="https://assets.codepen.io/16327/SplitText3.min.js"></script>
  <script src="/js/imagesloaded.pkgd.min.js"></script>
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



