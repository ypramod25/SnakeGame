document.addEventListener('DOMContentLoaded', function () {

    const gameArena = document.getElementById('game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = { x: 0, y: 0 };
    let snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
    let dx = cellSize;
    let dy = 0;
    let intervalId;
    let gameSpeed = 200;

    // function moveFood() {
    //     let newX, newY;
    //     do {
    //         newX = Math.floor(Math.random() * 30) * cellSize;
    //         newY = Math.floor(Math.random() * 30) * cellSize;
    //     } while (snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));
    //     food = { x: newX, y: newY };
    // }
    function moveFood() {
        const positions = [];

        // Top and Bottom borders
        for (let x = 0; x < arenaSize; x += cellSize) {
            positions.push({ x: x, y: 0 }); // Top border
            positions.push({ x: x, y: arenaSize - cellSize }); // Bottom border
        }

        // Left and Right borders (excluding corners already added)
        for (let y = cellSize; y < arenaSize - cellSize; y += cellSize) {
            positions.push({ x: 0, y: y }); // Left border
            positions.push({ x: arenaSize - cellSize, y: y }); // Right border
        }

        // Filter out any position that overlaps with the snake
        const availablePositions = positions.filter(pos =>
            !snake.some(cell => cell.x === pos.x && cell.y === pos.y)
        );

        if (availablePositions.length > 0) {
            const index = Math.floor(Math.random() * availablePositions.length);
            food = availablePositions[index];
        } else {
            // Fallback: just place food at (0,0) if no position available
            food = { x: 0, y: 0 };
        }
    }


    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            moveFood();
            if (gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed -= 10;
                gameLoop();
            }
        } else {
            snake.pop();
        }
    }

    function changeDirection(e) {
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;

        if (e.key === 'ArrowUp' && !isGoingDown) {
            dx = 0;
            dy = -cellSize;
        } else if (e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if (e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if (e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    function drawFoodAndSnake() {
        gameArena.innerHTML = '';
        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        });

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    function isGameOver() {
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }

        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > arenaSize - cellSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > arenaSize - cellSize;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function gameLoop() {
        intervalId = setInterval(() => {
            if (isGameOver()) {
                clearInterval(intervalId);
                gameStarted = false;
                alert('Game Over\nYour Score: ' + score);

                const restartButton = document.getElementById('restart-button');
                restartButton.style.display = 'inline-block';

                return;
            }
            updateSnake();
            drawFoodAndSnake();
            drawScoreBoard();
        }, gameSpeed);
    }

    function runGame() {
        if (!gameStarted) {
            document.removeEventListener('keydown', changeDirection); // Remove existing listener
            document.addEventListener('keydown', changeDirection);    // Add it again
            gameLoop();
            gameStarted = true;
        }
    }


    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
    }

    function initiateGame() {
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
        document.body.insertBefore(scoreBoard, gameArena);

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');
        startButton.id = 'start-button';
        document.body.appendChild(startButton);

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.classList.add('start-button');
        restartButton.style.display = 'none';
        restartButton.id = 'restart-button';
        document.body.appendChild(restartButton);

        startButton.addEventListener('click', function () {
            startButton.style.display = 'none';
            runGame();
        });

        restartButton.addEventListener('click', function () {
            resetGame();
            runGame();
            restartButton.style.display = 'none'; // Hide again after restarting
        });
    }

    function resetGame() {
        clearInterval(intervalId);

        score = 0;
        gameSpeed = 200;
        dx = cellSize;
        dy = 0;
        snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
        food = { x: 300, y: 200 };
        drawFoodAndSnake();
        drawScoreBoard();
        gameStarted = false; // Reset so runGame() will work again
    }


    initiateGame();
});
