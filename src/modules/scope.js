export default class Scope {
    constructor(x,y, ctx) {
        this.spriteWidth = 380;
        this.spriteHeight = 380;

        this.width = 80;
        this.height = this.width * (this.spriteHeight / this.spriteWidth);

        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.image = new Image();
        this.image.src = 'public/assets/images/scope.png'
    }

    update(x,y) {
        // console.log(x, y);
        this.x = x;
        this.y = y;
    }

    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}
