# Weather App 🌤️

## Overview
The Weather App is a simple web application that allows users to search for the current weather and hourly forecast of any city. The app uses the Open-Meteo API to fetch weather data and Nominatim for geocoding city names.

## Features
- **Current Weather**: Get the current temperature and wind speed for any city.
- **Hourly Forecast**: View hourly temperature and wind speed for the next few hours.
- **Error Handling**: Displays an error message if the city is not found or if there is an issue fetching the weather data.
- **Responsive Design**: The app is designed to work across different devices.

## Screenshots
*(Include screenshots or GIFs of your app here)*

## Demo
*(Include a link to your live demo hosted on GitHub Pages or another platform if available)*

## Installation
To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/weather-app.git```

2.  **Navigate to the project directory**:

    ```
    cd weather-app
    ```

3.  **Open `index.html` in your browser**: You can simply double-click on the `index.html` file to open it in your default browser, or use a live server extension if you're using VSCode.

## Usage


1.  **Search for a City**: Enter the name of the city you want to search for in the input field and click the "Search" button.
2.  **View Weather Information**: The app will display the current weather and hourly forecast for the city.
3.  **Search for a New City**: Click the "New City" button to search for a different city.

## Technologies Used


-   **HTML**: Structure of the application.
-   **CSS**: Styling of the application.
-   **JavaScript**: Fetching and displaying weather data.
-   **Open-Meteo API**: Used for fetching weather data.
-   **Nominatim API**: Used for geocoding city names.

## Project Structure


```
weather-app/
│
├── index.html          # Main HTML file
├── style.css           # CSS for styling
├── script.js           # JavaScript for functionality
└── README.md           # Project documentation
```

## API Integration


This project uses two external APIs:

1.  **Open-Meteo API**: For fetching weather data. The API requires the latitude and longitude of the city to return weather information.
2.  **Nominatim API**: For geocoding city names to latitude and longitude.

## How It Works:

1.  User enters a city name and clicks "Search".
2.  The app uses Nominatim API to get the latitude and longitude of the city.
3.  The app then uses Open-Meteo API to fetch the weather data based on the latitude and longitude.
4.  The app displays the current weather and hourly forecast.

## Error Handling


The app handles the following errors:

-   **City Not Found**: If the city is not found, an error message is displayed.
-   **API Errors**: If there is an issue with fetching data from the APIs, an error message is displayed.

## Contributing


Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.

License
-------

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements


-   [Open-Meteo API](https://open-meteo.com/) for providing weather data.
-   [Nominatim API](https://nominatim.openstreetmap.org/) for geocoding city names.
