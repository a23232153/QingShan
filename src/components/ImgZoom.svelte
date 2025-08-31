<script>
//@ts-nocheck
  import { onMount } from "svelte";

  const projects = [
    { id: 1, title: "The Space Between Notes", image: '/images/scene3.jpg' },
    { id: 2, title: "Love as the Fourth Dimension", image: '/images/scene3.jpg' },
    { id: 3, title: "The Art of Letting Go", image: '/images/scene3.jpg' },
    { id: 4, title: "Creativity as Prayer", image: '/images/scene3.jpg' },
    { id: 5, title: "The Universe Conspires", image: "" },
    { id: 6, title: "Designing from Source", image: "" },
    { id: 7, title: "The Frequency of Truth", image: "" },
    { id: 8, title: "Infinite Possibilities", image: "" },
    { id: 9, title: "The Creative Act", image: "" },
    { id: 10, title: "Love Beyond Form", image: "" },
    { id: 11, title: "The Eternal Now", image: "" },
    { id: 12, title: "Transcendent Design", image: "" },
    { id: 13, title: "Sacred Geometry", image: "" },
    { id: 14, title: "The Divine Proportion", image: "" },
    { id: 15, title: "Quantum Consciousness", image: "" }
  ];

  let container, bgImage, cursorImg;
  let currentItem = null;
  let containerHeight = 0, viewportHeight = 0;

  onMount(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const defaultBg = "";

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
      bgImage.style.filter = "blur(0)";
    };

    const updateContainerPos = (clientY) => {
      if (containerHeight > viewportHeight && container) {
        const mouseYPercent = clientY / viewportHeight;
        const margin = 100;
        const translateYAtTop = margin;
        const translateYAtBottom = viewportHeight - containerHeight - margin;
        const translateY =
          translateYAtTop +
          mouseYPercent * (translateYAtBottom - translateYAtTop);
        container.style.transform = `translateY(${translateY}px)`;
      }
    };

    const calculateHeight = () => {
      viewportHeight = window.innerHeight;
      if (!container) return;
      const items = container.querySelectorAll(".project");
      containerHeight = Array.from(items).reduce(
        (acc, item) => acc + item.offsetHeight,
        0
      );
    };

    const animateIn = () => {
      const items = container.querySelectorAll(".project");
      items.forEach((item, i) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        setTimeout(() => {
          requestAnimationFrame(() => {
            item.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          });
        }, i * 60);
      });
    };

    const handleEnter = (item, e) => {
      const imgSrc = item.dataset.image;
      console.log("Hover image:", imgSrc); 
      if (!imgSrc) return; 

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
      cursorImg.classList.add("visible");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bgImage.style.transition =
            "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)";
          bgImage.style.transform = "scale(1.0) rotate(0deg)";
          bgImage.style.filter = "blur(0)";
        });
      });
    };

    const handleLeave = (item) => {
      setTimeout(() => {
        if (currentItem === item) {
          currentItem = null;
          cursorImg.classList.remove("visible");
          setDefaultBg();
        }
      }, 30);
    };

    const setupEvents = () => {
      const items = container.querySelectorAll(".project");
      const allImages = [defaultBg, ...projects.map((p) => p.image)];

      allImages.forEach((src) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
      });

      items.forEach((item) => {
        if (!isTouchDevice) {
          item.addEventListener("mouseenter", (e) => handleEnter(item, e));
          item.addEventListener("mouseleave", () => handleLeave(item));
        } else {
          item.addEventListener("touchstart", (e) => handleEnter(item, e));
          item.addEventListener("touchend", () =>
            setTimeout(() => handleLeave(item), 2000)
          );
        }
      });

      container.addEventListener("mouseleave", () => {
        if (!isTouchDevice) {
          currentItem = null;
          cursorImg.classList.remove("visible");
          setDefaultBg();
        }
      });
    };

    const setupTracking = () => {
      const updateCursor = (e) => {
        const pos = getEventPos(e);
        if (cursorImg?.classList.contains("visible")) {
          cursorImg.classList.add("moving");
          cursorImg.style.left = pos.x + "px";
          cursorImg.style.top = pos.y + "px";
          setTimeout(() => cursorImg.classList.remove("moving"), 150);
        }
        updateContainerPos(pos.y);
      };

      if (!isTouchDevice) {
        document.addEventListener("mousemove", updateCursor);
      } else {
        document.addEventListener(
          "touchmove",
          (e) => {
            e.preventDefault();
            updateCursor(e);
          },
          { passive: false }
        );
        document.addEventListener("touchstart", updateCursor);
      }
    };

    // 初始化
    calculateHeight();
    animateIn();
    setupEvents();
    setupTracking();
    setDefaultBg();
    window.addEventListener("resize", calculateHeight);
  });
</script>

<div class="bg-container">
  <img class="bg-image" bind:this={bgImage} crossorigin="anonymous" alt="" />
</div>

<main class="app">
  <section class="projects" bind:this={container}>
    {#each projects as project}
      <div class="project" data-id={project.id} data-image={project.image}>
        
        <div class="project-title">{project.title}</div>
      </div>
    {/each}
  </section>
</main>

<div class="gradient-top"></div>
<div class="gradient-bottom"></div>

<div class="cursor-image" bind:this={cursorImg}>
  <img src="" alt="" />
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap");
    /* 這裡放你之前的 CSS，不動結構 */
    /* reset，只限於這個 component */
    .app *,
    .app *::before,
    .app *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    }

    .app {
    --primary-bg: #1a1917;
    --primary-text: #f8f5f2;

    width: 100vw;
    height: 100vh;
    overflow: hidden;
    
    font-weight: 700;
    font-size: 16px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--primary-bg);
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: var(--primary-text);
    cursor: none;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 10;
    overflow: hidden;
    }

    /* 背景 noise */
    .app::before {
    content: "";
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")
        repeat;
    background-size: 200px;
    animation: noise 0.2s steps(8) infinite;
    opacity: 0.6;
    z-index: 100;
    pointer-events: none;
    }

    @keyframes noise {
    0% { transform: translate(0, 0); }
    12.5% { transform: translate(-1%, -2%); }
    25% { transform: translate(-2%, 1%); }
    37.5% { transform: translate(1%, -2%); }
    50% { transform: translate(-1%, 3%); }
    62.5% { transform: translate(-2%, 1%); }
    75% { transform: translate(2%, 0); }
    87.5% { transform: translate(0, 2%); }
    100% { transform: translate(-1%, 0); }
    }

    /* 背景容器 */
    .bg-container {
    position: relative;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    }

    .bg-image {
    width: 30%;
    height: 30%;
    object-fit: cover;
    transform: scale(1.1);
    transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 0.6;
    }

    

    .projects {
    width: 100%;
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
    width: 100%;
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

    /* RWD */
    @media (max-width: 768px) {
    .app {
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
    .app {
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
