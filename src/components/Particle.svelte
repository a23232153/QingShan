<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { BufferGeometry, BufferAttribute, ShaderMaterial, Vector2, Vector3, Color } from 'three';

  // Props
  export let texturePath = '/images/mainCopy.png';
  export let lang = 'ja';
  export let numChars = 7;
  export let numCols = 18;
  export let numRows = 113;
  export let planeSize = 100;
  export let autoPlay = true;
  export let animationDuration = 5;
  export let fadeOutDuration = 1;

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let particleMesh: ParticleMesh;
  let width: number;
  let height: number;
  let isRunning = false;
  let time = 0;
  let startTime = 0;
  let beforeTime = 0;
  let timeDelta = 0;
  let observer: IntersectionObserver;
  let animationStartTime = 0;
  let isAnimating = false;
  let visible = true;
  let lastLang = lang;

  const vertexShader = `
    precision mediump float;
    precision mediump int;

    attribute vec3 position;
    attribute vec2 uv;
    attribute vec2 uvOffset;
    attribute vec2 centerUV;
    attribute vec4 randomValues;
    attribute vec3 charRandomValues;
    attribute vec2 offset;
    attribute float charIndex;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec2 uvSize;
    uniform float animationValue0;
    uniform float animationTimeOffset;
    uniform float planeSize;
    uniform float time;
    uniform float numChars;
    uniform float globalAlpha;
    uniform vec3 color0;
    uniform vec3 color1;
    varying vec2 vUvOrg;
    varying vec2 vUv;
    varying vec2 vCenterUV;
    varying float vA0;
    varying float vAlpha;
    varying float vTextureColorFactor;
    varying vec3 vColor;
    const float PI = 3.141592653589793;

    float getAnimationValueRandomDuration(float aValue, float randomValue1, float randomValue2, float minOffsetRatio, float maxOffsetRatio, float minDurationRatio, float maxDurationRatio) {
      float offsetRatio = minOffsetRatio + (maxOffsetRatio - minOffsetRatio) * randomValue1;
      float durationRatioBase = 1.0 - offsetRatio;
      float durationRatio = durationRatioBase * (minDurationRatio + (maxDurationRatio - minDurationRatio) * randomValue2);
      float vertexAnimationValue = max(0.0, aValue - offsetRatio);
      vertexAnimationValue = vertexAnimationValue / durationRatio;
      return clamp(vertexAnimationValue, 0.0, 1.0);
    }

    float sineOut(float t) {
      return sin(t * 1.5707963267948966);
    }

    void main() {
      float _a0 = getAnimationValueRandomDuration(animationValue0, randomValues.x * 0.25 + charIndex / numChars * 0.5, randomValues.w, 0.0, 0.6, 0.1, 1.0);
      vAlpha = smoothstep(0.0, 0.4, _a0) * globalAlpha;
      vTextureColorFactor = smoothstep(0.8, 1.0, _a0);
      float a0 = sineOut(_a0);
      vColor = mix(color1, color0, min(1.0, randomValues.z * 0.4 + a0));
      float scale = 10.0 + randomValues.x * 6.0;
      vec3 pos = position * (scale - a0 * (scale - 1.0));
      pos += vec3(
        charRandomValues.x * planeSize * 50.0 * (randomValues.y * 0.2 + 0.8),
        charRandomValues.y * planeSize * 320.0 * (randomValues.x * 0.2 + 0.8),
        charRandomValues.z * planeSize * 18.0
      ) * (1.0 - a0);
      pos.x += planeSize * 60.0 * (randomValues.z * 0.2 + 0.8) * sin(animationTimeOffset + a0 * PI * 1.6 * (randomValues.w * 0.2 + 0.8) + charIndex * 100.0) * (1.0 - smoothstep(0.6, 1.0, a0));
      pos.xy += offset * a0;
      vUvOrg = uv;
      vUv = uvOffset + vec2(uv.x, 1.0 - uv.y) * uvSize;
      vUv.y = 1.0 - vUv.y;
      vCenterUV = centerUV;
      vA0 = a0;
      vec4 modelPos = modelMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * viewMatrix * modelPos;
    }
  `;

  const fragmentShader = `
    precision mediump float;
    precision mediump int;

    uniform float time;
    uniform sampler2D texture;
    varying vec2 vUvOrg;
    varying vec2 vUv;
    varying float vA0;
    varying float vAlpha;
    varying float vTextureColorFactor;
    varying vec2 vCenterUV;
    varying vec3 vColor;

    void main() {
      float textureAlpha = texture2D(texture, vUv).a;
      float texturePlaneCenterAlpha = texture2D(texture, vCenterUV).a;
      vec2 _uv = vUvOrg * 2.0 - 1.0;
      float circleAlpha = (1.0 - smoothstep(0.0, 1.0, length(_uv))) * vAlpha * texturePlaneCenterAlpha;
      vec4 distColor = vec4(vColor, mix(circleAlpha, textureAlpha, vTextureColorFactor));
      gl_FragColor = distColor;
    }
  `;

  class InstancedParticleGeometry {
    numInstances: number;
    baseGeometry: THREE.BufferGeometry;
    geometry: THREE.InstancedBufferGeometry;

    constructor(numInstances: number, baseGeometry: THREE.BufferGeometry) {
      this.numInstances = numInstances;
      this.baseGeometry = baseGeometry;
      this.geometry = new THREE.InstancedBufferGeometry();
      this.initGeometry();
    }

    initGeometry() {
      this.geometry.instanceCount = this.numInstances;
      const instanceIndex = new THREE.InstancedBufferAttribute(new Float32Array(this.numInstances), 1);
      const randomValues = new THREE.InstancedBufferAttribute(new Float32Array(this.numInstances * 4), 4);
      for (let i = 0; i < this.numInstances; i++) {
        randomValues.setXYZW(i, Math.random(), Math.random(), Math.random(), Math.random());
        instanceIndex.setX(i, i);
      }
      const baseAttributes = this.baseGeometry.attributes;
      this.geometry.setAttribute('position', baseAttributes.position.clone());
      this.geometry.setAttribute('uv', baseAttributes.uv.clone());
      this.geometry.setAttribute('normal', baseAttributes.normal.clone());
      this.geometry.setAttribute('instanceIndex', instanceIndex);
      this.geometry.setAttribute('randomValues', randomValues);
      if (this.baseGeometry.index) {
        this.geometry.setIndex(this.baseGeometry.index.clone());
      }
    }

    setAttribute(name: string, data: any[], itemSize: number, x = 'x', y = 'y', z = 'z', w = 'w') {
      const attribute = new THREE.InstancedBufferAttribute(new Float32Array(this.numInstances * itemSize), itemSize);
      if (itemSize === 1) {
        for (let i = 0; i < this.numInstances; i++) {
          attribute.setX(i, data[i]);
        }
      } else if (itemSize === 2) {
        for (let i = 0; i < this.numInstances; i++) {
          attribute.setXY(i, data[i][x], data[i][y]);
        }
      } else if (itemSize === 3) {
        for (let i = 0; i < this.numInstances; i++) {
          attribute.setXYZ(i, data[i][x], data[i][y], data[i][z]);
        }
      } else if (itemSize === 4) {
        for (let i = 0; i < this.numInstances; i++) {
          attribute.setXYZW(i, data[i][x], data[i][y], data[i][z], data[i][w]);
        }
      }
      attribute.needsUpdate = true;
      this.geometry.setAttribute(name, attribute);
    }
  }

  class ParticleMesh extends THREE.Mesh {
    material: THREE.ShaderMaterial;
    constructor(baseGeometry: THREE.BufferGeometry) {
      const params = {
        numChars,
        numCols,
        numRows,
        numInstances: numCols * numRows
      };
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        uniforms: {
          time: { value: 0 },
          texture: { value: null },
          uvSize: { value: new Vector2(1 / numCols, 1 / numRows) },
          color0: { value: new Color(0xCCCCCC) },
          color1: { value: new Color(0xF4E4BF) },
          planeSize: { value: planeSize },
          numChars: { value: numChars },
          animationTimeOffset: { value: 0 },
          animationValue0: { value: 0 },
          globalAlpha: { value: 1 }
        }
      });

      const charIndices: number[] = [];
      const charRandomValues: THREE.Vector3[] = [];
      const uvOffsets: THREE.Vector2[] = [];
      const offsets: THREE.Vector2[] = [];
      const centerUVs: THREE.Vector2[] = [];
      const xOffset = (planeSize - planeSize * numCols) * 0.5;
      const yOffset = (planeSize * numRows - planeSize) * 0.5;

      for (let i = 0; i < params.numInstances; i++) {
        const col = i % numCols;
        const row = Math.floor(i / numCols);
        uvOffsets.push(new Vector2(col / numCols, row / numRows));
        centerUVs.push(new Vector2((col + 0.5) / numCols, (row + 0.5) / numRows));
        offsets.push(new Vector2(xOffset + col * planeSize, yOffset - row * planeSize));
        charIndices.push(lang === 'ja' ? Math.floor(row / numRows * numChars) : Math.floor(col / numCols * numChars));
        charRandomValues.push(new Vector3(Math.random(), Math.random(), Math.random()));
      }

      const geometry = new InstancedParticleGeometry(params.numInstances, baseGeometry);
      geometry.setAttribute('charIndex', charIndices, 1);
      geometry.setAttribute('charRandomValues', charRandomValues, 3);
      geometry.setAttribute('uvOffset', uvOffsets, 2);
      geometry.setAttribute('offset', offsets, 2);
      geometry.setAttribute('centerUV', centerUVs, 2);

      super(geometry.geometry, material);
      this.material = material;
      this.frustumCulled = false;
    }

    play() {
      if (isAnimating) return;
      isAnimating = true;
      this.material.uniforms.animationValue0.value = 0;
      this.material.uniforms.animationTimeOffset.value = 0;
      this.material.uniforms.globalAlpha.value = 1;
      visible = true;
      animationStartTime = performance.now() / 1000;

      const animate = () => {
        if (!isAnimating) return;
        const currentTime = performance.now() / 1000;
        const elapsed = currentTime - animationStartTime;
        const totalDuration = animationDuration + fadeOutDuration;

        if (elapsed < animationDuration) {
          this.material.uniforms.animationValue0.value = Math.min(elapsed / animationDuration, 1);
          this.material.uniforms.animationTimeOffset.value = Math.min(elapsed / animationDuration * 2, 2);
          this.material.uniforms.globalAlpha.value = 1;
        } else if (elapsed < totalDuration) {
          this.material.uniforms.globalAlpha.value = 1 - (elapsed - animationDuration) / fadeOutDuration;
        } else {
          this.material.uniforms.globalAlpha.value = 0;
          isAnimating = false;
          visible = false;
          console.log('Animation finished, hiding component');
          return;
        }

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }

    stop() {
      isAnimating = false;
      this.material.uniforms.animationValue0.value = 0;
      this.material.uniforms.animationTimeOffset.value = 0;
      this.material.uniforms.globalAlpha.value = 1;
      visible = true;
    }
  }

  function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 1000);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    
    const baseGeometry = new THREE.PlaneGeometry(1, 1);
    particleMesh = new ParticleMesh(baseGeometry);
    scene.add(particleMesh);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(
      texturePath,
      (texture: THREE.Texture) => {
        particleMesh.material.uniforms.texture.value = texture;
        console.log('Texture loaded successfully:', texturePath, 'Dimensions:', texture.image.width, texture.image.height);
      },
      undefined,
      (err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Texture loading failed:', message, 'Path:', texturePath);
      }
    );

    updateViewOffset();
  }

  function updateViewOffset() {
    const aspect = width / height;
    const viewWidth = planeSize * numCols;
    const viewHeight = planeSize * numRows;
    const viewAspect = viewWidth / viewHeight;

    if (aspect > viewAspect) {
      camera.setViewOffset(viewWidth * aspect, viewHeight, -viewWidth * (aspect - viewAspect) / 2, 0, viewWidth, viewHeight);
    } else {
      camera.setViewOffset(viewWidth, viewHeight / aspect, 0, -viewHeight * (1 / aspect - viewAspect) / 2, viewWidth, viewHeight);
    }
    camera.updateProjectionMatrix();
  }

  function animate() {
    if (!isRunning) return;
    requestAnimationFrame(animate);

    const now = performance.now() / 1000;
    timeDelta = now - beforeTime;
    time = now - startTime;
    beforeTime = now;

    particleMesh.material.uniforms.time.value = time;
    renderer.render(scene, camera);
  }

  function resize() {
    if (!container) return;
    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    updateViewOffset();
  }

  function setupObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && autoPlay) {
          particleMesh.play();
        } else {
          particleMesh.stop();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
  }

  onMount(() => {
    width = container.clientWidth;
    height = container.clientHeight;
    initScene();
    isRunning = true;
    startTime = beforeTime = performance.now() / 1000;
    animate();
    setupObserver();
    window.addEventListener('resize', resize);
    return () => {
      isRunning = false;
      window.removeEventListener('resize', resize);
      if (observer) observer.disconnect();
    };
  });

  onDestroy(() => {
    isRunning = false;
    isAnimating = false;
    if (observer) observer.disconnect();
    if (renderer) renderer.dispose();
  });

  export function play() {
    particleMesh.play();
  }

  export function stop() {
    particleMesh.stop();
  }

  $: if (particleMesh && lang !== lastLang) {
    lastLang = lang;
    particleMesh.material.uniforms.numChars.value = numChars;
    const newTexturePath = lang === 'ja' ? '/images/mainCopy.png' : '/images/mainCopyEn.png';
    if (newTexturePath !== texturePath) {
      texturePath = newTexturePath;
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      loader.load(
        texturePath,
        (texture: THREE.Texture) => {
          particleMesh.material.uniforms.texture.value = texture;
          console.log('Texture loaded successfully:', texturePath, 'Dimensions:', texture.image.width, texture.image.height);
        },
        undefined,
        (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          console.error('Texture loading failed:', message, 'Path:', texturePath);
        }
      );
    }
  }
</script>

<style>
  .container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    transition: opacity 0.5s ease;
  }
  .container.hidden {
    opacity: 0;
    pointer-events: none;
  }
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>

<div class="container" class:hidden={!visible} bind:this={container}>
  <canvas bind:this={canvas}></canvas>
</div>