# snake game Walkthrough

## Overview
I have successfully implemented the Snake Game with a Nokia 3310 retro aesthetic. The game features classic mechanics, including movement, growing, scoring, collisions, and a high score system. It is fully responsive, supporting keyboard controls for desktop and touch swipe gestures for mobile.

## Features Implemented
- **Classic Gameplay**: Snake moves, eats food, grows, and dies on collision.
- **Retro UI**: Nokia 3310 color palette (`#c6f196`, `#2c3527`) and pixelated font (`VT323`).
- **Input Handling**:
    - **Desktop**: Arrow Keys or Numpad (2, 4, 6, 8).
    - **Mobile**: On-screen Keypad (2=Up, 4=Left, 6=Right, 8=Down). Swipe gestures removed.
- **Game States**: Start Screen, Playing, Paused, Game Over.
- **Persistence**: High score is saved to LocalStorage.
- **Mobile Design**: Full simulation of a retro phone body.
- **Dynamic Speed**: Game speed increases by ~0.8% (1.008x) for every 4th food item eaten, adding progressive difficulty.

## Verification Results

### Automatic Browser Testing
I performed automated tests to verify both desktop and mobile modes.

#### 1. Initial Load (Mobile View)
The game features a full retro phone body design with no specific branding.
![Mobile Design]

#### 2. Gameplay Interaction
- **Desktop**: Verified `ArrowRight` movement and collision (Game Over).
- **Mobile Keypad**: Verified clicking `Menu` to start, then using keypad `6` (Right) and `2` (Up). The snake responded correctly.
- **Speed Mechanic**: Verified via console that speed increases (interval decreases) after every 4th eat.
![Mobile Keypad Gameplay]

## How to Play
1. Open `index.html` in your browser.
2. **Desktop**: Click START or press Space.
3. **Mobile**: Click the large **Menu Button** to start.
4. **Controls**:
    - **Desktop**: Arrow Keys.
    - **Mobile**: Use the **2-4-6-8** keypad buttons to steer.
5. Press **Space** or **#** to Pause/Resume.
6. Eat food to grow and increase your score!
