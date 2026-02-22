// Function to fetch weather data from the API
async function fetchWeatherData(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

// Function to create a div for displaying current weather
function createCurrentWeatherDiv(data) {
    const currentWeatherDiv = document.createElement('div');

    const temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${data.temperature_2m} °C`;
    currentWeatherDiv.appendChild(temperature);

    const windSpeed = document.createElement('p');
    windSpeed.textContent = `Wind Speed: ${data.wind_speed_10m} km/h`;
    currentWeatherDiv.appendChild(windSpeed);

    return currentWeatherDiv;
}

// Function to create a div for displaying hourly forecast
function createHourlyForecastDiv(hourlyData) {
    const hourlyForecastDiv = document.createElement('div');
    hourlyForecastDiv.classList.add('hourly-data');

    hourlyData.time.forEach((time, index) => {
        const hourlyItem = document.createElement('div');
        hourlyItem.classList.add('hourly-item');

        const timeElement = document.createElement('span');
        timeElement.textContent = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const tempElement = document.createElement('span');
        tempElement.textContent = `${hourlyData.temperature_2m[index]} °C`;

        const windElement = document.createElement('span');
        windElement.textContent = `${hourlyData.wind_speed_10m[index]} km/h`;

        hourlyItem.appendChild(timeElement);
        hourlyItem.appendChild(tempElement);
        hourlyItem.appendChild(windElement);

        hourlyForecastDiv.appendChild(hourlyItem);
    });

    return hourlyForecastDiv;
}

// Function to attach the created elements to the respective places in the DOM
function attachWeatherData(data, cityName) {
    const currentWeatherSection = document.getElementById('current-weather');
    const hourlyForecastSection = document.getElementById('hourly-forecast');
    const searchContainer = document.getElementById('search-container');
    const resultContainer = document.getElementById('result-container');
    
    const locationName = document.getElementById('location-name');
    const coordinates = document.getElementById('coordinates');

    // Clear previous data
    currentWeatherSection.innerHTML = '';
    hourlyForecastSection.innerHTML = '';

    // Create and attach current weather div
    const currentWeatherDiv = createCurrentWeatherDiv(data.current);
    currentWeatherSection.appendChild(currentWeatherDiv);

    // Create and attach hourly forecast div
    const hourlyForecastDiv = createHourlyForecastDiv(data.hourly);
    hourlyForecastSection.appendChild(hourlyForecastDiv);

    // Update location info
    locationName.textContent = `Location: ${cityName}`;
    coordinates.textContent = `Lat: ${data.latitude}, Lon: ${data.longitude}`;

    // Display the sections
    searchContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
}

// Function to display an error message when city is not found
function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';  // Show the error message
}

// Function to get weather for a given city name
async function getWeatherForLocationName(cityName) {
    try {
        const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`);
        
        if (!geocodeResponse.ok) {
            throw new Error('Network response was not ok');
        }
        
        const geocodeData = await geocodeResponse.json();
        console.log(geocodeData)
        if (geocodeData.length === 0) {
            displayErrorMessage('City not found. Please try again.');
            return;
        }

        const { lat, lon } = geocodeData[0];
        const weatherData = await fetchWeatherData(lat, lon);
        console.log(weatherData)
        if (weatherData) {
            attachWeatherData(weatherData, cityName);
        } else {
            displayErrorMessage('Failed to fetch weather data. Please try again.');
        }
    } catch (error) {
        console.error('Error in getWeatherForLocationName:', error);
        displayErrorMessage('An error occurred. Please try again.');
    }
}

// Event listener for search button
document.getElementById('search-btn').addEventListener('click', function () {
    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();
    if (cityName) {
        document.getElementById('error-message').style.display = 'none';  // Hide any previous error messages
        getWeatherForLocationName(cityName);
    }
});

// Event listener for new city button
document.getElementById('new-city-btn').addEventListener('click', function () {
    // Refresh the page
    window.location.reload();
});
