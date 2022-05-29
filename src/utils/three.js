import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const colors = {
  floor: '#c68767',
  walls: '#ffffff',
  roof: '#684132',
  grave: '#b2b6b1',
  bush: '#89c854'
};

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
);
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
);

export const main = () => {
  const canvas = document.querySelector('canvas.webgl');

  //scene
  const scene = new THREE.Scene();

  //floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15),
    new THREE.MeshStandardMaterial({ color: colors.floor })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  //house
  const house = new THREE.Group();
  scene.add(house);

  //walls
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
      map: bricksColorTexture,
      aoMap: bricksAmbientOcclusionTexture,
      normalMap: bricksNormalTexture,
      roughnessMap: bricksRoughnessTexture
    })
  );
  walls.position.y = 1.25;
  walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
  );
  house.add(walls);

  //roof
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: colors.roof })
  );
  roof.rotation.y = Math.PI * 0.25;
  roof.position.y = 2.5 + 0.5;
  house.add(roof);

  //door
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      alphaMap: doorAlphaTexture,
      transparent: true,
      aoMap: doorAmbientOcclusionTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture
    })
  );
  door.position.y = 0.9;
  door.position.z = 2 + 0.01;
  door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
  );
  house.add(door);

  //bushes
  const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial({ color: colors.bush });

  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);

  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);

  house.add(bush1, bush2, bush3, bush4);

  //tree
  const tree = new THREE.Group();
  scene.add(tree);

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: colors.roof })
  );
  trunk.position.set(-4, 2, 0);
  tree.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1, 3, 10),
    new THREE.MeshStandardMaterial({ color: colors.bush })
  );
  leaves.position.set(-4, 4, 0);
  tree.add(leaves);

  //graves
  const graves = new THREE.Group();
  scene.add(graves);

  const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const graveMaterial = new THREE.MeshStandardMaterial({ color: colors.grave });

  for (let i = 0; i < 25; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);

    const angle = Math.random() * Math.PI * 2; // random angle in half rotation * full rotation
    const radius = 3 + Math.random() * 4; // random radius for min & max
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    grave.position.set(x, 0.2, z);
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    grave.castShadow = true;
    graves.add(grave);
  }

  //ghost
  const ghost = new THREE.PointLight('#f8f8ff', 2, 3);
  scene.add(ghost);

  //camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 7;
  camera.position.y = 2;
  camera.position.x = 2;
  scene.add(camera);

  //lights
  const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
  directionalLight.position.set(2, 4, -2);
  scene.add(directionalLight);
  const pointLight = new THREE.PointLight('#ff7d46', 1, 7);
  pointLight.position.set(0, 2, 2.5);
  house.add(pointLight);

  //fog
  const fog = new THREE.Fog('#262837', 1, 15);
  scene.fog = fog;

  //shadows
  floor.receiveShadow = true;
  directionalLight.castShadow = true;
  trunk.castShadow = true;
  leaves.castShadow = true;
  walls.castShadow = true;

  //renderer
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(fog.color, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.render(scene, camera);
  });

  const clock = new THREE.Clock();

  const animationLoop = () => {
    const elapsedTime = clock.getElapsedTime();

    ghost.position.x = Math.cos(elapsedTime * 0.3) * 4;
    ghost.position.z = Math.sin(elapsedTime * 0.3) * 4;
    ghost.position.y = Math.sin(elapsedTime);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animationLoop);
  };

  animationLoop();
};
