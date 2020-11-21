'use strict'
var gClockTimeOut;
var gGoldTimeOut;
var gGlueTimeOut;
var gMagnetTimeOut;

function summonClockAtRandPos() {
    var emptyCoord = getRandEmptyCell();
    if (emptyCoord) {
        gBoard[emptyCoord.i][emptyCoord.j].gameElement = CLOCK;
        renderCell(emptyCoord, CLOCK_IMG);
        gClockTimeOut  = setTimeout(function () {
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
        gGoldTimeOut =setTimeout(function () {
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

        gGlueTimeOut =setTimeout(function () {
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
       
        gMagnetTimeOut= setTimeout(function () {
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
function saveCurrGboard() {
    gPrevSteps.push(gBoard);
    // console.log('gPrevSteps', gPrevSteps);
}

function undo() {
    var prevBoard = gPrevSteps.slice(gPrevSteps.length-2, gPrevSteps.length-1);
    // console.log('prevBoard', prevBoard);
    // renderBoard(prevBoard);
}