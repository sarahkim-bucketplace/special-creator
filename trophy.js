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
  renderer.toneMappingExposure = 0.85;
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

  // procedural fine-grain noise, standing in for a real plaster surface scan since
  // no texture map shipped with the model — used as both a bump and roughness map
  // so the surface catches light unevenly instead of reading as flat/plastic
  function makeGrainTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = 200 + Math.floor(Math.random() * 55);
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(18, 18);
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
          color: 0xd9d2c4,
          roughness: 0.85,
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
