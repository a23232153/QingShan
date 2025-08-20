<script context="module">
  export const ssr = false;
</script>


<script lang="ts">

  
  import { onMount, onDestroy } from 'svelte';
  

  let iframe: HTMLIFrameElement | null = null;
  let mounted = false;
  console.log('typeof window =', typeof window);

  // 將 devicemotion 資料傳遞給 iframe
  function handleDeviceMotion(event: DeviceMotionEvent) {
    if (!iframe || !iframe.contentWindow) return;

    try {
      iframe.contentWindow.postMessage(
        {
          type: 'devicemotion',
          deviceMotionEvent: {
            acceleration: {
              x: event.acceleration?.x ?? null,
              y: event.acceleration?.y ?? null,
              z: event.acceleration?.z ?? null,
            },
            accelerationIncludingGravity: {
              x: event.accelerationIncludingGravity?.x ?? null,
              y: event.accelerationIncludingGravity?.y ?? null,
              z: event.accelerationIncludingGravity?.z ?? null,
            },
            rotationRate: {
              alpha: event.rotationRate?.alpha ?? null,
              beta: event.rotationRate?.beta ?? null,
              gamma: event.rotationRate?.gamma ?? null,
            },
            interval: event.interval,
            timeStamp: event.timeStamp,
          },
        },
        '*'
      );
    } catch (error) {
      console.error('Failed to post devicemotion message:', error);
    }
  }

  onMount(() => {
    mounted = true;

    if ('DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    } else {
      console.warn('DeviceMotionEvent not supported in this browser');
    }
  });

  onDestroy(() => {
    window.removeEventListener('devicemotion', handleDeviceMotion);
  });
</script>

{#if mounted}
<section class="relative mt-[7vh] w-full h-[400px] md:h-[100vh] bg-black py-8">
  <div class="h-[93vh] mx-auto px-4">
    <h2 class="text-3xl font-bold text-white mb-6 text-center font-bakudai-md">
      艋舺青山宮虛擬導覽
    </h2>
    <iframe 
      bind:this={iframe}
      title="艋舺青山宮虛擬導覽"
      id="tour-embeded"
      name="艋舺青山宮導覽"
      src="https://tour.panoee.net/iframe/qingshan"
      frameborder="0"
      width="100%"
      height="100%"
      scrolling="no"
      allow="vr; xr; accelerometer; gyroscope; autoplay"
      allowfullscreen
      loading="eager"
      class="rounded-lg shadow-lg"
    ></iframe>
  </div>
</section>
{/if}

<style>
  section {
    width: 100%;
    box-sizing: border-box;
  }
  iframe {
    max-width: 100%;
    height: 100%;
    border: none;
  }
</style>
