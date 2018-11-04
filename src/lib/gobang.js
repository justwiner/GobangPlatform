import {getOffsetPoint} from './tool'

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
    const mulX = (x / width).toFixed(0) - 0
    const mulY = (y /width).toFixed(0) - 0
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

function checkWin (chessRecords = []) {
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
        tempCheckChess = checkChess.filter(e => e.point.index.mulY === mulY)
        result = transverseCheck(tempCheckChess, lastChess.type, mulX)
        if (result.ifEnd) {
            return result
        }
        // 纵向判断
        tempCheckChess = checkChess.filter(e => e.point.index.mulX === mulX)
        result = portraitCheck(tempCheckChess, lastChess.type, mulY)
        if (result.ifEnd) {
            return result
        }

        // 顺时针45度判断
        tempCheckChess = checkChess.filter(e => {
            const tempX = e.point.index.mulX;
            const tempY = e.point.index.mulY;
            const diffrence = mulX - tempX;
            if (tempY === mulY + diffrence) {
                return true;
            } else {
                return false
            }
        })
        result = fourtyFiveCheck(tempCheckChess, lastChess.type, mulX, mulY)
        if (result.ifEnd) {
            return result
        }

        // 顺时针135度判断
        tempCheckChess = checkChess.filter(e => {
            const tempX = e.point.index.mulX;
            const tempY = e.point.index.mulY;
            const diffrence = mulX - tempX;
            if (tempY === mulY - diffrence) {
                return true;
            } else {
                return false
            }
        })
        result = oneHundredAndThirtyFiveCheck(tempCheckChess, lastChess.type, mulX, mulY)
        if (result.ifEnd) {
            return result
        }

        if (length === 225) {
            return {
                ifEnd: true,
                winner: null
            };
        }
        return {
            ifEnd: false,
            winner: null
        };
    }
    
}

function transverseCheck (tempCheckChess, type, mulX) {
    let count = 1;
    const leftChess = tempCheckChess.filter(e => e.point.index.mulX < mulX).sort((pre, cur) => pre.point.index.mulX - cur.point.index.mulX);
    const rightChess = tempCheckChess.filter(e => e.point.index.mulX > mulX).sort((pre, cur) => pre.point.index.mulX - cur.point.index.mulX);
    const leftChessLength = leftChess.length;
    const rightChessLength = rightChess.length;
    let num = 1;
    for (let i = leftChessLength - 1; i >= 0; i --) {
        if (leftChess[i].point.index.mulX + num === mulX){
            count ++;
            num ++;
        }
        else break;
    }
    num = 1;
    for (let i = 0; i < rightChessLength; i ++) {
        if (rightChess[i].point.index.mulX - num === mulX){
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

function portraitCheck (tempCheckChess, type, mulY) {
    let count = 1;
    const topChess = tempCheckChess.filter(e => e.point.index.mulY < mulY).sort((pre, cur) => (pre.point.index.mulY - cur.point.index.mulY));
    const bottomChess = tempCheckChess.filter(e => e.point.index.mulY > mulY).sort((pre, cur) => (pre.point.index.mulY - cur.point.index.mulY));
    const topChessLength = topChess.length;
    const bottomChessLength = bottomChess.length;
    let num = 1;
    for (let i = topChessLength - 1; i >= 0; i --) {
        if (topChess[i].point.index.mulY + num === mulY){
            count ++;
            num ++;
        }
        else break;
    }
    num = 1;
    for (let i = 0; i < bottomChessLength; i ++) {
        if (bottomChess[i].point.index.mulY - num === mulY){
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

function fourtyFiveCheck (tempCheckChess, type, mulX, mulY) {
    let count = 1;
    const topChess = tempCheckChess.filter(e => e.point.index.mulY < mulY).sort((pre, cur) => pre.point.index.mulY - cur.point.index.mulY);
    const bottomChess = tempCheckChess.filter(e => e.point.index.mulY > mulY).sort((pre, cur) => pre.point.index.mulY - cur.point.index.mulY);
    const topChessLength = topChess.length;
    const bottomChessLength = bottomChess.length;
    let num = 1;
    for (let i = topChessLength - 1; i >= 0; i --) {
        if (topChess[i].point.index.mulY + num === mulY && topChess[i].point.index.mulX - num === mulX){
            count ++;
            num ++;
        }
        else break;
    }
    num = 1;
    for (let i = 0; i < bottomChessLength; i ++) {
        if (bottomChess[i].point.index.mulY - num === mulY && bottomChess[i].point.index.mulX + num === mulX){
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

function oneHundredAndThirtyFiveCheck (tempCheckChess, type, mulX, mulY) {
    let count = 1;
    const topChess = tempCheckChess.filter(e => e.point.index.mulY < mulY).sort((pre, cur) => pre.point.index.mulY - cur.point.index.mulY);
    const bottomChess = tempCheckChess.filter(e => e.point.index.mulY > mulY).sort((pre, cur) => pre.point.index.mulY - cur.point.index.mulY);
    const topChessLength = topChess.length;
    const bottomChessLength = bottomChess.length;
    let num = 1;
    for (let i = topChessLength - 1; i >= 0; i --) {
        if (topChess[i].point.index.mulY + num === mulY && topChess[i].point.index.mulX + num === mulX){
            count ++;
            num ++;
        }
        else break;
    }
    num = 1;
    for (let i = 0; i < bottomChessLength; i ++) {
        if (bottomChess[i].point.index.mulY - num === mulY && bottomChess[i].point.index.mulX - num === mulX){
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

function personClick (width, borderWidth, border, spec, ele, e) {
    let clickPoint = getOffsetPoint(ele, e)
    clickPoint = calPoint(clickPoint, width, spec)
    const {x, y} = clickPoint
    if (x === 0 || x === borderWidth || y === 0 || y === borderWidth)
      return
    return clickPoint
}

function pointIfExist (chessRecords, point) {
    const {mulX, mulY} = point.index
    let ifExist = false
    for (let i = 0 ; i < chessRecords.length; i ++) {
        if ((mulX === (chessRecords[i].point.index.mulX - 1)) && (mulY === chessRecords[i].point.index.mulY - 1)) {
            ifExist = true;
            break
        }
    }
    return ifExist;
}

function AIThink (chessRecords, spec, AIObj) {
    // console.log({
    //     chessRecords,
    //     spec,
    //     AIObj
    // })
    let mulX = ""
    let mulY = ""
    let ifExist = false
    debugger;
    while (!ifExist) {
        mulX = Math.floor(Math.random() * (spec + 1))
        mulY = Math.floor(Math.random() * (spec + 1))
        ifExist = pointIfExist (chessRecords, {
            index: {
                mulX, mulY
            }
        })
        ifExist = !ifExist
    }
    let result = {}
    result = {
        index: {
            mulX,
            mulY
        }
    }
    return result;
}

export {
    calPoint,
    addChessRecord,
    checkWin,
    personClick,
    AIThink
}