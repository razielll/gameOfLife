console.log('Coding Train!')
'use strict';

var fieldSize = 600;
var resolution = 80;
var framesPerSecond = 24;
var cellStrokeCrolor = '#a1a1a1';
var cellFillColor = '#000000'
var canvas;
var timeoutId;
var isGridVisible = true;

var cellSize = fieldSize / resolution;
var cellsInRow = fieldSize / cellSize;


function getNextGeneration(grid) {
    return grid.map((rowArray, rowIdx) => rowArray.map((cell, colIdx) => {
        var neighborCount = countNeighbors(grid, rowIdx, colIdx) // Count live neighbors!
        var isAlive = Boolean(grid[rowIdx][colIdx])
        return decideLife(isAlive, neighborCount);
    }));
};

function decideLife(currLifeStatus, neighborSum) {
    if (!currLifeStatus && neighborSum === 3) return 1 // LET THERE BE LIFE!
    else if (currLifeStatus && (neighborSum < 2 || neighborSum > 3)) return 0 // Death to over/under population
    else return currLifeStatus; // Who said status quo was bad, try changing this to 1, Apilepsy warning
}

function countNeighbors(grid, rowIdx, colIdx) {
    var sum = 0;
    var numberOfRows = grid.length;
    var numberOfCols = grid[0].length;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let row = (rowIdx + i + numberOfRows) % numberOfRows;
            let col = (colIdx + j + numberOfCols) % numberOfCols;
            sum += grid[row][col];
        };
    };
    sum -= grid[rowIdx][colIdx]; // Deduct self
    return sum;
};

function get2DArray(rows) {
    const initialArray = new Array(rows).fill().map((row) => new Array(rows).fill())
    return initialArray.map((row) => row.map(() => Math.floor(Math.random() * 2)));;
};


function drawGrid(ctx, grid) {
    grid.map((rows, rowIdx) => rows.map((cell, colIdx) => {
        var currState = grid[rowIdx][colIdx];
        if (currState) ctx.fillRect(rowIdx * cellSize, colIdx * cellSize, cellSize - 0.4, cellSize - 0.4);
        if (isGridVisible) ctx.strokeRect(rowIdx * cellSize, colIdx * cellSize, cellSize - 1, cellSize - 1);
    }));
};


function generation(ctx, grid) {
    ctx.clearRect(0, 0, fieldSize, fieldSize);
    ctx.strokeStyle = cellStrokeCrolor;
    ctx.fillStyle = cellFillColor;
    drawGrid(ctx, grid);
    var gridOfNextGeneration = getNextGeneration(grid);
    timeoutId = setTimeout(function () {
        if (timeoutId) clearTimeout(timeoutId)
        requestAnimationFrame(function () {
            generation(ctx, gridOfNextGeneration);
        });
    }, 1000 / framesPerSecond);
};


function init() {
    if (timeoutId) clearTimeout(timeoutId)
    canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var grid = get2DArray(cellsInRow, cellsInRow);
    generation(ctx, grid);
};

function decreaseResolution() {
    resolution += 20;
    cellSize = fieldSize / resolution;
    cellsInRow = fieldSize / cellSize;
    init();
};

function increaseResolution() {
    resolution -= 20;
    cellSize = fieldSize / resolution;
    cellsInRow = fieldSize / cellSize;
    init();
};

function setStrokeColor(e) {
    cellStrokeCrolor = '' + e.target.value;
};

function setFillColor(e) {
    cellFillColor = '' + e.target.value;
};

function gridVisibilityToggle(e) {
    isGridVisible = e.target.checked;
};

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
    // Challenge, create cells on click!
};