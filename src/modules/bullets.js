import Sound from './sound'
import { RELOAD } from '../consts'

export default class Bullets {
    _emptyBullets = 0
    _bulletsCount = 10
    _reloadDuration = 3
    _isReloading = false

    constructor({ x, y, emptyBullets = 0, bulletsCount = 10, reloadDuration = 3, ctx }) {
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

        setTimeout(() => {
            this._emptyBullets = 0
            this.setIsReloading(false)
        }, this._reloadDuration * 1000)
    }

    // update(emptyBullets) {
    //     this._emptyBullets = emptyBullets ?? 2
    // }

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
    }
}
