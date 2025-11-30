
# Swipe Snake

Swipe Snake is a modern, feature-rich version of the classic Snake game playable with keyboard arrow keys (desktop) or swipe gestures (mobile). The game tracks your score and saves the highest score in your browser.

## ✨ Features
- **Persistent Settings:** **Saves** your chosen **Wall Type**, **Level**, and **Bait Timeout** in the browser's storage.
- **Wall Type Selector**: Toggle between **Classic** (snake dies on wall) and **Teleporter** (snake wraps around walls) modes.
- **Level Selection**: Choose starting speed/difficulty (Level 1 is slow, Level 5 is fast).
- **Bait Timeout Setting**: Adjust how long food remains before disappearing (or set to None).
- **Arrow Key Controls** (desktop) and **Swipe Gesture Controls** (mobile).
- **Input Debouncing:** Prevents immediate 180-degree turns and accidental self-collision.
- **Pause/Resume Game** and **Restart Game**.
- **Score Tracking** with **Highest Score** saved in `localStorage`.
- **Visual Grid:** The canvas displays a light grid for better spatial awareness.
- **Score Pop-up Animation:** Displays **"+1"** visual feedback when food is eaten.
- **Game State Overlays:** Displays **PAUSED** and **GAME OVER** messages directly on the canvas.
- **Sound Effects**: Eating food and game over events play sounds (requires local `eat.mp3` and `gameover.mp3`).
- **Improved Mobile UI**: Responsive design for phones/tablets.

---

## 🕹️ How to Play

### Getting Started (Settings Panel)
1.  Use the **Wall Type Toggle** to switch between **Classic** (snake dies on wall) and **Teleporter** (snake wraps around walls) modes.
2.  Select your desired **Level** (speed) for a faster or slower game pace.
3.  Adjust the **Bait Timeout** to set how long food remains before disappearing. Choose 'None' to disable the timeout.
4.  Click the **Save** button to apply and store your settings permanently.

### Controls
* **Desktop:** Use the **Arrow Keys** (Up, Down, Left, Right).
* **Mobile Devices:** Swipe **Left**, **Right**, **Up**, or **Down** anywhere on the canvas.
* **Pause/Resume:** Use the button below the canvas to temporarily stop the game.

### Gameplay
The snake moves continuously; eat the red food to increase your score and length.

* In **Classic** mode, avoid hitting the outer walls or your own body.
* In **Teleporter** mode, hitting a wall wraps the snake to the opposite side.
* If Bait Timeout is enabled, food must be eaten before the timer expires.

---

## 🛠️ Project Structure
```

swipe\_snake/
├── index.html      \# Main HTML file
├── style.css       \# CSS for styling
├── snakeGame.js    \# Game logic class and core methods (ES module)
├── main.js         \# App initialization and UI wiring (ES module)
├── readme.md       \# Project documentation
├── eat.mp3         \# Eaten food sound effect (Required)
└── gameover.mp3    \# Game over sound effect (Required)

```

## ▶️ Setup and Running

1.  Clone or download the project files.
2.  **Ensure you have two local audio files (`eat.mp3` and `gameover.mp3`) in the main project folder.**
3.  Navigate to the project directory.
4.  Open the `index.html` file in any modern browser (Chrome, Firefox, Edge, etc.).
5.  Start playing and enjoy!

## 🤝 Dependencies

None (Pure HTML, CSS, and JavaScript ES modules)
