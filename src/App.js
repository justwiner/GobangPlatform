import React from 'react';
import { WingBlank, TabBar } from 'antd-mobile';
import Weather from './pages/weather'
import MyMap from './pages/map'
import './App.scss'

class App extends React.Component{
    state = {
        selectedTab: 'map',
        hidden: false,
    }
    render(){
        return (
            <div className="container">
                <TabBar
                unselectedTintColor="#949494"
                tintColor="#9254de"
                barTintColor="white"
                hidden={this.state.hidden}
                >
                <TabBar.Item
                    icon={<div className='weather-icon menu-icon'/>}
                    selectedIcon={<div className='weather-active-icon menu-icon'/>}
                    title="天气"
                    key="weather"
                    selected={this.state.selectedTab === 'weather'}
                    onPress={() => {this.setState({selectedTab: 'weather'})}}
                    data-seed="logId1"
                >
                    <Weather />
                </TabBar.Item>
                <TabBar.Item
                    title="出行"
                    key="map"
                    icon={<div className='map-icon menu-icon'/>
                    }
                    selectedIcon={<div className='map-active-icon menu-icon'/>
                    }
                    selected={this.state.selectedTab === 'map'}
                    onPress={() => {this.setState({selectedTab: 'map'})}}
                    data-seed="logId"
                >
                    <MyMap />
                </TabBar.Item>
                </TabBar>
            </div>
        );
    }
}
export default App;