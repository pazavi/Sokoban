'use strict'
const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BOX = 'BOX';
const GAMER = 'GAMER';
const TARGET = 'TARGET';
const CLOCK = 'CLOCK';
const GOLD = 'GOLD';
const GLUE = 'GLUE';
const MAGNET = 'MAGNET';



const GAMER_IMG = '<img src="img/gamer-purple.png" />';
const BOX_IMG = '<img src="img/box.jpg" />';
const CLOCK_IMG = '<img src="img/clock.png" />';
const GOLD_IMG = '<img src="img/gold.png" />';
const GLUE_IMG = '<img src="img/glue.png" />';
const MAGNET_IMG = '<img src="img/magnet.png" />';


var gStepsCount;
var gClockInterval;
var gMagnetInterval;
var gGoldInterval;
var gGlueInterval;
var gPrevSteps = [];


var gBoard;
var gGamerPos;
var gBoxPos = { i: 0, j: 0 };
var gIsGameOn;
var gIsGlue = false;
var gIsMagnet = false;

function initGame() {
    clearAllItntervals()
    gIsGameOn = true;
    gStepsCount = 0;
    gGamerPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    renderBoard(gBoard);
    setAllIntervals();

    document.querySelector('.steps').innerHTML = 'Score: <span>0</span>';

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

    board[4][3].type = TARGET;
    board[8][9].type = TARGET;
    board[7][2].type = TARGET;
    board[1][6].type = TARGET;

    var innerWallsNum = 9;
    while (innerWallsNum > 0) {
        var idxI = getRandomInt(1, board.length - 1);
        var idxJ = getRandomInt(1, board[0].length - 1);
        if (board[idxI][idxJ].gameElement === null && 
            board[idxI][idxJ].type === FLOOR && 
            board[idxI][idxJ+1].gameElement !== BOX && 
            board[idxI][idxJ-1].gameElement !== BOX &&
            board[idxI-1][idxJ].gameElement !== BOX &&
            board[idxI+1][idxJ].gameElement !== BOX &&
            board[idxI][idxJ+1].type !== TARGET && 
            board[idxI][idxJ-1].type !== TARGET &&
            board[idxI-1][idxJ].type !== TARGET &&
            board[idxI+1][idxJ].type !== TARGET
            ) {
            board[idxI][idxJ].type = WALL;
            innerWallsNum--
        }
    }

    // console.log(board);
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
            } else if (currCell.gameElement === CLOCK) {
                strHTML += CLOCK_IMG;
            } else if (currCell.gameElement === GOLD) {
                strHTML += GOLD_IMG;
            } else if (currCell.gameElement === GLUE) {
                strHTML += GLUE_IMG;
            } else if (currCell.gameElement === MAGNET) {
                strHTML += MAGNET_IMG;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// **********
function moveTo(i, j, direction) {
    if (gIsGameOn === false) return;
    if (gIsGlue === true) return;

    //for onclick
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
    }
    if (targetCell.type === WALL) return;

    if (gIsMagnet === true) {
        if (direction === 'left') {

            if (gBoard[gGamerPos.i][gGamerPos.j + 1].gameElement === BOX) {
                console.log('magnet to left');
                // renderCell(gBoxPos, '');
                gBoxPos.i = i;
                gBoxPos.j = j - 1;
                gIsMagnet = false;
                gBoard[gBoxPos.i][gBoxPos.j].gameElement = BOX;
                renderCell(gBoxPos, BOX_IMG);
            }
        }
    }

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
        // document.querySelector('.message').innerText ='A box was pushed'
    }

    if (targetCell.gameElement === CLOCK) {
        clearTimeout(gClockTimeOut);
        gStepsCount -= 10;
        document.querySelector('.message').innerText ='Clock collected. You got 10 free steps'

    }
    if (targetCell.gameElement === GOLD) {
        clearTimeout(gGoldTimeOut);
        gStepsCount += 100;
        document.querySelector('.message').innerText ='Gold collected. 100 Points added to your score'
    }
    if (targetCell.gameElement === GLUE) {
        gStepsCount += 5;
        gIsGlue = true;
        setTimeout(function () {
            gIsGlue = false;
        }, 5000);
        clearTimeout(gGlueTimeOut)
        document.querySelector('.message').innerText ='Steped on glue. You are stuck for 5 seconds'


    }

    if (targetCell.gameElement === MAGNET) {
        clearTimeout(gMagnetTimeOut);
        gIsMagnet = true;
        document.querySelector('.message').innerText ='Magnet collected. You can pull a box from the wall once'
    }

    gStepsCount++
    document.querySelector('.steps span').innerText = gStepsCount;

    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;//** */

    renderCell(gGamerPos, '');

    gGamerPos.i = i;
    gGamerPos.j = j;

    renderCell(gGamerPos, GAMER_IMG);

    // saveCurrGboard()
    checkIfGameOver();
}

function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}


function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;
    // saveCurrGboard();


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

function setAllIntervals() {
    gClockInterval = setInterval(summonClockAtRandPos, 10000);
    gGoldInterval = setInterval(summonGoldAtRandPos, 12000);
    // gMagnetInterval = setInterval(summonMagnetAtRandPos, 15000);
    gGlueInterval = setInterval(summonGlueAtRandPos, 11000);
}

function clearAllItntervals() {
    clearInterval(gClockInterval);
    clearInterval(gGoldInterval);
    clearInterval(gGlueInterval);
    // clearInterval(gMagnetInterval);

}

function checkIfGameOver() {
    var counter = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.gameElement === BOX && cell.type === TARGET) counter++;
        }
    }
    if (counter === 4) gameOver();
}

function gameOver() {
    clearAllItntervals()
    document.querySelector('.steps span').innerText += ' | GAME OVER |';
    document.querySelector('.message').innerText ='All Boxes on targets'
    gIsGameOn = false;
}

