import React, { useEffect } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
// import { AtButton } from 'taro-ui'
import './index.scss'
// import type CustomTabBar from '../../custom-tab-bar'

function Index() {
  const enterList = [{
      pagePath: '/pages/garden/index',
      text: '美育花园'
    }, {
      pagePath: '/pages/community/index',
      text: '美育社区'
    }, {
      pagePath: '/pages/resource/index',
      text: '美育资源'
    }, {
      pagePath: '/pages/resource/index',
      text: '辛勤耕耘'
  }]
  const redirectToPage = (url) => {
    Taro.navigateTo({url})
  }
  return (
    <View className='home-container'>
      {/* <tab-bar /> */}
      <View className="title">
        热腾公益美育小程序
      </View>
      <View className="enter-list">
        {
          enterList.map(item => (
            <View className='item' key={item.pagePath} onClick={() => redirectToPage(item.pagePath)}>{item.text}</View>
          ))
        }
      </View>
    </View>
  )
}

export default Index
