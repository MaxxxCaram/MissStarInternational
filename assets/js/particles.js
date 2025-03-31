/**
 * Miss Star International - Particles System
 * Creates an interactive particle background effect
 */

class ParticlesSystem {
  constructor(selector = "#particles-js", options = {}) {
    // Canvas setup
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.warn(`Container ${selector} not found`);
      return;
    }

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);

    // Dimensions
    this.width = 0;
    this.height = 0;

    // Particles array
    this.particles = [];

    // Default options
    this.options = {
      particleCount: options.particleCount || 100,
      particleColor: options.particleColor || "#00e5ff",
      lineColor: options.lineColor || "#00e5ff",
      particleRadius: options.particleRadius || 3,
      lineWidth: options.lineWidth || 1,
      lineDistance: options.lineDistance || 150,
      speed: options.speed || 1,
      directionX: options.directionX || 0,
      directionY: options.directionY || 0,
      density: options.density || 10000,
      interactive:
        options.interactive !== undefined ? options.interactive : true,
    };

    // Mouse position
    this.mouse = {
      x: null,
      y: null,
      radius: (this.canvas.height / 2) * (this.canvas.width / 2),
    };

    // Initialize
    this.init();

    // Event listeners
    window.addEventListener("resize", () => this.resize());
    if (this.options.interactive) {
      this.container.addEventListener("mousemove", (e) =>
        this.handleMouseMove(e)
      );
      this.container.addEventListener("mouseout", () => this.handleMouseOut());
    }
  }

  /**
   * Initialize the particle system
   */
  init() {
    // Set canvas size
    this.resize();

    // Create particles
    this.createParticles();

    // Start animation
    this.animate();
  }

  /**
   * Create particles
   */
  createParticles() {
    this.particles = [];

    const numberOfParticles = (this.width * this.height) / this.options.density;
    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * this.options.particleRadius + 1;
      const x = Math.random() * (this.width - size * 2 - size * 2) + size * 2;
      const y = Math.random() * (this.height - size * 2 - size * 2) + size * 2;
      const directionX = Math.random() * 2 - 1;
      const directionY = Math.random() * 2 - 1;

      this.particles.push({
        x: x,
        y: y,
        size: size,
        baseX: x,
        baseY: y,
        density: Math.random() * 30 + 1,
        directionX: directionX,
        directionY: directionY,
      });
    }
  }

  /**
   * Handle window resize
   */
  resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Recalculate mouse radius
    this.mouse.radius = (this.canvas.height / 2) * (this.canvas.width / 2);

    // Recreate particles
    this.createParticles();
  }

  /**
   * Handle mouse movement
   */
  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
  }

  /**
   * Handle mouse out
   */
  handleMouseOut() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  /**
   * Draw a single particle
   */
  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fillStyle = this.options.particleColor;
    this.ctx.fill();
  }

  /**
   * Draw lines between particles
   */
  connect() {
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.options.lineDistance) {
          const opacity = 1 - distance / this.options.lineDistance;
          this.ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
          this.ctx.lineWidth = this.options.lineWidth;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
          this.ctx.stroke();
        }
      }
    }
  }

  /**
   * Update particle positions
   */
  update() {
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Mouse interaction
      if (this.options.interactive && this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.x -= Math.cos(angle) * force * particle.density;
          particle.y -= Math.sin(angle) * force * particle.density;
        }
      }

      // Return to base position
      if (particle.x !== particle.baseX) {
        const dx = particle.x - particle.baseX;
        particle.x -= dx / 10;
      }
      if (particle.y !== particle.baseY) {
        const dy = particle.y - particle.baseY;
        particle.y -= dy / 10;
      }

      // Move particles
      particle.x += particle.directionX * this.options.speed;
      particle.y += particle.directionY * this.options.speed;

      // Bounce off edges
      if (particle.x < particle.size) {
        particle.x = particle.size;
        particle.directionX *= -1;
      } else if (particle.x > this.width - particle.size) {
        particle.x = this.width - particle.size;
        particle.directionX *= -1;
      }

      if (particle.y < particle.size) {
        particle.y = particle.size;
        particle.directionY *= -1;
      } else if (particle.y > this.height - particle.size) {
        particle.y = this.height - particle.size;
        particle.directionY *= -1;
      }
    }
  }

  /**
   * Animation loop
   */
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update();
    this.connect();
    this.particles.forEach((particle) => this.drawParticle(particle));
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
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
});
