
# Pixel Studio (Pixel Art Maker)

A professional-grade, browser-based **Pixel Art Editor**. Create, edit, and export crisp pixel art with a streamlined dark-mode interface.

## Features

* **Custom Dimensions:** Create square or rectangular canvases from 4x4 up to 64x64.
* **Precision Tools:** Dedicated Draw and Erase modes with right-click to erase shortcut.
* **Auto-Save:** Your work is automatically saved to LocalStorage—never lose your progress on refresh.
* **Smart Export:** Download your creations as high-quality PNG files with one click.
* **Built-in Hotkeys:**
    * `B` - Brush Tool
    * `E` - Eraser Tool
    * `G` - Toggle Grid Lines

## Getting Started

### Installation
1. **Download the source code** from the repository or project folder to your local machine.
2. **Navigate to the project folder:**
   ```text
   /project/pixel_art_maker
    ```

3. **Run the project:**
Because this project uses **JavaScript Modules**, you must run it through a local server (browsers block modules via the `file://` protocol for security).
* **Option A (VS Code):** Right-click `index.html` and select **"Open with Live Server"**.
* **Option B (Python):** Run `python -m http.server` in the terminal and go to `localhost:8000`.



## Built With

* **HTML5 Canvas** - High-performance pixel rendering.
* **Vanilla JavaScript** - Clean, modular logic with LocalStorage persistence.
* **CSS3** - Custom variables and Studio dark-mode UI.

## Usage

1. **Set Dimensions:** Use the width/height steppers. Note: Changing size will prompt to clear the current canvas.
2. **Pick a Color:** Use the color input to change your brush.
3. **Draw:** Left-click to place pixels. Hold and drag to paint. Use `B`, `E`, or `G` keys to switch tools quickly.
4. **Export:** Click **Download** to save a clean PNG without grid lines.

## Folder Structure

```text
pixel_art_maker/
├── index.html
├── style.css
└── js/
    └── main.js

```

## License

This project is open source and available under the [MIT License](./LICENSE).

---