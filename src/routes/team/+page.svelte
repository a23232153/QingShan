<script>
  import { onMount, afterUpdate, tick } from 'svelte';
  import { browser } from '$app/environment';
  import SlideInSection from '../../components/SlideInSection.svelte';

  // 範例資料
  const goalsText = `
    透過數位內容與實體活動，打破宮廟文化的傳統標籤，
    以沉浸式體驗拉近年輕世代的距離。
    讓更多人了解並參與其中，深化對宮廟文化的認知與尊重，
    發掘其深厚的文化底蘊與精神內涵，強化文化認同，
    促進臺灣民俗文化的傳承與社會反思，打造文化交流的平台，
    展現其獨特魅力。
  `;

  const backgroundText = `
    本專題旨在探索宮廟文化的現代傳承方式，
    結合數位科技與實體活動，讓更多年輕人了解
    傳統信仰的深層意涵與文化價值。
  `;

  const teamMembers = [
    {
      name: '任皓煒',
      role: '專案經理',
      bio: '負責專案規劃與執行',
      avatar: '/images/team1.jpg'
    },
    {
      name: '涂凱傑',
      role: '前端工程師',
      bio: '開發互動式網頁',
      avatar: '/images/team1.jpg'
    },
    {
      name: '姜兆揚',
      role: '內容總監',
      bio: '負責內容策劃與發想',
      avatar: '/images/team1.jpg'
    },
    {
      name: '徐偉峻',
      role: '公關行銷',
      bio: '負責媒體宣傳與活動推廣',
      avatar: '/images/team1.jpg'
    },
    {
      name: '黃盛隆',
      role: '美術設計',
      bio: '負責視覺設計與美編',
      avatar: '/images/team1.jpg'
    }


  ];

  // @ts-ignore
  let heroTitle;
  // @ts-ignore
  let heroSubtitle;
  // @ts-ignore
  let introSection;

  // @ts-ignore
  function handleImageError(event) {
    const failedSrc = event.target.getAttribute('src');
    event.target.src = '/images/default-avatar.jpg';
    console.error(`Image load failed: ${failedSrc} at ${new Date().toISOString()}`);
  }

  // @ts-ignore
  function handleHeroImageError(event) {
    const failedSrc = event.target.getAttribute('src');
    event.target.src = '/images/default-avatar.jpg';
    console.error(`Hero image load failed: ${failedSrc} at ${new Date().toISOString()}`);
  }

  function waitForGSAP() {
    return new Promise((resolve, reject) => {
      let tries = 0;
      const timer = setInterval(() => {
        // @ts-ignore
        if (window.gsap && window.ScrollTrigger) {
          clearInterval(timer);
          // @ts-ignore
          resolve();
        }
        tries++;
        if (tries > 20) {
          clearInterval(timer);
          reject('GSAP or ScrollTrigger not loaded from CDN');
        }
      }, 100);
    });
  }

  console.log('Running in /routes/team/+page.svelte', { goalsText, teamMembersCount: teamMembers.length });

  onMount(async () => {
    if (!browser) return; // 僅在客戶端執行


    try {
      await waitForGSAP();
      // @ts-ignore
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);
      // @ts-ignore
      

      await tick();
    
    } catch (err) {
      
     
    }
  });

  afterUpdate(() => {
    if (!browser) return; // 僅在客戶端執行

    console.log('afterUpdate: Checking DOM elements');
    // @ts-ignore
    console.log('Hero title element:', heroTitle, 'Height:', heroTitle?.offsetHeight, 'Visible:', heroTitle?.offsetParent !== null);
    // @ts-ignore
    console.log('Hero subtitle element:', heroSubtitle, 'Height:', heroSubtitle?.offsetHeight, 'Visible:', heroSubtitle?.offsetParent !== null);
    // @ts-ignore
    console.log('Intro section rendered:', { visible: introSection?.offsetParent !== null, height: introSection?.offsetHeight });

    // @ts-ignore
    if (!heroTitle || !heroSubtitle || !introSection) {
      console.error('DOM elements missing at', new Date().toISOString());
      document.querySelectorAll('.hero-title, .hero-subtitle, .team-card').forEach((el) => {
        el.classList.add('fallback-animation');
      });
      return;
    }

    const { gsap } = window;
    gsap.from(heroTitle, { y: 50, opacity: 0, duration: 1 });
    gsap.from(heroSubtitle, { y: 30, opacity: 0, duration: 1, delay: 0.3 });

    const cards = document.querySelectorAll('.team-card');
    console.log('Found team-card elements:', cards.length, Array.from(cards).map(card => ({
      // @ts-ignore
      offsetHeight: card.offsetHeight,
      // @ts-ignore
      isVisible: card.offsetParent !== null,
      style: window.getComputedStyle(card).display,
    })));

    if (cards.length === 0) {
      console.error('No team-card elements found at', new Date().toISOString());
      document.querySelectorAll('.team-card').forEach((el) => {
        el.classList.add('fallback-animation');
      });
      return;
    }

   
  });
