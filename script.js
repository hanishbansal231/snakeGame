// Game Variabel
let inputDir = { x: 0, y: 0 };
let lastPaintTime = 0;
let speed = 10;
let snakeArr = [{ x: 13, y: 17 }];
let food = { x: 5, y: 7 };
let score = 0;
let hiScoreVal = 0;
let board = document.querySelector('.gameBody');
let scorebox = document.querySelector('.score');
let highScore = document.querySelector('.highScore');
let controls = document.querySelectorAll('.controls i');
// Game Music Variable
const foodSound = new Audio('./music/food.mp3');
const moveSound = new Audio('./music/move.mp3');
const gameOverSound = new Audio('./music/gameover.mp3');
const musicSound = new Audio('./music/music.mp3');
// Game loop
const main = (cTime) => {
    window.requestAnimationFrame(main);
    if ((cTime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = cTime;
    gameEngine();
};
// Game Over Logic
const isCollide = (snake) => {
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x >= 30 || snake[0].x <= 0 || snake[0].y >= 30 || snake[0].y <= 0) {
        return true;
    }
};
const gameEngine = () => {
    //part 1 : Update the snake Array and food
    // Game Over Logic
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert('Game Over. Press any key to play again!');
        snakeArr = [{ x: 13, y: 17 }];
        score = 0;
        musicSound.play();
    }
    // Eating the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiScoreVal) {
            hiScoreVal = score;
            localStorage.setItem('hiScore', JSON.stringify(hiScoreVal));
            highScore.innerHTML = `High Score: ${hiScoreVal}`;
        }
        scorebox.innerHTML = `Score: ${score}`;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = { x: Math.floor(Math.random() * 30) + 1, y: Math.floor(Math.random() * 30) + 1 }
    }
    // Snake Increase
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
        console.log(snakeArr);
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
    //Part 2 : Display the Snake And Food
    board.innerHTML = "";
    // Snake Element 
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        Object.assign(snakeElement.style, {
            gridColumnStart: e.x,
            gridRowStart: e.y,
        });
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });
    //    Food Element
    foodElement = document.createElement('div');
    Object.assign(foodElement.style, {
        gridColumnStart: food.x,
        gridRowStart: food.y,
    });
    foodElement.classList.add('food');
    board.appendChild(foodElement);
};
// Change the Direction code
const changeDirection= (e) =>{
    inputDir = { x: 0, y: 1 }; // Start the Game
    musicSound.play();
    moveSound.play();
    switch (e.key) {
        case "ArrowUp": {
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        }
        case "ArrowDown": {
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        }
        case "ArrowLeft": {
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        }
        case "ArrowRight": {
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        }
        default:
            break;
    }
};
// Local Storage
hiScoreVal = localStorage.getItem('hiScore') ? JSON.parse(localStorage.getItem('hiScore')) : 0;
highScore.innerHTML = `High Score: ${hiScoreVal}`;
localStorage.setItem('hiScore', JSON.stringify(hiScoreVal));
// Main Logic
window.requestAnimationFrame(main);
// Change the Direction of snake
window.addEventListener('keydown',changeDirection);
// Use the controlers 
controls.forEach((key)=>{
    key.addEventListener('click',()=>{
        moveSound.play();
        changeDirection({key: key.dataset.key});
    });
});
