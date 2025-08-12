<script>
  import { onMount } from 'svelte';
  import SlideInSection from '../../components/SlideInSection.svelte';

  const backgroundText = `
    艋舺青山宮建於1856年，主祀青山靈安尊王，是臺北三大廟會之一的「艋舺青山祭」核心，象徵萬華的文化與信仰。每年的「艋舺大拜拜」如同「小過年」，凝聚社區情感，卻因現代化與年輕世代疏離，面臨傳承危機。我們的專案旨在結合數位科技與創新敘事，推廣青山宮的文化價值，吸引年輕人參與，讓這項民俗遺產在現代社會延續。
  `;

  const goalsText = `
    透過數位內容與實體活動，打破宮廟文化的傳統標籤，以沉浸式體驗拉近年輕世代的距離。讓更多人了解青山宮的歷史與信仰內涵，強化文化認同，促進臺灣民俗文化的傳承與社會反思，打造文化交流的平台，展現其獨特魅力。
  `;

  const teamMembers = [
    {
      name: '林志明',
      role: '專案經理',
      bio: '負責專案統籌，熱衷推廣艋舺文化，擁有10年數位轉型經驗。',
      avatar: '/images/team/lin-zhi-ming.jpg',
    },
    {
      name: '陳雅婷',
      role: '前端工程師',
      bio: '專精 SvelteKit，打造流暢且具文化氛圍的網站體驗。',
      avatar: '/images/team/chen-ya-ting.jpg',
    },
    {
      name: '張偉倫',
      role: '視覺設計師',
      bio: '融合北歐風與宮廟文化，設計簡約精美的介面。',
      avatar: '/images/team/zhang-wei-lun.jpg',
    },
    {
      name: '李欣怡',
      role: '內容策劃',
      bio: '策劃數位內容，擅長以創新方式呈現傳統文化。',
      avatar: '/images/team/li-xin-yi.jpg',
    },
    {
      name: '王俊傑',
      role: '活動統籌',
      bio: '負責實體活動規劃，推動社區參與與文化傳承。',
      avatar: '/images/team/wang-jun-jie.jpg',
    },
  ];

  // @ts-ignore
  function handleImageError(event) {
    const failedSrc = event.target.getAttribute('src');
    event.target.src = 'https://via.placeholder.com/150?text=Fallback';
    console.log(`Image load failed: ${failedSrc} -> switched to placeholder`);
  }

  // @ts-ignore
  function handleHeroImageError(event) {
    const failedSrc = event.target.getAttribute('src');
    event.target.src = 'https://via.placeholder.com/1920x600?text=Hero';
    console.log(`Hero image load failed: ${failedSrc} -> switched to placeholder`);
  }

  console.log('introData:', { backgroundText, goalsText, teamMembers });

  onMount(() => {
    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default;
      import('gsap/ScrollTrigger').then((stModule) => {
        gsap.registerPlugin(stModule.ScrollTrigger);
        // Hero Section 動畫
        gsap.from('.hero-title', {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
        gsap.from('.hero-subtitle', {
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
        });
        // 現有區塊動畫
        gsap.from('.intro-section', {
          opacity: 0,
          x: -50,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.intro-section',
            start: 'top 90%',
            end: 'bottom 20%',
            scrub: 1,
          },
        });
        document.querySelectorAll('.team-card').forEach((card, index) => {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'bottom 20%',
              scrub: 1,
            },
          });
        });
      }).catch((error) => {
        console.error('Failed to load GSAP ScrollTrigger:', error);
        document.querySelectorAll('.team-card').forEach((card) => {
          card.classList.add('fallback-animation');
        });
      });
    }).catch((error) => {
      console.error('Failed to load GSAP:', error);
      document.querySelectorAll('.hero-title, .hero-subtitle, .team-card').forEach((el) => {
        el.classList.add('fallback-animation');
      });
    });
  });
</script>

<main class="bg-black font-sans text-white font-bakudai-exlg">
  <section class="hero-section min-h-screen flex flex-col items-center justify-center relative bg-black">
    <img
      src="/images/hero-bg.jpg"
      alt="艋舺青山宮背景"
      class="absolute inset-0 w-full h-full object-cover opacity-50"
      loading="lazy"
      on:error={handleHeroImageError}
    />
    <div class="relative z-10 text-center px-4">
      <h1 class="hero-title text-5xl md:text-6xl font-bold text-[#113F67] mb-6 tracking-wide">
        艋舺青山宮：數位傳承文化之美
      </h1>
      <p class="hero-subtitle text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
        結合科技與傳統，延續萬華信仰
      </p>
      <div class="border-t-4 border-yellow-500 w-24 mx-auto"></div>
    </div>
  </section>

  <section class="intro-section container mx-auto py-16">
    <SlideInSection direction="left" delay={0.2}>
      <h1 class="text-4xl font-bold text-[#113F67] mb-8 text-center tracking-wide">
        專題背景與動機
      </h1>
      <div class="bg-gray-800 p-6 rounded-lg shadow-md border border-[#113F67] max-w-3xl mx-auto">
        <p class="text-gray-300 leading-relaxed">{backgroundText}</p>
      </div>
    </SlideInSection>
    <SlideInSection direction="left" delay={0.4}>
      <h1 class="text-4xl font-bold text-[#113F67] mb-8 mt-12 text-center tracking-wide">
        專題目標
      </h1>
      <div class="bg-gray-800 p-6 rounded-lg shadow-md border border-[#113F67] max-w-3xl mx-auto">
        <p class="text-gray-300 leading-relaxed">{goalsText}</p>
      </div>
    </SlideInSection>
  </section>

  <section class="team-section container mx-auto py-16">
    <SlideInSection direction="left" delay={0.6}>
      <h1 class="text-4xl font-bold text-[#113F67] mb-12 text-center tracking-wide">
        我們的團隊
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="team-grid">
        {#each teamMembers as member}
          <div
            class="team-card bg-white text-black p-6 rounded-lg shadow-md border-2 border-[#113F67] hover:border-yellow-500 hover:scale-105 transition transform duration-300 min-h-[300px]"
            style="opacity: 1; visibility: visible;"
          >
            <img
              src={member.avatar}
              alt={`頭像 - ${member.name}`}
              class="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
              loading="lazy"
              on:error={handleImageError}
            />
            <h2 class="text-2xl font-bold text-center mb-2">{member.name}</h2>
            <p class="text-lg text-center text-[#113F67] mb-4">{member.role}</p>
            <p class="text-gray-600 text-center">{member.bio}</p>
          </div>
        {/each}
      </div>
    </SlideInSection>
  </section>
</main>

<style>
  .hero-section {
    background-size: cover;
    background-position: center;
  }

  .intro-section,
  .team-section {
    max-width: 1200px;
    margin: 0 auto;
  }

  .team-card:hover {
    box-shadow: 0 4px 20px rgba(17, 63, 103, 0.3); /* #113F67 陰影 */
  }

  .fallback-animation {
    animation: fadeIn 0.8s ease-out forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .hero-section {
      min-height: 50vh;
      padding: 2rem 1rem;
    }

    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .intro-section,
    .team-section {
      padding: 2rem 1rem;
    }

    .team-card {
      max-width: 100%;
    }

    .team-card img {
      width: 6rem; /* w-24 = 96px */
      height: 6rem;
    }

    .intro-section p {
      font-size: 0.9rem;
    }
  }
</style>