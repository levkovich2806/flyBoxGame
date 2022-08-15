window.addEventListener('load', function() {

    const startBtn = document.getElementById("start");

    startBtn.addEventListener('click', function() {
        gameOver = false;
        score = 0;
        flyBoxes = [];
        explosions = [];
        this.style.visibility = 'hidden';
        animate(0);
    })


    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const collisionCanvas = document.getElementById('collisionCanvas');
    const collisionCtx = collisionCanvas.getContext('2d');
    collisionCanvas.width = window.innerWidth;
    collisionCanvas.height = window.innerHeight;

    ctx.font = '40px Impact';

    let timeToNextBox = 0;
    let boxInterval = 1500;
    let lastTime = 0;

    let flyBoxes = [];
    let score = 0;
    let gameOver = true;

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
            this.image.src = './images/spritesheet1.png';

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

    class Explosion {
        constructor(x, y ,size) {
            this.spriteWidth = 200;
            this.spriteHeight = 179;

            this.x = x;
            this.y = y;
            this.size = size;

            this.frame = 0;

            this.image = new Image();
            this.image.src = './images/boom.png';

            this.sound = new Audio();
            this.sound.src = './sounds/laserfire01.ogg';

            this.timeSinceLastFrame = 0;
            this.frameInterval = 100;

            this.markedForDeletion = false;
        }

        update(deltatime) {
            if (this.frame === 0) {
                this.sound.play();
            }

            this.timeSinceLastFrame += deltatime;

            if (this.timeSinceLastFrame > this.frameInterval) {
                this.frame++;
                this.timeSinceLastFrame = 0;

                if (this.frame > 5) {
                    this.markedForDeletion = true;
                }
            }
        }
        draw() {
            ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size);
        }
    }

    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.fillText(`Score: ${score}`, 10, 40);
        ctx.fillStyle = 'white';
        ctx.fillText(`Score: ${score}`, 12, 42);
    }

    window.addEventListener('click', function(e) {
        const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
        const pc = detectPixelColor?.data;

        flyBoxes.forEach(object => {
            if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
                object.markedForDeletion = true;
                score++;

                explosions.push(new Explosion(object.x, object.y, object.width));
            }
        })
    })



    function drawGameOver() {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.fillText(`GAME OVER, your score is: ${score}`, canvas.width / 2, canvas.height / 2)
        ctx.fillStyle = 'white';
        ctx.fillText(`GAME OVER, your score is: ${score}`, canvas.width / 2 + 5, canvas.height / 2 + 5)
        ctx.restore();

        const sound = new Audio();
        sound.src = './sounds/gameOver.ogg';
        sound.play();

        startBtn.style.visibility = 'visible';
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

})
