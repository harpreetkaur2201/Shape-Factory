'use strict';

const COLOR_NAMES = {
  '#09f': 'blue',
  '#9f0': 'green',
  '#f90': 'orange',
  '#f09': 'pink',
  '#90f': 'purple'
};

class Shape {
  constructor(name, colour) {
    this._name = name;
    this._colour = colour;
  }

  get name() {
    return this._name;
  }

  get colour() {
    return this._colour;
  }

  getInfo() {
    return `${this._colour} ${this._name}`;
  }
}

const shapesArray = [];
const shapeSelect = document.getElementById('shapeSelect');
const colorSelect = document.getElementById('colorSelect');
const createBtn = document.getElementById('createBtn');
const grid = document.getElementById('grid');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const popupBtn = document.getElementById('popupBtn');

let infoEl = document.querySelector('.info');
if (!infoEl) {
  infoEl = document.createElement('div');
  infoEl.className = 'info';
  grid.parentNode.insertBefore(infoEl, grid.nextSibling);
}

const MAX_MOVES = 20;
let movesLeft = MAX_MOVES;
let gameActive = false;
let gamePaused = true;

function showPopup(message, buttonText = 'Game Start') {
  popupMessage.textContent = message;
  popupBtn.textContent = buttonText;
  popup.classList.remove('hidden');
}

function hidePopup() {
  popup.classList.add('hidden');
}

function createShape(shapeName, colourCode) {
  const shapeObj = new Shape(shapeName, colourCode);
  const index = shapesArray.push(shapeObj) - 1;

  const div = document.createElement('div');
  div.classList.add('shape');

  if (shapeName === 'circle') div.classList.add('circle');
  else div.classList.add('square');

  div.style.backgroundColor = colourCode;
  div.dataset.index = index;

  const colourName = COLOR_NAMES[colourCode.toLowerCase()];
  if (colourName) div.setAttribute('aria-label', `${colourName} ${shapeName}`);
  else div.setAttribute('aria-label', `${colourCode} ${shapeName}`);

  div.addEventListener('click', () => {
  const idx = Number(div.dataset.index);
  const obj = shapesArray[idx];
  if (obj) {
    const colorName = COLOR_NAMES[obj.colour.toLowerCase()] || obj.colour;
    const colorCapital = colorName.charAt(0).toUpperCase() + colorName.slice(1);
    const shapeCapital = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);
    infoEl.textContent = `${colorCapital} ${shapeCapital}`;
  } else {
    infoEl.textContent = '';
  }
});

  grid.appendChild(div);
  return index;
}

function updateBanner() {
  infoEl.textContent = `Moves left: ${movesLeft}`;
}

function restartGame() {
  shapesArray.length = 0;
  grid.innerHTML = '';
  movesLeft = MAX_MOVES;
  gamePaused = false;
  gameActive = true;
  createBtn.textContent = 'Create';
  updateBanner();
}

function handleCreate() {
  if (createBtn.textContent === 'Clear') {
    restartGame();
    hidePopup();
    return;
  }

  if (!gameActive || gamePaused) return;
  if (movesLeft <= 0) return;

  const shapeName = shapeSelect.value;
  const colourCode = colorSelect.value;
  createShape(shapeName, colourCode);
  movesLeft--;
  updateBanner();

  if (movesLeft === 0) {
    gamePaused = true;
    gameActive = false;
    showPopup("You have reached 20 moves! Click 'Game Start' to restart.", 'Game Start');
    createBtn.textContent = 'Clear';
  }
}

popupBtn.addEventListener('click', () => {
  hidePopup();
  restartGame();
});

showPopup("Click 'Game Start' to begin!", 'Game Start');
createBtn.addEventListener('click', handleCreate);
updateBanner();
