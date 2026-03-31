/* =============================================
   PIERRE BOURGEOIS PORTFOLIO — script.js
   ============================================= */

// ── Navbar scroll effect ──────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNavLink();
});

// ── Mobile nav toggle ─────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Active nav link on scroll ─────────────────
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
    if (!link) return;
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
  });
}

// ── Scroll-reveal: timeline items ────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));

// ── Particle canvas (hero) ────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let width, height;

function resize() {
  width  = canvas.width  = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

const PARTICLE_COLORS = [
  '124,111,255',   // purple
  '0,255,204',     // teal
  '255,107,157',   // pink
  '255,169,77',    // orange
  '0,180,255',     // cyan
];

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x     = Math.random() * width;
    this.y     = initial ? Math.random() * height : height + 10;
    this.size  = Math.random() * 2.2 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = -(Math.random() * 0.65 + 0.2);
    this.alpha  = Math.random() * 0.65 + 0.1;
    this.color  = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -10) this.reset();
  }

  draw() {
    // glow halo
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
    grd.addColorStop(0,   `rgba(${this.color},${this.alpha})`);
    grd.addColorStop(0.4, `rgba(${this.color},${this.alpha * 0.3})`);
    grd.addColorStop(1,   `rgba(${this.color},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    // core dot
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${Math.min(this.alpha * 2, 1)})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.floor((width * height) / 6000);  // denser particle field
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize();
initParticles();
animateParticles();

// ── Smooth scroll for anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
