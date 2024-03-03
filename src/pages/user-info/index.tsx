import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { getUserDetail } from '@/api'
import { UserManagement } from '@/types'
import { AtAvatar } from 'taro-ui'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id

  const [userInfo, setInfo] = useState<UserManagement.UserInfo>()
  const getInfo = () => {
    getUserDetail({
      id: +currId
    }).then(res => {
      setInfo(res.data)
    })
  }

  useDidShow(() => {
    getInfo()
  })

  return (
    <View className='user-detail'>
      {userInfo && <View>
        <AtAvatar size='large' image={userInfo.avatar} />
        <View>
          <View>用户昵称：{userInfo.nickname}</View>
          <View>手机号码：{userInfo.mobile}</View>
          <View>注册时间：{userInfo.createTime}</View>
          <View>性别：{userInfo.sex === UserManagement.UserGenderEnum.Male ? '男' : '女'}</View>
        </View>
      </View>}
    </View>
  )
}

export default Index
