<script lang="ts">
  //@ts-nocheck
  import { onMount } from "svelte";
  import gsap from "gsap";

  // === 設定 ===
  const settings = {
    cellWidth: 300,
    smallHeight: 330, // 小圖片高度
    largeHeight: 500, // 大圖片高度
    itemGap: 20, // 圖片間距
    dragEase: 0.08,
    momentumFactor: 400,
    expandedScale: 0.6,
    hoverScale: 1.05,
    borderRadius: 8,
    vignetteSize: 20,
    vignetteSizePage: 50,
    vignetteStrength: 0.7
  };

  // === 資料 ===
  const galleryItems = [
  { title: "尊王爐", image: "/images/尊王爐.jpg" },
  { title: "前殿天井", image: "/images/前殿天井.jpg" },
  { title: "前殿橫梁", image: "/images/前殿橫梁.jpg" },
  { title: "正殿虎邊朝中對聯", image: "/images/正殿虎邊朝中對聯.jpg" },
  { title: "正殿匾額", image: "/images/正殿匾額.jpg" },
  { title: "龍門", image: "/images/龍門.jpg" },
  { title: "拜殿牆堵", image: "/images/拜殿牆堵.jpg" },
  { title: "天井燈籠", image: "/images/天井燈籠.jpg" },
  { title: "門神", image: "/images/門神-1.jpg" },
  { title: "拜殿龍邊燈籠", image: "/images/拜殿龍邊燈籠.jpg" },
];


  // === 狀態 ===
  let canvasElement: HTMLDivElement;
  
  let overlayElement: HTMLDivElement;
  let projectTitleElement: HTMLParagraphElement;
  let vignetteElement: HTMLDivElement;

  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;
  let isDragging = false, canDrag = true;
  let startX = 0, startY = 0;
  let dragVelocityX = 0, dragVelocityY = 0;
  let lastDragTime = 0;
  let lastX = 0, lastY = 0, lastUpdateTime = Date.now();
  let expandedItem: HTMLElement | null = null;

  let renderedItems: Record<string, HTMLElement> = {};
  let visibleItems = new Set<string>();
  const itemCount = galleryItems.length;


  // === 工具函數 ===
  const itemSizes = [
    { width: settings.cellWidth, height: settings.smallHeight },
    { width: settings.cellWidth, height: settings.largeHeight }
  ];
  const cellWidth = settings.cellWidth + settings.itemGap;
  const cellHeight = Math.max(settings.smallHeight, settings.largeHeight) + settings.itemGap;

  // 根據行列決定圖片大小（交錯高度）
  const getItemSize = (row: number, col: number) => {
    const sizeIndex = Math.abs((row * 4 + col) % itemSizes.length); // 使用固定 4 欄模式以保持一致
    return itemSizes[sizeIndex];
  };

  // 計算圖片位置
  const getItemPosition = (col: number, row: number) => ({
    x: col * cellWidth,
    y: row * cellHeight
  });

  // 生成唯一 ID
  const getItemId = (col: number, row: number) => `${col},${row}`;

  // 節流函數
  const throttle = (fn: Function, limit: number) => {
    let inThrottle = false;
    return function (...args: any[]) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // 初始化 CSS 變數
  function initializeStyles() {
    document.documentElement.style.setProperty("--border-radius", `${settings.borderRadius}px`);
    document.documentElement.style.setProperty("--vignette-size", `${settings.vignetteSize}px`);
    document.documentElement.style.setProperty("--hover-scale", `${settings.hoverScale}`);
    updatePageVignette();
  }

  // 更新頁面 vignette
  function updatePageVignette() {
    const strength = settings.vignetteStrength;
    const size = settings.vignetteSizePage;
    // Regular vignette
    const regularOpacity = strength * 0.7;
    const regularSize = size * 1.5;
    document.documentElement.style.setProperty("--page-vignette-size", `${regularSize}px`);
    document.documentElement.style.setProperty("--page-vignette-color", `rgba(0,0,0,${regularOpacity})`);
    // Strong vignette
    const strongOpacity = strength * 0.85;
    const strongSize = size * 0.75;
    document.documentElement.style.setProperty("--page-vignette-strong-size", `${strongSize}px`);
    document.documentElement.style.setProperty("--page-vignette-strong-color", `rgba(0,0,0,${strongOpacity})`);
    // Extreme vignette
    const extremeOpacity = strength;
    const extremeSize = size * 0.4;
    document.documentElement.style.setProperty("--page-vignette-extreme-size", `${extremeSize}px`);
    document.documentElement.style.setProperty("--page-vignette-extreme-color", `rgba(0,0,0,${extremeOpacity})`);
  }

  onMount(() => {
    initializeStyles();

    // === 虛擬滾動 ===
    
  const updateVisibleItems = throttle(() => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const buffer = 1;

  const startCol = Math.floor((-currentX - viewportWidth / 2) / cellWidth) - buffer;
  const endCol = Math.ceil((-currentX + viewportWidth * 1.5) / cellWidth) + buffer;
  const startRow = Math.floor((-currentY - viewportHeight / 2) / cellHeight) - buffer;
  const endRow = Math.ceil((-currentY + viewportHeight * 1.5) / cellHeight) + buffer;

  const newRenderedItems: Record<string, boolean> = {};

  const columns = 4; // 固定四欄
  for (let col = startCol; col <= endCol; col++) {
    for (let row = startRow; row <= endRow; row++) {
      const key = getItemId(col, row);
      newRenderedItems[key] = true;
      if (!renderedItems[key]) {
        const index = ((row * columns + col) % galleryItems.length + galleryItems.length) % galleryItems.length;

        const itemEl = createItemElement(galleryItems[index].title, galleryItems[index].image, col, row);
        const pos = getItemPosition(col, row);
        itemEl.style.left = `${pos.x}px`;
        itemEl.style.top = `${pos.y}px`;
        canvasElement.appendChild(itemEl);
        renderedItems[key] = itemEl;
        visibleItems.add(key);
      }
    }
  }

  // 移除不在 viewport 的 item
  for (const key in renderedItems) {
    if (!newRenderedItems[key]) {
      const el = renderedItems[key];
      if (el && el.parentNode) canvasElement.removeChild(el);
      delete renderedItems[key];
      visibleItems.delete(key);
    }
  }
}, 100);

// === 建立 item ===
const createItemElement = (title: string, imageUrl: string, col: number, row: number) => {
  const item = document.createElement("div");
  item.className = "item absolute bg-black cursor-pointer overflow-hidden";
  const itemSize = getItemSize(row, col);
  item.style.width = `${itemSize.width}px`;
  item.style.height = `${itemSize.height}px`;
  item.style.borderRadius = `${settings.borderRadius}px`;
  item.dataset.col = `${col}`;
  item.dataset.row = `${row}`;

  const imgContainer = document.createElement("div");
  imgContainer.className = "item-image-container w-full h-full hover:scale-130 transition-transform duration-300 ease-in-out";

  
  const img = document.createElement("img");
  img.className = "item-image w-full h-full object-cover pointer-events-none transition-transform duration-300";

  img.style.transform = `scale(1)`;
  img.src = imageUrl; // ✅ 改成 galleryItems[index].image
  img.alt = title;    // ✅ title
  img.onload = () => gsap.to(img, { opacity: 1, duration: 0.3 });

  const caption = document.createElement("div");
  caption.className = "item-caption absolute bottom-0 left-0 w-full p-2 z-2";
  const nameElement = document.createElement("div");
  nameElement.className = "item-name";
  nameElement.textContent = title; // ✅ 改成 galleryItems[index].title
  const numberElement = document.createElement("div");
  numberElement.className = "item-number";
  numberElement.textContent = `#${(galleryItems.findIndex(i => i.title === title) + 1).toString().padStart(5, "0")}`;
  caption.appendChild(nameElement);
  caption.appendChild(numberElement);

  imgContainer.appendChild(img);
  item.appendChild(imgContainer);
  item.appendChild(caption);

  item.addEventListener("click", (e) => {
    e.stopPropagation();
    if (expandedItem === item) collapseItem();
    else expandItem(item, title);
  });

  return item;
};

    // === 展開與收回 ===
    const expandItem = (item: HTMLElement, title: string) => {
      if (expandedItem) return;
      expandedItem = item;

      const rect = item.getBoundingClientRect();
      const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);

      gsap.to(item, {
        x: dx,
        y: dy,
        scale: (window.innerWidth * settings.expandedScale) / rect.width*0.5,
        zIndex: 10000,
        duration: 0.6,
        ease: "power3.inOut"
      });

      gsap.to(canvasElement.querySelectorAll(".item"), {
        opacity: (i, el) => (el === item ? 1 : 0),
        duration: 0.5,
        ease: "power2.inOut"
      });

      overlayElement.classList.add("active");
      if (vignetteElement) vignetteElement.classList.add("active");

      projectTitleElement.textContent = title;
      gsap.fromTo(projectTitleElement, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 });

      canDrag = false;
    };

    const collapseItem = () => {
      if (!expandedItem) return;
      const item = expandedItem;
      expandedItem = null;

      gsap.to(item, { x: 0, y: 0, scale: 1, zIndex: 1, duration: 0.6, ease: "power3.inOut" });
      gsap.to(canvasElement.querySelectorAll(".item"), { opacity: 1, duration: 0.5, ease: "power2.inOut" });

      overlayElement.classList.remove("active");
      if (vignetteElement) vignetteElement.classList.remove("active");

      gsap.to(projectTitleElement, { opacity: 0, y: -20, duration: 0.3, onComplete: () => { projectTitleElement.textContent = ""; } });

      canDrag = true;
    };

    overlayElement.addEventListener("click", collapseItem);

    // === 拖曳事件 ===
    canvasElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
      lastDragTime = Date.now();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging || !canDrag) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const now = Date.now();
      const dt = Math.max(10, now - lastDragTime);
      lastDragTime = now;

      dragVelocityX = dx / dt;
      dragVelocityY = dy / dt;

      targetX += dx;
      targetY += dy;
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(dragVelocityX) > 0.1 || Math.abs(dragVelocityY) > 0.1) {
        targetX += dragVelocityX * settings.momentumFactor;
        targetY += dragVelocityY * settings.momentumFactor;
      }
    });

    // Touch 支援
    canvasElement.addEventListener("touchstart", (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
      lastDragTime = Date.now();
    });

    window.addEventListener("touchmove", (e) => {
      if (!isDragging || !canDrag) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      const now = Date.now();
      const dt = Math.max(10, now - lastDragTime);
      lastDragTime = now;

      dragVelocityX = dx / dt;
      dragVelocityY = dy / dt;

      targetX += dx;
      targetY += dy;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    window.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(dragVelocityX) > 0.1 || Math.abs(dragVelocityY) > 0.1) {
        targetX += dragVelocityX * settings.momentumFactor;
        targetY += dragVelocityY * settings.momentumFactor;
      }
    });

    // === 動畫迴圈 ===
    const animate = () => {
      if (canDrag) {
        const ease = settings.dragEase;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        canvasElement.style.transform = `translate(${currentX}px, ${currentY}px)`;

        const now = Date.now();
        const distMoved = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2));
        if (distMoved > 100 || now - lastUpdateTime > 120) {
          updateVisibleItems();
          lastX = currentX;
          lastY = currentY;
          lastUpdateTime = now;
        }
      }
      requestAnimationFrame(animate);
    };

    updateVisibleItems();
    animate();
  });
