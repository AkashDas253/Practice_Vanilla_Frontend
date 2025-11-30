// --- API Configuration ---
const WORLD_TIME_API_BASE = 'https://worldtimeapi.org/api/timezone';
const UPDATE_INTERVAL_MS = 1000;
const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 5;

// --- DOM Elements ---
const sourceZoneSelect = document.getElementById('sourceZone');
const targetZoneSelect = document.getElementById('targetZone');
const sourceTimeDisplay = document.getElementById('sourceTimeDisplay');
const targetTimeDisplay = document.getElementById('targetTimeDisplay');
const sourceDateDisplay = document.getElementById('sourceDateDisplay');
const targetDateDisplay = document.getElementById('targetDateDisplay');
const timeDifference = document.getElementById('timeDifference');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');

// --- State Variables ---
let timezones = [];
let sourceTimeData = null; // Stores API data for source zone
let targetTimeData = null; // Stores API data for target zone
let updateTimer = null;

/**
 * Utility function for exponential backoff retry logic.
 * @param {Function} fetcher - The async function that performs the fetch operation.
 * @param {number} retries - Current retry count.
 * @returns {Promise<any>}
 */
async function fetchWithRetry(fetcher, retries = 0) {
    try {
        return await fetcher();
    } catch (error) {
        if (retries < MAX_RETRIES) {
            // console.log(`Retrying fetch (${retries + 1}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retries)));
            return fetchWithRetry(fetcher, retries + 1);
        }
        throw error;
    }
}

/**
 * Fetches the list of all available time zones from the API.
 */
async function fetchTimeZones() {
    loadingMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';

    try {
        const fetcher = async () => {
            const response = await fetch(WORLD_TIME_API_BASE);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        };

        timezones = await fetchWithRetry(fetcher);
        populateZoneSelects(timezones);
        
        // Set initial default zones
        const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        sourceZoneSelect.value = timezones.includes(localZone) ? localZone : 'America/Los_Angeles';
        targetZoneSelect.value = 'Europe/London';
        
        // Initial data fetch and start clock
        await updateAllTimes();
        startClock();
    } catch (error) {
        console.error('Error fetching time zones:', error);
        errorMessage.textContent = `Failed to load time zones after multiple retries. Please check your network connection. (${error.message})`;
        errorMessage.classList.remove('hidden');
    } finally {
        loadingMessage.classList.add('hidden');
    }
}

/**
 * Populates the <select> elements with time zone options.
 * @param {string[]} zones - Array of time zone strings.
 */
function populateZoneSelects(zones) {
    // Sort zones for easier searching
    zones.sort();
    
    const createOption = (zone) => `<option value="${zone}">${zone.replace('_', ' ')}</option>`;

    // Create option groups for better organization (e.g., Europe/London)
    const zoneGroups = {};
    zones.forEach(zone => {
        const [group, ...rest] = zone.split('/');
        if (!zoneGroups[group]) {
            zoneGroups[group] = [];
        }
        zoneGroups[group].push(zone);
    });

    let optionsHtml = '';
    for (const group in zoneGroups) {
        optionsHtml += `<optgroup label="${group}">`;
        zoneGroups[group].forEach(zone => {
            optionsHtml += createOption(zone);
        });
        optionsHtml += `</optgroup>`;
    }

    sourceZoneSelect.innerHTML = optionsHtml;
    targetZoneSelect.innerHTML = optionsHtml;
}

/**
 * Fetches the initial time data for a specific time zone.
 * @param {string} zone - The time zone identifier.
 * @returns {Promise<Object|null>}
 */
