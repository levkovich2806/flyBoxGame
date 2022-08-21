import Explosion from './modules/explosion';
import Sound from './modules/sound';

const SHOT = 'shot';
const GAME_OVER = 'gameover';

window.addEventListener('load', function() {
    let soundIsOn = false;

    Sound.addAudio(SHOT, 'public/assets/sounds/gunShot.mp3');
    Sound.initAudio(SHOT);
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
    })


    let timeToNextBox = 0;
    let boxInterval = 1500;
    let lastTime = 0;

    let flyBoxes = [];
    let score = 0;
    let shoots = 0;
    let gameOver = true;

    let canvas;
    let ctx;
    let collisionCanvas;
    let collisionCtx;

    function initData() {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        collisionCanvas = document.getElementById('collisionCanvas');
        collisionCtx = collisionCanvas.getContext('2d');
        collisionCanvas.width = window.innerWidth;
        collisionCanvas.height = window.innerHeight;

        ctx.font = '40px Impact';
        drawTip();
    }

    initData();

    window.addEventListener('resize', () => {
        initData();
    });

    function drawTip() {
        ctx.save();
        ctx.font = '20px italic';
        ctx.textAlign = 'center';

        ctx.fillStyle = 'black';
        ctx.fillText(`Click/touch to start`, canvas.width / 2 - 1, canvas.height - 21);
        ctx.fillStyle = 'white';
        ctx.fillText(`Click/touch to start`, canvas.width / 2, canvas.height - 20);

        ctx.restore();
    }

    function resetLevel() {
        gameOver = false;
        score = 0;
        shoots = 0;
        flyBoxes = [];
        explosions = [];
        animate(0);
    }

    class FlyBox {
        constructor() {
            this.spriteWidth = 259;
            this.spriteHeight = 146;

            this.sizeModifier = Math.random() * 0.4 + 0.4;

            this.width = this.spriteWidth * this.sizeModifier;
            this.height = this.spriteHeight * this.sizeModifier;

            this.x = canvas.width;
            this.y = Math.random() * (canvas.height - this.height);

            this.directionX = Math.random() * 5;
            this.directionY = Math.random();

            this.markedForDeletion = false;

            this.image = new Image();
            this.image.src = '../public/assets/images/spritesheet1.png';

            this.frame = 0;
            this.maxFrame = 9;

            this.timeSinceFlap = 0;
            this.flapInterval = Math.random() * 50 + 100;

            this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
            this.color = `rgb(${this.randomColors[0]} , ${this.randomColors[1]}, ${this.randomColors[2]})`;
        }

        update(deltaTime) {
            if (this.y < 0 || this.y > canvas.height - this.height) {
                this.directionY = this.directionY * -1;
            }

            this.x -= this.directionX;
            this.y += this.directionY;

            this.timeSinceFlap += deltaTime;

            if (this.timeSinceFlap > this.flapInterval) {
                if (this.frame > this.maxFrame) {
                    this.frame = 0;
                } else {
                    this.frame++;
                }

                this.timeSinceFlap = 0;
            }

            if (this.x < 0 - this.width) {
                gameOver = true;
            }
        }
        draw() {
            collisionCtx.fillStyle = this.color;
            collisionCtx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    let explosions = [];

    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.fillText(`Score: ${score}`, 10, 40);
        ctx.fillStyle = 'white';
        ctx.fillText(`Score: ${score}`, 12, 42);

        if (shoots) {
            ctx.save();

            ctx.font = '20px Impact';

            ctx.fillStyle = 'black';
            ctx.fillText(`Shots: ${shoots}`, 10, 70);
            ctx.fillStyle = 'white';
            ctx.fillText(`Shots: ${shoots}`, 12, 72);

            const accuracy = Math.floor(score / shoots * 100);

            ctx.fillStyle = 'black';
            ctx.fillText(`Accuracy: ${accuracy}%`, 10, 90);
            ctx.fillStyle = 'white';
            ctx.fillText(`Accuracy: ${accuracy}%`, 12, 92);

            ctx.restore();
        }
    }

    window.addEventListener('click', function(e) {
        if (gameOver) {
            resetLevel();
            return;
        }


        const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
        const pc = detectPixelColor?.data;

        shoots++;
        Sound.initAudioAndPlay(SHOT);

        flyBoxes.forEach(object => {
            if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
                object.markedForDeletion = true;
                score++;
                explosions.push(new Explosion(object.x, object.y, object.width, ctx));
            }
        })
    })



    function drawGameOver() {
        ctx.save();
        ctx.textAlign = 'center';

        ctx.fillStyle = 'black';
        ctx.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'white';
        ctx.fillText(`GAME OVER`, canvas.width / 2 + 5, canvas.height / 2 + 5)
        ctx.restore();

        Sound.initAudioAndPlay(GAME_OVER);

        drawTip();
    }

    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        timeToNextBox += deltaTime;

        if (timeToNextBox > boxInterval) {
            flyBoxes.push(new FlyBox());
            timeToNextBox = 0;
            flyBoxes.sort(function(a, b) {
                return a.width - b.width;
            })
        }

        drawScore();

        const arrayForUpdateDraw = [...explosions, ...flyBoxes];

        arrayForUpdateDraw.forEach(object => object.update(deltaTime));
        arrayForUpdateDraw.forEach(object => object.draw());

        flyBoxes = flyBoxes.filter(object => !object.markedForDeletion);
        explosions = explosions.filter(object => !object.markedForDeletion);

        if (!gameOver) {
            requestAnimationFrame(animate);
        } else {
            drawGameOver();
        }
    }

    drawTip();
})
