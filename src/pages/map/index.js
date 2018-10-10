import React from 'react'
import './index.scss'

class MyMap extends React.Component {
    componentDidMount () {
        const map = new AMap.Map('container', {
            resizeEnable: true,
        });
        AMap.plugin('AMap.Geolocation', function() {
            const geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                buttonPosition:'RB',    //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
    
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition(function(status,result){
                if(status=='complete'){
                    onComplete(result)
                }else{
                    onError(result)
                }
            });
        });
        //解析定位结果
        function onComplete(data) {
            console.log('定位成功')
        }
        //解析定位错误信息
        function onError(data) {
            console.log('定位失败')
        }
    }
    autoInput(){
        var keywords = document.getElementById("search-input").value;
        AMap.plugin('AMap.Autocomplete', function(){
          // 实例化Autocomplete
          var autoOptions = {
            city: '全国'
          }
          var autoComplete = new AMap.Autocomplete(autoOptions);
          autoComplete.search(keywords, function(status, result) {
            // 搜索成功时，result即是对应的匹配数据
            console.log(result)
          })
        })
    }
    render () {
        return (
            <section className="map">
                <div id='container' className="map-container"></div>
                <div className="map-placeSearch">
                    <input onInput={this.autoInput.bind(this)} type="text" id="search-input" placeholder="查找地点、公交、地铁"/>
                </div>
                <div className="map-roadLineIcon">
                    <img src={require('../../assets/img/road_line.svg')} alt=""></img>
                    <span>路线</span>
                </div>
            </section>
        )
    }
}

export default MyMap