</script>

<svelte:head>
  <style>
    @import url("https://fonts.cdnfonts.com/css/thegoodmonolith");
    @import url("https://fonts.cdnfonts.com/css/pp-neue-montreal");
  </style>
</svelte:head>

<main class="relative w-screen h-[120vh] bg-black text-white overflow-hidden select-none">
  <div class="header absolute top-0 left-0 w-full p-[1.5rem] z-[10000] grid grid-cols-12 gap-[var(--spacing-base)]">
    <div class="nav-section col-span-3">
      <div class="logo-container mb-[var(--spacing-md)] block w-[3rem] h-[1.5rem] relative">
        <div class="logo-circles relative w-full h-full">
          <div class="circle circle-1 absolute rounded-full w-[1.4rem] h-[1.4rem] bg-[var(--color-text)] top-1/2 left-0 transform -translate-y-1/2"></div>
          <div class="circle circle-2 absolute rounded-full w-[1.4rem] h-[1.4rem] bg-[var(--color-text)] top-1/2 left-[0.8rem] transform -translate-y-1/2 mix-blend-exclusion"></div>
        </div>
      </div>
    </div>
    <div class="values-section col-span-2 col-start-5">
      
    </div>
    
    
    
  </div>

<!--
  <div class="footer absolute bottom-0 left-0 w-full p-[1.5rem] z-[10000] grid grid-cols-12 gap-[var(--spacing-base)]">
    <div class="coordinates-section col-span-3">
      <p>34.0522° N, 118.2437° W</p>
    </div>
    <div class="links-section col-span-4 col-start-5 flex justify-center items-center gap-[var(--spacing-base)]">
      <p>Press <span class="key-hint inline-flex items-center justify-center px-[5px] border border-[var(--color-text)] rounded-[3px] text-[12px] min-w-[20px] h-[20px]">H</span> to toggle panel</p>
    </div>
    <div class="info-section col-span-4 col-start-9 text-right">
      <p>Est. 2025 • Summer Days</p>
    </div>
  </div>
