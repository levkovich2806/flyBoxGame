import { GAME_SPEED_INITIAL, MAX_FLY_BOX_INITIAL_COUNT } from '../consts'

class Game {
    _gameOver = false
    _isLogged = false
    _maxFlyBoxCount = MAX_FLY_BOX_INITIAL_COUNT
    _gameSpeed = GAME_SPEED_INITIAL

    constructor() {}

    reset() {
        this.setGameOverState(false)
        this._maxFlyBoxCount = MAX_FLY_BOX_INITIAL_COUNT
        this._gameSpeed = GAME_SPEED_INITIAL
    }

    get gameOver() {
        return this._gameOver
    }

    setGameOverState(state) {
        this._gameOver = state
    }

    get isLogged() {
        return this._isLogged
    }

    setIsLogged(logged) {
        this._isLogged = logged
    }

    increaseFlyBoxCount() {
        this._maxFlyBoxCount++
    }

    get maxFlyBoxCount() {
        return this._maxFlyBoxCount
    }

    increaseGameSpeed() {
        this._gameSpeed++
    }

    get gameSpeed() {
        return this._gameSpeed
    }
}

export default new Game()
