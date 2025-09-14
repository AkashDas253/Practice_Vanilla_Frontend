

## Catch the Moving Box

Catch the Moving Box is a simple browser game where a box moves randomly on the screen, and the player must click on it to score points. The difficulty increases as the box moves faster over time.

---

### Features
- Dynamic HTML: Creating and updating elements in the DOM.
- CSS Animations: Styling and smooth transitions.
- JavaScript Event Handling: Listening for clicks and updating scores dynamically.
- Game Logic: Speed increases over time to challenge the player.
- **Visual Upgrades:**
  - Catch animation (box grows/flashes when clicked)
  - Stylish game over modal with score and replay
  - Modern gradient and pattern background
- Difficulty and time controls
- Sound effects (toggleable)
- Responsive design for mobile

---

### Project Structure
```
catch_the_ball/
│
├── index.html      # Main HTML file
├── style.css       # CSS for styling
├── script.js       # JavaScript game logic
└── readme.md       # Project documentation
```

---

### How It Works
1. The game displays a moving box inside a `div`.
2. The box moves randomly every second (interval based on difficulty).
3. Clicking the box increases the score and triggers a catch animation.
4. The box speed increases every 5 points.
5. When time runs out, a modal shows your final score and replay option.
6. You can adjust difficulty, time limit, and toggle sound.

### Installation
1. Clone or download the project files.
2. Navigate to the project directory:
   ```
   cd project/catch_the_ball
   ```
3. Open the `index.html` file in any modern browser.
4. Start playing and enjoy!

---
