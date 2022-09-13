export default class Scope {
    constructor(x,y, ctx) {
        this.spriteWidth = 380
        this.spriteHeight = 380

        this.width = 80
        this.height = this.width * (this.spriteHeight / this.spriteWidth)

        this.x = x
        this.y = y
        this.ctx = ctx

        this.image = new Image()
        this.image.src = 'public/assets/images/scope.png'

        this.lastTime = 0
        this.interval = 1000/60
        this.timer = 0
    }

    update(x, y, timeStamp) {
        const deltaTime = timeStamp - this.lastTime
        this.lastTime = timeStamp

        if (this.timer > this.interval) {
            this.x = x
            this.y = y
            this.timer = 0
        } else {
            this.timer += deltaTime
        }
    }

    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
    }
}
