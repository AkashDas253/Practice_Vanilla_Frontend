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
const foodText = document.getElementById('foodText');
const foodIcon = document.getElementById('foodIcon');
const greetingText = document.getElementById('greetingText');
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

function getContext(hour) {
    if (hour >= 5 && hour < 10) return { g: 'Good Morning', m: 'Breakfast Time', i: '🍳' };
    if (hour >= 10 && hour < 12) return { g: 'Good Morning', m: 'Brunch Break', i: '☕' };
    if (hour >= 12 && hour < 15) return { g: 'Good Afternoon', m: 'Lunch Hour', i: '🍱' };
    if (hour >= 15 && hour < 18) return { g: 'Good Afternoon', m: 'Afternoon Tea', i: '🍰' };
    if (hour >= 18 && hour < 22) return { g: 'Good Evening', m: 'Dinner Time', i: '🍝' };
    if (hour >= 22 || hour < 2) return { g: 'Good Night', m: 'Late Snack', i: '🍦' };
    return { g: 'Good Night', m: 'Resting Time', i: '🌙' };
}

function getOffset(tz, date) {
    const str = date.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' });
    const match = str.match(/[+-]\d+(:?\d+)?/);
    if (!match) return 0;
    const sign = match[0].startsWith('+') ? 1 : -1;
    const parts = match[0].substring(1).split(':');
    return sign * (parseInt(parts[0]) * 60 + (parts[1] ? parseInt(parts[1]) : 0));
}

function update() {
    const now = new Date();
    const sZ = sourceZone.value;
    const tZ = targetZone.value;
    const tOpt = { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dOpt = { weekday: 'short', month: 'short', day: 'numeric' };
    sourceTime.textContent = now.toLocaleTimeString('en-US', { ...tOpt, timeZone: sZ });
    sourceDate.textContent = now.toLocaleDateString('en-US', { ...dOpt, timeZone: sZ });
    targetTime.textContent = now.toLocaleTimeString('en-US', { ...tOpt, timeZone: tZ });
    targetDate.textContent = now.toLocaleDateString('en-US', { ...dOpt, timeZone: tZ });
    const hour = parseInt(now.toLocaleTimeString('en-GB', { hour: '2-digit', hour12: false, timeZone: tZ }));
    const ctx = getContext(hour);
    greetingText.textContent = ctx.g;
    foodText.textContent = ctx.m;
    foodIcon.textContent = ctx.i;
    const diff = getOffset(tZ, now) - getOffset(sZ, now);
    const h = Math.floor(Math.abs(diff) / 60);
    const m = Math.abs(diff) % 60;
    diffDisplay.textContent = diff === 0 ? "Same Time" : `${h}h ${m}m ${diff > 0 ? 'Ahead' : 'Behind'}`;
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
init();s