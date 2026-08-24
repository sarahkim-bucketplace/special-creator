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

  // real photographed plaster/fiber-paper surface (assets/trophy_texture.png),
  // tiled across the model. Loaded once as the color map; a linear-colorspace
  // clone of the same image drives bump + roughness so its fiber/speckle detail
  // reads as physical relief instead of just a flat printed pattern.
  const textureLoader = new THREE.TextureLoader();
  const surfaceColorMap = textureLoader.load('assets/trophy_texture.png');
  surfaceColorMap.wrapS = THREE.RepeatWrapping;
  surfaceColorMap.wrapT = THREE.RepeatWrapping;
  surfaceColorMap.repeat.set(3, 3);
  surfaceColorMap.colorSpace = THREE.SRGBColorSpace;
  surfaceColorMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const surfaceReliefMap = surfaceColorMap.clone();
  surfaceReliefMap.needsUpdate = true;
  surfaceReliefMap.colorSpace = THREE.NoColorSpace;

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
          map: surfaceColorMap,
          color: 0xffffff,
          roughness: 0.68,
          roughnessMap: surfaceReliefMap,
          bumpMap: surfaceReliefMap,
          bumpScale: 0.01,
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
