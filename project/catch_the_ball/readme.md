
## Catch the Moving Box 📦

Catch the Moving Box is a simple, skill-based browser game where a box moves randomly on the screen, and the player must click on it quickly to score points within a time limit. The core challenge is the increasing speed of the box.

---

### 🌟 Key Features
* **Persistent High Score:** Tracks and saves the player's best score using local storage.
* **Dynamic HTML:** Elements are created and updated in the DOM (Score, Timer, High Score).
* **CSS Animations:** Provides stylish transitions for the box movement and a crisp **catch animation** (box grows/flashes when clicked).
* **Robust Game Logic:**
    * **Click Handling:** Listens for clicks on the box to score points.
    * **Speed Scaling:** The box speed gradually increases as the player's score rises.
    * **Time Management:** Countdown timer based on user input (30 to 600 seconds).
* **User Controls:** Options to adjust **Difficulty** (movement speed) and **Time Limit**.
* **Game State Management:** Clear separation between Start/End, Pause/Resume, and Reset states.
* **Sound Effects:** Toggleable audio feedback for catches.
* **Modern UI:** Stylish game over modal, flexible buttons, and a responsive design.

---

### 📁 Project Structure
```

catch\_the\_box/
│
├── index.html      \# Main HTML structure and element linkage
├── style.css       \# CSS for styling, animations, and responsiveness
├── script.js       \# Core JavaScript game logic, timers, and state management
├── favicon.ico     \# Browser tab icon (to resolve console errors)
└── readme.md       \# Project documentation (this file)

```

---

### 🎮 How To Play
1.  **Settings:** Adjust the **Difficulty** and **Time Limit** as desired (default is 30 seconds on Easy).
2.  **Start:** Click the **Start** button to begin the countdown and box movement.
3.  **Catch:** Click the moving **circular box** to earn 1 point.
4.  **Speed Up:** The box gets progressively faster as your score increases, regardless of the initial difficulty setting.
5.  **Game Over:** When the timer hits zero, the **Game Over modal** appears, showing your score and the option to replay.

---

### 🚀 Installation
1.  **Download:** Clone or download the project files to your local machine.
2.  **Navigate:** Open your terminal and navigate to the project directory:
    ```bash
    cd project/catch_the_box
    ```
3.  **Run with Live Server:** To ensure all features, especially **audio playback**, work correctly without browser security errors, use a local server:
    * Install the **Live Server** extension in VS Code.
    * Right-click `index.html` and select **"Open with Live Server"**.
4.  Start playing and enjoy chasing the high score!
