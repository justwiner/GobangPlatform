// 绘制棋盘所需要的函数
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
    // 绘制棋子
    chessRecords.forEach(e => {
        drawCircle(context, {
            point: e.point,
            width: width / 2.5,
            type: e.type,
            strokeStyle: e.color
        })
    });
}
// 绘制线条
function drawLine(context, options) {
    context.moveTo(options.start.x, options.start.y);
    context.lineTo(options.end.x, options.end.y);
    if (options.strokeColor)
        context.strokeStyle = options.strokeColor;
    context.stroke();
}
// 绘制棋子
function drawCircle(context, options) {
    context.beginPath();
    context.arc(options.point.x, options.point.y, options.width, 0, 2 * Math.PI, true);
    let grd = null;
    if (options.type !== undefined && options.type !== null) {
        grd = context.createRadialGradient(options.point.x, options.point.y, options.width, options.point.x, options.point.y, 0);//设置渐变
    }
    if (options.type === 0) {
        grd.addColorStop(0,'#0A0A0A');
        grd.addColorStop(1,'#636766');
    } else if (options.type === 1) {
        grd.addColorStop(0,'#D1D1D1');
        grd.addColorStop(1,'#F9F9F9');
    }
    if (options.fillStyle)
        context.fillStyle = options.fillStyle;
    else
        context.fillStyle = grd;
    if (options.strokeStyle)
        context.strokeStyle = options.strokeStyle;
    context.fill();
    context.stroke();
    context.closePath();
}

export {
    drawBoard,
    drawLine,
    drawCircle
}