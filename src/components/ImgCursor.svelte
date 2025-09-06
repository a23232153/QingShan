<script lang="ts">
  //@ts-nocheck
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let projects = [
    { id: 1, title: '青草巷', image: '/images/青草巷.jpg' },
    { id: 2, title: '西門町', image: '/images/西門町.jpg' },
    { id: 3, title: '廣州街夜市', image: '/images/廣州街.jpg' },
    { id: 4, title: '華西街', image: '/images/華西街.jpg' },
    { id: 5, title: '西門紅樓', image: '/images/西門紅樓-2.jpg' },
    { id: 6, title: '牌樓', image: '/images/牌樓.jpg' },
  ];
  export let defaultBg = '/images/NM.jpg';

  let container: HTMLDivElement;
  let bgImage: HTMLImageElement;
  let cursorImg: HTMLDivElement;
  let showCursor = false;
  let isTouchDevice = false;
  let currentItem: HTMLElement | null = null;
  let containerHeight = 0;
  let viewportHeight = 0;
  let lastUpdate = 0;

  // 獲取事件位置
  const getEventPos = (e: MouseEvent | TouchEvent) =>
    e instanceof MouseEvent
      ? { x: e.clientX, y: e.clientY }
      : { x: e.touches[0].clientX, y: e.touches[0].clientY };

  // 隨機旋轉角度
  const getRandomRotation = () => (Math.random() - 0.5) * 20;

  // 設置預設背景
  const setDefaultBg = () => {
    if (!bgImage) return;
    bgImage.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    bgImage.src = defaultBg;
    bgImage.style.opacity = '0.6';
    bgImage.style.transform = 'scale(1.1)';
    bgImage.style.filter = 'blur(0)';
  };

  // 計算容器高度
  const calculateHeight = () => {
    if (browser && container) {
      viewportHeight = window.innerHeight;
      containerHeight = Array.from(container.querySelectorAll('.project')).reduce(
        (acc, item) => acc + item.offsetHeight,
        0
      );
    }
  };

  // 更新容器位置（隨滑鼠滾動）
  const updateContainerPos = (clientY: number) => {
    if (containerHeight > viewportHeight && container) {
      const mouseYPercent = clientY / viewportHeight;
      const margin = 100;
      const translateYAtTop = margin;
      const translateYAtBottom = viewportHeight - containerHeight - margin;
      const translateY = translateYAtTop + mouseYPercent * (translateYAtBottom - translateYAtTop);
      container.style.transform = `translateY(${translateY}px)`;
    }
  };

  // 處理滑鼠/觸控進入
  const handleEnter = (item: HTMLElement, e: MouseEvent | TouchEvent) => {
    if (!bgImage || !cursorImg) return;

    const imgSrc = item.dataset.image;
    if (!imgSrc) {
      console.error('圖片來源未定義:', item);
      return;
    }

    currentItem = item;
    const rotation = getRandomRotation();

    bgImage.style.transition = 'none';
    bgImage.style.transform = `scale(1.2) rotate(${rotation}deg)`;
    bgImage.src = imgSrc;
    bgImage.style.opacity = '0.8';

    const pos = getEventPos(e);
    cursorImg.querySelector('img')!.src = imgSrc;
    cursorImg.style.left = `${pos.x}px`;
    cursorImg.style.top = `${pos.y}px`;
    showCursor = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bgImage.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        bgImage.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  };

  // 處理滑鼠/觸控離開
  const handleLeave = (item: HTMLElement) => {
    setTimeout(() => {
      if (currentItem === item && bgImage && cursorImg) {
        currentItem = null;
        showCursor = false;
        setDefaultBg();
      }
    }, 30);
  };

  // 設置滑鼠/觸控追蹤（帶防抖）
  const setupTracking = () => {
    const updateCursor = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - lastUpdate < 16) return; // 防抖：每 16ms 更新一次
      lastUpdate = now;

      const pos = getEventPos(e);
      if (showCursor && cursorImg) {
        cursorImg.classList.add('moving');
        cursorImg.style.left = `${pos.x}px`;
        cursorImg.style.top = `${pos.y}px`;
        setTimeout(() => cursorImg.classList.remove('moving'), 150);
      }
      updateContainerPos(pos.y);
    };

    if (browser) {
      if (!isTouchDevice) {
        document.addEventListener('mousemove', updateCursor);
      } else {
        document.addEventListener('touchmove', (e) => {
          e.preventDefault();
          updateCursor(e);
        }, { passive: false });
        document.addEventListener('touchstart', updateCursor);
      }
    }
  };

  onMount(() => {
    if (!browser) return;

    isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setDefaultBg();
    calculateHeight();
    setupTracking();

    // 預載圖片
    const allImages = [defaultBg, ...projects.map((p) => p.image)];
    allImages.forEach((src) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onerror = () => console.error(`圖片載入失敗: ${src}`);
    });

    // 進場動畫
    const items = container?.querySelectorAll('.project');
    if (items) {
      items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        }, i * 60);
      });
    }

    return () => {
      if (browser) {
        document.removeEventListener('mousemove', setupTracking);
        document.removeEventListener('touchmove', setupTracking);
        document.removeEventListener('touchstart', setupTracking);
      }
    };
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener('mousemove', setupTracking);
      document.removeEventListener('touchmove', setupTracking);
      document.removeEventListener('touchstart', setupTracking);
    }
  });
