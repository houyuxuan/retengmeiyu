import React, { useEffect, useState } from 'react'
import { View, Image, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import resource from '@/assets/svg/resource.svg';
import garden from '@/assets/svg/garden.svg';
import aboutUs from '@/assets/svg/about-us.svg';
import community from '@/assets/svg/community.svg';
import { login } from '@/api';
import './index.scss'

function Index() {
  const enterList = [{
    pagePath: '/pages/about-us/index',
    text: '关于我们',
    icon: aboutUs
  }, {
    pagePath: '/pages/garden-school/index',
    text: '美育花园',
    icon: garden
  }, {
    pagePath: '/pages/community/index',
    text: '美育社区',
    icon: community
  }, {
    pagePath: '/pages/resource/index',
    text: '美育资源',
    icon: resource
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

  const [code, setCode] = useState('')

  useEffect(() => {
    Taro.login({
      success: res => {
        console.log('login code', res)
        setCode(res.code)
      }
    })

  }, [])

  const callback1 = (res) => {
    console.log('get phone', res)
    login({
      loginCode: code,
      phoneCode: res.detail.code,
      // userInfo: {}
    })
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
        if (res.needAuthorization) {
          // 需要弹出隐私协议
              console.log(434343, res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
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

  const handleGetPhoneNumber = (res) => {
    console.log('handleGetPhoneNumber', res)
  }
  const handleAgreePrivacyAuthorization = (res) => {
    console.log('handleAgreePrivacyAuthorization', res)
  }

  const handleGetUserInfo = (res) => {
    console.log('handleGetUserInfo', res)
  }

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
      {/* <Button open-type='getUserInfooragreePrivacyAuthorization' onGetUserInfo={handleGetUserInfo} onAgreePrivacyAuthorization={handleAgreePrivacyAuthorization}>同意隐私协议并手机号</Button>

      <AtButton openType='getPhoneNumber' onGetPhoneNumber={callback1}>获取手机号</AtButton>
      <Button open-type="chooseAvatar" onChooseAvatar={callback2}>获取用户头像信息</Button>
      <Button open-type="agreePrivacyAuthorization" onAgreePrivacyAuthorization={callback4}>获取用户隐私</Button>
      <Image src={avatarUrl} /> */}
    </View>
  )
}

export default Index
