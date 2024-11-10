let clouds = [];
let holeY;
let timeOfDay = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  holeY = height - 50;
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  drawBackground();
  drawHole();

  for (let i = clouds.length - 1; i >= 0; i--) {
    let cloud = clouds[i];
    cloud.drift();
    cloud.drip();
    cloud.display();

    if (cloud.isGone()) {
      clouds.splice(i, 1);
    }
  }
}

function drawBackground() {
  let morningColor = color(210, 30, 100);
  let eveningColor = color(250, 70, 50);
  let transition = map(sin(timeOfDay), -1, 1, 0, 1);
  let skyColor = lerpColor(morningColor, eveningColor, transition);
  background(skyColor);
  timeOfDay += 0.01;
}

function drawHole() {
  fill(260, 60, 50, 0.15);
  ellipse(width / 2, holeY, 150 + sin(frameCount * 0.05) * 10, 40);
  fill(260, 40, 30);
  ellipse(width / 2, holeY, 120, 30);
}

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(100, 200);
    this.opacity = random(0.5, 0.8);
    this.dripParticles = [];
    this.wind = random(0.1, 0.3);
  }

  drift() {
    this.y += random(0.1, 0.4);
    this.x += this.wind;
  }

  drip() {
    if (frameCount % 20 === 0) {
      this.dripParticles.push({
        x: this.x + random(-this.size / 4, this.size / 4),
        y: this.y + this.size * 0.4,
        opacity: 200,
        size: random(2, 5)
      });
    }
    for (let i = this.dripParticles.length - 1; i >= 0; i--) {
      let drip = this.dripParticles[i];
      drip.y += random(0.8, 1.5);
      drip.opacity -= 2;
      if (drip.opacity <= 0) {
        this.dripParticles.splice(i, 1);
      }
    }
  }

  display() {
    for (let r = this.size; r > 0; r -= 10) {
      let interColor = color(0, 0, 100, this.opacity - (this.size - r) * 0.0015);
      fill(interColor);
      noStroke();
      ellipse(this.x, this.y, r * 1.3, r * 0.8);
    }

    for (let drip of this.dripParticles) {
      fill(200, 30, 90, drip.opacity / 255);
      ellipse(drip.x, drip.y, drip.size, drip.size * 1.5);
    }
  }

  isGone() {
    return this.opacity <= 0 || this.y > holeY + 30;
  }
}

function mousePressed() {
  clouds.push(new Cloud(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
