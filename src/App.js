import React, { Component } from 'react';
import {drawBoard} from './lib/drawBoard';
import {getOffsetPoint} from './lib/tool';
import {message, Button} from 'antd'
import {calPoint, addChessRecord, checkWin} from './lib/gobang';
import bowls from './assets/img/bowls.png'
import './App.css';

class App extends Component {
  state = {
    borderWidth: 600,
    spec: 14,
    border: 30,
    chessRecords: [],
    gameState: {
      ifEnd: false,
      winner: null
    }
  }
  componentDidMount () {
    this.refs.board.onclick = this.boardClick.bind(this)
    this.drawBoard_()
  }
  componentWillUpdate () {
    this.drawBoard_()
  }
  componentDidUpdate () {
    const {gameState} = this.state
    if (gameState.ifEnd) {
      const msg = `游戏结束,${gameState.winner === 0 ? '黑方' : '白方'}获胜!`
      message.success(msg)
      this.refs.board.onclick = null
    }
  }
  drawBoard_ () {
    const board = this.refs.board
    const context = board.getContext('2d');
    const {borderWidth, border, spec, chessRecords} = this.state;
    const width = (borderWidth - 2 * border) / spec
    drawBoard(context, borderWidth, border, spec, width, chessRecords)
  }
  boardClick (e) {
    e= e || window.event;
    const ele = this.refs.board
    const {chessRecords, borderWidth, border, spec} = this.state
    const width = (borderWidth - 2 * border) / spec
    let clickPoint = getOffsetPoint(ele, e)
    clickPoint = calPoint(clickPoint, width, spec)
    const {x, y} = clickPoint
    if (x === 0 || x === borderWidth || y === 0 || y === borderWidth)
      return
    const result = addChessRecord(chessRecords, clickPoint)
    if (result.success) {
      const checkResult = checkWin(result.chessRecords, width, spec)
      if (checkResult.ifEnd) {
        this.setState({chessRecords: result.chessRecords, gameState: checkResult})
      } else {
        this.setState({chessRecords: result.chessRecords})
      }
    }
  }
  render() {
    const borderWidth = this.state.borderWidth
    return (
      <div className="App">
        <header>
          GoBang - AI
        </header>
        <section>
          <canvas ref="board" width={borderWidth} height={borderWidth}></canvas>
        </section>
        <footer>
            <section>
              <img src={bowls} alt="碗" />
            </section>
            <section>
              <Button type="danger">认输</Button>
              <Button type="primary">悔棋</Button>
            </section>
        </footer>
      </div>
    );
  }
}

export default App;
