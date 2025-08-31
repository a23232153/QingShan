<script>
//@ts-nocheck
  import { onMount } from "svelte";

  let container, bgImage, cursorImg;
  let showCursor = false; // ✅ 必須先定義
  let isTouchDevice = false;

  const projects = [
    { id: 1, title: "青草巷", image: "https://assets.codepen.io/7558/bw-blurry-001.webp" },
    { id: 2, title: "Love as the Fourth Dimension", image: "https://assets.codepen.io/7558/bw-blurry-004.webp" },
    { id: 3, title: "The Art of Letting Go", image: "https://assets.codepen.io/7558/bw-blurry-007.webp" },
    { id: 4, title: "Creativity as Prayer", image: "https://assets.codepen.io/7558/bw-blurry-010.webp" },
    { id: 5, title: "Creativity as Prayer", image: "https://assets.codepen.io/7558/bw-blurry-010.webp" },
    { id: 6, title: "Love as the Fourth Dimension", image: "https://assets.codepen.io/7558/bw-blurry-004.webp" },
    { id: 7, title: "The Art of Letting Go", image: "https://assets.codepen.io/7558/bw-blurry-007.webp" },
  ];

  const defaultBg = "https://assets.codepen.io/7558/bw-blurry-005.webp";

  const getEventPos = (e) =>
    e.touches?.[0]
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };

  const getRandomRotation = () => (Math.random() - 0.5) * 20;

  const setDefaultBg = () => {
    if (!bgImage) return;
    bgImage.style.transition = "all 1.2s cubic-bezier(0.25,0.46,0.45,0.94)";
    bgImage.src = defaultBg;
    bgImage.style.opacity = "0.6";
    bgImage.style.transform = "scale(1.1)";
  };

  let currentItem = null;

  const handleEnter = (item, e) => {
    if (!bgImage || !cursorImg) return;

    console.log("bgImage", bgImage, "cursorImg", cursorImg);
    

    const imgSrc = item.dataset.image;

    console.log("切換到圖片：", imgSrc);

    currentItem = item;
    const rotation = getRandomRotation();

    bgImage.style.transition = "none";
    bgImage.style.transform = `scale(1.2) rotate(${rotation}deg)`;
    bgImage.src = imgSrc;
    bgImage.style.opacity = "0.8";

    const pos = getEventPos(e);
    cursorImg.querySelector("img").src = imgSrc;
    cursorImg.style.left = pos.x + "px";
    cursorImg.style.top = pos.y + "px";
    showCursor = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bgImage.style.transition = "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)";
        bgImage.style.transform = "scale(1) rotate(0deg)";
      });
    });
  };

  const handleLeave = (item) => {
    setTimeout(() => {
      if (currentItem === item) {
        currentItem = null;
        showCursor = false;
        setDefaultBg();
      }
    }, 30);
  };

  onMount(() => {
    isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setDefaultBg();
  });
</script>

<main class="portfolio font-bakudai-lg " on:mouseleave={() => {
    currentItem = null;
    showCursor = false;
    setDefaultBg();
  }}>

  <div class="bg-container ">
    <img class="bg-image" bind:this={bgImage} alt="" />
  </div>

  <section class="projects" bind:this={container}>
    {#each projects as project}
      <div
        class="project"
        data-id={project.id}
        data-image={project.image}
        on:mouseenter={(e) => handleEnter(e.currentTarget, e)}
        on:mouseleave={handleLeave}
      >
        <div class="project-title">{project.title}</div>
      </div>
    {/each}
  </section>
</main>

<div class="cursor-image" class:visible={showCursor} bind:this={cursorImg}>
  <img src="" alt="" />
</div>

<style>

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap");

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-bg: #1a1917;
  --primary-text: #f8f5f2;
}

.portfolio {
  height: 100%;
  width: 100%;
  
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--primary-text);
  background-color: var(--primary-bg);
  cursor: none;
  overflow: hidden;
  position: relative;
}

/* 把原本 body, html 的設置搬過來 */
.portfolio * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.portfolio .projects {
  width: 100vw;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.portfolio .project {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 2rem;
  width: 100vw;
  overflow: hidden;
}

.portfolio .project-title {
  font-size: 1.8rem;
  font-weight: 800;
  z-index: 2;
  position: relative;
  

  color: var(--primary-text);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.portfolio .project::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: rgba(255, 255, 255, 0.15); /* 比較柔和，不會吃掉字 */
  z-index: 1;
  transition: height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.portfolio .project:hover::before {
  height: 100%;
}

@keyframes noise {
  0% {
    transform: translate(0, 0);
  }
  12.5% {
    transform: translate(-1%, -2%);
  }
  25% {
    transform: translate(-2%, 1%);
  }
  37.5% {
    transform: translate(1%, -2%);
  }
  50% {
    transform: translate(-1%, 3%);
  }
  62.5% {
    transform: translate(-2%, 1%);
  }
  75% {
    transform: translate(2%, 0);
  }
  87.5% {
    transform: translate(0, 2%);
  }
  100% {
    transform: translate(-1%, 0);
  }
}

.bg-container {
  position: absolute;
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

main {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 10;
  position: relative;
  overflow: hidden;
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
  
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: 800;
  white-space: nowrap;
}

.project::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: var(--primary-text);
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
  background: linear-gradient(
    180deg,
    rgba(26, 25, 23, 0.8) 0%,
    transparent 100%
  );
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
  transition: left 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    top 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
  main {
    
    -size: 14px;
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
  main {
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
