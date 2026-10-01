const canvas = document.getElementById('oceanCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let fibers = [];
const FIBER_COUNT = 350;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Fiber {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.length = 15 + Math.random() * 25;
    this.segments = 5;
    this.angle = Math.random() * Math.PI * 2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.curvature = (Math.random() - 0.5) * 0.1;
    
    // Paleta de colores bioluminiscentes (cian, magenta, azul, neón)
    const hue = Math.random() < 0.7 ? 170 + Math.random() * 30 : 310 + Math.random() * 30;
    this.color = `hsla(${hue}, 85%, 55%, ${0.3 + Math.random() * 0.5})`;
    this.tipColor = `hsla(${hue}, 100%, 75%, 0.9)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.angle += Math.sin(Date.now() * 0.001 + this.x) * 0.005;

    // Reposicionar al salir de la pantalla
    if (this.x < -20) this.x = width + 20;
    if (this.x > width + 20) this.x = -20;
    if (this.y < -20) this.y = height + 20;
    if (this.y > height + 20) this.y = -20;
  }

  draw() {
    ctx.beginPath();
    let currentX = this.x;
    let currentY = this.y;
    let currentAngle = this.angle;

    ctx.moveTo(currentX, currentY);

    const segLen = this.length / this.segments;
    for (let i = 0; i < this.segments; i++) {
      currentAngle += this.curvature;
      currentX += Math.cos(currentAngle) * segLen;
      currentY += Math.sin(currentAngle) * segLen;
      ctx.lineTo(currentX, currentY);
    }

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 0.8 + Math.random() * 0.4;
    ctx.shadowBlur = 4;
    ctx.shadowColor = this.color;
    ctx.stroke();

    // Dibujar brillo en la punta
    ctx.beginPath();
    ctx.arc(currentX, currentY, 1, 0, Math.PI * 2);
    ctx.fillStyle = this.tipColor;
    ctx.fill();
    ctx.shadowBlur = 0; // Limpiar sombra para optimizar
  }
}

// Inicializar partículas
for (let i = 0; i < FIBER_COUNT; i++) {
  fibers.push(new Fiber());
}

// Bucle de animación
function animate() {
  ctx.fillStyle = 'rgba(5, 6, 10, 0.4)';
  ctx.fillRect(0, 0, width, height);

  fibers.forEach(fiber => {
    fiber.update();
    fiber.draw();
  });

  requestAnimationFrame(animate);
}

animate();