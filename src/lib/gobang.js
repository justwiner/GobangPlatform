
function calPoint (point, width, spec) {
    let {x, y} = point
    const remainDerX = x % width
    const remainDerY = y % width
    if (remainDerX > width/2)
        x = x - remainDerX + width
    else
        x = x - remainDerX
    if (remainDerY > width/2)
        y = y - remainDerY + width
    else 
        y = y - remainDerY
    x = x - (spec / 2 + 1)
    y = y  - (spec / 2 + 1)
    const mulX = (x / width).toFixed(0)
    const mulY = (y /width).toFixed(0)
    return {x,y, index: {mulX, mulY}}
}

function addChessRecord (chessRecords = [], point) {
    const length = chessRecords.length
    if (length === 0) {
        chessRecords.push({
            color: 'black',
            type: 0,
            point: {...point}
        })
    } else {
        const lastChess = chessRecords[length - 1];
        for (let i = 0; i < length; i ++) {
            const {x, y} = chessRecords[i].point
            if (x === point.x && y === point.y) {
                return {
                    success: false,
                    chessRecords
                }
            }
        }
        const newChess = lastChess.type === 0
        ? {
            color: 'white',
            type: 1,
            point: {...point}
        }
        : {
            color: 'black',
            type: 0,
            point: {...point}
        }
        chessRecords.push(newChess)
    }
    return {
        success: true,
        chessRecords
    }
}

function checkWin (chessRecords = [], width, spec) {
    const length = chessRecords.length;
    if (length < 9) {
        return {
            ifEnd: false,
            winner: null
        };
    } else {
        const lastChess = chessRecords[length - 1]
        const {mulX, mulY} = lastChess.point.index
        const checkChess = chessRecords.filter(e => e.type === lastChess.type)
        checkChess.pop()
        let tempCheckChess = []
        let result = {}
        // 横向判断
        tempCheckChess = checkChess.filter(e => e.point.index.y === mulY)
        console.log(tempCheckChess)
        result = transverseCheck(tempCheckChess, lastChess.type, mulX, width)
        if (result.ifEnd) {
            return result
        }
        // 纵向判断
        tempCheckChess = checkChess.filter(e => e.point.x === mulX)
        result = portraitCheck(tempCheckChess, lastChess.type, mulY, width)
        if (result.ifEnd) {
            return result
        }

        // 顺时针45度判断
        tempCheckChess = checkChess.filter(e => {
            const tempX = e.point.x;
            const tempY = e.point.y;
            const diffrence = mulX - tempX;
            if (tempY === mulY + diffrence) {
                return true;
            } else {
                return false
            }
        })
        result = fourtyFiveCheck(tempCheckChess, lastChess.type, mulX, mulY, width)
        if (result.ifEnd) {
            return result
        }

        // 顺时针135度判断
        tempCheckChess = checkChess.filter(e => {
            const tempX = e.point.x;
            const tempY = e.point.y;
            const diffrence = mulX - tempX;
            if (tempY === mulY - diffrence) {
                return true;
            } else {
                return false
            }
        })
        result = oneHundredAndThirtyFiveCheck(tempCheckChess, lastChess.type, mulX, mulY, width)
        if (result.ifEnd) {
            return result
        }

        return {
            ifEnd: false,
            winner: null
        };
    }
    
}

function transverseCheck (tempCheckChess, type, x, width) {
    let count = 1;
    const leftChess = tempCheckChess.filter(e => e.point.x < x).sort((pre, cur) => pre.point.x - cur.point.x);
    const rightChess = tempCheckChess.filter(e => e.point.x > x).sort((pre, cur) => pre.point.x - cur.point.x);
    const leftChessLength = leftChess.length;
    const rightChessLength = rightChess.length;
    let num = 1;
    for (let i = leftChessLength - 1; i >= 0; i --) {
        if (leftChess[i].point.x + num * width === x){
            count ++;
            num ++;
        }
        else break;
    }
    num = 1;
    for (let i = 0; i < rightChessLength; i ++) {
        if (rightChess[i].point.x - num * width === x){
            count ++
            num ++
        }
        else break;
    }
    if (count === 5) {
        return {
            ifEnd: true,
            winner: type
        }
    } else {
        return {
            ifEnd: false,
            winner: null
        }
    }
}

function portraitCheck (tempCheckChess, type, y, width) {
    let count = 1;
    const topChess = tempCheckChess.filter(e => e.point.y < y).sort((pre, cur) => pre.point.y - cur.point.y);
    const bottomChess = tempCheckChess.filter(e => e.point.y > y).sort((pre, cur) => pre.point.y - cur.point.y);
    const topChessLength = topChess.length;
    const bottomChessLength = bottomChess.length;
    let num = 1;
    for (let i = topChessLength - 1; i >= 0; i --) {
        if (topChess[i].point.y + num * width === y){
            count ++;
            num ++;
        }
        else break;
    }
    num = 1;
    for (let i = 0; i < bottomChessLength; i ++) {
        if (bottomChess[i].point.y - num * width === y){
            count ++
            num ++
        }
        else break;
    }
    if (count === 5) {
        return {
            ifEnd: true,
            winner: type
        }
    } else {
        return {
            ifEnd: false,
            winner: null
        }
    }
}

function fourtyFiveCheck (tempCheckChess, type, x, y, width) {
    let count = 1;
    const topChess = tempCheckChess.filter(e => e.point.y < y).sort((pre, cur) => pre.point.y - cur.point.y);
    const bottomChess = tempCheckChess.filter(e => e.point.y > y).sort((pre, cur) => pre.point.y - cur.point.y);
    const topChessLength = topChess.length;
    const bottomChessLength = bottomChess.length;
    let num = 1;
    for (let i = topChessLength - 1; i >= 0; i --) {
        if (topChess[i].point.y + num * width === y && topChess[i].point.x - num * width === x){
            count ++;
            num ++;
        }
        else break;
    }
    num = 1;
    for (let i = 0; i < bottomChessLength; i ++) {
        if (bottomChess[i].point.y - num * width === y && bottomChess[i].point.x + num * width === x){
            count ++
            num ++
        }
        else break;
    }
    if (count === 5) {
        return {
            ifEnd: true,
            winner: type
        }
    } else {
        return {
            ifEnd: false,
            winner: null
        }
    }
}

function oneHundredAndThirtyFiveCheck (tempCheckChess, type, x, y, width) {
    let count = 1;
    const topChess = tempCheckChess.filter(e => e.point.y < y).sort((pre, cur) => pre.point.y - cur.point.y);
    const bottomChess = tempCheckChess.filter(e => e.point.y > y).sort((pre, cur) => pre.point.y - cur.point.y);
    const topChessLength = topChess.length;
    const bottomChessLength = bottomChess.length;
    let num = 1;
    for (let i = topChessLength - 1; i >= 0; i --) {
        if (topChess[i].point.y + num * width === y && topChess[i].point.x + num * width === x){
            count ++;
            num ++;
        }
        else break;
    }
    num = 1;
    for (let i = 0; i < bottomChessLength; i ++) {
        if (bottomChess[i].point.y - num * width === y && bottomChess[i].point.x - num * width === x){
            count ++
            num ++
        }
        else break;
    }
    if (count === 5) {
        return {
            ifEnd: true,
            winner: type
        }
    } else {
        return {
            ifEnd: false,
            winner: null
        }
    }
}

export {
    calPoint,
    addChessRecord,
    checkWin
}