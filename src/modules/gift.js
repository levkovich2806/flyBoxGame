import {getRandomColor} from "../utils";

const GIFTS = [
    {
        width: 432 * 0.1,
        height: 370 * 0.1,
        spriteWidth: 432,
        spriteHeight: 370,
        asset: 'bullets.png',
        type: 'bullets'
    }
]

export default class Gift {
    constructor({ctx, canvas, collisionCtx, x, y}) {
        this.ctx = ctx;
        this.collisionCtx = collisionCtx;
        this.canvas = canvas;

        this.directionY = Math.random() * 3;

        this.markedForDeletion = false;

        const {rgbString, randomColors} = getRandomColor();
        this.color = rgbString;
        this.randomColors = randomColors;

        this.kind = GIFTS[Math.floor(Math.random() * (GIFTS.length - 1))] || {};

        this.height = this.kind.height;
        this.width = this.kind.width;
        this.spriteWidth = this.kind.spriteWidth;
        this.spriteHeight = this.kind.spriteHeight;
        this.type = this.kind.type;
        this.image = new Image();
        this.image.src = `../public/assets/images/gifts/${this.kind.asset}`;

        this.x = x - this.width / 2;
        this.y = y;
    }

    update() {
        this.y += this.directionY;

        if (this.y > this.canvas.height) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        this.collisionCtx.fillStyle = this.color;
        this.collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

    }
}