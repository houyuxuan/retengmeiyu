import React, { useEffect, useState } from 'react'
import { Button, View } from '@tarojs/components'
import { userLogin } from '@/api'
import Taro, { useDidShow } from '@tarojs/taro'
import { AtActionSheet, AtActionSheetItem } from 'taro-ui'

function Index(props: {
    onSuccess: () => void
}) {
  const [showAction, setShowAction] = useState(false)
  useEffect(() => {
    setShowAction(!Taro.getStorageSync('userInfo'))
  }, [])

  useDidShow(() => {
    setShowAction(!Taro.getStorageSync('userInfo'))
    props.onSuccess()
  })

  const handleGetPhoneNumber = async (res) => {
    await userLogin(res)
    setShowAction(false)
    props.onSuccess()
  }

  const toHomePage = () => {
    setShowAction(false)
    if (!Taro.getStorageSync('userInfo')) {
        Taro.switchTab({url: '/pages/home/index'})
    }
  }

  return (
    <View className='check-login'>
      <AtActionSheet isOpened={showAction} cancelText='取消' title='未登录' onCancel={toHomePage} onClose={toHomePage}>
        <AtActionSheetItem>
          <Button
            className='bottom-login-btn'
            open-type='getPhoneNumber|agreePrivacyAuthorization'
            onGetPhoneNumber={handleGetPhoneNumber}
          >
            点击登录
          </Button>
        </AtActionSheetItem>
      </AtActionSheet>
    </View>
  )
}

export default Index
