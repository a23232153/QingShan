<script lang="ts">
    import { onMount } from "svelte";
    import { DotLottie } from "@lottiefiles/dotlottie-web";
    export let showAni= ""; ;
  
    let canvasRef: HTMLCanvasElement | null = null; // 明確指定類型
      

    onMount(() => {
       if (!canvasRef) return; // 確保 canvasRef 不為 null
      const dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef,
        src: showAni, // 你的 Lottie 動畫 URL
      });
     
  
      return () => dotLottie.destroy(); // 組件卸載時清理動畫
    });
  </script>
  
  <canvas bind:this={canvasRef} style="max-width: 100%; height: auto;"></canvas>
  
  