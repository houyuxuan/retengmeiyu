import React, { useEffect } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

function Index() {
  useEffect(() => {
    Taro.reLaunch({
      url: '/pages/home/index'
    })
  })
  return (
    <View>
    </View>
  )
}

export default Index
