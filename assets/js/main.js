/**
 * Main JavaScript for Miss Star International
 * Dependencies:
 * - Three.js: 3D elements
 * - Particles.js: Background effects
 * - VanillaTilt: Card tilt effects
 * - Web Audio API: Sound effects
 */

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  let audioContext;

  // Initialize AudioContext only after user interaction
  document.addEventListener("click", initAudio, { once: true });

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Check for required scripts
  const requiredScripts = ["THREE", "particlesJS", "VanillaTilt"];
  const missingScripts = requiredScripts.filter((script) => {
    return typeof window[script] === "undefined";
  });

  if (missingScripts.length > 0) {
    console.error("Missing scripts:", missingScripts);
    return;
  }

  // Initialize components
  try {
    initPortalLoader();
    initParticlesSystem();
    initHolographicEffects();
    initTiltCards();
    initScrollAnimations();
    initMobileMenu();
    initLanguageSelector();
    if (document.querySelector(".consortium-page")) {
      initConsortiumPage();
    }
    if (document.querySelector(".dynasty-portal")) {
      initDynastyPortal();
    }
  } catch (error) {
    console.error("Error initializing components:", error);
  }
});

// Portal Loader
function initPortalLoader() {
  const loader = document.querySelector(".portal-loader");
  const text = document.querySelector(".portal-text");
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

// Particles System
function initParticlesSystem() {
  const particlesContainer = document.getElementById("particles-js");
  if (!particlesContainer) return;

  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#00e5ff",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#00e5ff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  });
}

// Holographic Effects
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

// Tilt Cards
function initTiltCards() {
  const tiltElements = document.querySelectorAll(".tilt-card");

  tiltElements.forEach((element) => {
    VanillaTilt.init(element, {
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
    { threshold: 0.1 }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// Language Selector
function initLanguageSelector() {
  const selector = document.querySelector(".language-selector");
  if (!selector) return;

  const button = selector.querySelector(".lang-btn");
  const dropdown = selector.querySelector(".lang-dropdown");

  button?.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", !isExpanded);
    dropdown.style.display = isExpanded ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) {
      button?.setAttribute("aria-expanded", "false");
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

// Consortium Page
function initConsortiumPage() {
  // Initialize franchise cards
  const franchiseCards = document.querySelectorAll(".franchise-card");

  franchiseCards.forEach((card) => {
    // Initialize tilt effect
    VanillaTilt.init(card, {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
      scale: 1.02,
    });

    // Add click transition
    card.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");

      // Add transition effect
      document.body.style.opacity = "0";
      document.body.style.transition = "opacity 0.5s ease";

      // Navigate after transition
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });

  // Initialize scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  franchiseCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = "all 0.6s ease-out";
    observer.observe(card);
  });

  // Initialize CTA parallax
  const ctaSection = document.querySelector(".cta-section");
  if (ctaSection) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.15;
      ctaSection.style.backgroundPositionY = `${rate}px`;
    });
  }
}

// Dynasty Portal Initialization
function initDynastyPortal() {
  const featureCards = document.querySelectorAll(".feature-card");
  const accessCards = document.querySelectorAll(".access-card");
  const portalCta = document.querySelector(".portal-cta");

  // Initialize tilt effect on feature cards
  if (featureCards.length) {
    featureCards.forEach((card) => {
      VanillaTilt.init(card, {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
        scale: 1.05,
      });
    });
  }

  // Initialize parallax effect on access cards
  if (accessCards.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transform = "translateY(0)";
            entry.target.style.opacity = "1";
          }
        });
      },
      { threshold: 0.1 }
    );

    accessCards.forEach((card) => {
      card.style.transform = "translateY(50px)";
      card.style.opacity = "0";
      card.style.transition = "transform 0.6s ease, opacity 0.6s ease";
      observer.observe(card);
    });
  }

  // Initialize portal CTA parallax effect
  if (portalCta) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.15;
      portalCta.style.backgroundPositionY = `${rate}px`;
    });
  }

  // Initialize hover effects
  document.querySelectorAll(".access-icon").forEach((icon) => {
    icon.addEventListener("mouseover", function () {
      this.style.transform = "translateZ(30px) scale(1.1)";
    });

    icon.addEventListener("mouseout", function () {
      this.style.transform = "translateZ(20px)";
    });
  });
}
