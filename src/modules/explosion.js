export default class Explosion {
    constructor(x, y ,size, ctx) {
        this.ctx = ctx;
        this.spriteWidth = 200;
        this.spriteHeight = 179;

        this.x = x;
        this.y = y;
        this.size = size;

        this.frame = 0;

        this.image = new Image();
        this.image.src = 'public/assets/images/boom.png';

        this.sound = new Audio();
        this.sound.src = 'public/assets/sounds/magic.mp3';

        this.timeSinceLastFrame = 0;
        this.frameInterval = 100;

        this.markedForDeletion = false;
    }

    update(deltatime) {
        if (this.frame === 0) {
            // soundIsOn && this.sound.play();
            this.sound.play();
        }

        this.timeSinceLastFrame += deltatime;

        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;

            if (this.frame > 5) {
                this.markedForDeletion = true;
            }
        }
    }
    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size);
    }
}
