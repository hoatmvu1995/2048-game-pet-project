let grid;
let score = 0;


function isGameWon()  {
    for (let i = 0; i< 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] == 2048) {
                return true;
            }
        }
    }

    return false;
}

function isGameOver() {
    let gameOver = true;

    for (let i = 0; i< 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] == 0) {
                return false;
            }

            if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
                return false;
            }

            if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
                return false;
            }
        }
    }

    return true;
}


function setup() {
    createCanvas(400, 400);
    noLoop();

    grid = blankGrid();

    addNumber();
    addNumber();
    updateCanvas();
}


function keyPressed() {
    let flipped = false;
    let rotated = false;
    let played = true;

    switch(keyCode) {
        case DOWN_ARROW:
            break;
        case UP_ARROW:
            grid = flipGrid(grid);
            flipped = true;
            break;
        case RIGHT_ARROW:
            grid = rotateGrid(grid);
            rotated = true;
            break;
        case LEFT_ARROW:
            grid = rotateGrid(grid);
            grid = flipGrid(grid);
            rotated = true;
            flipped = true;
            break;
        default:
            played = false;
    }
 
    let past = copyGrid(grid);

    for (let i = 0; i < 4; i++) {
        grid[i] = operate(grid[i]);
    }

    let changed = compare(past, grid);

    if (flipped) {
        grid = flipGrid(grid);
    }

    if (rotated) {
        grid = rotateGrid(grid);
    }

    if (changed) {
        addNumber();
    }

    updateCanvas();
    let gameOver = isGameOver();

    if (gameOver) {
        console.log("GAME OVER");
    }

    let gameWon = isGameWon();
    if  (gameWon) {
        console.log("Game Won");
    } 
}


function operate(rows) {
    rows = slide(rows);
    rows = combine(rows);
    rows = slide(rows);

    return rows;
}

function updateCanvas() {
    background(255);
    drawGrid();
    select('#score').html(score);
}

function slide(rows) {
    let arr = rows.filter(val => val);
    let missing = 4 - arr.length;
    let zeros = Array(missing).fill(0);

    arr = zeros.concat(arr);

    return arr;
}

function combine(rows) {
    for (let i = 3; i >= 1; i--) {
        let a = rows[i];
        let b = rows[i-1];
        if (a == b) {
            rows[i] = a + b;
            score += rows[i];
            rows[i - 1] = 0;
        }
    }

     return rows;
}

function drawGrid() {
    let w = 100;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            noFill();
            strokeWeight(2);
            let val =  grid[i][j];
            let s = val.toString();
            stroke(0);
            if   (val != 0) {
                fill(colorAndSize[s].color);
            } else {
                noFill();
            }

            rect(i*w, j*w, w, w, 30);
            if (grid[i][j] !== 0) {
                textAlign(CENTER, CENTER);
                noStroke();
                textSize(colorAndSize[s].size);
                fill(0);
                text(val, i*w + w/2, j*w + w/2);
            }
        }
    }
}