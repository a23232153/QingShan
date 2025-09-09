<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  export let projects = [
    { id: 1, title: "青草巷", image: "/images/青草巷.jpg" },
    { id: 2, title: "西門町", image: "/images/西門町.jpg" },
    { id: 3, title: "廣州街夜市", image: "/images/廣州街.jpg" },
    { id: 4, title: "華西街", image: "/images/華西街.jpg" },
    { id: 5, title: "西門紅樓", image: "/images/西門紅樓-2.jpg" },
    { id: 6, title: "牌樓", image: "/images/牌樓.jpg" }
  ];

  export let defaultBg = "/images/NM.jpg";

  let backgroundImage: HTMLImageElement;

  // 初始動畫
  const initialAnimation = () => {
    const items = document.querySelectorAll(".project-item");
    items.forEach((item, index) => {
      (item as HTMLElement).style.opacity = "0";
      (item as HTMLElement).style.transform = "translateY(20px)";
      setTimeout(() => {
        (item as HTMLElement).style.transition =
          "opacity 0.8s ease, transform 0.8s ease";
        (item as HTMLElement).style.opacity = "1";
        (item as HTMLElement).style.transform = "translateY(0)";
      }, index * 60);
    });
  };

  // hover 換背景
  const setupHoverEvents = () => {
    const items = document.querySelectorAll(".project-item");
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        const imgUrl = (item as HTMLElement).dataset.image;
        if (!backgroundImage || !imgUrl) return;

        backgroundImage.style.transition = "none";
        backgroundImage.style.transform = "scale(1.2)";
        backgroundImage.src = imgUrl;
        backgroundImage.style.opacity = "1";

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            backgroundImage.style.transition =
              "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            backgroundImage.style.transform = "scale(1.0)";
          });
        });
      });
    });

    const container = document.querySelector(".projects-container");
    container?.addEventListener("mouseleave", () => {
      if (backgroundImage) {
        backgroundImage.style.transition = "opacity 0.8s ease";
        backgroundImage.src = defaultBg;
        backgroundImage.style.opacity = "0.6";
      }
    });
  };

  // preload 圖片
  const preloadImages = () => {
    const allImages = [defaultBg, ...projects.map((p) => p.image)];
    allImages.forEach((src) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
    });
  };

  onMount(() => {
    if (!browser) return;
    if (backgroundImage) backgroundImage.src = defaultBg;
    initialAnimation();
    setupHoverEvents();
    preloadImages();
  });
</script>


<main class="relative  w-full ">

  <div id="background-image-container" class="w-full h-[120%vh]">
    <img
      id="background-image"
      bind:this={backgroundImage}
      crossorigin="anonymous"
      alt=""
    />
  </div>

  <!-- 專案清單 -->
  <div class="container">
    <div class="projects-container items-center text-center">
      {#each projects as project}
        <div class="project-item items-center text-center" data-image={project.image}>
          <p class="project-title text-white" > {project.title}</p>
          
        </div>
      {/each}
    </div>
  </div>`

</main>

<style>

  html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
  :root {
    --warm-off-black: #1a1917;
    --warm-off-white: #f8f5f2;
  }

  .container {
    width: 100%;
    
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    position: relative;
  }

  /* 背景圖 */
  #background-image-container {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    
    z-index: 0;
    overflow: hidden;
  }

  #background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.2);
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 0.6;
  }

  /* 專案清單 */
  .projects-container {
    width: 100%;
    position: relative;
    z-index: 10;
    max-height: 80vh;
    overflow-y: none;
    padding: 20px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .projects-container::-webkit-scrollbar {
    display: none;
  }

  .project-item {
    position: relative;
    display: flex;
    align-items: center;   /* 垂直置中 */
    justify-content: center; /* 水平置中 */
    
    padding: 0.7rem 0;
    border-bottom: 1px solid rgba(248, 245, 242, 0.1);
    cursor: pointer;
  }

  .project-title {
    font-size: 1.8rem;
    z-index: 2;
    mix-blend-mode: exclusion;
  }

  .project-item::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: var(--warm-off-white);
    z-index: 1;
    pointer-events: none;
    transition: height 0.2s cubic-bezier(0.445, 0.05, 0.55, 0.95);
  }

  .project-item:hover::before {
    height: 100%;
  }

  @media (max-width: 768px) {
    .project-title {
      font-size: 1.4rem;
    }
  }

  @media (max-width: 480px) {
    .project-item {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