-->

  <div class="container relative w-full h-full" bind:this={canvasElement} style="pointer-events: auto;">
    <div class="overlay fixed inset-0 bg-black pointer-events-none opacity-0 z-[9999]" bind:this={overlayElement}></div>
    <div class="project-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-[10002]">
      <p bind:this={projectTitleElement} class="relative h-[42px] text-white overflow-hidden font-sans text-4xl uppercase tracking-tight"></p>
    </div>
  </div>

  <div class="page-vignette-container fixed inset-0 pointer-events-none z-[9998]" bind:this={vignetteElement}>
    <div class="page-vignette absolute inset-0"></div>
    <div class="page-vignette-strong absolute inset-0"></div>
    <div class="page-vignette-extreme absolute inset-0"></div>
  </div>
</main>



<style>
  :root {
    --spacing-base: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --color-text: #ffffff;
    --color-text-dim: 0.6;
    --transition-medium: 0.3s ease;
    --font-size-base: 14px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
  }

  body {
    font-family: "PP Neue Montreal", sans-serif;
    background-color: #000000;
    color: #ffffff;
    overflow: hidden;
    position: relative;
  }

  body::before {
    content: "";
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: transparent url("http://assets.iceable.com/img/noise-transparent.png") repeat 0 0;
    background-size: 300px 300px;
    animation: noise-animation 0.3s steps(5) infinite;
    opacity: 0.9;
    will-change: transform;
    z-index: 100;
    pointer-events: none;
  }

  @keyframes noise-animation {
    0% { transform: translate(0, 0); }
    10% { transform: translate(-2%, -3%); }
    20% { transform: translate(-4%, 2%); }
    30% { transform: translate(2%, -4%); }
    40% { transform: translate(-2%, 5%); }
    50% { transform: translate(-4%, 2%); }
    60% { transform: translate(3%, 0); }
    70% { transform: translate(0, 3%); }
    80% { transform: translate(-3%, 0); }
    90% { transform: translate(2%, 2%); }
    100% { transform: translate(1%, 0); }
  }

  .coordinates-section {
    font-family: "TheGoodMonolith", monospace;
  }

  .key-hint {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    border: 1px solid var(--color-text);
    border-radius: 3px;
    font-size: 12px;
    margin: 0 3px;
    min-width: 20px;
    height: 20px;
  }

  .footer p {
    font-family: "TheGoodMonolith", monospace;
  }

  a {
    position: relative;
    cursor: pointer;
    color: var(--color-text);
    padding: 0;
    display: inline-block;
    z-index: 1;
    text-decoration: none;
    font-size: var(--font-size-base);
    opacity: 1;
    transition: color var(--transition-medium);
    font-weight: 700;
  }

  a::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: var(--color-text);
    z-index: -1;
    transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  a:hover::after {
    width: 100%;
  }

  a:hover {
    color: black;
    mix-blend-mode: difference;
    opacity: 1;
  }

  p {
    display: block;
    text-decoration: none;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01rem;
    -webkit-font-smoothing: antialiased;
  }

  ul {
    list-style: none;
  }

  h3 {
    font-size: 14px;
    margin-bottom: var(--spacing-base);
    font-weight: 600;
  }

  .logo-container:hover .circle-1 {
    transform: translate(-0.5rem, -50%);
  }

  .logo-container:hover .circle-2 {
    transform: translate(0.5rem, -50%);
  }

