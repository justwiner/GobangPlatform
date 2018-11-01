import React from "react"
import {Input, Radio, Button,Icon } from 'antd'
import winImg from '../assets/img/win.png'
const RadioGroup = Radio.Group;

class Player extends React.Component {
    state = {
        player: 1,
        url: '',
        noChangeAble: false,
        bottonContext: '准备',
        bottonType: '',
    }
    onChangePlayer = (e) => this.setState({player: e.target.value})
    onChangeUrl = (e) => this.setState({url: e.target.value})
    confirmReady = () => {
        const {url, player, bottonContext} = this.state
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
        const ifCurrent = (Player === currentPlayer)
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