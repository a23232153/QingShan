<script lang="ts">
  //@ts-nocheck
  import { onMount } from "svelte";
  import * as THREE from "three";
  import Stats from "three/examples/jsm/libs/stats.module.js";
  import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
  import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";const loader = new FontLoader();

  let container: HTMLDivElement;

   // === 自訂 Modifier ===
    class ExplodeModifier {
      modify(geometry) {
        const vertices = [];
        for (let i = 0; i < geometry.faces.length; i++) {
          const n = vertices.length;
          const face = geometry.faces[i];
          const va = geometry.vertices[face.a];
          const vb = geometry.vertices[face.b];
          const vc = geometry.vertices[face.c];
          vertices.push(va.clone(), vb.clone(), vc.clone());
          face.a = n;
          face.b = n + 1;
          face.c = n + 2;
        }
        geometry.vertices = vertices;
      }
    }

    class TessellateModifier {
      constructor(maxEdgeLength) {
        this.maxEdgeLength = maxEdgeLength;
      }

      modify(geometry) {
        const faces = [];
        for (let i = 0, il = geometry.faces.length; i < il; i++) {
          const face = geometry.faces[i];
          if (face instanceof THREE.Face3) {
            const a = face.a;
            const b = face.b;
            const c = face.c;
            const va = geometry.vertices[a];
            const vb = geometry.vertices[b];
            const vc = geometry.vertices[c];

            const dab = va.distanceTo(vb);
            const dbc = vb.distanceTo(vc);
            const dac = va.distanceTo(vc);

            if (dab > this.maxEdgeLength || dbc > this.maxEdgeLength || dac > this.maxEdgeLength) {
              const m = geometry.vertices.length;
              const vmid = new THREE.Vector3();

              if (dab >= dbc && dab >= dac) {
                vmid.addVectors(va, vb).multiplyScalar(0.5);
                geometry.vertices.push(vmid);
                faces.push(new THREE.Face3(a, m, c));
                faces.push(new THREE.Face3(m, b, c));
              } else if (dbc >= dab && dbc >= dac) {
                vmid.addVectors(vb, vc).multiplyScalar(0.5);
                geometry.vertices.push(vmid);
                faces.push(new THREE.Face3(a, b, m));
                faces.push(new THREE.Face3(m, c, a));
              } else {
                vmid.addVectors(va, vc).multiplyScalar(0.5);
                geometry.vertices.push(vmid);
                faces.push(new THREE.Face3(a, b, m));
                faces.push(new THREE.Face3(m, b, c));
              }
            } else {
              faces.push(face);
            }
          }
        }
        geometry.faces = faces;
        geometry.computeFaceNormals();
      }
    }

  onMount(async () => {
    

    // === Shader ===
    const vertexShader = `
      uniform float time;
      attribute vec3 customColor;
      attribute vec3 displacement;
      varying vec3 vNormal;
      varying vec3 vColor;

      float quadraticEaseInOut(float k) {
        if ((k *= 2.0) < 1.0) return 0.5 * k * k;
        return -0.5 * (--k * (k - 2.0) - 1.0);
      }

      void main() {
        vNormal = normal;
        vColor = customColor;
        vec3 newPosition = position + normal * time * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vColor;
      void main() {
        const float ambient = 0.005;
        vec3 light = normalize(vec3(1.0));
        float directional = max(dot(vNormal, light), 0.0);
        gl_FragColor = vec4((directional + ambient) * vColor, 1.0);
        gl_FragColor.xyz = sqrt(gl_FragColor.xyz);
      }
    `;

   

    // === three.js 場景初始化 ===
    let camera, scene, renderer, stats, uniforms;

    const init = (font) => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      camera.position.set(0, 100, 500);
      camera.lookAt(scene.position);

      // light
      const sunLight = new THREE.DirectionalLight(0xffeedd, 1);
      sunLight.position.set(0.3, -1, -1).normalize();
      scene.add(sunLight);
      const pointLight = new THREE.PointLight(0xffffff, 1.5);
      pointLight.position.set(-500, 1000, 500);
      scene.add(pointLight);

      scene.add(new THREE.AmbientLight(0x404040));

      const myText = "FANCYPANTS";
      uniforms = { time: { value: 0.0 } };

       // ✅ 建立 TextGeometry
    console.log("TextGeometry import:", TextGeometry);
    
    const textGeometry = new TextGeometry("HELLO", {
      font: font,
      size: 80,
      height: 20,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1.5,
      bevelSegments: 5,
    });

      textGeometry.center();
      const tessellateModifier = new TessellateModifier(4);
      for (let i = 0; i < 6; i++) tessellateModifier.modify(textGeometry);

      const explodeModifier = new ExplodeModifier();
      explodeModifier.modify(textGeometry);

      const numFaces = textGeometry.faces.length;
      const bb = textGeometry.boundingBox;
      const colors = new Float32Array(numFaces * 3 * 3);
      const displacement = new Float32Array(numFaces * 3 * 3);
      const color = new THREE.Color();

      for (let f = 0; f < numFaces; f++) {
        const index = 9 * f;
        const h = 0.2 * Math.random();
        const s = 0.5 + 0.5 * Math.random();
        const l = 0.5 + 0.5 * Math.random();
        color.setHSL(h, s, l);

        const x = Math.random() * (bb.max.x - bb.min.x);
        const y = Math.random() * (bb.max.y - bb.min.y) * 4;
        const z = Math.random() * (bb.max.z - bb.min.z) * 10;

        for (let i = 0; i < 3; i++) {
          colors[index + 3 * i] = color.r;
          colors[index + 3 * i + 1] = color.g;
          colors[index + 3 * i + 2] = color.b;
          displacement[index + 3 * i] = x;
          displacement[index + 3 * i + 1] = y;
          displacement[index + 3 * i + 2] = z;
        }
      }

      const bufferGeo = textGeometry.toNonIndexed(); 

      bufferGeo.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
      bufferGeo.setAttribute(
        "displacement",
        new THREE.BufferAttribute(displacement, 3)
      );

      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader
      });

      const mesh = new THREE.Mesh(bufferGeo, shaderMaterial);
      scene.add(mesh);

      // renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // stats
      stats = new Stats();
      stats.dom.style.position = "absolute";
      stats.dom.style.left = "0px";
      stats.dom.style.top = "0px";
      container.appendChild(stats.dom);

      window.addEventListener("resize", onWindowResize, false);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const render = () => {
      requestAnimationFrame(render);
      uniforms.time.value = 1.0 + Math.sin(Date.now() * 0.001 * 0.5);
      renderer.render(scene, camera);
      stats.update();
    };

    // 載入字體 → init → render
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        init(font);
        render();
      }
    );
  });
</script>

<div bind:this={container} class="w-full h-full bg-black"></div>

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
