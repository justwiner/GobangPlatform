// 五子棋平台共用逻辑函数

import {getOffsetPoint} from './tool'
import axios from 'axios'

// 根据点击位置的坐标（相对棋盘左上角），计算出目标下子位置
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

// 将落子记录添加到总记录中，用于棋盘的渲染
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

// 检查棋局是否结束总函数
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

// 检查是否具有横向获胜条件
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

// 检查是否具有纵向获胜条件
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

// 检查是否具有顺时针45°获胜条件
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

// 检查是否具有顺时针135°获胜条件
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

// 获取用户想要点击的位置
function personClick (width, borderWidth, border, spec, ele, e) {
    let clickPoint = getOffsetPoint(ele, e)
    clickPoint = calPoint(clickPoint, width, spec)
    const {x, y} = clickPoint
    if (x === 0 || x === borderWidth || y === 0 || y === borderWidth)
      return
    return clickPoint
}



// 根据落子记录，构建棋盘二维数组布局
function createArray (chessRecords = [], spec) {
    let boardArray = initArray(spec);
    for (let i = 0; i <= spec; i ++) {
        let temp = chessRecords.filter(item => item.point.index.mulY === (i + 1))
        let length = temp.length;
        for (let j = 0; j <= spec; j ++) {
            for (let chessIndex = 0; chessIndex < length; chessIndex ++) {
                if ((temp[chessIndex].point.index.mulX - 1) === j) {
                    if (temp[chessIndex].type === 0) {
                        boardArray[i][j] = 2
                    } else {
                        boardArray[i][j] = 1
                    }
                }
            }
        }
    }
    return boardArray;
}

// 初始化空棋盘二维数组
function initArray (spec) {
    let result = [];
    for(let i = 0 ; i <= spec; i ++) {
        let row = []
        for(let j = 0 ; j <= spec; j ++) {
            row.push(0)
        }
        result.push(row)
    }
    return result;
}

// 由AI思考落子位置
async function AIThink (chessRecords, spec, AIObj) {
    let result = (await axios.post(AIObj.url, {
        array: createArray(chessRecords, spec),
        spec,
        chessRecords
    })).data
    console.log(result)
    return result;
}

export {
    calPoint,
    addChessRecord,
    checkWin,
    personClick,
    AIThink
}