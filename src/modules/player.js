class Player {
    _score = 0
    _accuracy = 100
    _shoots = 0

    constructor() {}

    reset() {
        this._score = 0
        this._accuracy = 100
        this._shoots = 0
    }

    setScore(number) {
        this._score = number
        this.recalculateAccuracy()
    }

    get score() {
        return this._score
    }

    increaseScore() {
        this.setScore(this._score + 1)
    }

    setShoots(number) {
        this._shoots = number
        this.recalculateAccuracy()
    }

    get shoots() {
        return this._shoots
    }

    increaseShots() {
        this.setShoots(this._shoots + 1)
    }

    setAccuracy(value) {
        this._accuracy = value
    }

    get accuracy() {
        return this._accuracy
    }

    recalculateAccuracy() {
        this.setAccuracy(Math.floor((this.score / this.shoots) * 100))
    }
}

export default new Player()
