import React, { useEffect, useState } from 'react'
import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import './index.scss'

function Index() {
  const enterList = [{
    pagePath: '/pages/about-us/index',
    text: '关于我们'
  }, {
    pagePath: '/pages/garden-school/index',
    text: '美育花园'
  }, {
    pagePath: '/pages/community/index',
    text: '美育社区'
  }, {
    pagePath: '/pages/resource/index',
    text: '美育资源'
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

  // const [code, setCode] = useState('')

  useEffect(() => {
    Taro.getUserInfo({
      complete: res => {
        console.log('user info', res)

      }
    })

    Taro.login({
      success: res => {
        console.log('login code', res)
        // setCode(res.code)
      }
    })

  }, [])

  const callback1 = (res) => {
    console.log('get phone', res)
  }

  const [avatarUrl] = useState('')
  const callback2 = (res) => {
    console.log('get avatar', res)
  }
  const callback3 = (res) => {
    console.log('get user info', res)
  }
  const callback4 = (res) => {
    console.log('get privacy', res)
  }

  useEffect(() => {
    Taro.getPrivacySetting({
      success: res => {
        // console.log(434343, res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
        if (res.needAuthorization) {
          // 需要弹出隐私协议
          this.setData({
            showPrivacy: true
          })
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

  const handleGetPhoneNumber = (res) => {
    console.log('handleGetPhoneNumber', res)
  }
  const handleAgreePrivacyAuthorization = (res) => {
    console.log('handleAgreePrivacyAuthorization', res)
  }

  return (
    <View className='home-container'>
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
      {/* <AtButton openType='getPhoneNumber' onGetPhoneNumber={callback1}>获取手机号</AtButton>
      <AtButton openType='chooseAvatar' onChooseAvatar={callback2}>获取用户头像信息</AtButton>
      <button open-type='getUserInfo|agreePrivacyAuthorization' bindgetphonenumber="handleGetPhoneNumber" bindagreeprivacyauthorization="handleAgreePrivacyAuthorization">获取用户信息</button>
      <Button openType="agreePrivacyAuthorization" onAgreePrivacyAuthorization={callback4}>获取用户隐私</Button>
      <Button bindtap="handleOpenPrivacyContract">查看隐私协议</Button>
      <Image src={avatarUrl} /> */}
    </View>
  )
}

export default Index
