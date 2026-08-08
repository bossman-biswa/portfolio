import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

// --- 4D Tesseract geometry (precomputed, never allocated at runtime) ---
// 16 vertices of a 4D hypercube at unit scale
const VERTS_4D = [
  [-1,-1,-1,-1],[-1,-1,-1, 1],[-1,-1, 1,-1],[-1,-1, 1, 1],
  [-1, 1,-1,-1],[-1, 1,-1, 1],[-1, 1, 1,-1],[-1, 1, 1, 1],
  [ 1,-1,-1,-1],[ 1,-1,-1, 1],[ 1,-1, 1,-1],[ 1,-1, 1, 1],
  [ 1, 1,-1,-1],[ 1, 1,-1, 1],[ 1, 1, 1,-1],[ 1, 1, 1, 1],
];

// 32 edges of a tesseract: connect vertices that differ in exactly one coordinate
const EDGES_4D = [];
for (let a = 0; a < 16; a++) {
  for (let b = a + 1; b < 16; b++) {
    let diff = 0;
    for (let d = 0; d < 4; d++) {
      if (VERTS_4D[a][d] !== VERTS_4D[b][d]) diff++;
    }
    if (diff === 1) EDGES_4D.push([a, b]);
  }
}

// Reusable 4D vector for rotation (avoids allocation)
const _v4 = [0, 0, 0, 0];
const _projected = [0, 0, 0];

function rotate4D(x, y, z, w, angles) {
  // angles: [xy, xz, xw, yz, yw, zw]
  let a = x, b = y, c = z, d = w;
  let cos, sin, tmp;

  // XY rotation
  cos = Math.cos(angles[0]); sin = Math.sin(angles[0]);
  tmp = a * cos - b * sin; b = a * sin + b * cos; a = tmp;

  // XZ rotation
  cos = Math.cos(angles[1]); sin = Math.sin(angles[1]);
  tmp = a * cos - c * sin; c = a * sin + c * cos; a = tmp;

  // XW rotation
  cos = Math.cos(angles[2]); sin = Math.sin(angles[2]);
  tmp = a * cos - d * sin; d = a * sin + d * cos; a = tmp;

  // YZ rotation
  cos = Math.cos(angles[3]); sin = Math.sin(angles[3]);
  tmp = b * cos - c * sin; c = b * sin + c * cos; b = tmp;

  // YW rotation
  cos = Math.cos(angles[4]); sin = Math.sin(angles[4]);
  tmp = b * cos - d * sin; d = b * sin + d * cos; b = tmp;

  // ZW rotation
  cos = Math.cos(angles[5]); sin = Math.sin(angles[5]);
  tmp = c * cos - d * sin; d = c * sin + d * cos; c = tmp;

  _v4[0] = a; _v4[1] = b; _v4[2] = c; _v4[3] = d;
}

function project4Dto3D(x4, y4, z4, w4, perspDist) {
  const denom = perspDist - w4;
  const scale = denom > 0.01 ? perspDist / denom : perspDist / 0.01;
  _projected[0] = x4 * scale;
  _projected[1] = y4 * scale;
  _projected[2] = z4 * scale;
  return scale; // return for depth-based sizing
}

