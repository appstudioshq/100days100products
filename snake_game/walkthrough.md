# snake game Walkthrough

## Overview
I have successfully implemented the Snake Game with a Nokia 3310 retro aesthetic. The game features classic mechanics, including movement, growing, scoring, collisions, and a high score system. It is fully responsive, supporting keyboard controls for desktop and touch swipe gestures for mobile.

## Features Implemented
- **Classic Gameplay**: Snake moves, eats food, grows, and dies on collision.
- **Retro UI**: Nokia 3310 color palette (`#c6f196`, `#2c3527`) and pixelated font (`VT323`).
- **Input Handling**:
    - **Desktop**: Arrow Keys to move, Space to Pause/Resume.
    - **Mobile**: Swipe gestures to control direction.
- **Game States**: Start Screen, Playing, Paused, Game Over.
- **Persistence**: High score is saved to LocalStorage.

## Verification Results

### Automatic Browser Testing
I performed an automated test capability to verify the game loop.

#### 1. Initial Load
The game loads correctly with the Start Screen overlay.
![Initial Load](/Users/anivratgoel/.gemini/antigravity/brain/e9b2ba80-baff-40e9-b776-5a08775c3aed/initial_load_1770216544644.png)

#### 2. Gameplay Interaction
After clicking "START" and pressing `ArrowRight`, the snake moved. The test allowed the snake to crash, triggering the Game Over screen, verifying that the game logic (movement + collision) is active.
![Game Over State](/Users/anivratgoel/.gemini/antigravity/brain/e9b2ba80-baff-40e9-b776-5a08775c3aed/after_arrow_right_1770216570151.png)

## How to Play
1. Open `index.html` in your browser.
2. Click **START**.
3. Use **Arrow Keys** (Desktop) or **Swipe** (Mobile) to control the snake.
4. Press **Space** to Pause/Resume.
5. Eat food to grow and increase your score!
