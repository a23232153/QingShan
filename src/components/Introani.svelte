<script lang="ts">
  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
    //@ts-ignore
  import * as THREE from 'three';
    //@ts-ignore
  import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
    //@ts-ignore
  import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
  import { gsap } from 'gsap';

  const dispatch = createEventDispatcher();
  let container: HTMLDivElement;

  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let points: THREE.Points;
  let animationFrameId: number;

  onMount(async () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Three.js 場景設置和粒子動畫立即開始 ---
    // 不再有容器的淡入動畫，它會直接顯示為黑色
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.z = 200;
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const font = await new FontLoader().loadAsync('/fonts/Bakudai_Medium.json');
    const textGeo = new TextGeometry('青山', {
      font,
      size: 40,
      depth: 5,
      curveSegments: 16,
    });
    textGeo.center();

    const rawPositions = textGeo.attributes.position.array;
    const uniquePositionsSet = new Set<string>();
    const finalUniquePositions: number[] = [];

    for (let i = 0; i < rawPositions.length; i += 3) {
      const x = rawPositions[i];
      const y = rawPositions[i + 1];
      const z = rawPositions[i + 2];
      const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;

      if (!uniquePositionsSet.has(key)) {
        uniquePositionsSet.add(key);
        finalUniquePositions.push(x, y, z);
      }
    }

    const uniqueCount = finalUniquePositions.length / 3;

    const geometry = new THREE.BufferGeometry();
    const start = new Float32Array(uniqueCount * 3);
    const target = new Float32Array(uniqueCount * 3);

    for (let i = 0; i < uniqueCount; i++) {
      const x = finalUniquePositions[i * 3];
      const y = finalUniquePositions[i * 3 + 1];
      const z = finalUniquePositions[i * 3 + 2];

      start.set([
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 600,
        -300 - Math.random() * 300
      ], i * 3);
      target.set([x, y, z], i * 3);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(start, 3));
    geometry.setAttribute('targetPosition', new THREE.BufferAttribute(target, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: { progress: { value: 0 } },
      vertexShader: `
        uniform float progress;
        attribute vec3 targetPosition;
        varying float vAlpha;
        varying float vSize;

        void main() {
          vec3 newPos = mix(position, targetPosition, progress);
          float size = mix(15.0, 1.5, progress);
          vAlpha = smoothstep(0.0, 1.0, progress);
          vSize = size;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
          gl_PointSize = size;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vSize;
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

    // --- GSAP 粒子動畫 ---
    gsap.to(material.uniforms.progress, {
      value: 1,
      duration: 2.6,
      ease: 'expo.out',
      onComplete: () => {
        // --- 粒子動畫完成後，讓整個 Three.js 容器淡出 ---
        gsap.to(container, {
          opacity: 0,
          delay: 0.5, // 可以加一個小延遲，讓粒子形成文字後停留一下再開始淡出
          duration: 1, // 整個 Three.js 容器淡出時間
          ease: 'power2.out',
          onComplete: () => {
            // 所有動畫完成後發送 'done' 事件
            dispatch('done');
          }
        });
      }
    });

    const animate = () => {
      // 只要容器的 opacity 大於 0.01（幾乎透明），就繼續渲染
      // 這樣當容器淡出時，渲染也會停止
      if (container.style.opacity === '' || parseFloat(container.style.opacity) > 0.01) {
         animationFrameId = requestAnimationFrame(animate);
      } else {
         cancelAnimationFrame(animationFrameId);
      }
      renderer.render(scene, camera);
    };
    animate();
  });

  // --- onDestroy 進行資源清理 (保持不變) ---
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
        // Type guard: only dispose geometry/material if they exist
        // and object is Mesh or Points
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
  /* 確保這裡沒有設定 opacity 或 transition，讓 GSAP 全權控制 */
</style>