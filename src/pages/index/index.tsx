import React, { useEffect } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtMessage } from 'taro-ui'
import './index.scss'

function Index() {
  useEffect(() => {
    Taro.reLaunch({
      url: '/module/pages/admin-page/index'
    })
  }, [])
  return (
    <View>
      <AtMessage />
    </View>
  )
}

export default Index
