
## Global Time Zone Converter

### Overview

This is a clean, fast, and fully responsive Single-Page Application (SPA) designed to help users instantly convert time between any two global time zones. Built using **Vanilla JavaScript** and **Tailwind CSS**, it leverages native browser APIs to provide high-fidelity time data with zero external dependencies.

It’s the perfect tool for coordinating remote team meetings, scheduling international calls, or simply checking the time for family and friends across the globe.

### Features

* **Real-Time Clock:** High-precision clocks for both origin and destination that update every second.
* **Bookmarkable Links:** Automatically updates the URL query strings (`?s=...&t=...`) so you can bookmark specific conversions or share them with others.
* **Theme Toggle:** Built-in Dark and Light modes that persist via `localStorage` and respect system preferences.
* **Adaptive Layout:** A "direction-aware" swap button that changes its icon based on whether the layout is stacked (mobile) or side-by-side (desktop).
* **Time Difference Calculation:** Automatically calculates the exact offset between zones, handling unique half-hour and 45-minute offsets (e.g., "+5h 30m Ahead").
* **Offline First:** Uses the `Intl.DateTimeFormat` engine, meaning the app works perfectly without an internet connection once loaded.

### Technology Stack

* **Frontend:** HTML5, Vanilla JavaScript (ES6+).
* **Styling:** Tailwind CSS (configured for `class` based dark mode).
* **Time Engine:** Native Browser `Intl` API (no external API calls required, ensuring 100% uptime).

## How to Run Locally

Since this application consists of self-contained files, running it is simple:

1. Save the code into `index.html` and `script.js`.
2. Open `index.html` directly in any modern web browser.
3. **No server, dependencies, or build process is required!**

### Development Notes

The application uses `Intl.supportedValuesOf('timeZone')` to dynamically populate over 400 IANA time zones. By using the browser's internal time engine instead of a REST API, the app avoids "jumps" in time caused by network latency and provides a much smoother user experience. The state is synchronized with the browser's history API, allowing the back/forward buttons to navigate through your previous time zone selections.

---
