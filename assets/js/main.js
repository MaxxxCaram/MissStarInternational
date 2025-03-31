/**
 * Main JavaScript for Miss Star International
 * Dependencies:
 * - Three.js: 3D elements
 * - GSAP: Fluid animations
 * - WebGL: Visual effects
 * - Intersection Observer: Scroll animations
 * - Web Audio API: Sound effects
 */

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  let audioContext;

  // Inicializar AudioContext solo después de interacción del usuario
  document.addEventListener("click", initAudio, { once: true });

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // Aquí puedes agregar tu lógica de audio
    }
  }

  // Verificar recursos críticos
  const requiredScripts = ["THREE", "gsap", "particlesJS", "VanillaTilt"];

  // Verificar si faltan scripts
  const missingScripts = requiredScripts.filter((script) => {
    return typeof window[script] === "undefined";
  });

  if (missingScripts.length > 0) {
    console.error("Scripts faltantes:", missingScripts);
    return;
  }

  // Inicializar componentes
  try {
    initPortalLoader();
    initParticlesSystem();
    initHolographicEffects();
    initTiltCards();
    initScrollAnimations();
    initMobileMenu();
    initLanguageSelector();
  } catch (error) {
    console.error("Error inicializando componentes:", error);
  }
});

// Inicializar Portal Loader
function initPortalLoader() {
  const loader = document.getElementById("portal-loader");
  const text = document.getElementById("portal-text");
  if (!loader || !text) return;

  const loadingTexts = [
    "INITIALIZING PORTAL",
    "ESTABLISHING CONNECTION",
    "ACCESSING MAINFRAME",
    "LOADING ASSETS",
    "PORTAL READY",
  ];

  let currentTextIndex = 0;
  const textInterval = setInterval(() => {
    text.textContent = loadingTexts[currentTextIndex];
    currentTextIndex++;

    if (currentTextIndex >= loadingTexts.length) {
      clearInterval(textInterval);
      setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 500);
      }, 1000);
    }
  }, 1000);
}

// Inicializar Sistema de Partículas
function initParticlesSystem() {
  const particlesContainer = document.getElementById("particles-js");
  if (!particlesContainer) return;

  const particles = new ParticlesSystem("#particles-js", {
    particleCount: 80,
    particleColor: "#00e5ff",
    lineColor: "#00e5ff",
    particleRadius: 3,
    lineWidth: 1,
    lineDistance: 150,
    speed: 1,
    density: 10000,
    interactive: true,
  });
}

// Inicializar Efectos Holográficos
function initHolographicEffects() {
  const holographicElements = document.querySelectorAll(".holographic");

  holographicElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      const rotateX = (y - 0.5) * 20;
      const rotateY = (x - 0.5) * 20;

      element.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.05, 1.05, 1.05)
      `;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "none";
    });
  });
}

// Inicializar Tilt en Cards
function initTiltCards() {
  const tiltElements = document.querySelectorAll(".tilt-card");

  tiltElements.forEach((element) => {
    new VanillaTilt(element, {
      max: 25,
      speed: 400,
      glare: true,
      "max-glare": 0.5,
    });
  });
}

// Scroll Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// Language Selector
function initLanguageSelector() {
  const selector = document.querySelector(".language-selector");
  const current = selector.querySelector(".current-lang");
  const dropdown = selector.querySelector(".languages-dropdown");

  current.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

// Mobile Menu
function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });
}
