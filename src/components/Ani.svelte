<script lang="ts">

  import { onMount, onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";
  import * as THREE from "three";
  import Stats from "three/examples/jsm/libs/stats.module.js";
  import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
  import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

  export const events = {
    done: () => {}
  };

  // 綁定的容器：用「!」斷言，Svelte 在 onMount 前會綁好，不會是 undefined
  let container!: HTMLDivElement; 

  let renderer!: THREE.WebGLRenderer;
  let scene!: THREE.Scene;
  let camera!: THREE.PerspectiveCamera;
  let mesh!: THREE.Mesh;
  let stats: Stats | null = null;

  // uniforms（用來驅動 shader 動畫）
  const uniforms = {
    time: { value: 0 }, // 0→1 爆散進度
  };

  // 文字內容
  const textString = "青山";

  // 頂點與片段著色器（最新版 three 沒問題）
  const vertexShader = `
    uniform float time;
    attribute vec3 customColor;
    attribute vec3 displacement;
    varying vec3 vNormal;
    varying vec3 vColor;

    void main() {
      vNormal = normal;
      vColor = customColor;

      // time: 0→1，位移沿法線方向爆散
      vec3 newPosition = position + normal * (1.0 - time) * displacement;



      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vColor;

    void main() {
      const float ambient = 0.15;
      vec3 light = normalize(vec3(1.0, 1.0, 1.0));
      float directional = max(dot(normalize(vNormal), light), 0.0);
      vec3 color = (ambient + directional) * vColor;

      // 簡單的 gamma 矯正
      gl_FragColor = vec4(sqrt(color), 1.0);
    }
  `;

  onMount(() => {
    // --- 基本場景 ---
    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 5000);
    camera.position.set(0, 200, 800);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 燈光
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(0.5, 1, 0.75);
    scene.add(dir);
    scene.add(new THREE.AmbientLight(0x404040));

    // 測速器（可選）
    stats = new Stats();
    stats.dom.style.position = "absolute";
    stats.dom.style.left = "0px";
    stats.dom.style.top = "0px";
    container.appendChild(stats.dom);

    // --- 載入字型，建立文字 ---
    new FontLoader().load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        // TextGeometry（已是 BufferGeometry）
        const geo = new TextGeometry(textString, {
          font,
          size: 100,
          depth: 20,
          bevelEnabled: true,
          bevelThickness: 2,
          bevelSize: 1,
          bevelSegments: 5,
          curveSegments: 4,
        });

        geo.computeBoundingBox();
        geo.center();

        // 關鍵：打散成非索引，讓每個三角形擁有獨立頂點（等同 Explode）
        const bufferGeo = geo.toNonIndexed();

        // 依頂點數建立 attribute
        const vertexCount = bufferGeo.getAttribute("position").count;

        // 自訂屬性：每頂點一個顏色、一個位移向量
        const colors = new Float32Array(vertexCount * 3);
        const displacement = new Float32Array(vertexCount * 3);

        // 用字框大小來決定位移量範圍
        const bb = geo.boundingBox!;
        const size = new THREE.Vector3();
        bb.getSize(size);

        const tmpColor = new THREE.Color();

        for (let i = 0; i < vertexCount; i += 3) {
          // 三個頂點共用同一個亂數顏色，看起來比較乾淨
          tmpColor.setHSL(Math.random() * 0.25 + 0.05, 0.6, 0.55);

          // 給這個三角形一個位移（越大越爆）
          const dx = (Math.random() - 0.5) * size.x * 0.6;
          const dy = (Math.random() - 0.5) * size.y * 0.6;
          const dz = (Math.random() - 0.5) * size.z * 2.0;

          for (let v = 0; v < 3; v++) {
            const vi = i + v;

            colors[vi * 3 + 0] = tmpColor.r;
            colors[vi * 3 + 1] = tmpColor.g;
            colors[vi * 3 + 2] = tmpColor.b;

            displacement[vi * 3 + 0] = dx;
            displacement[vi * 3 + 1] = dy;
            displacement[vi * 3 + 2] = dz;
          }
        }

        bufferGeo.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
        bufferGeo.setAttribute(
          "displacement",
          new THREE.BufferAttribute(displacement, 3)
        );

        const material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: true,
        });

        mesh = new THREE.Mesh(bufferGeo, material);
        scene.add(mesh);

        // 動畫：把 uniforms.time 從 0→1（2.5 秒）
        // 使用 requestAnimationFrame，比較平順；若你想用 GSAP，改在下方替換。
        const start = performance.now();
        const duration = 2500; // ms

        const tickIn = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          uniforms.time.value = t;
          if (t < 1) requestAnimationFrame(tickIn);
        };
        requestAnimationFrame(tickIn);

        // 再給點時間看結果，然後淡出整個容器（等同 intro 蓋全屏 → 結束後隱藏）
        setTimeout(() => {
          container.classList.add("fade-out");
          // 淡出結束後通知外部可以移除這個元件
          container.addEventListener(
            "transitionend",
            () => events.done(),
            { once: true }
          );
        }, duration + 600);
      }
    );

    // 在載入字體後，啟動動畫
  gsap.to(uniforms.time, {
  value: 1.0,       // 目標值（影響爆炸程度）
  duration: 3,      // ✅ 動畫時長（秒）
  ease: "expo.out", // 動畫曲線

  onComplete: () => {
      // 動畫結束後淡出
      gsap.to(container, {
        opacity: 0,
        duration: 3,
        delay: 0.5,
      });
    }
  });

    // 迴圈
  const clock = new THREE.Clock();
  const duration = 3.0; 
  const animate = () => {
  animationId = requestAnimationFrame(animate);

  let elapsed = clock.getElapsedTime();
  uniforms.time.value = Math.min(elapsed / duration, 1.0);

  renderer.render(scene, camera);
  stats?.update();
};


    let animationId = requestAnimationFrame(animate);

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    onDestroy(() => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
      // 清理資源
      if (mesh) {
        (mesh.geometry as THREE.BufferGeometry).dispose();
        (mesh.material as THREE.Material).dispose();
        scene.remove(mesh);
      }
      renderer.dispose();
      stats && container.removeChild(stats.dom);

      // 把 canvas 移掉
      const canvas = renderer.domElement;
      canvas && canvas.parentElement?.removeChild(canvas);
    });
  });
</script>

<!-- 全螢幕覆蓋 -->
<div bind:this={container} class="intro absolute inset-0 z-50 bg-black"></div>

<style>
  .intro {
    /* 覆蓋全畫面 */
    width: 100vw;
    height: 100vh;
    opacity: 1;
    transition: opacity 0.9s ease;
  }
  .intro.fade-out {
    opacity: 0;
    pointer-events: none;
  }
</style>
