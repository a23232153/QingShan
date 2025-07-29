<script>
  import { onMount } from 'svelte';
  import SlideInSection from '../../components/SlideInSection.svelte';

 

  let scrollY = 0;
  // @ts-ignore
  let heroSection ;

  export function load() {
  return {
    headerColor: 'white' // 或 '#123456'、'white'、'transparent' 等
  };
}

  onMount(() => {
     // 只在瀏覽器端載入 gsap
    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default;
      import('gsap/ScrollTrigger').then((stModule) => {
        gsap.registerPlugin(stModule.ScrollTrigger);
        // 這裡可以加 GSAP 動畫初始化程式碼
      });
    });

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
  <!-- 背景圖，視差滑動 -->
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



<!-- 青山宮介紹區塊 --> 
<div class="w-full h-[100vh]  bg-black   text-white flex flex-row gap-10 items-center justify-center px-4">
  <div class="md:w-1/2 h-full max-h-full flex items-center justify-end">
    <SlideInSection direction="left">
      <img src="/images/t1.jpg" alt="青山宮" class="w-full max-h-[95vh]  rounded shadow-lg hover:scale-105 transition object-contain " />
    </SlideInSection>
  </div>

  <div class="md:w-1/2">
      <h2 class="text-3xl font-bold mb-4">青山宮</h2>
      <p class="text-gray-300 text-lg leading-relaxed  border-l-4 border-yellow-300 px-1">
        艋舺青山宮，位於臺灣臺北市萬華區，為肇建於1856年（咸豐6年）的民間信仰廟宇，主祀青山靈安尊王，現列中華民國直轄市定古蹟。該廟自清治時期以來就是艋舺地區泉州三邑惠安人的王爺信仰中心之一，每逢青山靈安尊王壽誕日前夕都有隆重祭典，正日為萬華區年中慣例迎神中最盛大者，俗稱「艋舺大拜拜」，為臺北市三大廟會之一。現今，艋舺青山宮與艋舺龍山寺、艋舺清水巖、西門町天后宮合稱「艋舺四大廟門」
      </p>
    </div>
</div>

<div class="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>

<!-- 靈安尊王介紹-->
 
<div class="w-full h-[100vh]  bg-gray-800   text-white flex flex-row gap-10 items-center justify-center px-4 "style=" box-shadow: 0 0 30px rgba(255, 215, 0, 0.3); border-left: 4px solid gold;">
  <div class="md:w-1/2 px-4 " >
    <h2 class="text-3xl font-bold mb-4">靈安尊王</h2>
    <p class="text-gray-300 text-lg leading-relaxed">
      靈安尊王是艋舺青山宮的主神，據說他是從福建惠安來到臺灣的神明，擁有強大的保護力量。每年青山宮都會舉辦盛大的慶典來慶祝他的誕辰，吸引了成千上萬的信徒和遊客前來參加。
    </p>

  </div>
  <div class="md:w-1/2 h-full max-h-full flex items-center justify-end">
    <SlideInSection direction="right">
      <img src="/images/t2.jpg" alt="靈安尊王" class="w-full max-h-[95vh]  rounded shadow-lg hover:scale-105 transition object-contain " />
    </SlideInSection>
  </div>
</div>


<!--青山季-->
<section >
  <div class="w-full h-[100vh]  bg-[#DED3C4]   text-black flex flex-col gap-10 items-center justify-center px-4 ">
     
   <h2 class="text-4xl font-bold ">青山季</h2>

   <div class="md:w-1/2  flex items-center ">
      <SlideInSection direction="right">
        <img src="/images/t2.jpg" alt="靈安尊王" class="w-full max-h-[60vh] rounded shadow-lg hover:scale-105 transition object-cover " />
      </SlideInSection>
    </div>

    <p class="text-gray-700 text-lg leading-relaxed px-30">
        靈安尊王是艋舺青山宮的主神，據說他是從福建惠安來到臺灣的神明，擁有強大的保護力量。每年青山宮都會舉辦盛大的慶典來慶祝他的誕辰，吸引了成千上萬的信徒和遊客前來參加。
    </p>  
  </div>
</section>
<!-- （圖片格） -->
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

<section class="w-[90vw] h-[500px] flex ">
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
