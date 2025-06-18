<script>
  import { onMount } from 'svelte';
  let scrollY = 0;
  // @ts-ignore
  let heroSection ;

  export function load() {
  return {
    headerColor: 'white' // 或 '#123456'、'white'、'transparent' 等
  };
}

  onMount(() => {
    const onScroll = () => {
      // @ts-ignore
      const rect = heroSection.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const baseY=-200;

      if (rect.top < viewHeight && rect.bottom > 0) {
        const ratio = (viewHeight - rect.top) / (viewHeight + rect.height);
        scrollY = baseY+Math.min(ratio * 400, 400); // 最多移動 300px

      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<section id= "hero" class="relative h-screen overflow-hidden text-white text-center" bind:this={heroSection}>
  <!-- 背景圖，從上往下鋪、可視差滑動 -->
  <div
    class="absolute top-0 left-0 w-full h-[120%] bg-cover bg-center z-0"
    style={`transform: translateY(${scrollY}px); transition: transform 0.1s ease-out; background-image: url('/images/qsbg.jpg');`}
  ></div>



  <!-- Hero  -->
  
  <div class="relative z-10 flex flex-col items-center justify-center h-full px-6">
    <h1 class="text-2xl md:text-4xl font-bold leading-tight drop-shadow-xl backdrop-blur border-yellow-500 border-b-4 pb-2">
      Beneath the allure of a timeless<br />landmark,<br />
    </h1>
    <p class="mt-4 text-lg md:text-xl backdrop-blur">Discover history</p>
    
      
    <a href="/" class="block p-3 bg-white rounded-3xl text-black  hover:bg-yellow-600 transition m-4" >see more</a>
   
  </div>
</section>


<!-- 介紹區塊 -->

  <div class="py-20 bg-white container mx-auto px-4 flex flex-row  items-center gap-10">
    <img src="/images/t1.jpg" alt="Room" class="w-full md:w-1/2 rounded shadow-lg" />
    <div class="md:w-1/2">
      <h2 class="text-3xl font-bold mb-4">青山宮</h2>
      <p class="text-gray-700 text-lg leading-relaxed">
        艋舺青山宮，位於臺灣臺北市萬華區，為肇建於1856年（咸豐6年）的民間信仰廟宇，主祀青山靈安尊王，現列中華民國直轄市定古蹟。該廟自清治時期以來就是艋舺地區泉州三邑惠安人的王爺信仰中心之一，每逢青山靈安尊王壽誕日前夕都有隆重祭典，正日為萬華區年中慣例迎神中最盛大者，俗稱「艋舺大拜拜」，為臺北市三大廟會之一。現今，艋舺青山宮與艋舺龍山寺、艋舺清水巖、西門町天后宮合稱「艋舺四大廟門」
      </p>
    </div>
  </div>

<!-- 房型區塊（圖片格） -->
<section class="py-20 bg-gray-100">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">history & culture</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="flex flex-col items-center">
        <img src="/images/t1.jpg" class="rounded shadow hover:scale-105 transition" alt="introduction1"/>
        <p class="mt-4 text-center text-gray-700">說明文字</p>
      </div>
      <div class="flex flex-col items-center">
        <img src="/images/t2.jpg" class="rounded shadow hover:scale-105 transition" alt="introduction2"/>
        <p class="mt-4 text-center text-gray-700">說明文字</p>
      </div>
      <div class="flex flex-col items-center">
        <img src="/images/t2.jpg" class="rounded shadow hover:scale-105 transition" alt="introduction3"/>
        <p class="mt-4 text-center text-gray-700">說明文字</p>
      </div>
    </div>
  </div>
</section>


<!-- slip-->

<section class="w-[90vw] h-[500px] flex overflow-hidden">
  <div
      class="group relative flex-1 overflow-hidden transition-all duration-500 hover:flex-[3] flex items-center justify-center">
      <img src="/images/slip5.jpg"
          class="w-full  h-full object-cover object-center mx-auto  transition duration-500"
          alt="Taktsang"
      />
      <div class="absolute  items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="text-center px-4">
          <h2 class="text-xl font-bold mb-2">Taktsang</h2>
          <p class="text-sm">Taktsang Monastery clings to a cliff 3120 meters above sea level.</p>
        </div>
      </div>
    </div>

    <div
      class="group relative flex-1 overflow-hidden transition-all duration-500 ease-in-out hover:flex-[3]"
    >
      <img  src="/images/slip2.jpg"
        class="h-full w-full object-cover object-center transition duration-500"
        alt="Taktsang"
      />
        s
      <div class="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="text-center px-4">
          <h2 class="text-xl font-bold mb-2">Taktsang</h2>
          <p class="text-sm">Taktsang Monastery clings to a cliff 3120 meters above sea level.</p>
        </div>
      </div>
    </div>

    <div
      class="group relative flex-1 overflow-hidden transition-all duration-500 ease-in-out hover:flex-[3]"
    >
      <img
        src="/images/slip3.jpg"
        class="h-full w-full object-cover object-center transition duration-500"
        alt="Taktsang"
      />
      <div class="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="text-center px-4">
          <h2 class="text-xl font-bold mb-2">Taktsang</h2>
          <p class="text-sm">Taktsang Monastery clings to a cliff 3120 meters above sea level.</p>
        </div>
      </div>
    </div>

    <div
      class="group relative flex-1 overflow-hidden transition-all duration-500 ease-in-out hover:flex-[3]"
    >
      <img
        src="/images/slip4.jpg"
        class="h-full w-full object-cover object-center transition duration-500"
        alt="Taktsang"
      />
      <div class="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="text-center px-4">
          <h2 class="text-xl font-bold mb-2">Taktsang</h2>
          <p class="text-sm">Taktsang Monastery clings to a cliff 3120 meters above sea level.</p>
        </div>
      </div>
    </div>
</section>

<!-- CTA / 聯絡區塊 -->
<section id="contact" class="py-20 bg-yellow-50">
  <div class="container mx-auto px-4 text-center">
    <h2 class="text-3xl font-bold mb-6">nothing</h2>
    <p class="text-gray-700 mb-6">We welcome your questions, inquiries, or collaboration ideas.</p>
    <a href="/booking" class="inline-block px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">聯絡我們</a>
  </div>
</section>

<!-- Footer -->
<footer class="bg-black text-white py-10 text-center text-sm">
  
</footer>
