export default class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.velocityX = Math.random() * 4 - 2;
        this.velocityY = Math.random() * 4 - 2;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update(context) {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.alpha -= this.decay;
        if (this.alpha <= this.decay) {
            this.alpha = 0;
        }

        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }
}