</script>

<div class="bg-container">
  <img class="bg-image" bind:this={bgImage} src={defaultBg} alt="Background" crossorigin="anonymous" />
</div>

<main class="portfolio font-bakudai-lg">
  <section class="projects" bind:this={container}>
    {#each projects as project}
      <div
        class="project"
        data-id={project.id}
        data-image={project.image}
        on:mouseenter={(e) => handleEnter(e.currentTarget, e)}
        on:mouseleave={() => handleLeave(e.currentTarget)}
        on:touchstart={(e) => handleEnter(e.currentTarget, e)}
        on:touchend={() => setTimeout(() => handleLeave(e.currentTarget), 2000)}
      >
        <div class="project-title">{project.title}</div>
      </div>
    {/each}
  </section>
</main>

<div class="gradient-top"></div>
<div class="gradient-bottom"></div>

<div class="cursor-image" class:visible={showCursor} bind:this={cursorImg}>
  <img src="" alt="Cursor" />
</div>

<style>
  :global(html), :global(body) {
    overflow-x: hidden;
    max-width: 100vw;
  }

  .portfolio {
    width: 100vw;
    height: 100vh;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: var(--primary-text, #f8f5f2);
    background-color: var(--primary-bg, #1a1917);
    overflow: hidden;
    position: relative;
  }

  .bg-container {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }

  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.1);
    transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 0.6;
  }

  .projects {
    width: 100vw;
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .project {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4px 2rem;
    cursor: none;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    width: 100vw;
    overflow: hidden;
    flex-shrink: 0;
  }

  .project-title {
    font-size: 1.8rem;
    position: relative;
    z-index: 2;
    mix-blend-mode: exclusion;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-weight: 800;
    white-space: nowrap;
  }

  .project::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: rgba(255, 255, 255, 0.15);
    z-index: 1;
    pointer-events: none;
    transition: height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .project:hover::before {
    height: 100%;
  }

  .project:hover .project-title {
    transform: translateY(-2px);
    letter-spacing: 0.02em;
  }

  .gradient-top,
  .gradient-bottom {
    position: fixed;
    left: 0;
    width: 100%;
    height: 80px;
    z-index: 200;
    pointer-events: none;
  }

  .gradient-top {
    top: 0;
    background: linear-gradient(180deg, rgba(26, 25, 23, 0.8) 0%, transparent 100%);
  }

  .gradient-bottom {
    bottom: 0;
    background: linear-gradient(0deg, rgba(26, 25, 23, 0.8) 0%, transparent 100%);
  }

  .cursor-image {
    position: fixed;
    width: 280px;
    height: 210px;
    z-index: 150;
    pointer-events: none;
    transform: translate(-50%, -50%);
    overflow: hidden;
    transform-origin: bottom right;
  }

  .cursor-image.moving {
    transition: left 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .cursor-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(0);
    transform-origin: bottom right;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .cursor-image.visible img {
    transform: scale(1);
  }

  @media (max-width: 768px) {
    .portfolio {
      font-size: 14px;
      cursor: auto;
    }
    .project-title {
      font-size: 1.5rem;
    }
    .project {
      padding: 3px 1rem;
    }
    .cursor-image {
      width: 220px;
      height: 165px;
    }
    .gradient-top,
    .gradient-bottom {
      height: 60px;
    }
  }

  @media (max-width: 480px) {
    .portfolio {
      font-size: 12px;
    }
    .project-title {
      font-size: 1.2rem;
    }
    .project {
      padding: 2px 0.5rem;
    }
    .cursor-image {
      width: 200px;
      height: 150px;
    }
    .gradient-top,
    .gradient-bottom {
      height: 50px;
    }
  }
</style>