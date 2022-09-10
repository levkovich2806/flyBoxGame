import Explosion from './modules/explosion';
import FlyBox from './modules/flyBox';
import Sound from './modules/sound';
import Scope from './modules/scope';
import Bullets from "./modules/bullets";
import {dateHelperFactory, takeXY} from "./utils";
import {addScore, getScores} from "./services/scores";

const SHOT = 'shot';
const GAME_OVER = 'gameover';
const RELOAD = 'RELOAD';
const MAX_FLY_BOX_INITIAL_COUNT = 5;
const GAME_SPEED_INITIAL = 1;
const INCREASE_SPEED_FREQUENCY = 10;

window.addEventListener('load', function() {
    let soundIsOn = false;
    let isLogged = false;

    Sound.addAudio(SHOT, 'public/assets/sounds/gunShot.mp3');
    Sound.initAudio(SHOT);
    Sound.addAudio(RELOAD, 'public/assets/sounds/reload.mp3');
    Sound.initAudio(RELOAD);
    Sound.addAudio(GAME_OVER, 'public/assets/sounds/gameOver.ogg');

    const soundToggle = document.getElementById("soundToggle");
    soundToggle.addEventListener('click', function(e) {
        e.stopPropagation();

        if (!soundIsOn) {
            soundIsOn = true;
            Sound.setSoundState(true);
            this.style.opacity = "1";
        } else {
            soundIsOn = false;
            Sound.setSoundState(false);
            this.style.opacity = "0.2";
        }
    });

    window.addEventListener('click', handleClick);
    window.addEventListener('resize', () => {
        initData();
    });
    window.addEventListener('mousemove', function (e) {
        mousePosition.x = e.x - canvasPosition.left;
        mousePosition.y = e.y - canvasPosition.top;
    })
    // document.addEventListener('keydown', (e) => {
    //     const {code} = e
    //
    //     if (code === 'KeyR') {
    //         handleReload();
    //     }
    // });



    let timeToNextBox = 0;
    let boxInterval = 1500;
    let lastTime = 0;

    let flyBoxes = [];
    let score = 0;
    let accuracy = 100;
    let shoots = 0;
    let gameOver = true;

    let canvas;
    let ctx;
    let collisionCanvas;
    let collisionCtx;
    let backgroundCanvas;
    let backgroundCtx;

    let mousePosition = {
        x: 0,
        y: 0
    }

    let canvasPosition;

    let bulletsCount = 10;
    let emptyBullets = 0;
    let isReloading = false;
    let reloadDuration = 3;

    let gameSpeed = GAME_SPEED_INITIAL;
    let maxFlyBoxCount = MAX_FLY_BOX_INITIAL_COUNT;

    function initData() {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        collisionCanvas = document.getElementById('collisionCanvas');
        collisionCtx = collisionCanvas.getContext('2d');
        collisionCanvas.width = window.innerWidth;
        collisionCanvas.height = window.innerHeight;

        backgroundCanvas = document.getElementById('backgroundCanvas');
        backgroundCtx = backgroundCanvas.getContext('2d');
        backgroundCanvas.width = window.innerWidth;
        backgroundCanvas.height = window.innerHeight;

        canvasPosition = canvas.getBoundingClientRect();

        ctx.font = '40px Impact';
        // drawTip();
        drawBackground();
    }

    initData();

    function showLoginForm() {
        loginFormContainer.style.opacity = '1';
    }

    function hideLoginForm() {
        loginFormContainer.style.opacity = '0';
    }

    function setUsername(username) {
        try {
            sessionStorage.setItem('username', username);
        } catch (e) {
            console.log(e);
        }
    }

    function getUsername() {
        try {
            return sessionStorage.getItem('username');
        } catch (e) {
            return 'Unknown';
        }
    }

    const loginForm = document.getElementById('loginForm');
    const loginFormContainer = document.getElementById('loginFormContainer');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        console.log('submit', username);

        if (username) {
            setUsername(username)

            isLogged = true;
            hideLoginForm();
            resetLevel();
        }
    })

    function drawTip() {
        ctx.save();
        ctx.font = '20px italic';
        ctx.textAlign = 'center';

        ctx.fillStyle = 'black';
        ctx.fillText(`Click/touch to start`, canvas.width / 2 - 1, canvas.height - 31);
        ctx.fillStyle = 'white';
        ctx.fillText(`Click/touch to start`, canvas.width / 2, canvas.height - 30);

        ctx.restore();
    }

    function resetLevel() {
        setGameOverState(false);
        score = 0;
        accuracy = 100;
        shoots = 0;
        flyBoxes = [];
        explosions = [];
        emptyBullets = 0;
        maxFlyBoxCount = MAX_FLY_BOX_INITIAL_COUNT;
        gameSpeed = GAME_SPEED_INITIAL;
        isReloading = false;
        toggleCursor();
        animate(0);
    }

    function toggleCursor(on = false) {
        if (on) {
            document.body.style.cursor = 'auto';
        } else {
            document.body.style.cursor = 'none';
        }
    }

    let explosions = [];

    function drawScore() {
        ctx.fillStyle = 'lightGreen';
        ctx.fillText(`Score: ${score}`, 10, 40);
        ctx.fillStyle = 'black';
        ctx.fillText(`Score: ${score}`, 12, 42);

        if (shoots) {
            ctx.save();

            ctx.font = '20px Impact';

            ctx.fillStyle = 'lightGreen';
            ctx.fillText(`Shots: ${shoots}`, 10, 70);
            ctx.fillStyle = 'black';
            ctx.fillText(`Shots: ${shoots}`, 12, 72);

            accuracy = Math.floor(score / shoots * 100);

            ctx.fillStyle = 'lightGreen';
            ctx.fillText(`Accuracy: ${accuracy}%`, 10, 90);
            ctx.fillStyle = 'black';
            ctx.fillText(`Accuracy: ${accuracy}%`, 12, 92);

            ctx.restore();
        }
    }

    function handleClick(e) {
        if (gameOver && isLogged) {
            resetLevel();
            return;
        }

        let {x,y} = takeXY(e);

        x = x - canvasPosition.left;
        y = y - canvasPosition.top;

        if (isReloading || typeof x !== 'number' || typeof y !== 'number') {
            return;
        }

        const detectPixelColor = collisionCtx.getImageData(x, y, 1, 1);
        const pc = detectPixelColor?.data;

        emptyBullets++;

        if (emptyBullets === bulletsCount) {
            handleReload();
        }

        shoots++;
        Sound.initAudioAndPlay(SHOT);

        flyBoxes.forEach(object => {
            if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
                object.markedForDeletion = true;
                score++;
                explosions.push(new Explosion(object.x, object.y, object.width, ctx));
            }
        });

        if (score % INCREASE_SPEED_FREQUENCY === 0) {
            maxFlyBoxCount++;
            gameSpeed++;
        }
    }

    function handleReload() {
        Sound.play(RELOAD);
        isReloading = true;

        setTimeout(() => {
            emptyBullets = 0;
            isReloading = false;
        }, reloadDuration * 1000);
    }

    function handleGameOver() {
        toggleCursor(true);

        ctx.save();
        ctx.textAlign = 'center';

        ctx.fillStyle = 'black';
        ctx.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'white';
        ctx.fillText(`GAME OVER`, canvas.width / 2 + 5, canvas.height / 2 + 5)
        ctx.restore();

        Sound.initAudioAndPlay(GAME_OVER);

        drawTip();

        addScore({username: getUsername(), score, accuracy});
    }

    function setGameOverState(state) {
        gameOver = state;
    }

    function onGameOver() {
        setGameOverState(true);
    }

    function drawBackground() {
        const backGroundImage = new Image();
        backGroundImage.src = 'public/assets/images/sky_background_green_hills.png';
        backGroundImage.onload = function() {
            backgroundCtx.drawImage(backGroundImage, 0, 0, 2826, 1536, 0, 0, canvas.width, canvas.height);
        }
    }

    const scope = new Scope(mousePosition.x,mousePosition.y, ctx);
    const bullets = new Bullets({x: 10, y: canvas.height - 70, ctx, emptyBullets, bulletsCount})

    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        timeToNextBox += deltaTime;

        if (timeToNextBox > boxInterval && flyBoxes.length <= maxFlyBoxCount) {
            flyBoxes.push(new FlyBox({
                ctx,
                canvas,
                collisionCtx,
                handleGameOver: onGameOver,
                gameSpeed
            }));
            timeToNextBox = 0;
            flyBoxes.sort(function(a, b) {
                return a.width - b.width;
            })
        }

        drawScore();

        const arrayForUpdateDraw = [...explosions, ...flyBoxes];

        arrayForUpdateDraw.forEach(object => object.update(deltaTime));
        arrayForUpdateDraw.forEach(object => object.draw());

        scope.update(mousePosition.x, mousePosition.y, timestamp);
        scope.draw();

        bullets.update(emptyBullets);
        bullets.draw();

        flyBoxes = flyBoxes.filter(object => !object.markedForDeletion);
        explosions = explosions.filter(object => !object.markedForDeletion);

        if (!gameOver) {
            requestAnimationFrame(animate);
        } else {
            handleGameOver();
        }
    }

    async function getAndShowScores() {
        const scoresListContainer = document.getElementById('scoreList');
        const scores = await getScores();
        console.log("scores", scores);
        if (scores && Array.isArray(scores)) {
            scores.forEach(function(score, index) {
                const date = dateHelperFactory()(new Date(score.__createdtime__));
                scoresListContainer.innerHTML += `
<tr>
    <td>${index + 1}</td>
    <td>${score.username}</td>
    <td>${score.score}</td>
    <td>${score.accuracy ?? 100}%</td>
    <td>${date.values.dd}.${date.values.mm}.${date.values.yyyy} ${date.values.hh}:${date.values.mmi}</td>
</tr>`;
            })
        }
    }

    // drawTip();
    getAndShowScores();
})
