<svelte:head>
  <meta name="description" content="深入探索艋舺青山宮的歷史與文化，一起了解青山宮的現在與過去。" />
  <meta name="robots" content="index, follow" />

  <meta property="og:title" content="艋舺青山宮｜參拜青山" />
  <meta property="og:description" content="深入探索艋舺青山宮的歷史與文化，一起了解青山宮的現在與過去。" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://qing-shan.vercel.app" />
  <meta property="og:image" content="https://qing-shan.vercel.app/images/qsbg.png" />

  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import SlideInSection from '../../components/SlideInSection.svelte';
  import AiChat from '../../components/AIChat.svelte';
  import Gallery from '../../components/Gallery.svelte';
  import TimeLine from '../../components/TimeLine.svelte';
  import FoldImages from '../../components/FoldImages.svelte';

  // 定義變數型別，解決 TS 錯誤
  let heroSection: HTMLElement;
  let scrollY = 0;

  const galleryItems = [
    {
      image: "/images/gang1.jpg",
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
      description: "艋舺青山宮-義英社，最早由西門市場的魚販組成，青山宮軒社，承載地方文化，日治曾赴日展傳統技藝。"
    },
    {
      image: "/images/鳳音社.jpg",
      title: "鳳音社神將",
      description: "艋舺青山宮-鳳音社原隸新興宮，抗戰後轉附青山宮，延續原勢力範圍。"
    },
  ];

  onMount(() => {
    // GSAP 載入邏輯
    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default;
      import('gsap/ScrollTrigger').then((stModule) => {
        gsap.registerPlugin(stModule.ScrollTrigger);
        
        // Timeline Animation
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
      });
    });

    const onScroll = () => {
      if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const baseY = -100; // 調整視差起始點

      if (rect.top < viewHeight && rect.bottom > 0) {
        const ratio = (viewHeight - rect.top) / (viewHeight + rect.height);
        scrollY = baseY + Math.min(ratio * 300, 300); 
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<div class="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay" style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');"></div>

<main class="bg-[#0a0a0a] text-stone-200 font-bakudai-md overflow-x-hidden selection:bg-amber-500 selection:text-black">

  <AiChat />

 <section id="hero" class="relative h-screen w-full overflow-hidden text-white text-center bg-black" bind:this={heroSection}>
    <div
      class="absolute top-0 left-0 w-full h-[120%] bg-cover bg-center z-0"
      style={`transform: translateY(${scrollY}px); transition: transform 0.1s ease-out; background-image: url('/images/qsbg.png');`}
    >
      <img
        src="/images/qsbg.png"
        alt="艋舺青山宮正門"
        title="艋舺青山宮正門燈籠門牌"
        class="sr-only"
        loading="lazy"
      />
    </div>

    <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-6">
      <h1 class="text-4xl md:text-6xl font-bold leading-tight drop-shadow-xl backdrop-blur border-yellow-500 border-b-4 pb-2 mb-2 py-2 px-4 rounded-sm">
        艋舺青山宮介紹
      </h1>
      <p class="mt-4 md:mt-8 text-lg md:text-2xl backdrop-blur-sm px-4 py-1 rounded-sm">
        走進信仰與歷史交織的聖地
      </p>
    </div>
  </section>


  <div class="relative w-full min-h-screen flex flex-col md:flex-row gap-12 items-center justify-center px-6 py-24 md:py-0">
    
    <div class="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="w-full md:w-1/2 flex items-center justify-center md:justify-end relative z-10">
      <SlideInSection direction="left">
        <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <img 
            src="/images/門口燈籠.jpg" 
            alt="艋舺青山宮照片" 
            loading="lazy" 
            class="relative w-full max-w-[320px] md:max-w-[450px] aspect-square object-cover rounded-full border border-stone-600 shadow-2xl group-hover:scale-[1.02] transition duration-700 ease-out" 
            />
        </div>
      </SlideInSection>
    </div>

    <div class="w-full md:w-1/2 relative z-10">
      <h2 class="text-4xl md:text-5xl font-bold mb-8 text-amber-500 tracking-widest border-l-8 border-amber-700 pl-4">艋舺青山宮</h2>
      
      <div class="text-stone-300 text-base md:text-lg leading-loose bg-stone-900/60 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-2xl shadow-xl">
        <p class="mb-4">
            艋舺青山宮位於臺北市萬華區，創建於1856年（清咸豐六年），主祀<span class="text-amber-400 font-bold">青山靈安尊王</span>，現為中華民國直轄市定古蹟。自清領時期以來，該廟便是艋舺地區泉州三邑惠安人的王爺信仰中心之一。
        </p>
        <p class="mb-4">
            每年青山靈安尊王聖誕前後，皆舉行盛大祭典，正日更為萬華年度迎神活動中最為隆重的儀式，民間俗稱<span class="text-amber-400 font-bold">「艋舺大拜拜」</span>。
        </p>
        <p>
            相傳惠安漁民迎請靈安尊王來臺，神轎行經舊街時突無法移動，擲筊後得知尊王欲留駐此地，遂建廟奉祀。恰逢瘟疫流行，誠心祈求者皆平安，香火因此鼎盛。
        </p>
      </div>
    </div>
  </div>


  <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-700/50 to-transparent my-10"></div>


  <div class="relative w-full min-h-screen flex flex-col md:flex-row gap-12 items-center justify-center px-6 py-24 md:py-0">
    
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="w-full md:w-1/2 order-2 md:order-1 relative z-10">
      <h2 class="text-4xl md:text-5xl font-bold mb-8 text-amber-500 tracking-widest border-l-8 border-amber-700 pl-4">主神：靈安尊王</h2>
      
      <div class="text-stone-300 text-base md:text-lg leading-loose bg-stone-900/60 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-2xl shadow-xl">
        <p class="mb-4">
          艋舺青山宮主祀「青山靈安尊王」，又名「青山王」，原為福建省泉州三邑惠安縣的地方守護神。
        </p>
        <p class="mb-4">
            相傳清朝咸豐年間(1854年)，艋舺爆發嚴重瘟疫，傳言是蟾蜍精作祟。當地漁民返鄉迎請「靈安尊王」來臺協助。
        </p>
        <p>
            尊王所經之處瘟疫平息，信眾深信其擁有<span class="text-red-400 font-bold">「去除邪祟、驅除瘟疫」</span>的神威，自此成為艋舺的守護神。
        </p>
      </div>
    </div>
    
    <div class="w-full md:w-1/2 flex items-center justify-center md:justify-start order-1 md:order-2 relative z-10">
      <SlideInSection direction="right">
        <div class="relative group">
             <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <img 
            src="/images/main god.jpg" 
            alt="靈安尊王" 
            class="relative w-full max-w-[320px] md:max-w-[450px] aspect-square object-cover rounded-full border border-stone-600 shadow-2xl group-hover:scale-[1.02] transition duration-700 ease-out" 
            />
        </div>
      </SlideInSection>
    </div>
  </div>


  <div class="relative w-full min-h-screen flex flex-col md:flex-row gap-12 items-center justify-center px-6 py-24 md:py-0">
    <div class="w-full md:w-1/2 flex items-center justify-center md:justify-end relative z-10">
      <SlideInSection direction="right">
        <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-amber-300 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
            <img 
            src="/images/尊王夫人.jpg" 
            alt="靈安尊王夫人" 
            class="relative w-full max-w-[320px] md:max-w-[450px] aspect-square object-cover rounded-full border border-stone-600 shadow-2xl group-hover:scale-[1.02] transition duration-700 ease-out" 
            />
        </div>
      </SlideInSection>
    </div>
    
    <div class="w-full md:w-1/2 relative z-10">
      <h2 class="text-3xl md:text-4xl font-bold mb-8 text-stone-200 tracking-widest">顯慶妃 與 慶安妃</h2>
      
      <div class="text-stone-300 text-base md:text-lg leading-loose bg-stone-900/60 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
        <div>
            <h3 class="text-xl font-bold text-amber-400 mb-2 border-b border-amber-500/30 pb-1 inline-block">顯慶妃</h3>
            <p>
                生前名為華氏，為尊王正室，受封「昭順夫人」晉封「顯慶妃」。象徵柔和與守護，信眾多祈求<span class="text-stone-100">婚姻順遂、家庭和樂</span>。
            </p>
        </div>
        <div>
            <h3 class="text-xl font-bold text-amber-400 mb-2 border-b border-amber-500/30 pb-1 inline-block">慶安妃</h3>
            <p>
                惠安李姓女子，幼時立約「拋手帕上梁不落者為尊王夫人」，後於宮內坐化。民間盛傳「二媽比大媽顯」，早期多由二媽降乩。
            </p>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-700/50 to-transparent my-16"></div>

  <div class="py-10">
      <Gallery />
  </div>

  <div class="py-10">
      <TimeLine />
  </div>

  <section class="mb-32 w-full relative">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 text-[10rem] md:text-[15rem] font-bold text-white/[0.03] pointer-events-none select-none whitespace-nowrap z-0">
        QING SHAN
    </div>

    <div class="relative z-10 text-white flex flex-col gap-10 items-center justify-center px-4">
      <h2 class="text-4xl md:text-5xl font-bold pt-10 text-amber-500 tracking-[0.5em] text-center">青山祭</h2>

      <div class="w-full md:w-[60vw] flex items-center justify-center perspective-1000">
        <SlideInSection direction="right">
          <img 
            src="/images/青山祭.jpg" 
            alt="青山祭" 
            class="w-full h-auto max-h-[60vh] rounded-xl border border-stone-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)] transition duration-500 object-cover" 
          />
        </SlideInSection>
      </div>

      <p class="text-stone-300 text-base md:text-xl w-full max-w-3xl mx-auto leading-loose text-center px-4 font-light">
        <span class="text-amber-500 font-bold">艋舺青山祭</span>不僅是每年的宗教盛事，更是一場結合傳統與現代的文化祭典。
        在這裡，古老的信仰與當代的創意碰撞，讓社群凝聚，讓文化傳承。
      </p>
    </div>
  </section>

  <section class="w-[100vw] h-[80vh] flex ">
    {#each galleryItems as item}
      <FoldImages image={item.image} title={item.title} description={item.description} link={""} />
    {/each}
  </section>

</main>

<footer class="bg-[#050505] text-stone-500 py-12 text-center text-sm border-t border-stone-900 font-bakudai-md px-4">
    <div class="mb-4">
        <h3 class="text-lg text-stone-300 font-bold tracking-widest mb-1">艋舺青山宮</h3>
        <p></p>
    </div>
  &copy; {new Date().getFullYear()} 艋舺青山宮數位專題團隊——青山. All rights reserved.
</footer>

<style>
    /* * 額外的 CSS 輔助 
     * 如果有字體載入需求或其他全域設定可放這
     */
    :global(body) {
        background-color: #0a0a0a;
    }
</style>