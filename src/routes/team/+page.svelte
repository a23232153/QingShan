<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

  // 贊助商資料
  const sponsors = [
    { name: '中華文化總會', logo: '/images/中華文化總會.png'},
    { name: '台北五帝會', logo: '/images/台北五帝會.jpg' },
    { name: '台北宣敬堂', logo: '/images/台北宣敬堂.png' },
    { name: '四湖參天宮', logo: '/images/四湖參天宮.png' },
    { name: '找廟公', logo: '/images/找廟公.jpg' },
    { name: '臺北永靈會', logo: '/images/臺北永靈會.png' },
    { name: '艋舺青山宮', logo: '/images/艋舺青山宮.png' },
    { name: '艋舺青山宮神將班', logo: '/images/艋舺青山宮神將班.png' },
    { name: '寶華影像工作室', logo: '/images/寶華影像工作室.jpg' },
  ];

  // 為了做無限滾動，將陣列複製一份
  const marqueeSponsors = [...sponsors, ...sponsors];

  const goalsText = `透過數位內容與實體活動，打破宮廟文化的傳統標籤，以沉浸式體驗拉近年輕世代的距離。讓更多人了解並參與其中，深化對宮廟文化的認知與尊重，發掘其深厚的文化底蘊與精神內涵。`;
  const backgroundText = `本專題旨在探索宮廟文化的現代傳承方式，結合數位科技與實體活動，讓更多年輕人了解傳統信仰的深層意涵與文化價值。`;

  const teamMembers = [
    { name: '任皓煒', role: '專案經理', bio: '負責專案規劃與執行', avatar: '/images/m6.png' },
    { name: '涂凱傑', role: '前端工程師', bio: '開發互動式網頁', avatar: '/images/m1.png' },
    { name: '姜兆揚', role: '內容總監', bio: '負責內容策劃與發想', avatar: '/images/m3.png' },
    { name: '徐偉峻', role: '公關行銷', bio: '負責媒體宣傳推廣', avatar: '/images/m2.png' },
    { name: '黃盛隆', role: '美術設計', bio: '負責視覺設計與美編', avatar: '/images/m4.png' },
    { name: '江信昱', role: '指導老師', bio: '負責指導專題方向', avatar: '/images/m5.png' }
  ];

  let heroSection: HTMLElement;
  let introSection: HTMLElement;
  let teamSection: HTMLElement;

  // 圖片載入失敗處理
  function handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://placehold.co/400x400?text=Member'; // 預設圖
  }

 
  function tilt(node: HTMLElement) {
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = node.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      // 設定旋轉角度 (可以調整 20 這個數值來改變傾斜強度)
      node.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      node.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)`;
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);

    return {
      destroy() {
        node.removeEventListener('mousemove', handleMouseMove);
        node.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }

  onMount(() => {
    if (browser) {
      gsap.registerPlugin(ScrollTrigger);

      // 1. Hero 文字進場動畫
      const tl = gsap.timeline();
      tl.from('.hero-title', { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' })
        .from('.hero-subtitle', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
        .from('.scroll-indicator', { opacity: 0, duration: 1 }, '-=0.5');

      // 2. 介紹區塊滾動觸發動畫
      gsap.from('.intro-card', {
        scrollTrigger: {
          trigger: introSection,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2, // 依序進場
        ease: 'power3.out'
      });

      // 3. 團隊成員依序彈出動畫
      gsap.from('.team-card-wrapper', {
        scrollTrigger: {
          trigger: teamSection,
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)' // 帶有彈性的效果
      });
    }
  });
</script>

<main class="bg-stone-900 font-sans text-white font-bakudai-md overflow-hidden">
  
  <section 
    bind:this={heroSection}
    class="relative h-screen flex flex-col items-center justify-center overflow-hidden"
  >
    <div 
        class="absolute inset-0 bg-[url('/images/牌樓-.jpg')] bg-cover bg-center bg-no-repeat opacity-60"
        style="background-attachment: fixed;"
    ></div>
    
    <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-stone-900"></div>

    <div class="relative z-10 text-center px-4 max-w-5xl mx-auto">
      <h1 class="hero-title text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 tracking-widest mb-6 drop-shadow-lg">
        艋舺青山宮
      </h1>
      <div class="hero-title text-2xl md:text-4xl font-light tracking-[0.5em] text-stone-200 mb-12 border-t border-b border-yellow-500/50 py-4 inline-block">
        數位傳承文化之美
      </div>
      
      <p class="hero-subtitle text-lg md:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-light">
        結合現代科技與傳統信仰，<br class="md:hidden" /> 讓萬華的記憶在數位時代永續傳承。
      </p>
    </div>

    <div class="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span class="text-yellow-500 text-sm tracking-widest">SCROLL</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    </div>
  </section>

  <section bind:this={introSection} class="relative py-24 px-4 md:px-8 max-w-7xl mx-auto">
    <div class="absolute top-10 left-10 text-9xl font-bold text-stone-800 opacity-30 select-none pointer-events-none rotate-90 md:rotate-0">緣起</div>

    <div class="grid md:grid-cols-2 gap-12 relative z-10">
        
        <div class="intro-card group">
            <div class="h-full bg-stone-800/50 backdrop-blur-md border border-stone-700 p-8 rounded-2xl hover:border-red-600 transition-colors duration-500 relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl group-hover:bg-red-600/40 transition-all duration-500"></div>
                
                <h2 class="text-3xl font-bold text-red-500 mb-6 flex items-center gap-3">
                    <span class="w-2 h-8 bg-red-500 rounded-full"></span>
                    背景與動機
                </h2>
                <p class="text-stone-300 text-lg leading-loose text-justify">
                    {backgroundText}
                </p>
            </div>
        </div>

        <div class="intro-card group md:mt-16">
            <div class="h-full bg-stone-800/50 backdrop-blur-md border border-stone-700 p-8 rounded-2xl hover:border-yellow-500 transition-colors duration-500 relative overflow-hidden">
                <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl group-hover:bg-yellow-500/30 transition-all duration-500"></div>

                <h2 class="text-3xl font-bold text-yellow-500 mb-6 flex items-center gap-3 flex-row-reverse md:flex-row justify-end md:justify-start">
                    <span class="w-2 h-8 bg-yellow-500 rounded-full"></span>
                    專題目標
                </h2>
                <p class="text-stone-300 text-lg leading-loose text-justify">
                    {goalsText}
                </p>
            </div>
        </div>
    </div>
  </section>

  <section bind:this={teamSection} class="py-24 bg-stone-900 relative overflow-hidden">
    <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

    <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-20">
            <h2 class="text-sm text-red-500 tracking-[0.3em] font-bold mb-2 uppercase">Our Team</h2>
            <h1 class="text-4xl md:text-5xl font-bold text-white tracking-wide">核心團隊成員</h1>
            <div class="w-24 h-1 bg-yellow-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {#each teamMembers as member}
                <div class="team-card-wrapper perspective-container">
                    <div 
                        use:tilt 
                        class="team-card bg-stone-800 border border-stone-700 p-8 rounded-xl shadow-xl relative group transform-style-3d transition-shadow duration-300"
                    >
                        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                        
                        <div class="relative w-32 h-32 mx-auto mb-6 transform-style-3d translate-z-20">
                            <div class="absolute inset-0 bg-yellow-500 rounded-full blur-lg opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <img
                                src={member.avatar}
                                alt={member.name}
                                class="w-full h-full rounded-full object-cover border-4 border-stone-700 group-hover:border-yellow-500 transition-colors duration-300 relative z-10"
                                on:error={handleImageError}
                            />
                        </div>

                        <div class="text-center transform-style-3d translate-z-10">
                            <h2 class="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{member.name}</h2>
                            <p class="text-red-400 font-medium tracking-wider text-sm mb-4">{member.role}</p>
                            <p class="text-stone-400 text-sm leading-relaxed">{member.bio}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
  </section>

</main>

<footer class="bg-black text-white border-t border-stone-800 font-bakudai-md py-12 overflow-hidden">
    <div class="text-center mb-8">
        <h3 class="text-xl font-bold text-stone-400 tracking-widest">合作單位</h3>
    </div>

    <div class="marquee-container relative w-full overflow-hidden">
        <div class="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
        <div class="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-black to-transparent z-10"></div>

        <div class="marquee-content flex gap-12 w-max animate-marquee hover:pause">
            {#each marqueeSponsors as sponsor}
                <div class="flex flex-col items-center justify-center min-w-[150px] group cursor-pointer">
                    <div class="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center p-4 mb-3 border border-stone-800 group-hover:border-yellow-500 group-hover:bg-stone-800 transition-all duration-300">
                        <img 
                            src={sponsor.logo} 
                            alt={sponsor.name} 
                            class="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100" 
                        />
                    </div>
                    <p class="text-xs font-medium text-stone-500 group-hover:text-yellow-500 transition-colors">
                        {sponsor.name}
                    </p>
                </div>
            {/each}
        </div>
    </div>
    
    <div class="mt-12 text-center text-stone-600 text-xs">
        &copy; {new Date().getFullYear()} 艋舺青山宮數位專題團隊——青山. All rights reserved.
    </div>
</footer>

<style>
    /* 3D Tilt 相關樣式 */
    .perspective-container {
        perspective: 1000px;
    }
    
    .transform-style-3d {
        transform-style: preserve-3d;
    }
    
    .translate-z-10 {
        transform: translateZ(20px);
    }
    
    .translate-z-20 {
        transform: translateZ(40px);
    }

    /* 跑馬燈動畫 */
    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }

    .animate-marquee {
        animation: marquee 30s linear infinite;
    }

    /* 滑鼠懸停時暫停跑馬燈 */
    .hover\:pause:hover {
        animation-play-state: paused;
    }
</style>