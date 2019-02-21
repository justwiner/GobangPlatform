/**
 *
 * 绘制棋盘所需要的函数
 * @param {*} context canvas对象上下文
 * @param {*} borderWidth 棋盘总宽度
 * @param {*} border 格子快度
 * @param {*} spec 每行的格子个数
 * @param {*} width 每个格子空白部分的宽度，即去除一个格子的边框的宽度
 * @param {*} chessRecords 落子记录
 */
function drawBoard(context, borderWidth, border, spec, width, chessRecords) {
    context.fillRect(30, 30, 0, 0);
    // 绘制线条
    for (let i = 0; i <= spec; i++) {
        drawLine(context, {
            start: {
                x: border + i * width,
                y: border
            },
            end: {
                x: border + i * width,
                y: borderWidth - border
            },
            strokeColor: "grey"
        })
        drawLine(context, {
            start: {
                x: border,
                y: border + i * width,
            },
            end: {
                x: borderWidth - border,
                y: border + i * width,
            },
            strokeColor: "grey"
        })
    }
    // 绘制 5 个中心点
    drawCircle(context, {
        point: {
            x: (spec / 2 + 1) * width - (spec / 2 + 1),
            y: (spec / 2 + 1) * width - (spec / 2 + 1)
        },
        width: width / 7,
        fillStyle: "black",
        strokeStyle: "black"
    })
    drawCircle(context, {
        point: {
            x: (spec / 2 + 1 - 4) * width - (spec / 2 + 1),
            y: (spec / 2 + 1 - 4) * width - (spec / 2 + 1)
        },
        width: width / 7,
        fillStyle: "black",
        strokeStyle: "black"
    })
    drawCircle(context, {
        point: {
            x: (spec / 2 + 1 + 4) * width - (spec / 2 + 1),
            y: (spec / 2 + 1 - 4) * width - (spec / 2 + 1)
        },
        width: width / 7,
        fillStyle: "black",
        strokeStyle: "black"
    })
    drawCircle(context, {
        point: {
            x: (spec / 2 + 1 - 4) * width - (spec / 2 + 1),
            y: (spec / 2 + 1 + 4) * width - (spec / 2 + 1)
        },
        width: width / 7,
        fillStyle: "black",
        strokeStyle: "black"
    })
    drawCircle(context, {
        point: {
            x: (spec / 2 + 1 + 4) * width - (spec / 2 + 1),
            y: (spec / 2 + 1 + 4) * width - (spec / 2 + 1)
        },
        width: width / 7,
        fillStyle: "black",
        strokeStyle: "black"
    })
    const length = chessRecords.length
    // 绘制棋子
    chessRecords.forEach((e, index) => {
        if (index + 1 !== length) {
            drawCircle(context, {
                point: e.point,
                width: width / 2.5,
                type: e.type,
                strokeStyle: e.color
            })
        } else {
            drawCircle(context, {
                point: e.point,
                width: width / 2.5,
                type: e.type,
                strokeStyle: e.color,
                ifLatest: true
            })
        }
    });
}

/**
 * 封装->绘制线条
 * @param {*} context canvas对象上下文
 * @param {*} options 线条属性（起点坐标、终点坐标、颜色）
 */
function drawLine(context, options) {
    // 绘制起点
    context.moveTo(options.start.x, options.start.y);
    // 绘制终点
    context.lineTo(options.end.x, options.end.y);
    // 给线条上色
    if (options.strokeColor)
        context.strokeStyle = options.strokeColor;
    // 以笔触(类似笔一样，画路径)的方式绘制， fill()方法为填充
    context.stroke();
}

/**
 * 封装->绘制棋子
 * @param {*} context canvas对象上下文
 * @param {*} options 棋子属性（圆心坐标、半径、填充颜色、类型（黑棋、白棋）、画笔颜色）
 */
function drawCircle(context, options) {
    // 清除之前所有的画笔设置
    context.beginPath();
    // arc(圆心x坐标，圆心y坐标，圆的半径，起始角，结束角，true=逆时针 | false=顺时针)
    context.arc(options.point.x, options.point.y, options.width, 0, 2 * Math.PI, true);
    let grd = null;
    if (options.type !== undefined && options.type !== null) {
        // 绘制棋子外侧的渐变色
        grd = context.createRadialGradient(options.point.x, options.point.y, options.width, options.point.x, options.point.y, 0);//设置渐变
    }
    if (options.type === 0) {
        // 棋子外侧渐变色的边框的 宽度与颜色范围
        grd.addColorStop(0,'#0A0A0A');
        grd.addColorStop(1,'#636766');
    } else if (options.type === 1) {
        // 棋子外侧渐变色的边框的 宽度与颜色范围
        grd.addColorStop(0,'#D1D1D1');
        grd.addColorStop(1,'#F9F9F9');
    }
    if (options.fillStyle)
        // 设置填充颜色
        context.fillStyle = options.fillStyle;
    else
        // 设置填充颜色
        context.fillStyle = grd;
    if (options.strokeStyle)
        // 设置画笔颜色
        context.strokeStyle = options.strokeStyle;
    // 以填充的方式绘制
    context.fill();
    context.stroke();
    // 封闭一个图形，无瑕疵
    context.closePath();
    if (options.ifLatest) {
        const latestColor = 'red'
        // 清除之前所有的画笔设置
        context.beginPath();
        // 设置画笔颜色
        context.strokeStyle = latestColor;
        // 设置填充颜色
        context.fillStyle = latestColor;
        // arc(圆心x坐标，圆心y坐标，圆的半径，起始角，结束角，true=逆时针 | false=顺时针)
        context.arc(options.point.x, options.point.y, options.width/5, 0, 2 * Math.PI, true);
        // 以填充的方式绘制
        context.fill();
        context.stroke();
        // 封闭一个图形，无瑕疵
        context.closePath();
    }
}

export {
    drawBoard,
    drawLine,
    drawCircle
}