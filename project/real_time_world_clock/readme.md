## Global Time Converter

### Overview

This is a clean, fast, and fully responsive Single-Page Application (SPA) designed to help users instantly convert time between any two global time zones. Built using Vanilla JavaScript and Tailwind CSS, it leverages a public API to ensure real-time accuracy and robust network handling.

It’s the perfect tool for coordinating remote team meetings, scheduling international calls, or simply checking the time for family and friends across the globe.

### Features

- Real-Time Clock: Both the source and target time displays update every single second.

- Time Zone Conversion: Easily select from a comprehensive list of over 400 time zones (organized by continent/region).

Time Difference Calculation: Automatically calculates and displays the exact time difference (e.g., "+5 hours and 30 minutes") between the two selected zones.

- Responsive Design: Fully optimized layout for seamless use on mobile phones, tablets, and desktop screens.

- Robust Networking: Implements an exponential backoff retry mechanism to gracefully handle temporary API downtime or network interruptions.

### Technology Stack

- Frontend: HTML5, Vanilla JavaScript (ES6+), and CSS

- Styling: Tailwind CSS (loaded via CDN for simplicity)

- Data Source: World Time API (worldtimeapi.org)

## How to Run Locally

Since this application is a single, self-contained HTML file, running it couldn't be simpler:

Save the provided code as a file named index.html.

Open index.html directly in any modern web browser (Chrome, Firefox, Edge, Safari).

No server, dependencies, or build process is required!

### Development Notes

The core logic relies on fetching accurate time data (including current Unix time, raw offset, and DST offset) from the World Time API upon selection change. The continuous, real-time update is then managed locally using setInterval and calculated relative to the user's local system time to maintain high fidelity and minimize unnecessary API requests.
