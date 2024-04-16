import React, { useEffect } from 'react'
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { systemImagePre } from '@/utils/constant'
import './index.scss'

function Index() {
  const enterList = [{
    pagePath: '../../module/pages/about-us/index',
    text: '关于我们',
    bg: 'aboutusBg.png',
    icon: 'aboutus.png'
  }, {
    pagePath: '/pages/garden-school/index',
    text: '美育花园',
    bg: 'gardenBg.png',
    icon: 'garden.png'
  }, {
    pagePath: '/pages/community/index',
    text: '美育社区',
    bg: 'communityBg.png',
    icon: 'community.png'
  }, {
    pagePath: '/pages/resource/index',
    text: '美育资源',
    bg: 'resourceBg.png',
    icon: 'resource.png'
  }]

  const redirectToPage = (url) => {
    if (url.includes('module')) {
      Taro.navigateTo({ url })
    } else {
      Taro.switchTab({ url })
    }
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
        <Text>热腾美育</Text>
        <Image src={systemImagePre + '/banner.png'} />
      </View>
      <View className="enter-list">
        {
          enterList.map(item => (
            <View className='item' key={item.pagePath} onClick={() => redirectToPage(item.pagePath)}>
              <Image className='item-bg' src={`${systemImagePre}/${item.bg}`} />
              <View className='item-text'>
                <Image className='item-icon' src={`${systemImagePre}/${item.icon}`} />
                <Text className='text'>{item.text}</Text>
                <AtIcon value="chevron-right" size='20' color='#fff' />
              </View>
            </View>
          ))
        }
      </View>
    </View>
  )
}

export default Index
