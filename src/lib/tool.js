function getOffsetTop(obj){
    let tmp = obj.offsetTop;
    let val = obj.offsetParent;
    while(val != null){
        tmp += val.offsetTop;
        val = val.offsetParent;
    }
    return tmp;
}
function getOffsetLeft(obj){
    let tmp = obj.offsetLeft;
    let val = obj.offsetParent;
    while(val != null){
        tmp += val.offsetLeft;
        val = val.offsetParent;
    }
    return tmp;
}

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

export {
    getOffsetPoint
}