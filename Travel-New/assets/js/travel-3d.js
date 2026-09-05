/**
 * SAVERON TRAVEL & TOURISM - Serene Waterfall Mist & Floating Leaf Breeze Canvas
 */
(function () {
  'use strict';

  const canvas = document.getElementById('nature-mist-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class NatureParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height * 0.5;
      this.size = Math.random() * 3.5 + 1.5;
      this.speedY = Math.random() * 1.4 + 0.6;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.isLeaf = Math.random() > 0.65;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
    }

    update(mouseX) {
      this.y += this.speedY;
      this.x += this.speedX + (mouseX || 0) * 0.4;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
        this.y = -10;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.isLeaf) {
        // Soft green leaf shape
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 2, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Shimmering waterfall water droplet
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new NatureParticle();
    p.y = Math.random() * height; // initial spread
    particles.push(p);
  }

  let mouseXNormalized = 0;
  window.addEventListener('mousemove', (e) => {
    mouseXNormalized = (e.clientX / window.innerWidth - 0.5) * 1.5;
  }, { passive: true });

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(mouseXNormalized);
      particles[i].draw();
    }
    requestAnimationFrame(render);
  }

  render();
})();
