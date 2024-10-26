import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TWEEN from '@tweenjs/tween.js';

// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const initialFOV = 30;
const camera = new THREE.PerspectiveCamera(initialFOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.fov = initialFOV;
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.minDistance = 5;
controls.maxDistance = 100;

// Pause and resume rotation when user interacts
let isPaused = false;
controls.addEventListener('start', () => { isPaused = true; });
controls.addEventListener('end', () => { isPaused = false; });

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Define planets with distances, random initial angles, colors, and unique pages
const planets = [
    { radius: 0.3, distance: 4, color: 0xaaaaaa, speed: 0.001, moons: 1, page: "planet1.html" },
    { radius: 0.3, distance: 5, color: 0xffcc99, speed: 0.0012, moons: 1, page: "planet2.html" },
    { radius: 0.4, distance: 6, color: 0x3399ff, speed: 0.0015, moons: 2, page: "planet3.html" },
    { radius: 0.3, distance: 7.5, color: 0xff5733, speed: 0.0011, moons: 1, page: "planet4.html" },
    { radius: 0.7, distance: 9, color: 0xd2691e, speed: 0.0009, moons: 1, page: "planet5.html" },
    { radius: 0.6, distance: 10.5, color: 0xffcc33, speed: 0.0013, moons: 2, page: "planet6.html" },
    { radius: 0.6, distance: 12, color: 0x66b3ff, speed: 0.0014, moons: 1, page: "planet7.html" },
    { radius: 0.5, distance: 13.5, color: 0x0000ff, speed: 0.001, moons: 1, page: "planet8.html" }
];

// Position planets with varied initial angles and add moons
const planetMeshes = planets.map((planet) => {
    planet.angle = Math.random() * Math.PI * 2;
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
        planet.distance * Math.cos(planet.angle),
        0,
        planet.distance * Math.sin(planet.angle)
    );
    scene.add(mesh);

    // Add moons orbiting around the planet
    const moons = [];
    const moonBaseSpeed = 0.005;
    for (let i = 0; i < planet.moons; i++) {
        const moonGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(planet.radius + 0.5 + i * 0.2, 0, 0);
        mesh.add(moon);
        moons.push({ mesh: moon, distance: planet.radius + 0.5 + i * 0.3, angle: i * Math.PI / 2, speed: moonBaseSpeed + i * 0.002 });
    }

    return { mesh, ...planet, moons };
});

// Initial camera position
camera.position.set(0, 20, 40);
camera.lookAt(scene.position);

// Raycaster and mouse for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Click event for navigating to each planet's unique page
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetMeshes.map(p => p.mesh));

    if (intersects.length > 0) {
        const clickedPlanet = planetMeshes.find(p => p.mesh === intersects[0].object);
        if (clickedPlanet) {
            window.open(clickedPlanet.page, '_blank');
        }
    }
});

// Animation loop for sun, planets, and moons
function animate() {
    if (!isPaused) {
        planetMeshes.forEach((planet) => {
            planet.angle += planet.speed;
            planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
            planet.mesh.position.z = planet.distance * Math.sin(planet.angle);

            // Rotate each moon around its planet
            planet.moons.forEach((moon) => {
                moon.angle += moon.speed;
                moon.mesh.position.x = moon.distance * Math.cos(moon.angle);
                moon.mesh.position.z = moon.distance * Math.sin(moon.angle);
            });
        });
    }

    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Start animation
animate();

