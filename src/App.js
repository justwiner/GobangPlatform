import React, { Component } from 'react';
import {drawBoard} from './lib/drawBoard';
import {setPointXY} from './lib/tool';
import {message, Button} from 'antd'
import {checkWin, personClick, addChessRecord, AIThink, calPoint} from './lib/gobang';
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
  // async componentWillUpdate (nextProps, nextState) {
  //   const {currentPlayer, blackObj, whiteObj, chessRecords, spec, gameState} = nextState
  //   await this.ItsAIThink(currentPlayer, blackObj, whiteObj, chessRecords, spec, gameState)
  // }
  componentDidUpdate () {
    const {gameState} = this.state
    if (gameState.ifEnd) {
      const msg = `游戏结束,${gameState.winner === 0 ? '黑方' : '白方'}获胜!`
      message.success(msg)
      this.refs.board.onclick = null
    }
  }
  ItsAIThink = async (currentPlayer, blackObj, whiteObj, chessRecords, spec, gameState) => {
    if (!gameState.ifEnd) {
      let currentPlayerObj = {}
      if (currentPlayer === "white") {
        currentPlayerObj = whiteObj
      } else {
        currentPlayerObj = blackObj
      }
      if (currentPlayerObj.player === 2) {
        console.log(`${currentPlayer} AI开始思考 <url: ${currentPlayerObj.url}>`)
        const nextPlayer = currentPlayer === "black" ? "white" : "black"
        let point = await AIThink(chessRecords, spec, currentPlayerObj)
        const width = this.getWidth()
        point = calPoint(setPointXY(point, width), width, spec)
        const result = addChessRecord(chessRecords, point)
        this.boardCheckWin(result, width, spec, nextPlayer)
      }
    }
    this.drawBoard_()
  }
  boardClick (e) {
    let {chessRecords, borderWidth, spec, currentPlayer, blackObj, whiteObj} = this.state
    const nextPlayer = currentPlayer === "black" ? "white" : "black"
    let ifNotAI = false
    if (currentPlayer === "white") {
      ifNotAI = (whiteObj.player === 1)
    } else {
      ifNotAI = (blackObj.player === 1)
    }
    if (ifNotAI) {
      e= e || window.event;
      const ele = this.refs.board
      const width = this.getWidth()
      const clickPoint = personClick(width, borderWidth, spec, ele, e)
      const result = addChessRecord(chessRecords, clickPoint)
      this.drawBoard_()
      this.boardCheckWin(result, width, spec, nextPlayer)
    }
  }
  ifStartGame = (balck, white) => {
    if (balck && white) {
      const {blackObj, whiteObj} = this.state
      this.setState({readyButtonShow: false, currentPlayer: "black"}, async () => {
        const {currentPlayer, blackObj, whiteObj, chessRecords, spec, gameState} = this.state
        await this.ItsAIThink(currentPlayer, blackObj, whiteObj, chessRecords, spec, gameState)
      })
      if (blackObj.player === 0 && whiteObj.player === 0) {} else {
        this.refs.board.onclick = this.boardClick.bind(this)
      }
    }
  }
  boardCheckWin = async (result, width, spec, nextPlayer) => {
    if (result.success) {
      const checkResult = checkWin(result.chessRecords, width, spec)
      if (checkResult.ifEnd) {
        this.setState({chessRecords: result.chessRecords, gameState: checkResult, currentPlayer: ""})
      } else {
        const {whiteObj, blackObj} = this.state
        let currentPlayerObj = {}
        if (nextPlayer === "white") {
          currentPlayerObj = whiteObj
        } else {
          currentPlayerObj = blackObj
        }
        if (currentPlayerObj.player === 2) {
          this.setState({chessRecords: result.chessRecords, currentPlayer: nextPlayer}, async () => {
            const {currentPlayer, blackObj, whiteObj, chessRecords, spec, gameState} = this.state
            await this.ItsAIThink(currentPlayer, blackObj, whiteObj, chessRecords, spec, gameState)
          })
        } else {
          this.setState({chessRecords: result.chessRecords, currentPlayer: nextPlayer})
        }
      }
    }
  }
  drawBoard_ () {
    const board = this.refs.board
    const context = board.getContext('2d');
    const {borderWidth, border, spec, chessRecords} = this.state;
    const width = (borderWidth - 2 * border) / spec
    drawBoard(context, borderWidth, border, spec, width, chessRecords)
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
  reastartGame = () => {
    window.location.reload()
  }
  getWidth = () => {
    const {borderWidth, border, spec} = this.state
    return (borderWidth - 2 * border) / spec
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
          <Button type="danger" onClick={this.reastartGame}>重开</Button>
        </footer>
      </div>
    );
  }
}

export default App;