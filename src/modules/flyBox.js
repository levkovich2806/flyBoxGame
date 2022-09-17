import {getRandomColor} from '../utils'

const PADDING = 100

export default class FlyBox {
    constructor({ctx, canvas, collisionCtx, handleGameOver, gameSpeed}) {
        this.ctx = ctx
        this.collisionCtx = collisionCtx
        this.handleGameOver = handleGameOver
        this.canvas = canvas
        this.gameSpeed = gameSpeed

        this.spriteWidth = 259
        this.spriteHeight = 146

        this.sizeModifier = Math.random() * 0.4 + 0.4

        this.width = this.spriteWidth * this.sizeModifier
        this.height = this.spriteHeight * this.sizeModifier

        this.x = canvas.width
        this.y = Math.random() * (canvas.height - this.height)

        if (this.y < PADDING) {
            this.y = PADDING
        } else if (this.y > canvas.height - this.height - PADDING) {
            this.y = canvas.height - this.height - PADDING
        }

        this.directionX = Math.random() * 2 + this.gameSpeed
        this.directionY = Math.random()

        this.markedForDeletion = false

        this.image = new Image()
        this.image.src = '../public/assets/images/spritesheet1.png'

        this.frame = 0
        this.maxFrame = 9

        this.timeSinceFlap = 0
        this.flapInterval = Math.random() * 50 + 100

        const {rgbString, randomColors} = getRandomColor()
        this.color = rgbString
        this.randomColors = randomColors
    }

    update(deltaTime, {speedModificator}) {
        if (this.y < PADDING || this.y > this.canvas.height - this.height - PADDING) {
            this.directionY = this.directionY * -1
        }

        function withModificator(direction, speedModificator) {
            return speedModificator ? speedModificator > 0 ? direction * speedModificator : direction / Math.abs(speedModificator) : direction
        }

        const xDelta = withModificator(this.directionX, speedModificator)
        const yDelta = withModificator(this.directionY, speedModificator)

        this.x -= xDelta
        this.y += yDelta

        this.timeSinceFlap += deltaTime

        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) {
                this.frame = 0
            } else {
                this.frame++
            }

            this.timeSinceFlap = 0
        }

        if (this.x < 0 - this.width) {
            typeof this.handleGameOver === 'function' && this.handleGameOver()
        }
    }
    draw() {
        this.collisionCtx.fillStyle = this.color
        this.collisionCtx.fillRect(this.x, this.y, this.width, this.height)
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}
