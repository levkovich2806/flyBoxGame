import Explosion from './modules/explosion'
import FlyBox from './modules/flyBox'
import Sound from './modules/sound'
import Scope from './modules/scope'
import Bullets from './modules/bullets'
import { dateHelperFactory, takeXY } from './utils'
import { addScore, getScores } from './services/scores'
import Gift from './modules/gift'
import Skill from './modules/skill'
import { getUsername, setUsername } from './utils/helpers'
import {
    GAME_OVER,
    INCREASE_SPEED_FREQUENCY,
    RELOAD,
    SHOT,
    WIND_SKILL_DURATION,
    WIND_SPEED_MODIFICATOR,
} from './consts'
import Game from './modules/game'
import Player from './modules/player'

window.addEventListener('load', function () {
    const SKILLS = [
        {
            type: 'armagedon',
            cooldown: 30000,
            callback: armagedonCallback,
            key: 'KeyW',
            keyTitle: 'W',
            imageSrc: 'public/assets/images/skills/fire.png',
            imageWidth: 128,
            imageHeight: 128,
        },
        {
            type: 'wind',
            cooldown: 15000,
            callback: windCallback,
            key: 'KeyQ',
            keyTitle: 'Q',
            imageSrc: 'public/assets/images/skills/wind.png',
            imageWidth: 512,
            imageHeight: 512,
        },
    ]

    window.addEventListener('click', handleClick)
    window.addEventListener('resize', () => {
        initData()
    })
    window.addEventListener('mousemove', function (e) {
        mousePosition.x = e.x - canvasPosition.left
        mousePosition.y = e.y - canvasPosition.top
    })
    document.addEventListener('keydown', e => {
        const { code } = e

        if (!Game.gameOver) {
            SKILLS.forEach(function (skill) {
                if (skill.key === code) {
                    const skillObject = skills.find(function (s) {
                        return s.type === skill.type
                    })
                    if (skillObject) {
                        skillObject.callSkill()
                    }
                }
            })
        }
    })

    const giftCallbacks = {
        bullets: addBullets,
    }

    let timeToNextBox = 0
    let boxInterval = 1500
    let lastTime = 0

    let flyBoxes = []
    let gifts = []
    let skills = []

    let canvas
    let ctx
    let collisionCanvas
    let collisionCtx
    let backgroundCanvas
    let backgroundCtx

    let mousePosition = {
        x: 0,
        y: 0,
    }

    let canvasPosition

    let bulletsCount = 10
    let emptyBullets = 0
    let isReloading = false
    let reloadDuration = 3

    // Skills
    let windIsActive = false

    function initData() {
        canvas = document.getElementById('gameCanvas')
        ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        collisionCanvas = document.getElementById('collisionCanvas')
        collisionCtx = collisionCanvas.getContext('2d')
        collisionCanvas.width = window.innerWidth
        collisionCanvas.height = window.innerHeight

        backgroundCanvas = document.getElementById('backgroundCanvas')
        backgroundCtx = backgroundCanvas.getContext('2d')
        backgroundCanvas.width = window.innerWidth
        backgroundCanvas.height = window.innerHeight

        canvasPosition = canvas.getBoundingClientRect()

        ctx.font = '40px Impact'
        // drawTip();
        drawBackground()
    }

    initData()

    function addBullets() {
        emptyBullets = Math.max(0, Math.floor(emptyBullets - (Math.random() * bulletsCount + 1)))
    }

    const loginForm = document.getElementById('loginForm')
    const loginFormContainer = document.getElementById('loginFormContainer')

    function showLoginForm() {
        loginFormContainer.style.opacity = '1'
    }

    function hideLoginForm() {
        loginFormContainer.style.opacity = '0'
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault()

        const username = document.getElementById('username').value
        if (username) {
            setUsername(username)

            Game.setIsLogged(true)
            hideLoginForm()
            resetLevel()
        }
    })

    function drawTip() {
        ctx.save()
        ctx.font = '20px italic'
        ctx.textAlign = 'center'

        ctx.fillStyle = 'black'
        ctx.fillText('Click/touch to start', canvas.width / 2 - 1, canvas.height - 31)
        ctx.fillStyle = 'white'
        ctx.fillText('Click/touch to start', canvas.width / 2, canvas.height - 30)

        ctx.restore()
    }

    function resetLevel() {
        Game.reset()
        Player.reset()
        flyBoxes = []
        gifts = []
        explosions = []
        emptyBullets = 0
        isReloading = false
        windIsActive = false
        toggleCursor()
        initSkills()

        // ALWAYS MAST BE LAST
        animate(0)
    }

    function toggleCursor(on = false) {
        if (on) {
            document.body.style.cursor = 'auto'
        } else {
            document.body.style.cursor = 'none'
        }
    }

    let explosions = []

    function drawScore() {
        ctx.fillStyle = 'lightGreen'
        ctx.fillText(`Score: ${Player.score}`, 10, 40)
        ctx.fillStyle = 'black'
        ctx.fillText(`Score: ${Player.score}`, 12, 42)

        if (Player.shoots) {
            ctx.save()

            ctx.font = '20px Impact'

            ctx.fillStyle = 'lightGreen'
            ctx.fillText(`Shots: ${Player.shoots}`, 10, 70)
            ctx.fillStyle = 'black'
            ctx.fillText(`Shots: ${Player.shoots}`, 12, 72)

            ctx.fillStyle = 'lightGreen'
            ctx.fillText(`Accuracy: ${Player.accuracy}%`, 10, 90)
            ctx.fillStyle = 'black'
            ctx.fillText(`Accuracy: ${Player.accuracy}%`, 12, 92)

            ctx.restore()
        }
    }

    function needToAddGift() {
        return Math.random() < 0.05
    }

    function handleClick(e) {
        if (!Game.isLogged) {
            return
        }

        if (Game.gameOver && Game.isLogged) {
            resetLevel()
            return
        }

        let { x, y } = takeXY(e)

        x = x - canvasPosition.left
        y = y - canvasPosition.top

        if (isReloading || typeof x !== 'number' || typeof y !== 'number') {
            return
        }

        const detectPixelColor = collisionCtx.getImageData(x, y, 1, 1)
        const pc = detectPixelColor?.data

        emptyBullets++
        Sound.initAudioAndPlay(SHOT)

        let shotInGift = false

        gifts.forEach(object => {
            if (
                object.randomColors[0] === pc[0] &&
                object.randomColors[1] === pc[1] &&
                object.randomColors[2] === pc[2]
            ) {
                shotInGift = true
                object.markedForDeletion = true
                const callback = giftCallbacks[object.type]

                if (typeof callback === 'function') {
                    callback()
                }
            }
        })

        if (emptyBullets === bulletsCount) {
            handleReload()
        }

        if (shotInGift) {
            return
        }

        Player.increaseShots()

        killFlyBox(pc)

        if (Player.score % INCREASE_SPEED_FREQUENCY === 0) {
            Game.increaseFlyBoxCount()
            Game.increaseGameSpeed()
        }
    }

    function killFlyBox(pixelInfoRGB = [], killAll = false) {
        flyBoxes.forEach(object => {
            if (
                killAll ||
                (object.randomColors[0] === pixelInfoRGB[0] &&
                    object.randomColors[1] === pixelInfoRGB[1] &&
                    object.randomColors[2] === pixelInfoRGB[2])
            ) {
                object.markedForDeletion = true
                !killAll && Player.increaseScore()
                explosions.push(new Explosion(object.x, object.y, object.width, ctx))

                if (needToAddGift()) {
                    gifts.push(
                        new Gift({
                            ctx,
                            collisionCtx,
                            canvas,
                            x: object.x + object.width / 2,
                            y: object.y + object.height,
                        })
                    )
                }
            }
        })
    }

    function handleReload() {
        Sound.play(RELOAD)
        isReloading = true

        setTimeout(() => {
            emptyBullets = 0
            isReloading = false
        }, reloadDuration * 1000)
    }

    function handleGameOver() {
        toggleCursor(true)

        ctx.save()
        ctx.textAlign = 'center'

        ctx.fillStyle = 'black'
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2)
        ctx.fillStyle = 'white'
        ctx.fillText('GAME OVER', canvas.width / 2 + 5, canvas.height / 2 + 5)
        ctx.restore()

        Sound.initAudioAndPlay(GAME_OVER)

        drawTip()

        addScore({ username: getUsername(), score: Player.score, accuracy: Player.accuracy })
    }

    function drawBackground() {
        const backGroundImage = new Image()
        backGroundImage.src = 'public/assets/images/sky_background_green_hills.png'
        backGroundImage.onload = function () {
            backgroundCtx.drawImage(backGroundImage, 0, 0, 2826, 1536, 0, 0, canvas.width, canvas.height)
        }
    }

    function armagedonCallback() {
        this.callSkill()
        killFlyBox(undefined, true)
    }

    function windCallback() {
        this.callSkill()
        windIsActive = true

        setTimeout(function () {
            windIsActive = false
        }, WIND_SKILL_DURATION)
    }

    // Прицел
    const scope = new Scope(mousePosition.x, mousePosition.y, ctx)
    // Пули доступные игроку
    const bullets = new Bullets({
        x: 10,
        y: canvas.height - 70,
        ctx,
        emptyBullets,
        bulletsCount,
    })
    // Перезарядка

    function initSkills() {
        if (skills.length > 0) {
            skills.forEach(function (skill) {
                skill.reset()
            })
        } else {
            SKILLS.forEach(function (skill, index) {
                skills.push(
                    new Skill({
                        ...skill,
                        x: canvas.width,
                        y: 10,
                        ctx,
                        canvas,
                        index: index + 1,
                    })
                )
            })
        }
    }

    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        collisionCtx.clearRect(0, 0, canvas.width, canvas.height)

        let deltaTime = timestamp - lastTime
        lastTime = timestamp
        timeToNextBox += deltaTime

        if (timeToNextBox > boxInterval && flyBoxes.length <= Game.maxFlyBoxCount) {
            flyBoxes.push(
                new FlyBox({
                    ctx,
                    canvas,
                    collisionCtx,
                    handleBoxOutFromField: () => Game.setGameOverState(true),
                    gameSpeed: Game.gameSpeed,
                })
            )
            timeToNextBox = 0
            flyBoxes.sort(function (a, b) {
                return a.width - b.width
            })
        }

        drawScore()

        const arrayForUpdateDraw = [...explosions, ...flyBoxes, ...gifts, ...skills]

        arrayForUpdateDraw.forEach(object =>
            object.update(deltaTime, {
                speedModificator: windIsActive && WIND_SPEED_MODIFICATOR,
            })
        )
        arrayForUpdateDraw.forEach(object => object.draw())

        scope.update(mousePosition.x, mousePosition.y, timestamp)
        scope.draw()

        bullets.update(emptyBullets)
        bullets.draw()

        flyBoxes = flyBoxes.filter(object => !object.markedForDeletion)
        explosions = explosions.filter(object => !object.markedForDeletion)
        gifts = gifts.filter(object => !object.markedForDeletion)

        if (!Game.gameOver) {
            requestAnimationFrame(animate)
        } else {
            handleGameOver()
        }
    }

    async function getAndShowScores() {
        const scoresListContainer = document.getElementById('scoreList')
        const scores = await getScores()

        if (scores && Array.isArray(scores)) {
            scores.forEach(function (score, index) {
                const date = dateHelperFactory()(new Date(score.__createdtime__))
                scoresListContainer.innerHTML += `
<tr>
    <td>${index + 1}</td>
    <td>${score.username}</td>
    <td>${score.score}</td>
    <td>${score.accuracy ?? 100}%</td>
    <td>${date.values.dd}.${date.values.mm}.${date.values.yyyy} ${date.values.hh}:${date.values.mmi}</td>
</tr>`
            })
        }
    }

    // drawTip();
    getAndShowScores()
})
