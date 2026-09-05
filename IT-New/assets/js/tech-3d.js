/**
 * SAVERON SOLUTIONS - 3D Tech Visualizer
 * Three.js Powered Interactive Quantum Core & Matrix Scene
 */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 7.5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Root Interactive Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // 1. Quantum Wireframe Outer Sphere
  const outerGeo = new THREE.IcosahedronGeometry(2.4, 2);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const outerSphere = new THREE.Mesh(outerGeo, outerMat);
  masterGroup.add(outerSphere);

  // 2. Inner Glowing Core (Tetrahedron Matrix)
  const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  masterGroup.add(coreMesh);

  // 3. Central Energy Nucleus
  const nucleusGeo = new THREE.SphereGeometry(0.5, 16, 16);
  const nucleusMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.85
  });
  const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
  masterGroup.add(nucleus);

  // 4. Orbital Cybernetic Rings
  function createOrbitalRing(radius, tubeRadius, color, rotX, rotY) {
    const ringGeo = new THREE.TorusGeometry(radius, tubeRadius, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.45
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = rotX;
    ring.rotation.y = rotY;
    return ring;
  }

  const ring1 = createOrbitalRing(3.2, 0.015, 0x00f0ff, Math.PI / 3, 0);
  const ring2 = createOrbitalRing(3.6, 0.012, 0x6366f1, -Math.PI / 4, Math.PI / 6);
  const ring3 = createOrbitalRing(4.0, 0.01, 0xa855f7, Math.PI / 6, -Math.PI / 3);
  masterGroup.add(ring1);
  masterGroup.add(ring2);
  masterGroup.add(ring3);

  // 5. Constellation & Floating Particle Cloud
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleScales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const r = 3.5 + Math.random() * 5.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePositions[i3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i3 + 2] = r * Math.cos(phi);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.055,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  masterGroup.add(particles);

  // Subtle Ambient Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  // Mouse / Pointer Parallax Tracking
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Handle Resize
  function onResize() {
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onResize);

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia interpolation for mouse parallax
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    // Rotations
    masterGroup.rotation.y = elapsedTime * 0.15 + currentMouseX * 0.4;
    masterGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.15 - currentMouseY * 0.3;

    outerSphere.rotation.y = -elapsedTime * 0.08;
    outerSphere.rotation.x = elapsedTime * 0.05;

    coreMesh.rotation.x = -elapsedTime * 0.25;
    coreMesh.rotation.z = elapsedTime * 0.2;

    const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
    nucleus.scale.set(pulse, pulse, pulse);

    ring1.rotation.z = elapsedTime * 0.2;
    ring2.rotation.z = -elapsedTime * 0.15;
    ring3.rotation.z = elapsedTime * 0.1;

    particles.rotation.y = elapsedTime * 0.03;

    renderer.render(scene, camera);
  }

  animate();
})();
