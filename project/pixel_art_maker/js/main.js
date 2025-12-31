const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

// Elements
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const toggleGridBtn = document.getElementById('toggleGrid');
const modeDrawBtn = document.getElementById('modeDraw');
const modeEraseBtn = document.getElementById('modeErase');

// Stepper Buttons
const widthDec = document.getElementById('widthDec');
const widthInc = document.getElementById('widthInc');
const heightDec = document.getElementById('heightDec');
const heightInc = document.getElementById('heightInc');

// --- STATE ---
const MAX_CANVAS_DISPLAY = 512; 
let gridW = 16;
let gridH = 16;
let pixelSize = 0; 
let isDrawing = false;
let isErasing = false;
let showGrid = false;
let pixelData = {}; // Key: "x-y", Value: hex

// --- INITIALIZATION ---
function init() {
    loadFromLocal(); // Load saved session
    updateCanvasDimensions(false); // Initialize without wiping loaded data
}

// --- PERSISTENCE ---
function saveToLocal() {
    const session = { gridW, gridH, pixelData };
    localStorage.setItem('pixelStudio_save', JSON.stringify(session));
}

function loadFromLocal() {
    const saved = localStorage.getItem('pixelStudio_save');
    if (saved) {
        const data = JSON.parse(saved);
        gridW = data.gridW || 16;
        gridH = data.gridH || 16;
        pixelData = data.pixelData || {};
        widthInput.value = gridW;
        heightInput.value = gridH;
    }
}

// --- CORE LOGIC ---

// Updates canvas resolution and pixel scale
function updateCanvasDimensions(shouldClear = true) {
    const largerDim = Math.max(gridW, gridH);
    pixelSize = Math.floor(MAX_CANVAS_DISPLAY / largerDim);
    
    canvas.width = gridW * pixelSize;
    canvas.height = gridH * pixelSize;

    if (shouldClear) {
        pixelData = {}; 
        localStorage.removeItem('pixelStudio_save');
    }
    render();
}

// Main Draw Loop
function render() {
    // Clear background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw saved pixels
    for (const key in pixelData) {
        const [x, y] = key.split('-').map(Number);
        
        // Safety check: Don't draw pixels if we shrank the grid and they are now out of bounds
        if (x < gridW && y < gridH) {
            ctx.fillStyle = pixelData[key];
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }

    // Draw Grid Lines
    if (showGrid) {
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        
        // Vertical Lines
        for (let i = 0; i <= gridW; i++) {
            ctx.moveTo(i * pixelSize, 0);
            ctx.lineTo(i * pixelSize, canvas.height);
        }
        
        // Horizontal Lines
        for (let i = 0; i <= gridH; i++) {
            ctx.moveTo(0, i * pixelSize);
            ctx.lineTo(canvas.width, i * pixelSize);
        }
        ctx.stroke();
    }
}

// Map screen coordinates to grid coordinates
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Calculate current grid cell
    const x = Math.floor(((evt.clientX - rect.left) * scaleX) / pixelSize);
    const y = Math.floor(((evt.clientY - rect.top) * scaleY) / pixelSize);
    
    return { x, y };
}

// Handles drawing and erasing input
function handleInput(e) {
    if (!isDrawing) return;
    
    const { x, y } = getMousePos(e);
    
    // Boundary Check
    if (x < 0 || x >= gridW || y < 0 || y >= gridH) return;

    const isRightClick = e.buttons === 2;
    const color = (isErasing || isRightClick) ? '#ffffff' : colorPicker.value;
    const key = `${x}-${y}`;
    
    if (pixelData[key] !== color) {
        pixelData[key] = color;
        render();
        saveToLocal();
    }
}

// --- EVENT LISTENERS ---

// Mouse Events
canvas.addEventListener('mousedown', (e) => { isDrawing = true; handleInput(e); });
canvas.addEventListener('mousemove', handleInput);
window.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'b') modeDrawBtn.click();
    if (e.key.toLowerCase() === 'e') modeEraseBtn.click();
    if (e.key.toLowerCase() === 'g') toggleGridBtn.click();
});

// Dimension Steppers
function updateDim(input, change, isWidth) {
    let val = parseInt(input.value);
    const newVal = val + change;
    if (newVal >= 4 && newVal <= 64) {
        if(confirm("Changing dimensions will clear current art. Proceed?")) {
            input.value = newVal;
            if (isWidth) gridW = newVal;
            else gridH = newVal;
            updateCanvasDimensions(true);
        }
    }
}

// Button Listeners
widthDec.addEventListener('click', () => updateDim(widthInput, -4, true));
widthInc.addEventListener('click', () => updateDim(widthInput, 4, true));
heightDec.addEventListener('click', () => updateDim(heightInput, -4, false));
heightInc.addEventListener('click', () => updateDim(heightInput, 4, false));

// Tool Controls
clearBtn.addEventListener('click', () => { 
    if(confirm("Clear canvas?")) {
        pixelData = {}; 
        localStorage.removeItem('pixelStudio_save');
        render(); 
    }
});

modeDrawBtn.addEventListener('click', () => { 
    isErasing = false; 
    modeDrawBtn.classList.add('active'); 
    modeEraseBtn.classList.remove('active'); 
});

modeEraseBtn.addEventListener('click', () => { 
    isErasing = true; 
    modeEraseBtn.classList.add('active'); 
    modeDrawBtn.classList.remove('active'); 
});

toggleGridBtn.addEventListener('click', () => { 
    showGrid = !showGrid; 
    toggleGridBtn.classList.toggle('active', showGrid); 
    render(); 
});

// File Export
downloadBtn.addEventListener('click', () => {
    const prevGrid = showGrid;
    showGrid = false;
    render();
    const link = document.createElement('a');
    link.download = `pixel-art-${gridW}x${gridH}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    showGrid = prevGrid;
    render();
});

// Start
init();