document.addEventListener('keydown', handleKeydown);

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startButton = document.querySelector('#controls #start-button');
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');

let snake = [
    { x: 160, y: 160 },
    { x: 140, y: 160 },
    { x: 120, y: 160 },
    { x: 100, y: 160 }
];
let dx = 20;
let dy = 0;
let foodX;
let foodY;
let score = 0;
let changingDirection = false;
let gameActive = false;
let gameInterval;
let gameTimeout;
let countdownInterval;
let timeLeft = 60;

const buttons = document.querySelectorAll('#movement-buttons button');
buttons.forEach(button => {
    button.addEventListener('click', () => changeDirection({ keyCode: getKeyCodeFromButton(button.id) }));
});

startButton.addEventListener('click', startGame);

function getKeyCodeFromButton(buttonId) {
    switch (buttonId) {
        case 'up-button':
            return 38;
        case 'down-button':
            return 40;
        case 'left-button':
            return 37;
        case 'right-button':
            return 39;
        default:
            return null;
    }
}

function startGame() {
    if (gameActive) return;
    gameActive = true;
    score = 0;
    timeLeft = 60;
    snake = [
        { x: 160, y: 160 },
        { x: 140, y: 160 },
        { x: 120, y: 160 },
        { x: 100, y: 160 }
    ];
    dx = 20;
    dy = 0;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    createFood();
    gameInterval = setInterval(main, 100);
    countdownInterval = setInterval(updateTimer, 1000);
    gameTimeout = setTimeout(endGame, 60000); // 60 seconds
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    alert(`Game over! Your score was: ${score}`);
}

function updateTimer() {
    timeLeft -= 1;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        endGame();
    }
}

function main() {
    if (hasGameEnded()) {
        endGame();
        return;
    }
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = "#aad751";
    ctx.strokestyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'blue';
    ctx.strokestyle = 'darkblue';
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    if (hasEatenFood) {
        score += 1;
        scoreElement.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (hasCollided) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function createFood() {
    foodX = Math.round((Math.random() * (canvas.width - 20)) / 20) * 20;
    foodY = Math.round((Math.random() * (canvas.height - 20)) / 20) * 20;

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) createFood();
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const keyCode = event.keyCode || getKeyCodeFromButton(event.target.id);
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const UP_KEYS = [UP_KEY, 87]; // Thêm mã phím 'W'
    const DOWN_KEYS = [DOWN_KEY, 83]; // Thêm mã phím 'S'
    const LEFT_KEYS = [LEFT_KEY, 65]; // Thêm mã phím 'A'
    const RIGHT_KEYS = [RIGHT_KEY, 68]; // Thêm mã phím 'D'

    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (LEFT_KEYS.includes(keyCode) && !goingRight) {
        dx = -20;
        dy = 0;
    }

    if (UP_KEYS.includes(keyCode) && !goingDown) {
        dx = 0;
        dy = -20;
    }

    if (RIGHT_KEYS.includes(keyCode) && !goingLeft) {
        dx = 20;
        dy = 0;
    }

    if (DOWN_KEYS.includes(keyCode) && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

function handleKeydown(event) {
    const keyCode = event.keyCode;
    changeDirection({ keyCode });
}
