export default class Skill {
    constructor({x, y, ctx, canvas, index, callback, cooldown, type, keyTitle, imageSrc, imageWidth, imageHeight}) {
        this.width = 50
        this.height = 50

        this.x = x - (this.width * index + 10 * index)
        this.y = y
        this.ctx = ctx
        this.canvas = canvas
        this.callback = callback
        this.cooldown = cooldown
        this.type = type
        this.keyTitle = keyTitle
        this.image = new Image()
        this.image.src = imageSrc

        this.spriteWidth = imageWidth
        this.spriteHeight = imageHeight

        this.cooldownLeft = 0
        this.timeStamp = 0

        this.skillYPosition = this.canvas.height - this.height - this.y

        this.startCooldown()
    }

    get cooldownInProgress() {
        return this.cooldownLeft > 0
    }

    reset() {
        this.timeStamp = 0
        this.startCooldown()
    }

    startCooldown() {
        this.cooldownLeft = this.cooldown
    }

    callSkill() {
        if (this.cooldownInProgress) {
            return
        }

        this.startCooldown()
        this.callback?.()
    }

    update(deltaTime) {
        if (this.cooldownInProgress) {
            this.timeStamp += deltaTime

            if (this.timeStamp > 100) {
                this.cooldownLeft -= this.timeStamp
                this.timeStamp = 0
            }
        }
    }

    drawCooldownText() {
        const textX = this.x + this.width / 2
        const textY = this.skillYPosition + this.height / 2 + 6

        this.ctx.save()
        this.ctx.font = '20px italic'
        this.ctx.textAlign = 'center'

        this.ctx.fillStyle = 'white'
        this.ctx.fillText((this.cooldownLeft / 1000).toFixed(1), textX, textY)
        this.ctx.fillStyle = 'black'
        this.ctx.fillText((this.cooldownLeft / 1000).toFixed(1), textX, textY + 2)

        this.ctx.restore()
    }

    drawKeyTitle() {
        const textX = this.x + this.width - 8
        const textY = this.skillYPosition + 10

        this.ctx.fillRect(textX - 8, textY - 10, 16, 16)

        this.ctx.save()
        this.ctx.font = '12px italic'
        this.ctx.textAlign = 'center'

        this.ctx.fillStyle = 'black'
        this.ctx.fillText(this.keyTitle, textX, textY)
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(this.keyTitle, textX, textY + 2)

        this.ctx.restore()
    }

    drawCooldownBackground() {
        this.ctx.save()
        this.ctx.fillStyle = 'rgba(225,225,225,0.5)'
        this.ctx.fillRect(this.x, this.skillYPosition, this.width, this.height)
        this.ctx.restore()
    }


    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.skillYPosition, this.width, this.height)

        this.drawKeyTitle()

        if (this.cooldownInProgress) {
            this.drawCooldownBackground()
            this.drawCooldownText()
        }
    }
}