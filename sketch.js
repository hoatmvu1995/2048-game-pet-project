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

function blankGrid() {
    return [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ];
}

function setup() {
    createCanvas(400, 400);
    noLoop();

    grid = blankGrid();

    addNumber();
    addNumber();
    updateCanvas();
}

function addNumber() {
    let options = [];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                options.push({
                    x: i,
                    y: j
                });
            }
        }
    }

    if (options.length > 0) {
        let spot = random(options);
        let r = random(1);
        grid[spot.x][spot.y] = r > 0.5 ? 2 : 4;
    }

}

function compare(a, b) {
    for (let i = 0; i< 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (a[i][j] !== b[i][j]) {
                return true;
            }
        }
    }

    return false;
}

function flipGrid(grid) {
    for (let i = 0; i < 4; i++) {
        grid[i].reverse();
    }

    return grid;
}

function rotateGrid(grid) {
    let newGrid = blankGrid();

    for (let i = 0; i< 4; i++) {
        for (let j = 0; j < 4; j++) {
            newGrid[i][j] = grid[j][i];
        }
    }

    return newGrid;
} 

function keyPressed() {
    let flipped = false;
    let rotated = false;
    let played = true;

    if (keyCode === DOWN_ARROW) {
        //do nothing
    } else if (keyCode === UP_ARROW) {
        grid = flipGrid(grid);
        flipped = true;
    } else if (keyCode === RIGHT_ARROW) {
        grid = rotateGrid(grid);
        rotated = true;
    } else if (keyCode === LEFT_ARROW) {
        grid = rotateGrid(grid);
        grid = flipGrid(grid);
        rotated = true;
        flipped = true;
    } else {
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
        grid = rotateGrid(grid);
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

function copyGrid(grid) {
    let extra = blankGrid();

    for (let i = 0; i< 4; i++) {
        for (let j = 0; j < 4; j++) {
            extra[i][j] = grid[i][j];
        }
    }

    return extra;
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
            if   (val != 0) {
                let s = "" + val;
                stroke(0);
                
            }

            rect(i*w, j*w, w, w);
            if (grid[i][j] !== 0) {
                textAlign(CENTER, CENTER);
                
                textSize(colorAndSize[s].size);
                fill(colorAndSize[s].color);
                noStroke();
                text(val, i*w + w/2, j*w + w/2);
            }
        }
    }
}