</script>

<main class="bg-white font-sans text-white font-bakudai-exlg">
  <!-- Hero Section -->
  <section class="hero-section min-h-screen flex flex-col items-center justify-center relative bg-black">

    <img
      src="/images/hero-bg.jpg"
      alt="艋舺青山宮背景"
      class="absolute inset-0 w-full h-full object-cover opacity-50"
      loading="lazy"
      on:error={handleHeroImageError}
    />
    
    <div class="relative z-10 text-center px-4 ">
      <h1 bind:this={heroTitle} class="hero-title text-5xl md:text-6xl font-bold text-[#113F67] mb-6 tracking-wide">
        艋舺青山宮：數位傳承文化之美
      </h1>
      <p bind:this={heroSubtitle} class="hero-subtitle text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
        結合科技與傳統，延續萬華信仰
      </p>
      <div class="border-t-4 border-yellow-500 w-24 mx-auto"></div>
    </div>
  </section>

  <!-- Intro Section -->
  <section bind:this={introSection} class="intro-section container mx-auto py-16">
    <SlideInSection direction="left" delay={0.35}>
      <h1 class="text-6xl font-bold text-[#113F67] mb-8 text-center tracking-wide">
        專題背景與動機
      </h1>

      <div class="bg-gray-800 p-6 rounded-lg border-l-4 border-yellow-500  shadow-md  max-w-5xl mx-auto">
        <p class="text-white text-2xl leading-relaxed">{backgroundText}</p>
      </div>
    </SlideInSection>


    <SlideInSection direction="left" delay={0.4}>
      <h1 class="text-6xl font-bold text-[#113F67] mb-8 mt-12 text-center tracking-wide">
        專題目標
       </h1>
      <div class="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-yellow-500 max-w-5xl mx-auto">
        <p class="text-gray-300 text-2xl leading-relaxed">{goalsText}</p>
      </div>
    </SlideInSection>
  </section>

  <!-- Team Section -->
  <section class="team-section container mx-auto py-16">
    <SlideInSection direction="left" delay={0.6}>
      <h1 class="text-4xl font-bold text-[#113F67] mb-12 text-center tracking-wide">
        我們的團隊
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-3  justify-items-center gap-6" data-testid="team-grid">
        {#each teamMembers.slice(0, 5) as member}
          <div class="team-card bg-white text-black p-6 rounded-lg shadow-md border-2 border-[#113F67] hover:border-yellow-500 hover:scale-105 transition transform duration-300 min-h-[300px] w-full md:basis-1/3 md:grow-0 md:shrink-0 max-w-md"
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
    box-shadow: 0 4px 20px rgba(17, 63, 103, 0.3);
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
      width: 6rem;
      height: 6rem;
    }

    .intro-section p {
      font-size: 0.9rem;
    }
  }
</style>