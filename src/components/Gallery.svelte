
<script lang="ts">
  //@ts-nocheck
  import { onMount } from "svelte";
  import gsap from "gsap";

  // === 設定 ===
  const settings = {
    cellWidth: 300,
    cellHeight: 400,
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
  const items = [
    "Chromatic Loopscape","Solar Bloom","Neon Handscape","Echo Discs","Void Gaze",
    "Gravity Sync","Heat Core","Fractal Mirage","Nova Pulse","Sonic Horizon",
    "Dream Circuit","Lunar Mesh","Radiant Dusk","Pixel Drift","Vortex Bloom",
    "Shadow Static","Crimson Phase","Retro Cascade","Photon Fold","Zenith Flow"
  ];
  const imageUrls = [
    "images/slip1.jpg",
    "https://picsum.photos/300/400?random=2",
    "https://picsum.photos/300/400?random=3",
    "https://picsum.photos/300/400?random=4",
    "https://picsum.photos/300/400?random=5",
    "https://picsum.photos/300/400?random=6",
    "https://picsum.photos/300/400?random=7"
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
  const columns = 10; // 最大列數
  const rows = 5;     // 最大行數
  const itemCount = items.length;

  // === 工具函數 ===
  const gap = 20; 
  const getItemSize = (row: number, col: number) => ({
    width: settings.cellWidth,
    height: settings.cellHeight
  });
  const getItemPosition = (col: number, row: number) => ({
    x: col * (settings.cellWidth + gap),
    y: row * (settings.cellHeight + gap)
  });

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

  onMount(() => {
    // === 虛擬滾動 ===
    const updateVisibleItems = throttle(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const buffer = 1;

      const startCol = Math.floor(-currentX / settings.cellWidth) - buffer;
      const endCol = Math.floor((-currentX + viewportWidth) / settings.cellWidth) + buffer;
      const startRow = Math.floor(-currentY / settings.cellHeight) - buffer;
      const endRow = Math.floor((-currentY + viewportHeight) / settings.cellHeight) + buffer;

      const newRenderedItems: Record<string, boolean> = {};

      for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
          const key = `${col},${row}`;
          newRenderedItems[key] = true;
          if (!renderedItems[key]) {
            const index = Math.abs(col * row) % itemCount;
            const itemEl = createItemElement(items[index], imageUrls[index % imageUrls.length]);
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
    const createItemElement = (title: string, imageUrl: string) => {
      const item = document.createElement("div");
      item.className = "item absolute bg-black cursor-pointer overflow-hidden";
      item.style.width = `${settings.cellWidth}px`;
      item.style.height = `${settings.cellHeight}px`;
      item.style.borderRadius = `${settings.borderRadius}px`;

      const img = document.createElement("img");
      img.className = "item-image w-full h-full object-cover pointer-events-none transition-transform duration-300";
      img.style.transform = `scale(${settings.hoverScale})`;
      img.style.opacity = "0";
      img.src = imageUrl;
      img.onload = () => gsap.to(img, { opacity: 1, duration: 0.3 });

      const caption = document.createElement("div");
      caption.className = "item-caption absolute bottom-0 left-0 w-full p-2 z-2 text-white font-sans text-xs font-medium uppercase tracking-tight";
      caption.textContent = title;

      item.appendChild(img);
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
        scale: (window.innerWidth * settings.expandedScale) / rect.width,
        zIndex: 2000,
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

        const minX = -((columns * (settings.cellWidth + gap)) - window.innerWidth);
        const minY = -((rows * (settings.cellHeight + gap)) - window.innerHeight);


        currentX = Math.min(0, Math.max(minX, currentX));
        currentY = Math.min(0, Math.max(minY, currentY));

        canvasElement.style.transform = `translate(${currentX}px, ${currentY}px)`;

        const now = Date.now();
        const distMoved = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2));
        if (distMoved > 50 || now - lastUpdateTime > 150) {
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

<main class="relative w-screen h-screen bg-black text-white overflow-hidden select-none">
  <div class="container relative w-full h-full" bind:this={canvasElement} style="pointer-events: auto;">
    <div class="overlay fixed inset-0 bg-black pointer-events-none opacity-0 z-[9999]" bind:this={overlayElement}></div>
    <div class="project-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-[10002]">
      <p bind:this={projectTitleElement} class="relative h-[42px] text-white overflow-hidden font-sans text-4xl uppercase tracking-tight"></p>
    </div>
  </div>
</main>

<style>
  .item { position: absolute; cursor: pointer; overflow: hidden; }
  .item img { width: 100%; height: 100%; object-fit: cover; }
  .item:hover img { transform: scale(1.05); }
</style>
