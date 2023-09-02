import Sound from './sound'
import { RELOAD } from '../consts'

const BULLETS_COUNT_INITIAL = 10
const RELOAD_DURATION_INITIAL = 3

export default class Bullets {
    _emptyBullets = 0
    _bulletsCount = BULLETS_COUNT_INITIAL
    _reloadDuration = RELOAD_DURATION_INITIAL
    _isReloading = false
    _reloadProgress = 0

    constructor({
        x,
        y,
        emptyBullets = 0,
        bulletsCount = BULLETS_COUNT_INITIAL,
        reloadDuration = RELOAD_DURATION_INITIAL,
        ctx,
    }) {
        this.x = x
        this.y = y
        this._bulletsCount = bulletsCount
        this._emptyBullets = emptyBullets
        this._reloadDuration = reloadDuration
        this.ctx = ctx
        this.spriteWidth = 108
        this.spriteHeight = 370
        this.height = 60
        this.width = this.height * (this.spriteWidth / this.spriteHeight)

        this.fullBullet = new Image()
        this.fullBullet.src = 'public/assets/images/full.png'
        this.emptyBullet = new Image()
        this.emptyBullet.src = 'public/assets/images/empty.png'

        this.timeSinceLastReloadUpdate = 0
    }

    reset() {
        this._emptyBullets = 0
        this._isReloading = false
    }

    setEmptyBullets(emptyBullets) {
        this._emptyBullets = emptyBullets

        if (this._emptyBullets === this._bulletsCount) {
            this.reload()
        }
    }

    get emptyBullets() {
        return this._emptyBullets
    }

    setBulletsCount(bulletsCount) {
        this._bulletsCount = bulletsCount
    }

    get bulletsCount() {
        return this._bulletsCount
    }

    setReloadDuration(duration) {
        this._reloadDuration = duration
    }

    get reloadDuration() {
        return this._reloadDuration
    }

    setIsReloading(isReloading) {
        this._isReloading = isReloading
    }

    get isReloading() {
        return this._isReloading
    }

    increaseEmptyBullets() {
        this.setEmptyBullets(this._emptyBullets + 1)
    }

    reload() {
        Sound.play(RELOAD)
        this.setIsReloading(true)
        this.setReloadProgress(0)

        setTimeout(() => {
            this._emptyBullets = 0
            this.setIsReloading(false)
        }, this._reloadDuration * 1000)
    }

    update(deltatime) {
        this.timeSinceLastReloadUpdate += deltatime

        if (this.timeSinceLastReloadUpdate > this._reloadDuration * deltatime) {
            this.timeSinceLastReloadUpdate = 0

            if (this.isReloading && this.reloadProgress < 100) {
                this.setReloadProgress(this.reloadProgress + 1)
            }
        }
    }

    get reloadProgress() {
        return this._reloadProgress
    }

    setReloadProgress(percent) {
        this._reloadProgress = percent
    }

    draw() {
        const fullBullets = this.bulletsCount - this.emptyBullets

        for (let i = 0; i < this.bulletsCount; i++) {
            const image = i < fullBullets ? this.fullBullet : this.emptyBullet
            this.ctx.drawImage(
                image,
                0,
                0,
                this.spriteWidth,
                this.spriteHeight,
                this.x + this.width * i,
                this.y,
                this.width,
                this.height
            )
        }

        this.drawReload()
    }

    drawReload() {
        if (this.isReloading) {
            const y = this.y + this.height + 10

            const x = this.x + this.width * this.bulletsCount * (this.reloadProgress / 100)

            this.ctx.strokeStyle = 'orange'
            this.ctx.lineWidth = 3

            this.ctx.beginPath()
            this.ctx.moveTo(this.x, y)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }
    }
}
