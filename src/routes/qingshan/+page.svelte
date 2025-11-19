<svelte:head>
  <!-- SEO  -->
  <title>艋舺青山宮｜探索青山</title>
  <meta name="description" content="深入探索艋舺青山宮的歷史與文化，一起了解青山宮的現在與過去。" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph / Facebook -->
  <meta property="og:title" content="艋舺青山宮｜參拜青山" />
  <meta property="og:description" content="深入探索艋舺青山宮的歷史與文化，一起了解青山宮的現在與過去。" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://qing-shan.vercel.app" />
  <meta property="og:image" content="https://qing-shan.vercel.app/images/qsbg.jpg" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="艋舺青山宮｜沉浸式文化體驗與歷史探索" />
  <meta name="twitter:description" content="探索艋舺青山宮的歷史與文化，透過沉浸式互動體驗感受古老廟宇的魅力與故事。" />
  <meta name="twitter:image" content="https://qing-shan.vercel.app/images/qsbg.jpg" />

  <!-- Schema.org JSON-LD -->
  
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import SlideInSection from '../../components/SlideInSection.svelte';
  import AiChat from '../../components/AIChat.svelte';
  import Gallery from '../../components/Gallery.svelte';
  import TimeLine from '../../components/TimeLine.svelte';
  import FoldImages from '../../components/FoldImages.svelte';  

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "艋舺青山宮介紹",
    "url": "https://qing-shan.vercel.app/qingshan",
    "description": "深入探索艋舺青山宮的歷史與文化，一起了解青山宮的現在與過去。"
  };

  

 

  let scrollY = 0;
  // @ts-ignore
  let heroSection ;

   const galleryItems = [
    {
      image: "/images/青山會神將.jpg",
      title: "青山會神將",
      description: "艋舺青山宮-青山會創立推廣艋舺文化，傳承技藝並促進地方繁榮。"
    },
    {
      image: "/images/義安社.jpg",
      title: "義安社神將",
      description: "艋舺青山宮-義安社於民國10年創立，塑謝范將軍新像，鬢角上梳成特色，成為台北信仰經典。"
    },
    {
      image: "/images/義英社.jpg",
      title: "義英社神將",
      description: "艋舺青山宮-義英社，最早由西門市場的魚販組成，青山宮軒社，承載地方文化，日治曾赴日展傳統技藝。."
    },
    {
      image: "/images/鳳音社.jpg",
      title: "鳳音社神將",
      description: "艋舺青山宮-鳳音社原隸新興宮，抗戰後轉附青山宮，延續原勢力範圍。."
    },
  ];

 
  

  onMount(() => {
     // 只在瀏覽器端載入 gsap
    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default;
      import('gsap/ScrollTrigger').then((stModule) => {
        gsap.registerPlugin(stModule.ScrollTrigger);
        // 這裡可以加 GSAP 動畫初始化程式碼
      });
    });

  

   gsap.from('.timeline-item', {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
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

<main class="bg-black font-bakudai-md">

  <AiChat />

  <section id= "hero" class="relative h-screen overflow-hidden text-white text-center bg-black" bind:this={heroSection}>
    <!-- 背景圖，視差滑動 -->
    <div
      class="absolute top-0 left-0 w-full h-[120%] bg-cover bg-center z-0"
      style={`transform: translateY(${scrollY}px); transition: transform 0.1s ease-out; background-image: url('/images/qsbg.jpg');`}
    >
      <img
        src="/images/qsbg.jpg"
        alt="艋舺青山宮正門"
        title="艋舺青山宮正門燈籠門牌"
        class="sr-only"
        loading="lazy"
      />
    </div>

    
    <!-- Hero  -->  
    <div class="relative z-10 flex flex-col items-center justify-center h-full px-6">
      <h1 class="md:text-6xl font-bold leading-tight drop-shadow-xl backdrop-blur border-yellow-500 border-b-4 pb-2 mb-2 py-2 px-2">
        艋舺青山宮
      </h1>
      <p class="mt-8 text-lg md:text-2xl backdrop-blur">走進信仰與歷史交織的聖地</p>
      
    </div>
  </section>


  <!-- 青山宮介紹區塊 --> 
  <div class="w-full h-[100vh]     text-white flex flex-row gap-10 items-center justify-center px-4">
    <div class="md:w-1/2 h-full max-h-full flex items-center justify-end">
      <SlideInSection direction="left">
        <img src="/images/門口燈籠.jpg" alt="艋舺青山宮照片" loading="lazy"  class="w-full max-h-[95vh]   rounded-full border-2 border-tw-blue shadow-lg hover:scale-105 transition object-contain " />
      </SlideInSection>
    </div>

    <div class="md:w-1/2">
        <h2 class="text-3xl font-bold mb-4 text-title font-bakudai-md">艋舺青山宮</h2>
        <p class="text-blue-100 py-4 text-lg leading-relaxed bg-gray-900 border-l-4 border-yellow-300 px-1">
             艋舺青山宮位於臺北市萬華區，創建於1856年（清咸豐六年），主祀青山靈安尊王，現為中華民國直轄市定古蹟。自清領時期以來，該廟便是艋舺地區泉州三邑惠安人的王爺信仰中心之一。
        每年青山靈安尊王聖誕前後，便皆舉行盛大祭典，正日更為萬華年度迎神活動中最為隆重的儀式，民間俗稱「艋舺大拜拜」。時至今日，艋舺青山宮與艋舺龍山寺、艋舺清水巖、臺北天后宮合稱「艋舺四大廟門」。<br><br>
        相傳惠安漁民自大陸迎請靈安尊王來臺時，當神像途經舊街（今西園路）時，神轎突然無法移動。信徒遂擲筊請示，方得知靈安尊王有意留駐於此。於是，眾人遂於舊街建廟奉祀。<br><br>
        恰逢當時瘟疫流行，凡誠心向靈安尊王祈求者皆能平安健康，信眾因此日益增多。隨著香火鼎盛，信徒合力籌資興建更為宏偉的廟宇，即為今日的「艋舺青山宮」。」
        </p>
    </div>
  </div>

  





<div class="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>

  <!-- 靈安尊王介紹-->

  <div class="w-full h-[100vh]    text-white flex flex-row gap-10 items-center justify-center px-4">
    <div class="md:w-1/2 px-4 " >
      <h2 class="text-3xl font-bold mb-4 text-title font-bakudai-md">主神：靈安尊王</h2>
      <p class="py-4 text-lg bg-gray-900 border-l-4 border-amber-300 leading-relaxed">
        艋舺青山宮主祀「青山靈安尊王」，又名「青山王」、「靈安尊王」，原為福建省泉州三邑惠安縣的地方守護神。<br><br>

        相傳清朝咸豐年間(1854年)，艋舺地區爆發嚴重瘟疫，而當時人們相信瘟疫元兇是因為古井裡頭藏了一隻蟾蜍精，其吐出的毒霧使人染疫。<br><br>

        於是為了平息瘟疫，當地漁民特地返至青山宮祖廟惠安青山宮迎請一尊「靈安尊王」前至艋舺協助除疫。後來所經之處的瘟疫的確逐漸平息，人們便相信靈安尊王有著「去除邪祟」、「驅除瘟疫」的本領。
      </p>

    </div>
    <div class="md:w-1/2 h-full max-h-full flex items-center justify-end">
      <SlideInSection direction="right">
        <img src="/images/main god.jpg" alt="靈安尊王" class="w-full max-h-[95vh]  rounded-full border-2 border-tw-blue shadow-lg hover:scale-105 transition object-contain " />
      </SlideInSection>
    </div>
  </div>

  <div class="w-full h-[100vh]    text-white flex flex-row gap-10 items-center justify-center px-4">

    <div class="md:w-1/2 h-full max-h-full flex items-center justify-end">
      <SlideInSection direction="right">
        <img src="/images/尊王夫人.jpg" alt="靈安尊王" class="w-full max-h-[95vh]  rounded-full border-2 border-tw-blue shadow-lg hover:scale-105 transition object-contain " />
      </SlideInSection>
    </div> 
    
    <div class="md:w-1/2 px-4 " >
      <h2 class="text-3xl font-bold mb-4 text-title font-bakudai-md">顯慶王妃</h2>
      <p class="py-4 text-lg bg-gray-900 border-l-4 border-amber-300 leading-relaxed">
         艋舺青山宮後殿主祀顯慶王妃。顯慶王妃為靈安尊王的配偶，不僅陪伴主神，也展現柔和與庇佑的一面。<br><br>
         民間普遍視妃神為守護家庭、福澤子嗣的神祇，因此後殿常成為信眾祈求婚姻和合、子嗣平安的重要所在。
      </p>

    </div>
  </div>

  <!--  神將介紹
  <section class="w-[100vw] h-[80vh] flex ">
    {#each galleryItems as item}
      <FoldImages image={item.image} title={item.title} description={item.description} />
    {/each}
  </section>
-->

  <div class="w-full h-[2px] bg-gradient-to-r from-transparent via-568F87 to-transparent my-16"></div>

  <Gallery />

  <TimeLine />


  
  <section class="mb-20 w-full h-full" >
    <div class=" text-white flex flex-col gap-10 items-center justify-center px-4 ">
      
    <h2 class="text-title font-bakudai-md font-bold pt-10 ">青山祭</h2>

    <div class="md:w-[50vw]   flex items-center ">
        <SlideInSection direction="right">
          <img src="/images/青山祭.jpg" alt="青山祭" class="w-full max-h-[50vh] rounded-2xl border-2 border-tw-blue shadow-lg hover:scale-105 transition object-cover " />
        </SlideInSection>
      </div>

      <p class="text-white text-lg mx-48 leading-relaxed pt-5">
          艋舺青山祭作為艋舺青山宮每年的重要文化盛事，承載著豐富的歷史意義與當代價值。歷年來，該活動不僅提供了一個展現創意與才華的平臺，更促進了社群的凝聚與文化傳承
      </p>  
    </div>
  </section>

  
  
  <!-- （圖片格） 
  <section class="mt-20 py-20 bg-gray-100">
    <div class="container mx-auto px-4">
      <h2 class="text-6xl font-bold text-center mb-12  font-bakudai-md">青山季</h2>
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
-->




  <section class="w-[100vw] h-[80vh] flex ">
    {#each galleryItems as item}
      <FoldImages image={item.image} title={item.title} description={item.description} link={""} />
    {/each}

  </section>

 

  
</main>
<!-- Footer -->
<footer class="bg-black text-white py-10 text-center text-sm">
  
</footer>


<style>
 
</style>