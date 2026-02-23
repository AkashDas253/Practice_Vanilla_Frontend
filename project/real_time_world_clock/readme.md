
# Global Time Zone Converter

### Overview

Global Time Zone Converter is a lightweight, zero-dependency web application for real-time synchronization between international locations. It utilizes the native browser **Intl** API to provide accurate time data and offsets without the need for external libraries or API calls.

### Technical Specifications

* **Engine:** Vanilla JavaScript (ES6+)
* **CSS Framework:** Tailwind CSS 3.4+
* **Data Source:** IANA Time Zone Database (Browser Native)
* **State Management:** URL Search Parameters (`window.history`)
* **Persistence:** `localStorage` for theme synchronization

---

### Core Features

1. **Dual Clock Interface:** Real-time 1-second interval updates for origin and destination zones.
2. **Contextual Greeting & Meal Engine:** Dynamic UI component that provides time-appropriate greetings (Good Morning, etc.) and suggests meal types based on the destination's 24-hour cycle.
3. **Fractional Offset Support:** Accurately calculates differences for regions with non-hourly offsets (e.g., +5:30, +5:45).
4. **Responsive Swap Logic:** Adaptive layout toggle that transitions between vertical (mobile) and horizontal (desktop) orientations via Tailwind utility classes.
5. **Dark Mode:** System-aware theme toggle with persistent user preference memory and vibrant emoji integration.

---

### Project Architecture

#### 1. Input Layer

Uses `Intl.supportedValuesOf('timeZone')` to generate a comprehensive list of over 400 global regions.

#### 2. Calculation Layer

Determines time differences by extracting `shortOffset` strings from the browser's internal clock. This ensures accuracy during Daylight Savings Time (DST) transitions.

#### 3. State Layer

The application state is mirrored in the browser URL. Sharing the current URL preserves the selected time zones for the recipient.

---

### Installation and Usage

The project consists of three self-contained files:

1. `index.html`: Semantic structure and Tailwind integration.
2. `style.css`: Minimal overrides for form appearance and animations.
3. `script.js`: Core logic and update loop.

**Execution:**
Open `index.html` in any modern web browser. No build process, server, or package installation is required.

---

### File Logic Summary

* **`init()`**: Populates dropdowns and restores state from URL/Storage.
* **`update()`**: Re-renders time strings, greetings, and meal suggestions every 1000ms.
* **`getOffset()`**: Resilient regex-based offset extraction from localized strings.
* **`getContext()`**: Maps the 24-hour integer to specific daily meal windows, greetings, and relevant emojis.

---
