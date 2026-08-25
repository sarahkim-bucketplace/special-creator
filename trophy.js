import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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

  // even less ambient fill than before — the softer grain texture no longer
  // needs as much fill light to read, so the room to push contrast on the
  // carved engraving (which is real geometry, not the texture) is bigger
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d8d8, 0.25));

  // the engraved face doesn't rotate (autoRotate spins the camera, not the
  // object), so a light angled to graze *that* face stays raking no matter
  // where the camera orbits to. Low Z (near the face plane) + off to the
  // side is what actually carves out shadow in shallow relief — a light
  // near the camera/view direction (the old (2,3,4)) barely shows any.
  // pushed brighter (was 1.1) so the lettering's shadow reads more strongly
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(4, 1.4, 1.0);
  scene.add(keyLight);

  // second raking light from the other side, dimmer, so the engraving
  // still reads even from angles where the key light alone underlights it
  const embossLight = new THREE.DirectionalLight(0xffffff, 0.55);
  embossLight.position.set(-3, 0.8, 1.2);
  scene.add(embossLight);

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

  // resting 3/4 view (was a nonstop auto-spin, which read as distracting) —
  // holds a 45° azimuth by default and drifts gently toward the cursor's
  // position on the page instead, spherical coords around the origin (the
  // object is re-centered on load below) preserving the original framing's
  // distance and elevation
  const radius = Math.hypot(0, 0.4, 4.2);
  const baseTheta = -Math.PI / 4;
  const basePhi = Math.acos(0.4 / radius);
  const maxThetaSwing = THREE.MathUtils.degToRad(20);
  const maxPhiSwing = THREE.MathUtils.degToRad(10);

  let targetTheta = baseTheta;
  let targetPhi = basePhi;
  let theta = baseTheta;
  let phi = basePhi;

  window.addEventListener('pointermove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetTheta = baseTheta + THREE.MathUtils.clamp(nx, -1, 1) * maxThetaSwing;
    targetPhi = basePhi - THREE.MathUtils.clamp(ny, -1, 1) * maxPhiSwing;
  });

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
          bumpScale: 0.005,
          normalMap: surfaceNormalMap,
          normalScale: new THREE.Vector2(0.3, 0.3),
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

    // ease toward the cursor-driven target each frame instead of snapping,
    // so the motion reads as a gentle drift rather than a jump
    theta += (targetTheta - theta) * 0.06;
    phi += (targetPhi - phi) * 0.06;

    const sinPhiRadius = radius * Math.sin(phi);
    camera.position.set(
      sinPhiRadius * Math.sin(theta),
      radius * Math.cos(phi),
      sinPhiRadius * Math.cos(theta)
    );
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
