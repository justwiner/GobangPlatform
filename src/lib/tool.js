// 工具库

/**
 * 获取相对棋盘上部的距离
 * @param {*} obj 棋盘上下文对象
 * @returns 棋盘距窗口顶部的距离
 */
function getOffsetTop(obj){
    let tmp = obj.offsetTop;
    let val = obj.offsetParent;
    while(val != null){
        tmp += val.offsetTop;
        val = val.offsetParent;
    }
    return tmp;
}

/**
 * 获取相对棋盘左侧的距离
 * @param {*} obj
 * @returns 棋盘相对窗口左侧的距离
 */
function getOffsetLeft(obj){
    let tmp = obj.offsetLeft;
    let val = obj.offsetParent;
    while(val != null){
        tmp += val.offsetLeft;
        val = val.offsetParent;
    }
    return tmp;
}

/**
 * 获取相对坐标
 * @param {*} obj 棋盘上下文对象
 * @param {*} event 点击事件
 * @returns 鼠标点击位置相对于棋盘左上角的相对坐标
 */
function getOffsetPoint (obj, event) {
    let objTop = getOffsetTop(obj);//对象x位置
    let objLeft = getOffsetLeft(obj);//对象y位置
    
    let mouseX = event.clientX + document.body.scrollLeft;//鼠标x位置
    let mouseY = event.clientY + document.body.scrollTop;//鼠标y位置
   //计算点击的相对位置
    let objX = mouseX-objLeft;
    let objY = mouseY-objTop;
    return {
        x: objX,
        y: objY
    }
}

// 将坐标转换为二维数组的下标
/**
 *
 *
 * @param {*} point
 * @param {*} width
 * @returns
 */
function setPointXY (point, width) {
    const {mulX, mulY} = point.index
    const result = {
        index: {
            mulX,
            mulY
        },
        x: (mulX + 1) * width,
        y: (mulY + 1) * width
    }
    return result
}

export {
    getOffsetPoint,
    setPointXY
}