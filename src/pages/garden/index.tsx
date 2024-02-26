import React, { useEffect } from 'react'
// import cloud from 'wx-server-sdk'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './index.scss'

// eslint-disable-next-line import/no-commonjs
// const cloud = require('wx-server-sdk')

// cloud.init({
//   env: cloud.DYNAMIC_CURRENT_ENV,
// })

function Index() {
  // console.log(454545, cloud)
  useEffect(() => {
    Taro.getUserInfo({
      complete: res => {
        console.log(11111, 'get info', JSON.stringify(res))
      }
    })

    Taro.login({
      complete: res => {
        console.log(2323, 'login', res)
      }
    })

  }, [])

  const callback = (res) => {
    console.log(11111, JSON.stringify(res.detail))
  }

  return (
    <View>
      花园
      <Button openType='getPhoneNumber' onGetPhoneNumber={callback}>获取手机号</Button>
      <Button>上传</Button>
    </View>
  )
}

export default Index
