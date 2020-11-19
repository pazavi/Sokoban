'use strict'

function summonClockAtRandPos() {
    var emptyCoord = getRandEmptyCell();
    if (emptyCoord) {
        gBoard[emptyCoord.i][emptyCoord.j].gameElement = CLOCK;
        renderCell(emptyCoord, CLOCK_IMG);
        setTimeout(function() {
            gBoard[emptyCoord.i][emptyCoord.j].gameElement = null;
            renderCell(emptyCoord, '');
            
        }, 5000);
    }
}

function summonGoldAtRandPos(){
    var emptyCoord = getRandEmptyCell();
    if (emptyCoord) {
        gBoard[emptyCoord.i][emptyCoord.j].gameElement = GOLD;
        renderCell(emptyCoord, GOLD_IMG);
        setTimeout(function() {
            gBoard[emptyCoord.i][emptyCoord.j].gameElement = null;
            renderCell(emptyCoord, '');
            
        }, 5000);
    }
}

function summonInnerWalls(){
    var emptyCoord = getRandEmptyCell();
    if (emptyCoord) {
        gBoard[emptyCoord.i][emptyCoord.j].type = WALL;
        renderCell(emptyCoord, WALL);
    }



}

function getRandEmptyCell() {
     
    do {
        var idxI = getRandomInt(1, gBoard.length - 1);
        var idxJ = getRandomInt(1, gBoard[0].length - 1);
        if (gBoard[idxI][idxJ].gameElement === null && gBoard[idxI][idxJ].type === FLOOR) {
            return { i: idxI, j: idxJ }
        }
        if (gBoard[idxI][idxJ].type === Wall ) return null;

    } while (true);

}