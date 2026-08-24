import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const container = document.getElementById('trophyViewer');
if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 5000);
  camera.position.set(0, 0.4, 4.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.65;
  container.appendChild(renderer.domElement);

  // soft studio-style reflections without needing an external HDRI file
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d8d8, 0.5));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(2, 3, 4);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xdbe8ff, 0.25);
  rimLight.position.set(-3, 1.5, -2.5);
  scene.add(rimLight);

  // procedural plaster-grain noise, standing in for a real surface scan since no
  // texture map shipped with the model — used as both a bump and roughness map.
  // Two octaves: soft low-frequency blotches (mottling, survives mip-mapping at
  // small on-screen sizes) plus fine per-pixel speckle on top, both with a wide
  // enough value range to actually show up — the original single-octave version
  // was too high-frequency (blurred away by mipmapping) and too narrow-range
  // (200-255 only), which together read as flat, textureless white.
  function makeGrainTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#b8b0a0';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 14 + Math.random() * 34;
      const v = 90 + Math.floor(Math.random() * 140);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(${v}, ${v}, ${v}, 0.55)`);
      grad.addColorStop(1, `rgba(${v}, ${v}, ${v}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const imageData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const jitter = Math.floor((Math.random() - 0.5) * 70);
      imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + jitter));
      imageData.data[i + 1] = imageData.data[i];
      imageData.data[i + 2] = imageData.data[i];
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    texture.colorSpace = THREE.NoColorSpace;
    return texture;
  }
  const grainTexture = makeGrainTexture();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.4;

  const loader = new OBJLoader();
  loader.load('assets/trophy.obj', (object) => {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          // sampled from a flat patch of assets/trophy.png (the reference render):
          // avg rgb(189, 184, 172), a warmer/darker taupe than the old off-white
          color: 0xbdb8ac,
          roughness: 0.62,
          roughnessMap: grainTexture,
          bumpMap: grainTexture,
          bumpScale: 0.015,
          metalness: 0,
          clearcoat: 0,
          envMapIntensity: 0.3,
        });
      }
    });

    // export is in arbitrary units; normalize + center so it fills the viewer consistently.
    // scale must be applied before deriving the position offset, since .position is a
    // parent-space translation that isn't itself affected by the object's own .scale.
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetScale = (2.2 / maxDim) * 0.8;
    object.scale.setScalar(targetScale);
    object.position.set(-center.x * targetScale, -center.y * targetScale, -center.z * targetScale);

    scene.add(object);
  }, undefined, (err) => {
    console.error('[trophy] failed to load assets/trophy.obj', err);
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
