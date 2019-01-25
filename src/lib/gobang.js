// 五子棋平台共用逻辑函数

import {getOffsetPoint} from './tool'
import axios from 'axios'

// 

/**
 * 根据点击位置的坐标（相对棋盘左上角），计算出目标下子位置
 * @param {*} point 点击位置信息（横坐标、纵坐标）
 * @param {*} width 每个格子空白部分的宽度
 * @param {*} spec 每行的格子数目
 * @returns 返回-根据点击信息计算出的棋盘位置
 */
function calPoint (point, width, spec) {
    let {x, y} = point
    // 点击位置的横坐标对宽度取余，求出多余部分的长度
    const remainDerX = x % width
    // 点击位置的纵坐标对宽度取余，求出多余部分的长度
    const remainDerY = y % width
    /**
     * 如果横坐标取余结果多余部分的长度大于width的一半，则默认取右侧最近的落子位置
     * 反之取左侧最近的落子位置
     */
    if (remainDerX > width/2)
        x = x - remainDerX + width
    else
        x = x - remainDerX
    /**
     * 如果纵坐标取余结果多余部分的长度大于width的一半，则默认取下侧最近的落子位置
     * 反之取上侧最近的落子位置
     */
    if (remainDerY > width/2)
        y = y - remainDerY + width
    else 
        y = y - remainDerY
    x = x - (spec / 2 + 1)
    y = y  - (spec / 2 + 1)
    // 计算出二维数组方式的落子位置，如(2,2)
    const mulX = (x / width).toFixed(0) - 0
    const mulY = (y /width).toFixed(0) - 0
    return {x,y, index: {mulX, mulY}}
}

/**
 * 将落子记录添加到总记录中，用于棋盘的渲染
 * @param {*} [chessRecords=[]] 上一步的落子总记录
 * @param {*} point 当前落子信息
 * @returns 当前落子总记录
 */
