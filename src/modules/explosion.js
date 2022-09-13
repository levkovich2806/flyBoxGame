import Sound from './sound'

const EXPLOSION = 'explosion'
Sound.addAudio(EXPLOSION, 'public/assets/sounds/magic.mp3')

const explosionImage = new Image()
explosionImage.src = 'public/assets/images/boom.png'

export default class Explosion {
    constructor(x, y ,size, ctx) {
        this.ctx = ctx
        this.spriteWidth = 200
        this.spriteHeight = 179

        this.x = x
        this.y = y
        this.size = size

        this.frame = 0

        this.timeSinceLastFrame = 0
        this.frameInterval = 100

        this.markedForDeletion = false
        Sound.initAudio(EXPLOSION)
    }

    update(deltatime) {
        if (this.frame === 0) {
            Sound.play(EXPLOSION)
        }

        this.timeSinceLastFrame += deltatime

        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++
            this.timeSinceLastFrame = 0

            if (this.frame > 5) {
                this.markedForDeletion = true
            }
        }
    }
    draw() {
        this.ctx.drawImage(explosionImage, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size)
    }
}
