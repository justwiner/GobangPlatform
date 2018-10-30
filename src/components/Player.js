import React from "react"
import {Input, Radio, Button } from 'antd'
const RadioGroup = Radio.Group;

class Player extends React.Component {
    state = {
        player: 1,
        url: '',
        changeAble: false
    }
    onChangePlayer = (e) => {
        console.log(e.target.value)
        this.setState({player: e.target.value})
    }
    onChangeUrl = (e) => this.setState({url: e.target.value})
    confirmAIUrl = () => {
        const {url} = this.state
        console.log(url)
    }
    render () {
        const {icon} = this.props;
        const {player, url} = this.state
        return (
            <section className="player">
                <img alt="黑方" src={icon}></img>
                <RadioGroup style={{display: 'block'}} onChange={this.onChangePlayer} value={player}>
                    <Radio value={1}>真人</Radio>
                    <Radio value={2}>AI</Radio>
                </RadioGroup>
                {
                    player === 2 ? (
                        <section>
                            <Input 
                            placeholder="请输入你的 AI 链接"
                            disabled={false}
                            value={url}
                            onChange={this.onChangeUrl}/>
                        </section>
                    ) : (
                        <section></section>
                    )
                }
                <Button onClick={this.confirmAIUrl}>准备</Button>
            </section>
        )
    }
}

export default Player