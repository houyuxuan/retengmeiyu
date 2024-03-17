import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'
import { getUploadToken } from './api'

class App extends Component<PropsWithChildren>  {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  cloud: any

  onLaunch() {
    // getUploadToken()
    // Taro.cloud.init({
    //     // env: 'wxa688e0cca18e3f1f', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
    //     env: 'prod-5gkhjln1fb14c277', // 微信云托管的环境ID
    // })
    // cloud.init() // init过程是异步的，需要等待init完成才可以发起调用
  }

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
