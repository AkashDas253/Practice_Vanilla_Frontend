const sourceZone = document.getElementById('sourceZone');
const targetZone = document.getElementById('targetZone');
const sourceTime = document.getElementById('sourceTime');
const targetTime = document.getElementById('targetTime');
const sourceDate = document.getElementById('sourceDate');
const targetDate = document.getElementById('targetDate');
const diffDisplay = document.getElementById('diff');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const swapBtn = document.getElementById('swapBtn');
const shareBtn = document.getElementById('shareBtn');
const shareBtnText = document.getElementById('shareBtnText');
const foodIcon = document.getElementById('foodIcon');
const foodText = document.getElementById('foodText');

const SYSTEM_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

function init() {
    const zones = Intl.supportedValuesOf('timeZone');
    let html = '';
    zones.forEach(z => {
        const cleanName = z.replace(/_/g, ' ').split('/').pop();
        const region = z.split('/')[0];
        html += `<option value="${z}">${region}: ${cleanName}</option>`;
    });
    
    sourceZone.innerHTML = html;
    targetZone.innerHTML = html;

    const params = new URLSearchParams(window.location.search);
    sourceZone.value = params.get('s') || SYSTEM_ZONE;
    targetZone.value = params.get('t') || 'UTC';

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeIcon.textContent = '☀️';
    }

    update();
    setInterval(update, 1000);
}

function getMeal(hour) {
    if (hour >= 5 && hour < 10) return { i: '🍳', t: 'Breakfast Time' };
    if (hour >= 10 && hour < 12) return { i: '☕', t: 'Brunch Break' };
    if (hour >= 12 && hour < 15) return { i: '🍱', t: 'Lunch Hour' };
    if (hour >= 15 && hour < 18) return { i: '🍰', t: 'Afternoon Tea' };
    if (hour >= 18 && hour < 22) return { i: '🍝', t: 'Dinner Time' };
    if (hour >= 22 || hour < 2) return { i: '🍦', t: 'Late Night Snack' };
    return { i: '😴', t: 'Kitchen Closed' };
}

function getOffsetInMinutes(tz, date) {
    const localeString = date.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' });
    const offsetMatch = localeString.match(/[+-]\d+(:?\d+)?/);
    if (!offsetMatch) return 0;
    
    const offsetStr = offsetMatch[0];
    const sign = offsetStr.startsWith('+') ? 1 : -1;
    const parts = offsetStr.substring(1).split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1] ? parseInt(parts[1], 10) : 0;
    
    return sign * (hours * 60 + minutes);
}

function update() {
    const now = new Date();
    const sZ = sourceZone.value;
    const tZ = targetZone.value;

    const tOptions = { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dOptions = { weekday: 'short', month: 'short', day: 'numeric' };

    try {
        sourceTime.textContent = now.toLocaleTimeString('en-US', { ...tOptions, timeZone: sZ });
        sourceDate.textContent = now.toLocaleDateString('en-US', { ...dOptions, timeZone: sZ });
        targetTime.textContent = now.toLocaleTimeString('en-US', { ...tOptions, timeZone: tZ });
        targetDate.textContent = now.toLocaleDateString('en-US', { ...dOptions, timeZone: tZ });

        const targetHour = parseInt(now.toLocaleTimeString('en-GB', { hour: '2-digit', hour12: false, timeZone: tZ }));
        const meal = getMeal(targetHour);
        foodIcon.textContent = meal.i;
        foodText.textContent = meal.t;

        const sOff = getOffsetInMinutes(sZ, now);
        const tOff = getOffsetInMinutes(tZ, now);
        const diffMinutes = tOff - sOff;
        const absMin = Math.abs(diffMinutes);
        const h = Math.floor(absMin / 60);
        const m = absMin % 60;
        
        if (diffMinutes === 0) {
            diffDisplay.textContent = "Same Time";
        } else {
            const dir = diffMinutes > 0 ? 'Ahead' : 'Behind';
            diffDisplay.textContent = `${h}h ${m}m ${dir}`;
        }

        const url = new URL(window.location);
        url.searchParams.set('s', sZ);
        url.searchParams.set('t', tZ);
        window.history.replaceState({}, '', url);
    } catch (e) {
        console.error("Update failed", e);
    }
}

themeToggle.onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
    themeIcon.textContent = isDark ? '☀️' : '🌙';
};

swapBtn.onclick = () => {
    const temp = sourceZone.value;
    sourceZone.value = targetZone.value;
    targetZone.value = temp;
    update();
};

shareBtn.onclick = () => {
    navigator.clipboard.writeText(window.location.href);
    shareBtnText.textContent = "Copied!";
    setTimeout(() => { shareBtnText.textContent = "Copy Link"; }, 2000);
};

sourceZone.onchange = update;
targetZone.onchange = update;

init();