
# Swipe Snake

Swipe Snake is a modern version of the classic Snake game playable with keyboard arrow keys (desktop) or swipe gestures (mobile). The game tracks your score and saves the highest score in your browser.

## Features:
## Features:
- **Arrow Key Controls** (for desktop)
- **Swipe Gesture Controls** (for mobile devices)
- **Pause/Resume Game**
- **Restart Game**
- **Score Tracking** with **Highest Score** saved in localStorage and displayed on UI
- **Game Over** condition when the snake collides with walls, itself, or obstacles
- **Obstacles**: New obstacles appear as you score higher
- **Increasing Speed**: The game gets faster every 5 points
- **Sound Effects**: Eating food and game over events play sounds
- **Animated Food & Game Over**: Visual feedback for eating and losing
- **Improved Mobile UI**: Responsive design for phones/tablets

## How to Play:
- On **desktop**, use the **Arrow Keys** to control the snake (Up, Down, Left, Right).
- On **mobile devices**, swipe **Left**, **Right**, **Up**, or **Down** to control the snake.
- The snake moves continuously, and your goal is to eat the red food that appears on the canvas. Each time you eat food, your score increases and the game gets faster.
- Avoid hitting the walls, your own body, or obstacles that appear as you score higher.
- Click **Pause** to stop the game and **Resume** to continue from where you left off. You can restart the game anytime.
- Sound effects and animations provide feedback for eating and game over.
- Click **Pause** to stop the game and **Resume** to continue from where you left off. You can restart the game anytime.
## Game Controls:
- **Arrow Keys (Desktop)**: Control the snake's movement.
- **Swipe (Mobile)**: Swipe left, right, up, or down to change the snake's direction.
- **Pause Button**: Pauses the game and changes to a Resume button.
- **Restart Button**: Restarts the game once the game is over.
- **Sound Effects**: Eating and game over events play sounds (can be muted via browser tab).
- **Pause Button**: Pauses the game and changes to a Resume button.
- **Restart Button**: Restarts the game once the game is over.

## Requirements:
This game runs directly in the browser and doesn't require any server-side components.

## Installation

## Project Structure
```
swipe_snake/
├── index.html      # Main HTML file
├── style.css       # CSS for styling (renamed from styles.css)
├── script.js       # JavaScript game logic
├── readme.md       # Project documentation
```
## Screenshots

_Add screenshots here to showcase new UI and features!_
1. Clone or download the project files.
2. Navigate to the project directory:
	```
	cd project/swipe_snake
	```
3. Open the `index.html` file in any modern browser (Chrome, Firefox, etc.).
4. Start playing and enjoy!

## Project Structure

```
swipe_snake/
│
├── index.html      # Main HTML file
├── styles.css      # CSS for styling
├── script.js       # JavaScript game logic
└── readme.md       # Project documentation
```

## Dependencies

None (Pure HTML, CSS, and JavaScript)

## Credits:
- Developed by Akash Das
- Based on the classic Snake game.
