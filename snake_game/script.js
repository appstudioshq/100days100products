const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const startBtn = document.getElementById('startBtn');

// Game Constants
const TILE_SIZE = 20;
const TILE_COUNT = canvas.width / TILE_SIZE;
const GAME_SPEED = 100; // ms

// Game State
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameInterval;
let isPlaying = false;
let isPaused = false;
let touchStartX = 0;
let touchStartY = 0;

class Snake {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.velocity = { x: 1, y: 0 };
        this.nextVelocity = { x: 1, y: 0 };
        this.growPending = 0;
    }

    update() {
        // Apply the next velocity (prevents double-turn suicide glitch)
        this.velocity = { ...this.nextVelocity };

        // Calculate new head position
        const head = { ...this.body[0] };
        head.x += this.velocity.x;
        head.y += this.velocity.y;

        // Add new head
        this.body.unshift(head);

        // Remove tail unless growing
        if (this.growPending > 0) {
            this.growPending--;
        } else {
            this.body.pop();
        }
    }

    grow() {
        this.growPending++;
    }

    changeDirection(x, y) {
        // Prevent 180 degree turns
        if (x === -this.velocity.x && y === -this.velocity.y) return;
        this.nextVelocity = { x, y };
    }

    checkCollision(width, height) {
        const head = this.body[0];

        // Wall Collision
        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
            return true;
        }

        // Self Collision (start checking from segment 1, not 0)
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    draw() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--nokia-fg').trim();
        this.body.forEach((segment, index) => {
            // Draw slightly smaller rects for segment definition
            ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE - 2, TILE_SIZE - 2);
        });
    }
}

class Food {
    constructor() {
        this.position = { x: 15, y: 10 };
    }

    respawn(snake) {
        let newPos;
        let valid = false;
        
        while (!valid) {
            newPos = {
                x: Math.floor(Math.random() * TILE_COUNT),
                y: Math.floor(Math.random() * TILE_COUNT)
            };

            // Check if food spawns on snake
            valid = !snake.body.some(segment => segment.x === newPos.x && segment.y === newPos.y);
        }
        this.position = newPos;
    }

    draw() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--nokia-fg').trim();
        // Outer box
        ctx.fillRect(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, TILE_SIZE - 2, TILE_SIZE - 2);
        // Inner "bite" (hollow)
        const bg = getComputedStyle(document.documentElement).getPropertyValue('--nokia-bg').trim();
        ctx.fillStyle = bg;
        ctx.fillRect(this.position.x * TILE_SIZE + 4, this.position.y * TILE_SIZE + 4, TILE_SIZE - 10, TILE_SIZE - 10);
        // Core
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--nokia-fg').trim();
        ctx.fillRect(this.position.x * TILE_SIZE + 7, this.position.y * TILE_SIZE + 7, 6, 6);
    }
}

const snake = new Snake();
const food = new Food();

function gameLoop() {
    if (isPaused) return;

    snake.update();

    // Check Collisions
    if (snake.checkCollision(TILE_COUNT, TILE_COUNT)) {
        gameOver();
        return;
    }

    // Check Food
    if (snake.body[0].x === food.position.x && snake.body[0].y === food.position.y) {
        snake.grow();
        score += 10;
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        food.respawn(snake);
    }
    
    draw();
}

function draw() {
    // Clear screen
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--nokia-bg').trim();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    food.draw();
    snake.draw();
}

function gameOver() {
    isPlaying = false;
    clearInterval(gameInterval);
    overlayTitle.textContent = "GAME OVER";
    overlayMessage.textContent = `Score: ${score}`;
    startBtn.textContent = "TRY AGAIN";
    overlay.classList.remove('hidden');
}

function startGame() {
    if (isPlaying) return;
    
    isPlaying = true;
    isPaused = false;
    score = 0;
    scoreElement.textContent = '0';
    overlay.classList.add('hidden');
    
    snake.reset();
    
    // Ensure food doesn't start on snake (rare but possible)
    food.respawn(snake);
    
    draw();
    
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, GAME_SPEED);
}

function togglePause() {
    if (!isPlaying) return;
    isPaused = !isPaused;
    if (isPaused) {
        overlayTitle.textContent = "PAUSED";
        overlayMessage.textContent = "Press Space to Resume";
        startBtn.textContent = "RESUME";
        startBtn.onclick = () => {
            togglePause();
            startBtn.onclick = startGame; // reset handler
        };
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
        startBtn.onclick = startGame;
    }
}

// Initial Draw
highScoreElement.textContent = highScore;
draw();

// Event Listeners
startBtn.addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
    handleInput(e.key);
});

// Keypad Button Listeners
document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        handleInput(btn.getAttribute('data-key'));
    });
    // Prevent double-tap zoom issues and feel more responsive
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // prevents mouse emulation
        handleInput(btn.getAttribute('data-key'));
        btn.classList.add('active'); // Add active state if needed via JS or rely on :active
    });
});

// Menu button acting as Start/Select
const menuBtn = document.getElementById('btn-menu');
const handleMenuAction = (e) => {
    e.preventDefault();
    if (isPlaying) togglePause();
    else startGame();
};
menuBtn.addEventListener('click', handleMenuAction);
menuBtn.addEventListener('touchstart', handleMenuAction);

function handleInput(key) {
    // Number keys for valid direction changes
    // 2=UP, 8=DOWN, 4=LEFT, 6=RIGHT
    
    // Also support Arrow keys for desktop fallback convenience
    if (!isPlaying && (key === 'Enter' || key === ' ')) {
        startGame();
        return;
    }

    if (isPlaying) {
        switch(key) {
            case 'ArrowUp':
            case '2':
                if (!isPaused) snake.changeDirection(0, -1);
                break;
            case 'ArrowDown':
            case '8':
                if (!isPaused) snake.changeDirection(0, 1);
                break;
            case 'ArrowLeft':
            case '4':
                if (!isPaused) snake.changeDirection(-1, 0);
                break;
            case 'ArrowRight':
            case '6':
                if (!isPaused) snake.changeDirection(1, 0);
                break;
            case 'Space':
            case ' ':
            case '#': // Let '#' act as pause on keypad
                togglePause();
                break;
        }
    }
}
