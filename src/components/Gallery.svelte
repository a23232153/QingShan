<script>
  //@ts-nocheck
  import { onMount, tick } from 'svelte';
  import { writable } from 'svelte/store';

  // 項目標題
  const items = [
    "Chromatic Loopscape",
    "Solar Bloom",
    "Neon Handscape",
    "Echo Discs",
    "Void Gaze",
    "Gravity Sync",
    "Heat Core",
    "Fractal Mirage",
    "Nova Pulse",
    "Sonic Horizon",
    "Dream Circuit",
    "Lunar Mesh",
    "Radiant Dusk",
    "Pixel Drift",
    "Vortex Bloom",
    "Shadow Static",
    "Crimson Phase",
    "Retro Cascade",
    "Photon Fold",
    "Zenith Flow"
  ];

  // 圖片 URL
  const imageUrls = [
    "https://cdn.cosmos.so/0f164449-f65e-4584-9d62-a9b3e1f4a90a?format=jpeg",
    "https://cdn.cosmos.so/74ccf6cc-7672-4deb-ba13-1727b7dc6146?format=jpeg",
    "https://cdn.cosmos.so/2f49a117-05e7-4ae9-9e95-b9917f970adb?format=jpeg",
    "https://cdn.cosmos.so/7b5340f5-b4dc-4c08-8495-c507fa81480b?format=jpeg",
    "https://cdn.cosmos.so/f733585a-081e-48e7-a30e-e636446f2168?format=jpeg",
    "https://cdn.cosmos.so/47caf8a0-f456-41c5-98ea-6d0476315731?format=jpeg",
    "https://cdn.cosmos.so/f99f8445-6a19-4a9a-9de3-ac382acc1a3f?format=jpeg"
  ];

  // 響應式設置
  const settings = writable({
    baseWidth: 400,
    smallHeight: 330,
    largeHeight: 500,
    itemGap: 65,
    hoverScale: 1.05,
    expandedScale: 0.4,
    dragEase: 0.075,
    momentumFactor: 200,
    bufferZone: 3,
    borderRadius: 0,
    vignetteSize: 0,
    vignetteStrength: 0.7,
    vignetteSizePage: 200,
    overlayOpacity: 0.9,
    overlayEaseDuration: 0.8,
    zoomDuration: 0.6
  });

  let itemSizes = [
    { width: 400, height: 330 },
    { width: 400, height: 500 }
  ];
  let itemGap = 65;
  const columns = 4;
  const itemCount = items.length;
  let cellWidth = 400 + 65;
  let cellHeight = Math.max(330, 500) + 65;

  let isDragging = false;
  let startX, startY;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let dragVelocityX = 0, dragVelocityY = 0;
  let lastDragTime = 0;
  let mouseHasMoved = false;
  let visibleItems = new Set();
  let lastUpdateTime = 0;
  let lastX = 0, lastY = 0;
  let isExpanded = false;
  let activeItem = null;
  let activeItemId = null;
  let canDrag = true;
  let originalPosition = null;
  let expandedItem = null;
  let overlayAnimation = null;
  let titleSplit = null;
  let canvasElement;
  let overlayElement;
  let projectTitleElement;

  // 響應式更新設置
  $: {
    itemSizes = [
      { width: $settings.baseWidth, height: $settings.smallHeight },
      { width: $settings.baseWidth, height: $settings.largeHeight }
    ];
    itemGap = $settings.itemGap;
    cellWidth = $settings.baseWidth + $settings.itemGap;
    cellHeight = Math.max($settings.smallHeight, $settings.largeHeight) + $settings.itemGap;
    updateStyles();
    if (typeof window !== 'undefined') {
      updateVisibleItems();
    }
  }

  function updateStyles() {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--border-radius', `${$settings.borderRadius}px`);
    document.documentElement.style.setProperty('--vignette-size', `${$settings.vignetteSize}px`);
    document.documentElement.style.setProperty('--hover-scale', $settings.hoverScale);
    const strength = $settings.vignetteStrength;
    const size = $settings.vignetteSizePage;
    document.documentElement.style.setProperty('--page-vignette-size', `${size * 1.5}px`);
    document.documentElement.style.setProperty('--page-vignette-color', `rgba(0,0,0,${strength * 0.7})`);
    document.documentElement.style.setProperty('--page-vignette-strong-size', `${size * 0.75}px`);
    document.documentElement.style.setProperty('--page-vignette-strong-color', `rgba(0,0,0,${strength * 0.85})`);
    document.documentElement.style.setProperty('--page-vignette-extreme-size', `${size * 0.4}px`);
    document.documentElement.style.setProperty('--page-vignette-extreme-color', `rgba(0,0,0,${strength})`);
  }

  onMount(async () => {
    // 檢查 GSAP 和插件是否可用
    if (typeof gsap === 'undefined') {
      console.error('GSAP 未載入，請檢查 layout.svelte 中的 GSAP CDN 腳本');
      return;
    }
    const useCustomEase = typeof window.CustomEase !== 'undefined';
    if (!useCustomEase) {
      console.warn('CustomEase 未載入，將使用 power3.out 作為備用緩動');
    } else {
      gsap.registerPlugin(window.CustomEase);
      CustomEase.create('hop', '0.9, 0, 0.1, 1');
    }
    const useSplitText = typeof gsap.SplitText !== 'undefined';
    if (!useSplitText) {
      console.warn('SplitText 未載入，將使用簡單的文字動畫作為備用方案');
    } else {
      gsap.registerPlugin(gsap.SplitText);
    }

    // 等待 DOM 渲染完成
    await tick();

    // 動畫循環
    function animate() {
      if (canDrag) {
        currentX += (targetX - currentX) * $settings.dragEase;
        currentY += (targetY - currentY) * $settings.dragEase;
        if (canvasElement) {
          canvasElement.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
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
    }
    animate();

    // 事件處理
    function handleMouseDown(e) {
      if (!canDrag || !canvasElement) return;
      isDragging = true;
      mouseHasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      canvasElement.style.cursor = 'grabbing';
      console.log('開始拖曳：', { startX, startY, canDrag });
    }

    function handleMouseMove(e) {
      if (!isDragging || !canDrag) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        mouseHasMoved = true;
      }
      const now = Date.now();
      const dt = Math.max(10, now - lastDragTime);
      lastDragTime = now;
      dragVelocityX = dx / dt;
      dragVelocityY = dy / dt;
      targetX += dx;
      targetY += dy;
      startX = e.clientX;
      startY = e.clientY;
      console.log('拖曳移動：', { dx, dy, targetX, targetY });
    }

    function handleMouseUp() {
      if (!isDragging) return;
      isDragging = false;
      if (canDrag && canvasElement) {
        canvasElement.style.cursor = 'grab';
        if (Math.abs(dragVelocityX) > 0.1 || Math.abs(dragVelocityY) > 0.1) {
          targetX += dragVelocityX * $settings.momentumFactor;
          targetY += dragVelocityY * $settings.momentumFactor;
          console.log('拖曳結束，應用動量：', { dragVelocityX, dragVelocityY, targetX, targetY });
        }
      }
    }

    function handleTouchStart(e) {
      if (!canDrag || !canvasElement) return;
      isDragging = true;
      mouseHasMoved = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      console.log('觸控開始：', { startX, startY });
    }

    function handleTouchMove(e) {
      if (!isDragging || !canDrag) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        mouseHasMoved = true;
      }
      targetX += dx;
      targetY += dy;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      console.log('觸控移動：', { dx, dy, targetX, targetY });
    }

    function handleTouchEnd() {
      if (!isDragging) return;
      isDragging = false;
      if (canDrag && canvasElement) {
        canvasElement.style.cursor = 'grab';
        if (Math.abs(dragVelocityX) > 0.1 || Math.abs(dragVelocityY) > 0.1) {
          targetX += dragVelocityX * $settings.momentumFactor;
          targetY += dragVelocityY * $settings.momentumFactor;
          console.log('觸控結束，應用動量：', { dragVelocityX, dragVelocityY, targetX, targetY });
        }
      }
    }

    // 確保 DOM 渲染後綁定事件
    if (canvasElement) {
      canvasElement.addEventListener('mousedown', handleMouseDown);
      canvasElement.addEventListener('touchstart', handleTouchStart);
      console.log('事件監聽器已綁定到 canvasElement');
    } else {
      console.error('canvasElement 未定義，無法綁定拖曳事件');
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    window.addEventListener('resize', () => {
      if (isExpanded && expandedItem) {
        const viewportWidth = window.innerWidth;
        const targetWidth = viewportWidth * $settings.expandedScale;
        const aspectRatio = originalPosition.height / originalPosition.width;
        const targetHeight = targetWidth * aspectRatio;
        gsap.to(expandedItem, {
          width: targetWidth,
          height: targetHeight,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        updateVisibleItems();
      }
    });

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('mousedown', handleMouseDown);
        canvasElement.removeEventListener('touchstart', handleTouchStart);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  });

  function getItemSize(row, col) {
    const sizeIndex = Math.abs((row * columns + col) % itemSizes.length);
    return itemSizes[sizeIndex];
  }

  function getItemId(col, row) {
    return `${col},${row}`;
  }

  function getItemPosition(col, row) {
    const xPos = col * cellWidth;
    const yPos = row * cellHeight;
    return { x: xPos, y: yPos };
  }

  function updateVisibleItems() {
    if (typeof window === 'undefined') return;
    const buffer = $settings.bufferZone;
    const viewWidth = window.innerWidth * (1 + buffer);
    const viewHeight = window.innerHeight * (1 + buffer);
    const startCol = Math.floor((-currentX - viewWidth / 2) / cellWidth);
    const endCol = Math.ceil((-currentX + viewWidth * 1.5) / cellWidth);
    const startRow = Math.floor((-currentY - viewHeight / 2) / cellHeight);
    const endRow = Math.ceil((-currentY + viewHeight * 1.5) / cellHeight);
    const currentItems = new Set();

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const itemId = getItemId(col, row);
        currentItems.add(itemId);
        if (visibleItems.has(itemId) || (activeItemId === itemId && isExpanded)) continue;
        visibleItems.add(itemId);
      }
    }

    visibleItems.forEach((itemId) => {
      if (!currentItems.has(itemId)) {
        visibleItems.delete(itemId);
      }
    });
  }

  function setAndAnimateTitle(title) {
    if (!projectTitleElement || typeof gsap === 'undefined') return;
    projectTitleElement.textContent = title;
    const useSplitText = typeof gsap.SplitText !== 'undefined';
    if (useSplitText) {
      try {
        if (titleSplit) titleSplit.revert();
        titleSplit = new gsap.SplitText(projectTitleElement, { type: 'words' });
        gsap.set(titleSplit.words, { y: '100%' });
        gsap.fromTo(
          titleSplit.words,
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
        );
      } catch (error) {
        console.error('SplitText 初始化失敗：', error);
        gsap.fromTo(
          projectTitleElement,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
      }
    } else {
      gsap.fromTo(
        projectTitleElement,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }

  function animateOverlayIn() {
    if (overlayAnimation) overlayAnimation.kill();
    gsap.to(overlayElement, {
      opacity: $settings.overlayOpacity,
      duration: $settings.overlayEaseDuration,
      ease: 'power2.inOut',
      overwrite: true,
      onStart: () => {
        overlayElement.classList.add('active');
        overlayElement.style.pointerEvents = 'auto';
      }
    });
  }

  function animateOverlayOut() {
    if (overlayAnimation) overlayAnimation.kill();
    gsap.to(overlayElement, {
      opacity: 0,
      duration: $settings.overlayEaseDuration,
      ease: 'power2.inOut',
      onComplete: () => {
        overlayElement.classList.remove('active');
        overlayElement.style.pointerEvents = 'none';
      }
    });
  }

  function handleItemClick(item, itemIndex) {
    if (mouseHasMoved || isDragging) return;
    if (isExpanded) {
      closeExpandedItem();
    } else {
      expandItem(item, itemIndex);
    }
  }

  function expandItem(item, itemIndex) {
    isExpanded = true;
    activeItem = item;
    activeItemId = item.id;
    canDrag = false;
    if (canvasElement) canvasElement.style.cursor = 'auto';
    const imgSrc = item.querySelector('img').src;
    const titleIndex = itemIndex % items.length;
    const itemWidth = parseInt(item.dataset.width);
    const itemHeight = parseInt(item.dataset.height);
    setAndAnimateTitle(items[titleIndex]);

    const nameElement = item.querySelector('.item-name');
    const numberElement = item.querySelector('.item-number');
    const nameText = nameElement.textContent;
    const numberText = numberElement.textContent;
    const captionClone = item.querySelector('.item-caption').cloneNode(true);
    captionClone.classList.add('caption-clone');
    captionClone.style.position = 'fixed';
    captionClone.style.zIndex = '10002';
    const nameClone = captionClone.querySelector('.item-name');
    const numberClone = captionClone.querySelector('.item-number');
    nameClone.style.overflow = 'hidden';
    numberClone.style.overflow = 'hidden';
    const useSplitText = typeof gsap.SplitText !== 'undefined';
    let nameCloneSplit, numberCloneSplit;
    if (useSplitText) {
      try {
        nameCloneSplit = new gsap.SplitText(nameClone, { type: 'words' });
        numberCloneSplit = new gsap.SplitText(numberClone, { type: 'words' });
      } catch (error) {
        console.error('SplitText 初始化失敗：', error);
      }
    }
    const captionRect = item.querySelector('.item-caption').getBoundingClientRect();
    captionClone.style.left = `${captionRect.left}px`;
    captionClone.style.bottom = `${window.innerHeight - captionRect.bottom}px`;
    captionClone.style.width = `${captionRect.width}px`;
    document.body.appendChild(captionClone);
    item.querySelector('.item-caption').style.opacity = '0';
    if (useSplitText && nameCloneSplit && numberCloneSplit) {
      gsap.to(nameCloneSplit.words, {
        y: '100%',
        opacity: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.in',
        onComplete: () => {
          if (captionClone.parentNode) document.body.removeChild(captionClone);
        }
      });
      gsap.to(numberCloneSplit.words, {
        y: '100%',
        opacity: 0,
        duration: 0.6,
        stagger: 0.02,
        delay: 0.05,
        ease: 'power3.in'
      });
    } else {
      gsap.to(captionClone, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.in',
        onComplete: () => {
          if (captionClone.parentNode) document.body.removeChild(captionClone);
        }
      });
    }

    const rect = item.getBoundingClientRect();
    originalPosition = {
      id: item.id,
      rect,
      imgSrc,
      width: itemWidth,
      height: itemHeight,
      nameText,
      numberText,
      captionRect // 儲存 captionRect
    };
    animateOverlayIn();
    expandedItem = document.createElement('div');
    expandedItem.className = 'expanded-item';
    expandedItem.style.position = 'fixed';
    expandedItem.style.top = '50%';
    expandedItem.style.left = '50%';
    expandedItem.style.transform = 'translate(-50%, -50%)';
    expandedItem.style.backgroundColor = 'black';
    expandedItem.style.overflow = 'hidden';
    expandedItem.style.cursor = 'pointer';
    expandedItem.style.zIndex = '10000';
    expandedItem.style.width = `${itemWidth}px`;
    expandedItem.style.height = `${itemHeight}px`;
    expandedItem.style.borderRadius = `${$settings.borderRadius}px`;
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.pointerEvents = 'none';
    expandedItem.appendChild(img);
    expandedItem.addEventListener('click', closeExpandedItem);
    document.body.appendChild(expandedItem);
    document.querySelectorAll('.item').forEach((el) => {
      if (el !== activeItem) {
        gsap.to(el, { opacity: 0, duration: $settings.overlayEaseDuration, ease: 'power2.inOut' });
      }
    });
    const viewportWidth = window.innerWidth;
    const targetWidth = viewportWidth * $settings.expandedScale;
    const aspectRatio = itemHeight / itemWidth;
    const targetHeight = targetWidth * aspectRatio;
    gsap.fromTo(
      expandedItem,
      {
        width: itemWidth,
        height: itemHeight,
        x: rect.left + itemWidth / 2 - window.innerWidth / 2,
        y: rect.top + itemHeight / 2 - window.innerHeight / 2
      },
      {
        width: targetWidth,
        height: targetHeight,
        x: 0,
        y: 0,
        duration: $settings.zoomDuration,
        ease: useCustomEase ? 'hop' : 'power3.out'
      }
    );
  }

  function closeExpandedItem() {
    if (!expandedItem || !originalPosition) return;
    animateOverlayOut();
    document.querySelectorAll('.item').forEach((el) => {
      if (el.id !== activeItemId) {
        gsap.to(el, { opacity: 1, duration: $settings.overlayEaseDuration, delay: 0.3, ease: 'power2.inOut' });
      }
    });
    const originalItem = document.getElementById(activeItemId);
    if (originalItem) {
      const nameElement = originalItem.querySelector('.item-name');
      const numberElement = originalItem.querySelector('.item-number');
      nameElement.textContent = originalPosition.nameText;
      numberElement.textContent = originalPosition.numberText;
      originalItem.querySelector('.item-caption').style.opacity = '0';
    }
    const originalRect = originalPosition.rect;
    const originalWidth = originalPosition.width;
    const originalHeight = originalPosition.height;
    const captionRect = originalPosition.captionRect; // 使用儲存的 captionRect
    gsap.to(expandedItem, {
      width: originalWidth,
      height: originalHeight,
      x: originalRect.left + originalWidth / 2 - window.innerWidth / 2,
      y: originalRect.top + originalHeight / 2 - window.innerHeight / 2,
      duration: $settings.zoomDuration,
      ease: typeof window.CustomEase !== 'undefined' ? 'hop' : 'power3.out',
      onComplete: () => {
        if (originalItem) {
          const captionElement = originalItem.querySelector('.item-caption');
          const captionClone = document.createElement('div');
          captionClone.className = 'caption-clone';
          captionClone.innerHTML = captionElement.innerHTML;
          captionClone.style.position = 'fixed';
          captionClone.style.left = captionRect ? `${captionRect.left}px` : '0px';
          captionClone.style.bottom = captionRect ? `${window.innerHeight - captionRect.bottom}px` : '10px';
          captionClone.style.width = captionRect ? `${captionRect.width}px` : 'auto';
          captionClone.style.padding = '10px';
          captionClone.style.zIndex = '10002';
          document.body.appendChild(captionClone);
          const nameClone = captionClone.querySelector('.item-name');
          const numberClone = captionClone.querySelector('.item-number');
          nameClone.style.overflow = 'hidden';
          numberClone.style.overflow = 'hidden';
          const useSplitText = typeof gsap.SplitText !== 'undefined';
          let nameCloneSplit, numberCloneSplit;
          if (useSplitText) {
            try {
              nameCloneSplit = new gsap.SplitText(nameClone, { type: 'words' });
              numberCloneSplit = new gsap.SplitText(numberClone, { type: 'words' });
              gsap.set(nameCloneSplit.words, { y: '100%', opacity: 0 });
              gsap.set(numberCloneSplit.words, { y: '100%', opacity: 0 });
              gsap.to(nameCloneSplit.words, {
                y: '0%',
                opacity: 1,
                duration: 0.7,
                stagger: 0.03,
                ease: 'power3.out'
              });
              gsap.to(numberCloneSplit.words, {
                y: '0%',
                opacity: 1,
                duration: 0.7,
                stagger: 0.02,
                delay: 0.05,
                ease: 'power3.out',
                onComplete: () => {
                  captionElement.style.opacity = '1';
                  if (captionClone.parentNode) document.body.removeChild(captionClone);
                }
              });
            } catch (error) {
              console.error('SplitText 初始化失敗：', error);
              gsap.to(captionClone, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power3.out',
                onComplete: () => {
                  captionElement.style.opacity = '1';
                  if (captionClone.parentNode) document.body.removeChild(captionClone);
                }
              });
            }
          } else {
            gsap.to(captionClone, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              onComplete: () => {
                captionElement.style.opacity = '1';
                if (captionClone.parentNode) document.body.removeChild(captionClone);
              }
            });
          }
        }
        if (expandedItem && expandedItem.parentNode) document.body.removeChild(expandedItem);
        if (originalItem) originalItem.style.visibility = 'visible';
        expandedItem = null;
        isExpanded = false;
        activeItem = null;
        originalPosition = null;
        activeItemId = null;
        canDrag = true;
        if (canvasElement) canvasElement.style.cursor = 'grab';
        dragVelocityX = 0;
        dragVelocityY = 0;
      }
    });
  }
</script>

<svelte:head>
  <link href="https://fonts.cdnfonts.com/css/thegoodmonolith" rel="stylesheet">
  <link href="https://fonts.cdnfonts.com/css/pp-neue-montreal" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</svelte:head>

<main class="relative w-screen h-screen bg-black text-white overflow-hidden select-none">
  <!-- 噪點效果 
  <div class="fixed inset-0 -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[url('http://assets.iceable.com/img/noise-transparent.png')] bg-repeat bg-[length:300px_300px] animate-noise opacity-90 pointer-events-none z-[100]"></div>
-->
  <!-- 主內容 -->
  <div class="container relative w-full h-full" bind:this={canvasElement} style="pointer-events: auto;">
    <div class="canvas absolute" id="canvas">
      {#each Array.from(visibleItems) as itemId}
        {@const [col, row] = itemId.split(',').map(Number)}
        {@const itemSize = getItemSize(row, col)}
        {@const position = getItemPosition(col, row)}
        {@const itemNum = Math.abs((row * columns + col) % itemCount)}
        <div
          class="item absolute bg-black cursor-pointer overflow-hidden"
          style="width: {itemSize.width}px; height: {itemSize.height}px; left: {position.x}px; top: {position.y}px; border-radius: {$settings.borderRadius}px;"
          id={itemId}
          data-col={col}
          data-row={row}
          data-width={itemSize.width}
          data-height={itemSize.height}
          on:click={() => handleItemClick(document.getElementById(itemId), itemNum)}
        >
          <div class="item-image-container relative w-full h-full overflow-hidden">
            <img
              src={imageUrls[itemNum % imageUrls.length]}
              alt={`圖片 ${itemNum + 1}`}
              class="w-full h-full object-cover pointer-events-none transition-transform duration-300"
              style="transform: scale({$settings.hoverScale});"
            >
            <div class="absolute inset-0 pointer-events-none z-[1]" style="box-shadow: inset 0 0 {$settings.vignetteSize}px rgba(0, 0, 0, 0.5);"></div>
          </div>
          <div class="item-caption absolute bottom-0 left-0 w-full p-2 z-[2]">
            <div class="item-name font-sans text-white text-xs font-medium uppercase tracking-tight mb-0.5 overflow-hidden h-4">{items[itemNum]}</div>
            <div class="item-number font-mono text-gray-500 text-[10px] font-normal overflow-hidden h-[14px]">#{(itemNum + 1).toString().padStart(5, '0')}</div>
          </div>
        </div>
      {/each}
    </div>
    <div
      class="overlay fixed inset-0 bg-black pointer-events-none opacity-0 z-[9999]"
      bind:this={overlayElement}
      on:click={closeExpandedItem}
    ></div>
  </div>

  <!-- 項目標題 -->
  <div class="project-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-[10002]">
    <p bind:this={projectTitleElement} class="relative h-[42px] text-white overflow-hidden font-sans text-4xl uppercase tracking-tight"></p>
  </div>

  <!-- 頁面陰影 -->
  <div class="page-vignette-container fixed inset-0 pointer-events-none z-[9998]">
    <div class="page-vignette absolute inset-0" style="box-shadow: inset 0 0 {$settings.vignetteSizePage * 1.5}px rgba(0,0,0,{$settings.vignetteStrength * 0.7});"></div>
    <div class="page-vignette-strong absolute inset-0" style="box-shadow: inset 0 0 {$settings.vignetteSizePage * 0.75}px rgba(0,0,0,{$settings.vignetteStrength * 0.85});"></div>
    <div class="page-vignette-extreme absolute inset-0" style="box-shadow: inset 0 0 {$settings.vignetteSizePage * 0.4}px rgba(0,0,0,{$settings.vignetteStrength});"></div>
  </div> 
</main>

<style>
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

  .animate-noise {
    animation: noise-animation 0.3s steps(5) infinite;
  }

  .item:hover img {
    transform: scale(var(--hover-scale, 1.05));
  }
</style>