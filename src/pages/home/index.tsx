import React, { useEffect } from 'react'
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

function Index() {
  const enterList = [{
    pagePath: '../../module/pages/about-us/index',
    text: '关于我们',
    icon: 'https://media.retenggy.com/systemImage/about-us.svg'
  }, {
    pagePath: '/pages/garden-school/index',
    text: '美育花园',
    icon: 'https://media.retenggy.com/systemImage/home-garden.svg'
  }, {
    pagePath: '/pages/community/index',
    text: '美育社区',
    icon: 'https://media.retenggy.com/systemImage/home-community.svg'
  }, {
    pagePath: '/pages/resource/index',
    text: '美育资源',
    icon: 'https://media.retenggy.com/systemImage/home-resource.svg'
  }]

  const redirectToPage = (url) => {
    Taro.navigateTo({
      url,
      fail(err) {
        if (err.errMsg.includes('tabbar')) {
          Taro.switchTab({ url })
        }
      }
    })
  }

  useEffect(() => {
    Taro.getPrivacySetting({
      success: res => {
        if (res.needAuthorization) {
          // 需要弹出隐私协议
          // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
          // this.setData({
          //   showPrivacy: true
          // })
        } else {
          // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
          // wx.getUserProfile()
          // wx.chooseMedia()
          // wx.getClipboardData()
          // wx.startRecord()
        }
      },
      fail: () => {},
      complete: () => {}
    })
  }, [])

  return (
    <View className='home-container'>
      <View className="title">
        <Text>热腾公益美育小程序</Text>
        <Image src='https://media.retenggy.com/systemImage/bg.jpg' />
      </View>
      <View className="enter-list">
        {
          enterList.map(item => (
            <View className='item' key={item.pagePath} onClick={() => redirectToPage(item.pagePath)}>
              <Image src={item.icon} />
              <Text>{item.text}</Text>
            </View>
          ))
        }
      </View>
    </View>
  )
}

export default Index
