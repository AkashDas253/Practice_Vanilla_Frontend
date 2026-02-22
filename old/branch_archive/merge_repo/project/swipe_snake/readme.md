
# Swipe Snake

Swipe Snake is a modern version of the classic Snake game playable with keyboard arrow keys (desktop) or swipe gestures (mobile). The game tracks your score and saves the highest score in your browser.

## Features
- **Arrow Key Controls** (desktop)
- **Swipe Gesture Controls** (mobile)
- **Pause/Resume Game**
- **Restart Game**
- **Score Tracking** with **Highest Score** saved in localStorage and displayed on UI
- **Game Over** when the snake collides with walls, itself, or obstacles
- **Obstacles**: New obstacles appear as you score higher
- **Increasing Speed**: The game gets faster every 5 points
- **Sound Effects**: Eating food and game over events play sounds
- **Animated Food & Game Over**: Visual feedback for eating and losing
- **Improved Mobile UI**: Responsive design for phones/tablets
- **Wall Type Selector**: Toggle button to switch between Classic and Teleporter wall modes (top of UI)
- **Level Selection**: Choose starting level/speed (top of UI)
- **Bait Timeout Setting**: Adjust how long food remains before disappearing (top of UI)
- **Settings Panel**: All options are at the top of the game UI for easy access

## How to Play
At the top of the game, use the **Wall Type Toggle** to switch between Classic (snake dies on wall) and Teleporter (snake wraps around walls) modes.
Select your desired **Level** to start with a faster or slower snake.
Adjust the **Bait Timeout** to set how long food remains before disappearing.
Use the **Settings Panel** at the top for all game options.
Game controls (Pause, Restart, etc.) are located at the bottom of the game UI.
On **desktop**, use the **Arrow Keys** to control the snake (Up, Down, Left, Right).
On **mobile devices**, swipe **Left**, **Right**, **Up**, or **Down** to control the snake.
The snake moves continuously; eat the red food to increase your score and speed.
Avoid hitting the walls, your own body, or obstacles that appear as you score higher.
Use the **Pause** button to stop the game and **Resume** to continue. You can restart the game anytime.
Sound effects and animations provide feedback for eating and game over.

## Game Controls
**Wall Type Toggle**: Switch wall behavior (top of UI)
**Level Selector**: Pick starting level/speed (top of UI)
**Bait Timeout**: Set food timeout (top of UI)
**Arrow Keys (Desktop)**: Control the snake's movement
**Swipe (Mobile)**: Swipe left, right, up, or down to change the snake's direction
**Pause Button**: Pauses the game and changes to a Resume button
**Restart Button**: Restarts the game once the game is over
**Sound Effects**: Eating and game over events play sounds (can be muted via browser tab)

## Requirements
This game runs directly in the browser and doesn't require any server-side components.
## Project Structure
```
swipe_snake/
├── index.html      # Main HTML file
├── style.css       # CSS for styling
├── snakeGame.js    # Game logic class (ES module)
├── main.js         # App initialization and UI wiring (ES module)
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
	- Make sure your browser supports ES modules (most modern browsers do).
	- The game logic is now split into `snakeGame.js` (class) and `main.js` (initialization).
4. Start playing and enjoy!

## Dependencies

None (Pure HTML, CSS, and JavaScript ES modules)

## Credits:
- Developed by Akash Das
- Based on the classic Snake game.
