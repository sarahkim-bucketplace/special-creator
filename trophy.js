import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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

  // real photographed stone/plaster surface, processed into a seamless tile
  // (assets/trophy-3d-texture/trophy-texture-seamless.png). The .glb's own
  // material has no image baked in (just a flat white plaster color), so this
  // is applied manually — a color map plus a linear-colorspace clone driving
  // bump + roughness so the grain reads as physical relief.
  const textureLoader = new THREE.TextureLoader();
  const surfaceColorMap = textureLoader.load('assets/trophy-3d-texture/trophy-texture-seamless.png');
  surfaceColorMap.wrapS = THREE.RepeatWrapping;
  surfaceColorMap.wrapT = THREE.RepeatWrapping;
  // this .glb's UVs are normalized (u: 0-1, v: 0.14-1) — unlike the old .obj's
  // real-world-scale unwrap, so repeat is a plain tile count here. The v span
  // (0.858) is slightly narrower than u's (0.999), so an equal x/y repeat would
  // tile v ~14% denser and read as a stretch; scale y down to compensate.
  const uvSpanU = 0.99853515625;
  const uvSpanV = 0.8574801683425903;
  const tileCount = 2.5 / 0.9 / 0.8 / 0.6;
  surfaceColorMap.repeat.set(tileCount, tileCount * (uvSpanV / uvSpanU));
  surfaceColorMap.colorSpace = THREE.SRGBColorSpace;
  surfaceColorMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const surfaceReliefMap = surfaceColorMap.clone();
  surfaceReliefMap.needsUpdate = true;
  surfaceReliefMap.colorSpace = THREE.NoColorSpace;

  // proper tangent-space normal map, generated from the seamless texture's
  // own grayscale height (Sobel gradient -> encoded normal), rather than the
  // cheap single-channel bump approximation — gives more accurate per-pixel
  // lighting on the grain. Kept alongside bumpMap per request; wrap/repeat
  // mirrored from the color map so the two line up on the surface.
  const surfaceNormalMap = textureLoader.load('assets/trophy-3d-texture/trophy-texture-normal.png');
  surfaceNormalMap.wrapS = THREE.RepeatWrapping;
  surfaceNormalMap.wrapT = THREE.RepeatWrapping;
  surfaceNormalMap.repeat.copy(surfaceColorMap.repeat);
  surfaceNormalMap.colorSpace = THREE.NoColorSpace;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.4;

  const loader = new GLTFLoader();
  loader.load('assets/trophy.glb', (gltf) => {
    const object = gltf.scene;

    object.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          map: surfaceColorMap,
          color: 0xffffff,
          roughness: 0.68,
          roughnessMap: surfaceReliefMap,
          bumpMap: surfaceReliefMap,
          bumpScale: 0.01,
          normalMap: surfaceNormalMap,
          normalScale: new THREE.Vector2(0.6, 0.6),
          metalness: 0,
          clearcoat: 0,
          envMapIntensity: 0.3,
        });
      }
    });

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetScale = (2.2 / maxDim) * 0.8;
    object.scale.setScalar(targetScale);
    object.position.set(-center.x * targetScale, -center.y * targetScale, -center.z * targetScale);

    scene.add(object);
  }, undefined, (err) => {
    console.error('[trophy] failed to load assets/trophy.glb', err);
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
