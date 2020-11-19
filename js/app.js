const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BOX = 'BOX';
const GAMER = 'GAMER';
const TARGET = 'TARGET';
const CLOCK = 'TARGET';



const GAMER_IMG = '<img src="img/gamer-purple.png" />';
const BOX_IMG = '<img src="img/box.jpg" />';
const CLOCK_IMG = '<img src="img/clock.png" />';



var gPrevSteps = [];
var gStepsCount;
var gClockInterval;
var gMagnetInterval;
var gGoldInterval;


var gBoard;
var gGamerPos;
var gBoxPos = { i: 0, j: 0 };
var gIsGameOn;

function initGame() {
    gIsGameOn = true;
    gStepsCount = 0;

    gGamerPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    renderBoard(gBoard);

    // gClockInterval= setInterval(summonBonusAtRandPos, 10000, CLOCK )
    document.querySelector('.steps').innerHTML = 'Steps: <span>0</span>';

}

function summonBonusAtRandPos(bonusGameElement) {
    var emptyCoord = getRandEmptyCell();
    if (emptyCoord) {
        gBoard[emptyCoord.i][emptyCoord.j].gameElement = bonusGameElement;
   
        renderCell(emptyCoord, '');
    }
}

function getRandEmptyCell() {

    do {
        var idxI = getRandomInt(1, gBoard.length - 1);
        var idxJ = getRandomInt(1, gBoard[0].length - 1);
        if (gBoard[idxI][idxJ].gameElement === null) {
            return { i: idxI, j: idxJ }
        }
        // if  return null

    } while (true);

}


function buildBoard() {

    var board = createMat(10, 12)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var cell = { type: FLOOR, gameElement: null };

            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }

            board[i][j] = cell;
        }
    }


    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    board[3][8].gameElement = BOX;
    board[7][4].gameElement = BOX;
    board[6][3].gameElement = BOX;
    board[2][3].gameElement = BOX;

    board[1][5].type = WALL;
    board[2][5].type = WALL;
    board[5][5].type = WALL;
    board[5][6].type = WALL;
    board[5][7].type = WALL;
    board[8][7].type = WALL;
    board[7][7].type = WALL;
    board[6][5].type = WALL;

    board[4][3].type = TARGET;
    board[8][9].type = TARGET;
    board[7][2].type = TARGET;
    board[1][6].type = TARGET;



    console.log(board);
    return board;
}


function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            if (currCell.type === FLOOR) cellClass += ' floor';
            if (currCell.type === WALL) cellClass += ' wall';
            else if (currCell.type === TARGET) cellClass += ' target';


            strHTML += '\t<td class="cell ' + cellClass +
                '"onclick="moveTo(' + i + ',' + j + ')" ' + '"onmouseup="saveCurrGboard()" >\n';


            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BOX) {
                strHTML += BOX_IMG;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function moveTo(i, j, direction) {
    if (gIsGameOn === false) return;


    if (!direction) {
        if (i > gGamerPos.i) direction = 'down';
        if (i < gGamerPos.i) direction = 'up';
        if (j > gGamerPos.j) direction = 'right';
        if (j < gGamerPos.j) direction = 'left';
    }
    // console.log(direction);

    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);



    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

        var targetCell = gBoard[i][j];
        if (targetCell.type === WALL) return;

        if (targetCell.gameElement === BOX) {

            if (direction === 'left') {
                if (gBoard[i][j - 1].type === WALL || gBoard[i][j - 1].gameElement === BOX) return;
                gBoxPos.i = i;
                gBoxPos.j = j - 1;


            }

            if (direction === 'right') {
                if (gBoard[i][j + 1].type === WALL || gBoard[i][j + 1].gameElement === BOX) return;
                gBoxPos.i = i;
                gBoxPos.j = j + 1;

            }

            if (direction === 'up') {
                if (gBoard[i - 1][j].type === WALL || gBoard[i - 1][j].gameElement === BOX) return;
                gBoxPos.i = i - 1;
                gBoxPos.j = j;
            }

            if (direction === 'down') {
                if (gBoard[i + 1][j].type === WALL || gBoard[i + 1][j].gameElement === BOX) return;
                gBoxPos.i = i + 1;
                gBoxPos.j = j;
            }

            gBoard[gBoxPos.i][gBoxPos.j].gameElement = BOX;
            renderCell(gBoxPos, BOX_IMG);
        }

        gStepsCount++
        document.querySelector('.steps span').innerText = gStepsCount;

        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);

    }

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}


function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;
    saveCurrGboard();


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1, 'left');
            break;
        case 'ArrowRight':
            moveTo(i, j + 1, 'right');
            break;
        case 'ArrowUp':
            moveTo(i - 1, j, 'up');
            break;
        case 'ArrowDown':
            moveTo(i + 1, j, 'down');
            break;

    }

}


function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function saveCurrGboard() {
    gPrevSteps.push(gBoard);
    // console.log('gPrevSteps', gPrevSteps);
}

function undo() {
    gPrevSteps.pop();
    var prevBoard= gPrevSteps.pop();
    console.log('prevBoard', prevBoard);
    // renderBoard(prevBoard)
}




function gameOver() {
    console.log('Game Over');
    //clear all Intervals

    document.querySelector('.steps span').innerText += ' | GAME OVER |';
    gIsGameOn = false;
}

