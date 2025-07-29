<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  //@ts-ignore
  import * as THREE from 'three';
  //@ts-ignore
  import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
  //@ts-ignore
  import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
  import { gsap } from 'gsap';

  let container: HTMLDivElement;
  const dispatch = createEventDispatcher();
  let visible = true;

  onMount(async () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const font = await new FontLoader().loadAsync('/fonts/Bakudai_Medium.json');
    const textGeo = new TextGeometry('青山', {
      font,
      size: 100,
      height: 1,
      curveSegments: 12
    });
    textGeo.center();

    const pos = Array.from(textGeo.attributes.position.array);
    const count = pos.length / 3;
    const geometry = new THREE.BufferGeometry();
    const init = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      init.set([
        (Math.random()-0.5)*800,
        (Math.random()-0.5)*800,
        (Math.random()-0.5)*800,
      ], i*3);
      target.set((pos as number[]).slice(i*3, i*3+3), i*3);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(init,3));
    geometry.setAttribute('target', new THREE.BufferAttribute(target,3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRipple: { value: 0 },
        uBlur: { value: 0.3 },
        uSize: { value: 8.0 }
        },
      vertexShader: `uniform float uSize;
        uniform float uTime;
        attribute vec3 target;
        
        void main() {
        vec3 p = mix(position, target, uTime);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uSize;
        }`,
      fragmentShader: `
        uniform float uRipple;
        uniform float uBlur;
        void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            float blurFactor = smoothstep(0.0, 0.5 + uBlur, d);
            float alpha = 1.0 - blurFactor;
            if (alpha < 0.05) discard;

            gl_FragColor = vec4(1., 1., 1., alpha * (1.0 - uRipple));
           

        }`,
      depthTest: true,
      transparent: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const tl = gsap.timeline();

tl.to(material.uniforms.uTime, {
  value: 1,
  duration: 2,
  ease: 'power2.out'
}, 0); // 粒子飛進

tl.to(material.uniforms.uSize, {
  value: 4.0, // 👈 變小
  duration: 1.7,
  ease: 'power2.out'
}, 0); // 同步開始

tl.to(material.uniforms.uBlur, {
  value: 0,
  duration: 1.5,
  ease: 'power2.out'
}, 0); // 模糊同步減少

tl.to(material.uniforms.uRipple, {
  value: 1,
  duration: 1,
  ease: 'power1.inOut'
});

tl.to(container, {
  opacity: 0,
  duration: 1,
  onComplete: () => {
    visible = false;
    dispatch('done');
  }
});




    const animate = () => {
      if (visible) requestAnimationFrame(animate);
      renderer.clear(); 
      renderer.render(scene, camera);
    };
    animate();
  });
</script>

{#if visible}
  <div bind:this={container} class="fixed inset-0 z-50 bg-black transition-opacity duration-1000"></div>
{/if}



