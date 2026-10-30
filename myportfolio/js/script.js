import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const container = document.querySelector('#three-container');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 5.4;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.25, 2);
  const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0x8bffce, wireframe: true, transparent: true, opacity: 0.72
  }));
  group.add(wire);

  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.92, 1),
    new THREE.MeshBasicMaterial({ color: 0xa995ff, wireframe: true, transparent: true, opacity: 0.28 })
  );
  group.add(inner);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xa995ff, wireframe: true, transparent: true, opacity: 0.65 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.68, 0.006, 8, 150), ringMaterial);
  ring.rotation.x = 1.1;
  ring.rotation.y = 0.35;
  group.add(ring);

  const particleCount = 260;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 1.7 + Math.random() * 1.05;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
    color: 0xb7c7ff, size: 0.018, transparent: true, opacity: 0.7
  }));
  group.add(particles);

  let pointerX = 0;
  let pointerY = 0;
  let visible = true;
  const resize = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.45;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.35;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    const t = clock.getElapsedTime();
    if (!reducedMotion) {
      group.rotation.y = t * 0.12 + pointerX;
      group.rotation.x = Math.sin(t * 0.18) * 0.12 + pointerY;
      inner.rotation.y = -t * 0.16;
      inner.rotation.x = t * 0.1;
      ring.rotation.z = Math.sin(t * 0.2) * 0.08;
      particles.rotation.y = -t * 0.025;
    }
    renderer.render(scene, camera);
  }
  animate();
}

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Active navigation link
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}

// Subtle scroll reveals with GSAP when available; content remains visible without it.
window.addEventListener('load', () => {
  document.querySelector('#year').textContent = new Date().getFullYear();
  if (!reducedMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.section-heading, .about-content, .skill-card, .project-card, .timeline-item').forEach((element) => {
      gsap.fromTo(element, { y: 22, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.75, ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true }
      });
    });
  }
});
