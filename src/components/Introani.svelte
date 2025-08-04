<script lang="ts">
  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { gsap } from 'gsap';

  const dispatch = createEventDispatcher();
  let container: HTMLDivElement;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let points: THREE.Points;
  let animationFrameId: number;

  // 粒子分布參數
  const gridX = 2500; // 橫向粒子數
  const gridY = 1500;  // 縱向粒子數
  const fontSize = 0.15; // 字體大小倍率，調整這個就像 font-size
  const imgSrc = '/images/qingshan-text-2.png';
  const threshold = 0.2; // alpha 閾值，決定哪些地方顯示粒子

  onMount(async () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.z = 200;
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 載入貼圖
    const img = new window.Image();
    img.src = imgSrc;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });
    // 將貼圖畫到 canvas 取得像素資料
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = gridX;
    tempCanvas.height = gridY;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('無法取得 2D 繪圖 context');
    }
    ctx.drawImage(img, 0, 0, gridX, gridY);
    const imgData = ctx.getImageData(0, 0, gridX, gridY).data;

    // 產生粒子位置
    const positions = [];
    const startPositions = [];
    const rotations = [];
    const curveAngles = [];
    const curveStrengths = [];
    for (let y = 0; y < gridY; y++) {
      for (let x = 0; x < gridX; x++) {
        const idx = (y * gridX + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const a = imgData[idx + 3] / 255;
        // 只在有字的地方產生粒子（只渲染文字本身）
        if (a > threshold) { // 只有有字的地方顯示粒子
          // 讓粒子分布在中心
          const px = (x - gridX / 2) * fontSize;
          const py = (gridY / 2 - y) * fontSize;
          positions.push(px, py, 0);
          // 隨機起始位置
          startPositions.push(
            (Math.random() - 0.5) * 600,
            (Math.random() - 0.5) * 600,
            -300 - Math.random() * 300
          );
          // 曲線參數
          curveAngles.push(Math.random() * Math.PI * 2); // 隨機方向
          curveStrengths.push(Math.random() * 2.5 + 0.5); // 隨機幅度 0.5~3.0
        }
      }
    }
    const count = positions.length / 3;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(startPositions, 3));
    geometry.setAttribute('targetPosition', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('curveAngle', new THREE.Float32BufferAttribute(curveAngles, 1));
    geometry.setAttribute('curveStrength', new THREE.Float32BufferAttribute(curveStrengths, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: { progress: { value: 0 } },
      vertexShader: `
        uniform float progress;
        attribute vec3 targetPosition;
        attribute float curveAngle;
        attribute float curveStrength;
        varying float vAlpha;
        void main() {
          // 基本線性插值
          vec3 newPos = mix(position, targetPosition, progress);
          // 曲線偏移
          float t = 1.0 - progress;
          float radius = curveStrength * t * 350.0;
          newPos.x += cos(curveAngle) * radius * t;
          newPos.y += sin(curveAngle) * radius * t;
          vAlpha = smoothstep(0.0, 1.0, progress);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
          gl_PointSize = 2.5;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.4, 0.5, d);
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    // 進場動畫
    gsap.to(material.uniforms.progress, {
      value: 1.0,
      duration: 3.5,
      ease: 'expo.out',
      onComplete: () => {
        gsap.to(container, {
          opacity: 0,
          delay: 0.5,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: () => {
            dispatch('done');
          }
        });
      }
    });

    const animate = () => {
      if (container.style.opacity === '' || parseFloat(container.style.opacity) > 0.01) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
      renderer.render(scene, camera);
    };
    animate();
  });

  onDestroy(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
    if (scene) {
      scene.traverse((object) => {
        if (
          (object instanceof THREE.Mesh || object instanceof THREE.Points) &&
          'geometry' in object &&
          'material' in object
        ) {
          const meshOrPoints = object as THREE.Mesh | THREE.Points;
          if (meshOrPoints.geometry) {
            meshOrPoints.geometry.dispose();
          }
          if (meshOrPoints.material) {
            if (Array.isArray(meshOrPoints.material)) {
              meshOrPoints.material.forEach((mat) => mat.dispose());
            } else {
              meshOrPoints.material.dispose();
            }
          }
        }
      });
      scene.clear();
    }
  });
</script>

<div bind:this={container} class="fixed inset-0 z-50 bg-black"></div>

<style>
</style>