.item {
    position: absolute;
    cursor: pointer;
    overflow: hidden;
    background-color: #000000;
    border-radius: var(--border-radius, 8px);
  }.item {
    position: absolute;
    cursor: pointer;
    overflow: hidden;
    background-color: #000000;
    border-radius: var(--border-radius, 8px);
  }

  .item .item-image-container {
    width: 100%;
    height: 100%;
    
    overflow: hidden;
    position: relative;
    transform: scale(1); /* 明確初始縮放 */
    transition: transform 0.3s ease-in-out; /* 平滑放大動畫 */
    will-change: transform; /* 優化性能 */
  }

  .item-image-container img.item-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

  .item .item-image-container::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    box-shadow: inset 0 0 var(--vignette-size, 20px) rgba(0, 0, 0, 0.5);
    transition: box-shadow 0.3s ease-in-out;
    z-index: 1;
  }

  .item:hover .item-image-container {
    transform: scale(var(--hover-scale, 1.05)); /* 容器放大 */
    outline: 2px solid red; /* 調試用：確認 hover 觸發 */
  }

  .item:hover .item-image-container::after {
    box-shadow: inset 0 0 calc(var(--vignette-size, 20px) * 1.1) rgba(0, 0, 0, 0.5); /* 陰影適應放大 */
  }

  .item img.item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    transform: scale(1); /* 明確初始縮放 */
    transition: transform 0.3s ease-in-out;
    will-change: transform;
  }

  .item:hover img.item-image {
    transform: scale(var(--hover-scale, 1.05)); /* 圖片同步放大 */
  }

  .item .item-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    z-index: 2;
  }

  .item .item-name {
    font-family: "PP Neue Montreal", sans-serif;
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    margin-bottom: 2px;
    position: relative;
    overflow: hidden;
    height: 16px;
  }

  .item .item-number {
    font-family: "TheGoodMonolith", monospace;
    color: #888888;
    font-size: 10px;
    font-weight: 400;
    position: relative;
    overflow: hidden;
    height: 14px;
  }

  .item .item-image-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    transform: scale(1); /* 明確初始縮放 */
    transition: transform 0.3s ease-in-out; /* 平滑放大動畫 */
    will-change: transform; /* 優化性能 */
  }

  .item .item-image-container::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    box-shadow: inset 0 0 var(--vignette-size, 20px) rgba(0, 0, 0, 0.5);
    transition: box-shadow 0.3s ease-in-out;
    z-index: 1;
  }

  .item:hover .item-image-container {
    transform: scale(var(--hover-scale, 1.05)); /* 容器放大 */
    outline: 2px solid red; /* 調試用：確認 hover 觸發 */
  }

  .item:hover .item-image-container::after {
    box-shadow: inset 0 0 calc(var(--vignette-size, 20px) * 1.1) rgba(0, 0, 0, 0.5); /* 陰影適應放大 */
  }

  .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    transform: scale(1); /* 明確初始縮放 */
    transition: transform 0.3s ease-in-out;
    will-change: transform;
  }

  .item:hover img.item-image {
    transform: scale(var(--hover-scale, 1.05)); /* 圖片同步放大 */
  }

  .item .item-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    z-index: 2;
  }

  .item .item-name {
    font-family: "PP Neue Montreal", sans-serif;
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    margin-bottom: 2px;
    position: relative;
    overflow: hidden;
    height: 16px;
  }

  .item .item-number {
    font-family: "TheGoodMonolith", monospace;
    color: #888888;
    font-size: 10px;
    font-weight: 400;
    position: relative;
    overflow: hidden;
    height: 14px;
  }

  .page-vignette {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 var(--page-vignette-size, 0px) var(--page-vignette-color, rgba(0, 0, 0, 0.9));
  }

  .page-vignette-strong {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 var(--page-vignette-strong-size, 0px) var(--page-vignette-strong-color, rgba(0, 0, 0, 0.95));
  }

  .page-vignette-extreme {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 var(--page-vignette-extreme-size, 0px) var(--page-vignette-extreme-color, rgba(0, 0, 0, 1));
  }

  
</style>
