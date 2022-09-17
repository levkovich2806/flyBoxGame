export default class Bullets {
    constructor({x, y, emptyBullets, bulletsCount, ctx}) {
        this.x = x
        this.y = y
        this.bulletsCount = bulletsCount
        this.emptyBullets = emptyBullets
        this.ctx = ctx
        this.spriteWidth = 108
        this.spriteHeight = 370
        this.height = 60
        this.width = this.height * (this.spriteWidth / this.spriteHeight)

        this.fullBullet = new Image()
        this.fullBullet.src = 'public/assets/images/full.png'
        this.emptyBullet = new Image()
        this.emptyBullet.src = 'public/assets/images/empty.png'
    }

    update(emptyBullets) {
        this.emptyBullets = emptyBullets ?? 2
    }

    draw() {
        const fullBullets = this.bulletsCount - this.emptyBullets

        for (let i = 0; i < this.bulletsCount; i++) {
            const image = i < fullBullets ? this.fullBullet : this.emptyBullet
            this.ctx.drawImage(image, 0, 0, this.spriteWidth, this.spriteHeight, this.x + this.width * i, this.y, this.width, this.height)
        }
    }
}
