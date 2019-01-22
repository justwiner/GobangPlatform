/* 
    本组件用于展示下棋双方状态，包括真人与AI的选择与编辑
    当游戏开始之后，双方无法更改信息 
*/

import React from "react"
import {Input, Radio, Button,Icon } from 'antd'
import winImg from '../assets/img/win.png'
const RadioGroup = Radio.Group;

class Player extends React.Component {
    state = {
        player: 1, // 1 - 真人 ， 2 - AI 
        url: '', // AI 远程链接地址
        noChangeAble: false, // 当前是否允许修改信息
        bottonContext: '准备', // 按钮文字（准备，取消准备）
        bottonType: '', // 按钮状态，不同状态不同样式
    }
    onChangePlayer = (e) => this.setState({player: e.target.value}) // 改变玩家属性： 1 - 真人 ， 2 - AI 
    onChangeUrl = (e) => this.setState({url: e.target.value}) // 改变AI 远程链接地址
    // 准备按钮触发事件
    confirmReady = () => {
        const {url, player, bottonContext} = this.state
        /* 
            如果点击前状态是准备
            那么
            按钮文字 由“准备” -> “取消准备”
            当前玩家变为 ready：true 状态（父组件使用）
            单选项变为不可编辑
            修改样式
            ...
            反之同上
        */
        if (bottonContext === "准备") {
            let obj = {
                player,
                ready: true
            }
            if (url !== "") {
                obj = Object.assign({}, {url}, obj)
            }
            this.setState({
                bottonContext: "取消准备",
                bottonType: 'primary',
                noChangeAble: true
            })
            this.props.onOkCallBack(obj)
        } else {
            this.setState({
                bottonContext: "准备",
                bottonType: '',
                noChangeAble: false
            })
            this.props.onOkCallBack({
                ready: false
            })
        }
    }
    render () {
        const {icon} = this.props;
        const {player, url, bottonContext, bottonType, noChangeAble} = this.state
        const {Player, currentPlayer, readyButtonShow, winner} = this.props
        // 判断是否轮到当前玩家下棋，是则显示思考中字样
        const ifCurrent = (Player === currentPlayer)
        // 判断是否获胜， 获胜那方将会有奖杯图标显示
        const ifWin = ((Player === "black" ? 0 : 1) === winner)
        return (
            <section className="player">
                <img alt="黑方" src={icon}></img>
                <RadioGroup style={{display: 'block'}} disabled={noChangeAble} onChange={this.onChangePlayer} value={player}>
                    <Radio value={1}>真人</Radio>
                    <Radio value={2}>AI</Radio>
                </RadioGroup>
                {
                    player === 2 ? (
                        <section>
                            <Input 
                            placeholder="请输入你的 AI 链接"
                            disabled={noChangeAble}
                            value={url}
                            onChange={this.onChangeUrl}/>
                        </section>
                    ) : (
                        <section></section>
                    )
                }
                {
                    readyButtonShow ? (
                        <Button type={bottonType} onClick={this.confirmReady}>{bottonContext}</Button>
                    ) : (
                        <section></section>
                    )
                }
                {
                    ifCurrent ? (
                        <section style={{fontSize: '.7vw', marginTop: '2vw', color: '#40a9ff'}}><Icon type="loading" theme="outlined" /> 思考中...</section>
                    ) : (
                        <section></section>
                    )
                }
                {
                    ifWin ? (
                        <section style={{fontSize: '.7vw', marginTop: '2vw', color: '#db3b26'}}>
                            <img alt="奖杯" src={winImg} style={{width: "2vw", marginRight: '.5vw'}}/>
                            胜利！
                        </section>
                    ) : (
                        <section></section>
                    )
                }
            </section>
        )
    }
}

export default Player