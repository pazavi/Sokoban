'use strict'
var gClockTimeOut;
var gGoldTimeOut;
var gGlueTimeOut;
var gMagnetTimeOut;
var gElementPosition = { i: 1, j: 1 };
var gElementCounter = 0;

function summonClockAtRandPos() {
    var emptyCoord = getRandEmptyCell();
    if (emptyCoord) {
        gBoard[emptyCoord.i][emptyCoord.j].gameElement = CLOCK;
        renderCell(emptyCoord, CLOCK_IMG);
        gClockTimeOut = setTimeout(function () {
            gBoard[emptyCoord.i][emptyCoord.j].gameElement = null;
            renderCell(emptyCoord, '');

        }, 5000);
    }
}

function summonGoldAtRandPos() {
    var emptyCoord = getRandEmptyCell();
    if (emptyCoord) {
        gBoard[emptyCoord.i][emptyCoord.j].gameElement = GOLD;
        renderCell(emptyCoord, GOLD_IMG);
        gGoldTimeOut = setTimeout(function () {
            gBoard[emptyCoord.i][emptyCoord.j].gameElement = null;
            renderCell(emptyCoord, '');

        }, 5000);
    }
}

function summonGlueAtRandPos() {
    var emptyCoord = getRandEmptyCell();
    if (emptyCoord) {
        gBoard[emptyCoord.i][emptyCoord.j].gameElement = GLUE;
        renderCell(emptyCoord, GLUE_IMG);

        gGlueTimeOut = setTimeout(function () {
            gBoard[emptyCoord.i][emptyCoord.j].gameElement = null;
            renderCell(emptyCoord, '');


        }, 5000);
    }
}

function summonMagnetAtRandPos() {
    var emptyCoord = getRandEmptyCell();
    if (emptyCoord) {
        gBoard[emptyCoord.i][emptyCoord.j].gameElement = MAGNET;
        renderCell(emptyCoord, MAGNET_IMG);

        gMagnetTimeOut = setTimeout(function () {
            gBoard[emptyCoord.i][emptyCoord.j].gameElement = null;
            renderCell(emptyCoord, '');

        }, 5000);
    }

}


function getRandEmptyCell() {

    do {
        var idxI = getRandomInt(1, gBoard.length - 1);
        var idxJ = getRandomInt(1, gBoard[0].length - 1);
        if (gBoard[idxI][idxJ].gameElement === null && gBoard[idxI][idxJ].type === FLOOR) {
            return { i: idxI, j: idxJ }
        }
        if (gBoard[idxI][idxJ].type === 'Wall') return null;

    } while (true);

}

function manualBoard() {
    gIsGameOn = false;
    clearAllItntervals();
    gElementCounter = 0;
    gBoard = createManualBoard();
    renderBoard(gBoard);
    document.querySelector('.message').innerText = 'First, locate your Gamer on Board with right click'

}

function elementPos(elCell, idxI, idxJ) {

    gElementPosition = { i: idxI, j: idxJ }
    setElement();
}

function setElement() {
    if (gElementCounter === 0) {
        document.querySelector('.message').innerText = 'Now, locate 4 boxes on Board with right clicks'

        gBoard[gElementPosition.i][gElementPosition.j].gameElement = GAMER;
        gGamerPos = {i:gElementPosition.i, j: gElementPosition.j};
        renderCell(gElementPosition, GAMER_IMG);
        gElementCounter++
    }

    else if (gElementCounter === 0 || gElementCounter < 5) {
       
        gBoard[gElementPosition.i][gElementPosition.j].gameElement = BOX;
        renderCell(gElementPosition, BOX_IMG);
        if (gElementCounter ===5)  document.querySelector('.message').innerText = 'Now, locate 4 boxes on Board with right clicks'
        gElementCounter++
    }

    else if (gElementCounter === 0 || gElementCounter < 9) {
        document.querySelector('.message').innerText = 'Now, locate 4 Targets on Board with right clicks';
        gBoard[gElementPosition.i][gElementPosition.j].type = TARGET;
        renderBoard(gBoard);
        gElementCounter++
    }

    else if (gElementCounter === 0 || gElementCounter < 18) {
        document.querySelector('.message').innerText = 'Locate 9 inner boxes on Board and start playing';
        gBoard[gElementPosition.i][gElementPosition.j].type = WALL;
        renderBoard(gBoard);
        gElementCounter++
    }
    else initManualGame();


}

function initManualGame(){
    clearAllItntervals()
    gIsGameOn = true;
    gStepsCount = 0;

    setAllIntervals();

    document.querySelector('.steps').innerHTML = 'Score: <span>0</span>';
    document.querySelector('.message').innerText = 'Better Push those Boxes!  start Playing'

}



function createManualBoard() {

    var board = createMat(10, 12);

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var cell = { type: FLOOR, gameElement: null };

            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }

            board[i][j] = cell;
        }
    }

    // console.log(board);
    return board;
}




// function saveCurrGboard() {
//     gPrevSteps.push(gBoard);
//     // console.log('gPrevSteps', gPrevSteps);
// }

// function undo() {
//     var prevBoard = gPrevSteps.slice(gPrevSteps.length - 2, gPrevSteps.length - 1);
//     // console.log('prevBoard', prevBoard);
//     // renderBoard(prevBoard);
// }