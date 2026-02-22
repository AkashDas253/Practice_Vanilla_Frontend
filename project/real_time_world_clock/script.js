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

function update() {
    const now = new Date();
    const sZ = sourceZone.value;
    const tZ = targetZone.value;

    const options = { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };

    sourceTime.textContent = now.toLocaleTimeString('en-US', { ...options, timeZone: sZ });
    sourceDate.textContent = now.toLocaleDateString('en-US', { ...dateOptions, timeZone: sZ });
    targetTime.textContent = now.toLocaleTimeString('en-US', { ...options, timeZone: tZ });
    targetDate.textContent = now.toLocaleDateString('en-US', { ...dateOptions, timeZone: tZ });

    const getMinutes = (tz) => {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }).formatToParts(now);
        const offset = parts.find(p => p.type === 'timeZoneName').value;
        if (offset === 'GMT') return 0;
        const match = offset.match(/GMT([+-])(\d{2}):(\d{2})/);
        if (!match) return 0;
        return (match[1] === '+' ? 1 : -1) * (parseInt(match[2]) * 60 + parseInt(match[3]));
    };

    const diffMinutes = getMinutes(tZ) - getMinutes(sZ);
    const h = Math.floor(Math.abs(diffMinutes) / 60);
    const m = Math.abs(diffMinutes) % 60;
    
    if (diffMinutes === 0) {
        diffDisplay.textContent = "Same Time";
    } else {
        const prefix = diffMinutes > 0 ? 'Ahead' : 'Behind';
        diffDisplay.textContent = `${h}h ${m}m ${prefix}`;
    }

    const url = new URL(window.location);
    url.searchParams.set('s', sZ);
    url.searchParams.set('t', tZ);
    window.history.replaceState({}, '', url);
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