async function fetchInitialTimeData(zone) {
    try {
        const fetcher = async () => {
            const response = await fetch(`${WORLD_TIME_API_BASE}/${zone}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        };
        return await fetchWithRetry(fetcher);
    } catch (error) {
        console.error(`Error fetching time for ${zone}:`, error);
        // Display error only if it's the current selected zone
        const isSource = zone === sourceZoneSelect.value;
        const isTarget = zone === targetZoneSelect.value;
        
        if (isSource || isTarget) {
             errorMessage.textContent = `Could not fetch time for ${zone} (Network/API failure). Please try refreshing or selecting another zone.`;
             errorMessage.classList.remove('hidden');
        }
        return null;
    }
}

/**
 * Converts the current time based on the fetched API data.
 * @param {Object} data - The time zone data from the API.
 * @param {HTMLElement} timeEl - The element to display the time.
 * @param {HTMLElement} dateEl - The element to display the date.
 * @returns {Date|null} - The calculated current Date object, or null on error.
 */
function calculateAndDisplayTime(data, timeEl, dateEl) {
    if (!data) return null;

    // Get current UTC time in milliseconds
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);

    // Calculate current time in the target zone
    // unixtime (seconds since epoch) + offset_seconds = current time in this zone
    const zoneNowMs = (data.unixtime * 1000) + (data.raw_offset * 1000) + (data.dst_offset * 1000) + (utcTime - (data.unixtime * 1000));
    const zoneTime = new Date(zoneNowMs);

    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

    // Format and display
    timeEl.textContent = zoneTime.toLocaleTimeString('en-US', timeOptions);
    dateEl.textContent = zoneTime.toLocaleDateString('en-US', dateOptions);
    
    return zoneTime;
}

/**
 * Updates the time difference display between source and target.
 * @param {Object} sourceData - Source time zone data.
 * @param {Object} targetData - Target time zone data.
 */
function updateTimeDifference(sourceData, targetData) {
    if (!sourceData || !targetData) {
        timeDifference.textContent = '';
        return;
    }

    // Calculate total offset in seconds (raw_offset + dst_offset)
    const sourceOffsetSeconds = sourceData.raw_offset + sourceData.dst_offset;
    const targetOffsetSeconds = targetData.raw_offset + targetData.dst_offset;

    // Difference in hours
    const diffSeconds = targetOffsetSeconds - sourceOffsetSeconds;
    const diffHours = diffSeconds / 3600;

    const sign = diffHours >= 0 ? '+' : '-';
    const absHours = Math.floor(Math.abs(diffHours));
    const absMinutes = Math.round((Math.abs(diffHours) - absHours) * 60);

    let diffText = '';

    if (diffHours === 0) {
        diffText = 'Same time.';
    } else {
        let hoursPart = absHours > 0 ? `${absHours} hour${absHours !== 1 ? 's' : ''}` : '';
        let minutesPart = absMinutes > 0 ? `${absMinutes} minute${absMinutes !== 1 ? 's' : ''}` : '';

        if (hoursPart && minutesPart) {
            diffText = `${hoursPart} and ${minutesPart}`;
        } else if (hoursPart) {
            diffText = hoursPart;
        } else if (minutesPart) {
            diffText = minutesPart;
        }
        
        diffText = `Target is ${sign}${diffText} from Source`;
    }

    timeDifference.textContent = diffText;
}

/**
 * The main clock loop function.
 */
function runClock() {
    // Update the display for both zones every second
    calculateAndDisplayTime(sourceTimeData, sourceTimeDisplay, sourceDateDisplay);
    calculateAndDisplayTime(targetTimeData, targetTimeDisplay, targetDateDisplay);
}

/**
 * Starts the time update interval.
 */
function startClock() {
    clearInterval(updateTimer); // Clear any existing timer
    if (sourceTimeData && targetTimeData) {
        updateTimer = setInterval(runClock, UPDATE_INTERVAL_MS);
    }
}

/**
 * Event handler to fetch new time data when a zone changes.
 */
async function updateAllTimes() {
    clearInterval(updateTimer);
    
    // Immediately update UI to show loading state
    loadingMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden'); 
    targetTimeDisplay.textContent = '...Loading';
    sourceTimeDisplay.textContent = '...Loading';

    const sourceZone = sourceZoneSelect.value;
    const targetZone = targetZoneSelect.value;

    // Fetch source time data
    sourceTimeData = await fetchInitialTimeData(sourceZone);

    // Fetch target time data
    targetTimeData = await fetchInitialTimeData(targetZone);

    loadingMessage.classList.add('hidden'); // Hide loading once data is retrieved or failed

    // Start clock only if both fetches succeeded
    if (sourceTimeData && targetTimeData) {
        updateTimeDifference(sourceTimeData, targetTimeData);
        startClock();
    } else {
        // If either failed, reset displays
        sourceTimeDisplay.textContent = '--:--:--';
        targetTimeDisplay.textContent = '--:--:--';
        sourceDateDisplay.textContent = '';
        targetDateDisplay.textContent = '';
        timeDifference.textContent = '';
        console.warn('Clock cannot start: Missing time data.');
    }
}

// --- Event Listeners and Initialization ---

// Wait for the DOM to be fully loaded before attaching listeners (good practice)
document.addEventListener('DOMContentLoaded', () => {
    sourceZoneSelect.addEventListener('change', updateAllTimes);
    targetZoneSelect.addEventListener('change', updateAllTimes);

    // Fetch time zones and start the app
    fetchTimeZones();
});