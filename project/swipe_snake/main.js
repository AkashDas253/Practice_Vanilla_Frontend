import { SnakeGame } from './snakeGame.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const controls = {
    wallToggle: document.getElementById('wallToggle'),
    levelSelect: document.getElementById('levelSelect'),
    baitTimeoutSelect: document.getElementById('baitTimeout'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    startRestartBtn: document.getElementById('startRestartBtn'),
    pauseResumeBtn: document.getElementById('pauseResumeBtn'),
};

const snakeGame = new SnakeGame(canvas, ctx, controls);
