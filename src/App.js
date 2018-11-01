import React, { Component } from 'react';
import {drawBoard} from './lib/drawBoard';
import {getOffsetPoint} from './lib/tool';
import {message, Button} from 'antd'
import {calPoint, addChessRecord, checkWin} from './lib/gobang';
import black from './assets/img/black.png'
import white from './assets/img/white.png'
import Player from './components/Player'
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
    },
    blackReady: false,
    whiteReady: false,
    blackObj: {},
    whiteObj: {},
    currentPlayer: "",
    readyButtonShow: true,
  }
  componentDidMount () {
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
    let {chessRecords, borderWidth, border, spec, currentPlayer} = this.state
    const width = (borderWidth - 2 * border) / spec
    let clickPoint = getOffsetPoint(ele, e)
    clickPoint = calPoint(clickPoint, width, spec)
    const {x, y} = clickPoint
    if (x === 0 || x === borderWidth || y === 0 || y === borderWidth)
      return
    const result = addChessRecord(chessRecords, clickPoint)
    currentPlayer = currentPlayer === "black" ? "white" : "black"
    if (result.success) {
      const checkResult = checkWin(result.chessRecords, width, spec)
      if (checkResult.ifEnd) {
        this.setState({chessRecords: result.chessRecords, gameState: checkResult, currentPlayer: ""})
      } else {
        this.setState({chessRecords: result.chessRecords, currentPlayer})
      }
    }
  }
  blackOnOkFun = (obj) => {
    if (obj.ready) {
      const {whiteReady} = this.state
      // this.setState({
      //   blackReady: true,
      //   state: obj
      // })
      this.state.blackReady = true;
      this.state.blackObj = obj
      this.ifStartGame(true, whiteReady)
    } else {
      this.setState({
        blackReady: false
      })
    }
  }
  whiteOnOkFun = (obj) => {
    if (obj.ready) {
      const {blackReady} = this.state
      // this.setState({
      //   whiteReady: true,
      //   whiteObj: obj
      // })
      this.state.whiteReady = true;
      this.state.whiteObj = obj
      this.ifStartGame(blackReady, true)
    } else {
      this.setState({
        whiteReady: false
      })
    }
  }
  ifStartGame = (balck, white) => {
    if (balck && white) {
      const {blackObj, whiteObj} = this.state
      console.log({
        blackObj,
        whiteObj
      })
      this.setState({readyButtonShow: false, currentPlayer: "black"})
      this.refs.board.onclick = this.boardClick.bind(this)
    } else {

    }
  }
  render() {
    const borderWidth = this.state.borderWidth
    const {currentPlayer, readyButtonShow, gameState} = this.state
    return (
      <div className="App">
        <header>
          GoBang - AI
        </header>
        <section>
          <Player 
          icon={black} 
          onOkCallBack={this.blackOnOkFun} 
          Player="black" 
          currentPlayer={currentPlayer} 
          readyButtonShow={readyButtonShow}
          winner={gameState.winner}/>
          <canvas ref="board" width={borderWidth} height={borderWidth}></canvas>
          <Player 
          icon={white} 
          onOkCallBack={this.whiteOnOkFun} 
          Player="white" 
          currentPlayer={currentPlayer} 
          readyButtonShow={readyButtonShow}
          winner={gameState.winner}/>
        </section>
        <footer>
          <Button type="danger">重开</Button>
        </footer>
      </div>
    );
  }
}

export default App;