const ParticleSwarm = ({ isMobile = false }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const pointsRef = useRef(null);
  const frameIdRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const timeRef = useRef(0);
  const opacityRef = useRef(1);

  const PARTICLE_COUNT = isMobile ? 8000 : 25000;
  const SCALE = isMobile ? 100 : 160;

  const handlePointerMove = useCallback((e) => {
    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseRef.current.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      1,
      2000
    );
    camera.position.z = 400;
    cameraRef.current = camera;

    // --- Geometry ---
    const count = PARTICLE_COUNT;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // --- Custom shader material for round, glowing particles ---
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uGlobalOpacity: { value: 1.0 },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 12.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uGlobalOpacity;
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.15, 0.5, dist);
          alpha *= uGlobalOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    // --- Clock ---
    const timer = new THREE.Timer();

    // --- Precomputed rotation angles array (reused every frame) ---
    const angles = [0, 0, 0, 0, 0, 0];

    // --- Reusable color object for HSL conversion ---
    const tmpColor = new THREE.Color();

    // --- Scroll opacity ---
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      if (scrollY < vh * 0.3) {
        opacityRef.current = 1;
      } else if (scrollY < vh * 0.9) {
        opacityRef.current = 1 - (scrollY - vh * 0.3) / (vh * 0.6);
      } else {
        opacityRef.current = 0;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Resize ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation loop ---
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      timer.update();
      const dt = timer.getDelta();
      timeRef.current += dt;
      const t = timeRef.current;

      // Skip rendering if fully invisible
      if (opacityRef.current <= 0.001) return;

      material.uniforms.uGlobalOpacity.value = opacityRef.current;

      const posAttr = geometry.attributes.position;
      const colAttr = geometry.attributes.color;
      const sizeAttr = geometry.attributes.size;
      const posArr = posAttr.array;
      const colArr = colAttr.array;
      const sizeArr = sizeAttr.array;

      // 4D rotation angles evolving over time — "breathing" tesseract
      const breathe = Math.sin(t * 0.3) * 0.15;
      angles[0] = t * 0.17 + breathe;             // XY
      angles[1] = t * 0.13 + breathe * 0.7;       // XZ
      angles[2] = t * 0.23;                        // XW — primary 4D rotation
      angles[3] = t * 0.11 + breathe * 0.5;       // YZ
      angles[4] = t * 0.19;                        // YW
      angles[5] = t * 0.07 + breathe * 0.3;       // ZW

      const perspDist = 3.0 + Math.sin(t * 0.2) * 0.3; // 4D perspective distance
      const edgeCount = EDGES_4D.length; // 32
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mActive = mouseRef.current.active;
      const sc = SCALE;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Distribute particles: ~60% on edges, ~25% on faces, ~15% ambient cloud
        const norm = i / count;

        let px, py, pz;

        if (norm < 0.6) {
          // --- Edge particles ---
          const edgeRegion = norm / 0.6;
          const edgeIdx = (edgeRegion * edgeCount) | 0;
          const edge = EDGES_4D[edgeIdx % edgeCount];
          const vA = VERTS_4D[edge[0]];
          const vB = VERTS_4D[edge[1]];

          // Parametric position along edge with slight jitter
          const edgeFrac = edgeRegion * edgeCount - edgeIdx;
          const jitter = Math.sin(i * 7.31 + t * 0.5) * 0.08;
          const lerp = edgeFrac + jitter;

          const x4 = vA[0] + (vB[0] - vA[0]) * lerp;
          const y4 = vA[1] + (vB[1] - vA[1]) * lerp;
          const z4 = vA[2] + (vB[2] - vA[2]) * lerp;
          const w4 = vA[3] + (vB[3] - vA[3]) * lerp;

          rotate4D(x4, y4, z4, w4, angles);
          project4Dto3D(_v4[0], _v4[1], _v4[2], _v4[3], perspDist);

          px = _projected[0] * sc;
          py = _projected[1] * sc;
          pz = _projected[2] * sc;

          // Depth-based glow
          const depthScale = project4Dto3D(_v4[0], _v4[1], _v4[2], _v4[3], perspDist);
          const hue = 0.52 + edgeIdx * 0.008 + Math.sin(t * 0.4 + edgeIdx) * 0.06;
          const sat = 0.7 + Math.sin(t * 0.3 + i * 0.001) * 0.2;
          const lum = 0.45 + depthScale * 0.05 + Math.sin(t + i * 0.01) * 0.08;
          tmpColor.setHSL(hue % 1, Math.min(sat, 1), Math.min(Math.max(lum, 0.2), 0.75));
          colArr[i3] = tmpColor.r;
          colArr[i3 + 1] = tmpColor.g;
          colArr[i3 + 2] = tmpColor.b;

          sizeArr[i] = 2.0 + depthScale * 0.6;

        } else if (norm < 0.85) {
          // --- Face / surface particles ---
          const faceNorm = (norm - 0.6) / 0.25;
          const faceIdx = (faceNorm * 24) | 0; // 24 faces on a tesseract
          const seed1 = Math.sin(i * 3.17) * 0.5 + 0.5;
          const seed2 = Math.cos(i * 5.73) * 0.5 + 0.5;

          // Pick 3 vertices forming part of a face
          const eA = EDGES_4D[faceIdx % edgeCount];
          const eB = EDGES_4D[(faceIdx + 8) % edgeCount];
          const vA = VERTS_4D[eA[0]];
          const vB = VERTS_4D[eA[1]];
          const vC = VERTS_4D[eB[0]];

          const u = seed1;
          const v = seed2 * (1 - u);
          const w = 1 - u - v;

          const x4 = vA[0] * u + vB[0] * v + vC[0] * w;
          const y4 = vA[1] * u + vB[1] * v + vC[1] * w;
          const z4 = vA[2] * u + vB[2] * v + vC[2] * w;
          const w4 = vA[3] * u + vB[3] * v + vC[3] * w;

          rotate4D(x4, y4, z4, w4, angles);
          const ds = project4Dto3D(_v4[0], _v4[1], _v4[2], _v4[3], perspDist);

          px = _projected[0] * sc;
          py = _projected[1] * sc;
          pz = _projected[2] * sc;

          const hue = 0.58 + faceIdx * 0.012 + Math.sin(t * 0.5) * 0.05;
          const sat = 0.5 + Math.sin(t * 0.2 + i * 0.002) * 0.15;
          const lum = 0.35 + ds * 0.04;
          tmpColor.setHSL(hue % 1, Math.min(sat, 1), Math.min(Math.max(lum, 0.15), 0.6));
          colArr[i3] = tmpColor.r;
          colArr[i3 + 1] = tmpColor.g;
          colArr[i3 + 2] = tmpColor.b;

          sizeArr[i] = 1.2 + ds * 0.3;

        } else {
          // --- Ambient cloud particles ---
          const cloudNorm = (norm - 0.85) / 0.15;
          const phi = i * 2.399963 + t * 0.05; // golden angle spiral
          const cosTheta = 1 - 2 * cloudNorm;
          const sinTheta = Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta));
          const radius = 1.6 + Math.sin(i * 0.37 + t * 0.3) * 0.4;

          const x4 = radius * sinTheta * Math.cos(phi);
          const y4 = radius * sinTheta * Math.sin(phi);
          const z4 = radius * cosTheta;
          const w4 = Math.sin(i * 1.73 + t * 0.15) * 0.8;

          rotate4D(x4, y4, z4, w4, angles);
          const ds = project4Dto3D(_v4[0], _v4[1], _v4[2], _v4[3], perspDist);

          px = _projected[0] * sc * 0.9;
          py = _projected[1] * sc * 0.9;
          pz = _projected[2] * sc * 0.9;

          const hue = 0.65 + Math.sin(t * 0.15 + i * 0.005) * 0.1;
          const lum = 0.2 + Math.sin(t * 0.5 + i * 0.003) * 0.08;
          tmpColor.setHSL(hue % 1, 0.4, Math.min(Math.max(lum, 0.1), 0.4));
          colArr[i3] = tmpColor.r;
          colArr[i3 + 1] = tmpColor.g;
          colArr[i3 + 2] = tmpColor.b;

          sizeArr[i] = 0.8 + ds * 0.15;
        }

        // --- Cursor gravitational influence ---
        if (mActive) {
          const screenX = px;
          const screenY = py;
          const cursorWorldX = mx * 250;
          const cursorWorldY = my * 250;
          const dx = cursorWorldX - screenX;
          const dy = cursorWorldY - screenY;
          const distSq = dx * dx + dy * dy + 1;
          const pullStrength = 12000 / (distSq + 2000);
          px += dx * pullStrength * 0.04;
          py += dy * pullStrength * 0.04;

          // Brighten particles near cursor
          if (distSq < 15000) {
            const glow = 1 - distSq / 15000;
            colArr[i3] = Math.min(colArr[i3] + glow * 0.3, 1);
            colArr[i3 + 1] = Math.min(colArr[i3 + 1] + glow * 0.25, 1);
            colArr[i3 + 2] = Math.min(colArr[i3 + 2] + glow * 0.2, 1);
            sizeArr[i] += glow * 1.5;
          }
        }

        posArr[i3] = px;
        posArr[i3 + 1] = py;
        posArr[i3 + 2] = pz;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;

      // Slow global rotation for added depth
      points.rotation.y = Math.sin(t * 0.05) * 0.1;
      points.rotation.x = Math.cos(t * 0.04) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // --- Pointer listeners ---
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [PARTICLE_COUNT, SCALE, handlePointerMove, handlePointerLeave]);

  return (
    <div
      ref={mountRef}
      className="particle-canvas"
      aria-hidden="true"
    />
  );
};

export default React.memo(ParticleSwarm);
