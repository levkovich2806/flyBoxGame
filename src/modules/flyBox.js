export default class FlyBox {
    constructor({ctx, canvas, collisionCtx, handleGameOver}) {
        this.ctx = ctx;
        this.collisionCtx = collisionCtx;
        this.handleGameOver = handleGameOver;
        this.canvas = canvas;


        this.spriteWidth = 259;
        this.spriteHeight = 146;

        this.sizeModifier = Math.random() * 0.4 + 0.4;

        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;

        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);

        this.directionX = Math.random() * 5;
        this.directionY = Math.random();

        this.markedForDeletion = false;

        this.image = new Image();
        this.image.src = '../public/assets/images/spritesheet1.png';

        this.frame = 0;
        this.maxFrame = 9;

        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 100;

        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = `rgb(${this.randomColors[0]} , ${this.randomColors[1]}, ${this.randomColors[2]})`;
    }

    update(deltaTime) {
        if (this.y < 0 || this.y > this.canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }

        this.x -= this.directionX;
        this.y += this.directionY;

        this.timeSinceFlap += deltaTime;

        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) {
                this.frame = 0;
            } else {
                this.frame++;
            }

            this.timeSinceFlap = 0;
        }

        if (this.x < 0 - this.width) {
            typeof this.handleGameOver === 'function' && this.handleGameOver();
        }
    }
    draw() {
        this.collisionCtx.fillStyle = this.color;
        this.collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}
