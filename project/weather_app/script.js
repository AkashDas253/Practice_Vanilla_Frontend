// Autocomplete city suggestions
const cityInput = document.getElementById('city-input');
const suggestionsDiv = document.getElementById('suggestions');

cityInput.addEventListener('input', async function() {
    const query = cityInput.value.trim();
    if (query.length < 2) {
        suggestionsDiv.style.display = 'none';
        suggestionsDiv.innerHTML = '';
        return;
    }
    // Fetch city suggestions from geocoding API
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`);
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
        suggestionsDiv.style.display = 'none';
        suggestionsDiv.innerHTML = '';
        return;
    }
    suggestionsDiv.innerHTML = '';
    data.results.forEach(city => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = `${city.name}, ${city.country}`;
        item.addEventListener('click', () => {
            cityInput.value = city.name;
            suggestionsDiv.style.display = 'none';
            suggestionsDiv.innerHTML = '';
        });
        suggestionsDiv.appendChild(item);
    });
    suggestionsDiv.style.display = 'block';
});

// Hide suggestions when input loses focus
cityInput.addEventListener('blur', () => {
    setTimeout(() => {
        suggestionsDiv.style.display = 'none';
    }, 200);
});
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

    // Update location info
    locationName.textContent = `Location: ${cityName}`;
    coordinates.textContent = `Lat: ${data.latitude}, Lon: ${data.longitude}`;
    // Update weather info
    updateCurrentWeather({
        temperature_2m: data.current.temperature_2m,
        wind_speed_10m: data.current.wind_speed_10m,
        relative_humidity_2m: data.hourly.relative_humidity_2m ? data.hourly.relative_humidity_2m[0] : null
    });
    updateHourlyForecast(data.hourly);
    searchContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
}

// Show/hide loading spinner
function setLoading(isLoading) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = isLoading ? 'block' : 'none';
}

// Set weather icon based on temperature (simple logic)
function setWeatherIcon(temp) {
    const iconDiv = document.getElementById('weather-icon');
    if (!iconDiv) return;
    let icon = '';
    if (temp >= 30) icon = '☀️';
    else if (temp >= 20) icon = '🌤️';
    else if (temp >= 10) icon = '🌦️';
    else icon = '❄️';
    iconDiv.textContent = icon;
}

function updateCurrentWeather(data) {
    document.getElementById('current-temperature').textContent = `Temperature: ${data.temperature_2m} °C`;
    document.getElementById('current-wind').textContent = `Wind Speed: ${data.wind_speed_10m} km/h`;
    document.getElementById('current-humidity').textContent = `Humidity: ${data.relative_humidity_2m || 'N/A'}%`;
    setWeatherIcon(data.temperature_2m);
}

function updateHourlyForecast(hourlyData) {
    const hourlyDiv = document.getElementById('hourly-data');
    if (!hourlyDiv) return;
    hourlyDiv.innerHTML = '';
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
        hourlyDiv.appendChild(hourlyItem);
    });
}


// Function to display an error message when city is not found
function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';  // Show the error message
}

// Function to get weather for a given city name
async function getWeatherForLocationName(cityName) {
    setLoading(true);
    try {
        const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`);
        if (!geocodeResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.length === 0) {
            displayErrorMessage('City not found. Please try again.');
            setLoading(false);
            return;
        }
        const { lat, lon } = geocodeData[0];
        const weatherData = await fetchWeatherData(lat, lon);
        if (weatherData) {
            attachWeatherData(weatherData, cityName);
            document.getElementById('error-message').style.display = 'none';
        } else {
            displayErrorMessage('Failed to fetch weather data. Please try again.');
        }
    } catch (error) {
        console.error('Error in getWeatherForLocationName:', error);
        displayErrorMessage('An error occurred. Please try again.');
    }
    setLoading(false);
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