function addChessRecord (chessRecords = [], point) {
    // 计算当前以前共落多少颗子
    const length = chessRecords.length
    // 如果落子数为0，则直接将当前落子信息添加进总记录
    if (length === 0) {
        chessRecords.push({
            color: 'black',
            type: 0,
            point: {...point}
        })
    } else {
        // 拿到上一步的落子信息
        const lastChess = chessRecords[length - 1];
        // 如果此位子已有棋子了，则落子失败，原落子总记录不变
        for (let i = 0; i < length; i ++) {
            const {x, y} = chessRecords[i].point
            // 判断是否落子位置相同
            if (x === point.x && y === point.y) {
                return {
                    success: false,
                    chessRecords
                }
            }
        }
        /**
         * 当前落子必定与上一步落子信息相反
         * 即上一步是白棋，则此步必为黑棋
         * 并将落子信息添加进总记录中
         */
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

/**
 * 检查棋局是否结束总函数
 * @param {*} [chessRecords=[]] 落子记录
 * @returns {是否胜利，胜利者}
 */
function checkWin (chessRecords = []) {
    const length = chessRecords.length;
    // 落子数小于9.则必不可能结束
    if (length < 9) {
        return {
            ifEnd: false,
            winner: null
        };
    } else {
        /**
         * 判断是否胜利，肯定是判断最后一步落子的那一方
         * 不能判断倒数第二步的棋手是否胜利，若是倒数第二步的棋手胜利了，就不可能走最后一步
         */
        // 拿出最后一步棋子的信息
        const lastChess = chessRecords[length - 1]
        const {mulX, mulY} = lastChess.point.index
        // 筛选出所有此棋手的棋子
        const checkChess = chessRecords.filter(e => e.type === lastChess.type)
        // 由于之前取出过最后一步的棋子，因此将筛选出的结果去掉最后一个棋子
        checkChess.pop()
        let tempCheckChess = []
        let result = {}
        /**
         * 横向判断
         * 取出跟最后一步棋子在同一行的所有棋子，即纵坐标相同即可
         */
        tempCheckChess = checkChess.filter(e => e.point.index.mulY === mulY)
        // 得到横向判断的结果
        result = transverseCheck(tempCheckChess, lastChess.type, mulX)
        if (result.ifEnd) {
            return result
        }
        /**
         * 纵向判断
         * 取出跟最后一步棋子在同一列的所有棋子，即横坐标相同即可
         */
        tempCheckChess = checkChess.filter(e => e.point.index.mulX === mulX)
        // 得到纵向判断的结果
        result = portraitCheck(tempCheckChess, lastChess.type, mulY)
        if (result.ifEnd) {
            return result
        }

        /**
         * 顺时针45°（即左低右高）判断
         * 取出跟最后一步棋子在同一顺时针45°的所有棋子
         */
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
        // 得到顺时针45°判断的结果
        result = fourtyFiveCheck(tempCheckChess, lastChess.type, mulX, mulY)
        if (result.ifEnd) {
            return result
        }

        /**
         * 顺时针135°（即左高右低）判断
         * 取出跟最后一步棋子在同一顺时针135°的所有棋子
         */
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
        // 得到顺时针135°判断的结果
        result = oneHundredAndThirtyFiveCheck(tempCheckChess, lastChess.type, mulX, mulY)
        if (result.ifEnd) {
            return result
        }
        // 如果落子数为255，即棋盘下满。和棋
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


/**
 * 检查是否具有横向获胜条件
 * @param {*} tempCheckChess 同一行的所有棋子列表
 * @param {*} type 棋手所在方
 * @param {*} mulX 最后一次落子的横坐标
 * @returns 判断结果
 */
function transverseCheck (tempCheckChess, type, mulX) {
    // 默认连接初始值为 1
    let count = 1;
    // 最后一次落子位置的左侧棋子列表（由大到小的顺序）
    const leftChess = tempCheckChess.filter(e => e.point.index.mulX < mulX).sort((pre, cur) => pre.point.index.mulX - cur.point.index.mulX);
    // 最后一次落子位置的右侧棋子列表（由大到小的顺序）
    const rightChess = tempCheckChess.filter(e => e.point.index.mulX > mulX).sort((pre, cur) => pre.point.index.mulX - cur.point.index.mulX);
    // 左侧棋子的数目
    const leftChessLength = leftChess.length;
    // 右侧棋子的数目
    const rightChessLength = rightChess.length;
    // 起始横坐标偏移量为 1， 1 - 2 - 3 - 4
    let num = 1;
    /**
     * 计算左侧棋子最长连续棋路的数字
     * 距离落子位置最近的位置
     * 由右向左遍历
     */
    for (let i = leftChessLength - 1; i >= 0; i --) {
        if (leftChess[i].point.index.mulX + num === mulX){
            count ++;
            num ++;
        }
        // 不连续的话就break
        else break;
    }
    num = 1;
    /**
     * 计算右侧棋子最长连续棋路的数字
     * 距离落子位置最近的位置
     * 由左向右遍历
     */
    for (let i = 0; i < rightChessLength; i ++) {
        if (rightChess[i].point.index.mulX - num === mulX){
            count ++
            num ++
        }
        // 不连续的话就break
        else break;
    }
    // 如果连续棋子数目为5，则游戏结束，并得到胜利者信息
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

/**
 * 检查是否具有纵向获胜条件
 * @param {*} tempCheckChess 同一列所有棋子的列表
 * @param {*} type 棋手所在方
 * @param {*} mulY 落子位置的纵坐标
 * @returns 判断结果
 */
function portraitCheck (tempCheckChess, type, mulY) {
    // 统计可连续的棋子数目,默认为1
    let count = 1;
    // 最后一次落子的上方棋子列表（由小到大排序）
    const topChess = tempCheckChess.filter(e => e.point.index.mulY < mulY).sort((pre, cur) => (pre.point.index.mulY - cur.point.index.mulY));
    // 最后一次落子的下方棋子列表（由小到大排序）
    const bottomChess = tempCheckChess.filter(e => e.point.index.mulY > mulY).sort((pre, cur) => (pre.point.index.mulY - cur.point.index.mulY));
    const topChessLength = topChess.length;
    const bottomChessLength = bottomChess.length;
    let num = 1;
    // 计算最后一次落子位置上方可以连续的棋子数目
    for (let i = topChessLength - 1; i >= 0; i --) {
        if (topChess[i].point.index.mulY + num === mulY){
            count ++;
            num ++;
        }
        else break;
    }
    num = 1;
    // 计算最后一次落子位置下方可以连续的棋子数目
    for (let i = 0; i < bottomChessLength; i ++) {
        if (bottomChess[i].point.index.mulY - num === mulY){
            count ++
            num ++
        }
        else break;
    }
    // 可连续的棋子数目为 5 时，即连成 5 子
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

/**
 * 检查是否具有顺时针45°获胜条件
 * @param {*} tempCheckChess 在同一顺时针45°的所有棋子列表
 * @param {*} type 棋手所在方
 * @param {*} mulX 落子位置的横坐标
 * @param {*} mulY 落子位置的纵坐标
 * @returns 判断结果
 */
function fourtyFiveCheck (tempCheckChess, type, mulX, mulY) {
    let count = 1;
    // 位于最后一次落子位置右上方的棋子列表（按纵坐标，由大到小排序）
    const topChess = tempCheckChess.filter(e => e.point.index.mulY < mulY).sort((pre, cur) => pre.point.index.mulY - cur.point.index.mulY);
    // 位于最后一次落子位置左下方的棋子列表（按纵坐标，由大到小排序）
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
    return result;
}

export {
    calPoint,
    addChessRecord,
    checkWin,
    personClick,
    AIThink
}