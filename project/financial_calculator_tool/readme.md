
# 💰 FinanceHub SPA

**FinanceHub** is a modular, Single Page Application (SPA) designed to perform various financial calculations. Built entirely with **Vanilla HTML, CSS, and JavaScript**, it utilizes ES6 Modules and a custom lightweight routing system to load calculator tools dynamically without page reloads.

## 🚀 Features

* **SPA Architecture:** Fast navigation without refreshing the page.
* **Modular Design:** Calculators are separated into individual files ("plugins"), making the code clean and scalable.
* **Zero Dependencies:** No frameworks (React, Vue, etc.) or libraries required. Pure browser-native JavaScript.
* **Responsive UI:** Clean sidebar navigation and mobile-friendly layout.

## 🧰 Included Calculators

1.  **Compound Interest:** Calculate future value based on principal, rate, and time.
2.  **Loan Amortization:** Estimate monthly mortgage/loan payments.
3.  **ROI Calculator:** Calculate the percentage return on an investment.
4.  **Inflation Calculator:** Determine the future purchasing power of money.

## 📂 Project Structure

```text
/finance-hub
├── index.html           # Main entry point (Shell)
├── styles.css           # Global styling
├── main.js              # Router & Module Loader
└── modules/             # Calculator Logic & UI
    ├── compound.js      
    ├── amortization.js  
    ├── roi.js           
    └── inflation.js     
```

## 🛠️ How to Run

⚠️ **Important:** Because this project uses **ES6 Modules** (`import`/`export`), you cannot simply double-click `index.html` to open it. Browsers block modules on the `file://` protocol for security (CORS).

You must serve the files using a local web server. Here are two easy ways:

### Option A: VS Code "Live Server" (Recommended)

1.  Open the project folder in **VS Code**.
2.  Install the **Live Server** extension.
3.  Right-click `index.html` and select **"Open with Live Server"**.

### Option B: Python Simple Server

If you have Python installed, open your terminal in the project folder and run:

```bash
# Python 3
python -m http.server 8000
```

Then open your browser to `http://localhost:8000`.

## ➕ How to Add a New Calculator

The architecture allows you to plug in new tools easily.

1.  **Create the Module:**
    Create a new file in `modules/` (e.g., `savings.js`). It must export two functions:

    ```javascript
    export function getTemplate() { return `HTML STRING HERE`; }
    export function init() { /* Event listeners here */ }
    ```

2.  **Register the Route:**
    Open `main.js`, import your new file, and add it to the `routes` object:

    ```javascript
    import * as Savings from './modules/savings.js';

    const routes = {
        // ... existing routes
        'savings': Savings
    };
    ```

3.  **Update Navigation:**
    Add a link in `index.html`:

    ```html
    <li><a href="#savings" class="nav-link" data-target="savings">Savings Goal</a></li>
    ```

## 📄 License

This project is open source and free to use.
