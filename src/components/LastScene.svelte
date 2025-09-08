<script>
//@ts-nocheck
  import { onMount } from 'svelte';
  
  // Props (tweak as you like)
  export let background = 0xffffff; // scene background
  export let controlsEnabled = false; // OrbitControls toggle
  export let maxPixelRatio = 1; // clamp DPR to keep things light

  let container; // wrapper div
  let canvas; // WebGL canvas

  let cleanup;

  // GLSL simplex noise chunk
  const noise = `// Simplex 2D noise\n//\nvec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }\n\nfloat snoise(vec2 v){\n  const vec4 C = vec4(0.211324865405187, 0.366025403784439,\n           -0.577350269189626, 0.024390243902439);\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n  vec2 i1;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n  i = mod(i, 289.0);\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n  + i.x + vec3(0.0, i1.x, 1.0 ));\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),\n    dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}`;

  onMount(async () => {
    // Dynamic imports to avoid SSR issues
    const THREE = await import('three');
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
    const { mergeGeometries } = await import('three/examples/jsm/utils/BufferGeometryUtils.js');

    const gu = { time: { value: 0 } };

    // Scene basics
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
    camera.position.set(0, 0.25, 1).setLength(30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const dpr = Math.min(window.devicePixelRatio || 1, maxPixelRatio);

    // Sizing helpers
    function setSize() {
      const { clientWidth: w, clientHeight: h } = container;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
    }

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = !!controlsEnabled;

    // Lights
    const dirLight = new THREE.DirectionalLight(0xffffff, Math.PI);
    dirLight.position.setScalar(1);
    scene.add(dirLight, new THREE.AmbientLight(0xffffff, Math.PI * 0.5));

    // Landscape mesh (two merged planes; front/back with shader tweaks)
    class Landscape extends THREE.Mesh {
      constructor() {
        const g = mergeGeometries([
          new THREE.PlaneGeometry(1, 1, 250, 500),
          new THREE.PlaneGeometry(1, 1, 250, 500)
        ], true).rotateX(Math.PI * -0.5);

        const ms = Array.from({ length: 2 }, (_, idx) => {
          const m = new THREE.MeshBasicMaterial({
            color: idx < 0.5 ? 0x000000 : 0xffffff,
            side: idx < 0.5 ? THREE.FrontSide : THREE.BackSide,
            onBeforeCompile: (shader) => {
              shader.uniforms.time = gu.time;
              shader.uniforms.hasShift = { value: idx };
              shader.vertexShader = `
                uniform float hasShift;
                uniform float time;
                
                varying float river;
                varying float vHasShift;
                
                ${noise}
                ${shader.vertexShader}
              `.replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>
                  vHasShift = hasShift;
                  float t = time * PI;
                  vec3 pos = vec3(modelMatrix * vec4(position, 1.0));
                  float treeNoise = abs(snoise((pos.xz - vec2(0.0, t)) * 0.25));
                  treeNoise = pow(treeNoise, 0.5);
                  float riverNoise = snoise(vec2(0.0, pos.z - t) * 0.05);
                  riverNoise = smoothstep(5.0, 7.0, abs(pos.x + riverNoise * 2.5));
                  transformed.y += treeNoise * 2.5 * riverNoise;
                  transformed.y += hasShift * 0.05;
                  river = riverNoise;`
              );

              shader.fragmentShader = `
                varying float vHasShift;
                varying float river;
                ${shader.fragmentShader}
              `.replace(
                `#include <color_fragment>`,
                `#include <color_fragment>
                 diffuseColor.rgb = vHasShift < 0.5 && river < 0.01 ? vec3(1.0) : diffuseColor.rgb;`
              );
            }
          });
          return m;
        });

        super(g, ms);
        this.scale.set(50, 1, 50);
      }
    }

    // Sun billboard
    class Sun extends THREE.Mesh {
      constructor() {
        const g = new THREE.PlaneGeometry(50, 50);
        const m = new THREE.MeshBasicMaterial({
          color: 'red',
          onBeforeCompile: (shader) => {
            shader.uniforms.time = gu.time;
            shader.fragmentShader = `
              uniform float time;
              ${shader.fragmentShader}
            `.replace(
              `#include <color_fragment>`,
              `#include <color_fragment>
                vec2 lUv = (vUv - 0.5) * 2.0;
                float val = 0.0;
                float lenUv = length(lUv);
                float tShift = fract(time * 0.5);
                val = max(val, 1.0 - step(0.3, lenUv));
                val = max(val, step(0.3 + (tShift * 0.7), lenUv) - step(0.35 + (tShift * 0.65), lenUv));
                val = 1.0 - min(val, step(0.025, lUv.y));
                val = min(val, step(0.05, lUv.y));
                diffuseColor.rgb = vec3(val);`
            );
          }
        });
        m.defines = { USE_UV: '' };
        super(g, m);
        this.position.z = -25;
      }
    }

    const landscape = new Landscape();
    const sun = new Sun();
    scene.add(landscape, sun);

    // Mount & size once the component is in the DOM
    setSize();

    // Resize handling
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    // Animation loop
    const clock = new THREE.Clock();
    let rafId;

    function renderLoop() {
      const dt = clock.getDelta();
      gu.time.value += dt;
      controls.update();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(renderLoop);
    }

    renderLoop();

    // Cleanup on destroy
    cleanup = () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.setAnimationLoop(null);
      renderer.dispose();
      // Dispose geometries/materials
      landscape.geometry?.dispose?.();
      if (Array.isArray(landscape.material)) landscape.material.forEach(m => m.dispose());
      sun.geometry?.dispose?.();
      sun.material?.dispose?.();
    };

    return cleanup;
  });

  // Svelte will call this when the component is torn down
  export function onDestroy() { if (cleanup) cleanup(); }
</script>

<style>
  .wrapper { position: relative; width: 100%; height: 100%; }
  canvas { display: block; width: 100%; height: 120%; outline: none; }
</style>

<div class="wrapper" bind:this={container}>
  <canvas bind:this={canvas} />
  
</div>
