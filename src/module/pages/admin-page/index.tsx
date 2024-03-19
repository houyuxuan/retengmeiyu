import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtAvatar } from 'taro-ui'
import { UserManagement } from '@/types'
import { getManageMenu, getStatistic } from '@/api'
import './index.scss'

function Index() {
  const [userInfo, setUserInfo] = useState<UserManagement.UserInfo>()

  const [menuList, setMenuList] = useState<UserManagement.MenuListItem[]>([])

  const [stat, setStat] = useState<UserManagement.StatisticData>()

  useEffect(() => {
    const user = userInfo || Taro.getStorageSync('userInfo')
    setUserInfo(user)
  }, [userInfo])

  useEffect(() => {
    const loginInfo = Taro.getStorageSync('loginInfo')
    if (loginInfo && ['admin', 'super_admin'].includes(loginInfo.roleCode)) {
      getStatistic().then(res => {
        setStat(res.data)
      })
    }
  }, [])

  useEffect(() => {
    getMenuList()
  }, [])

  const getMenuList = () => {
    getManageMenu().then(res => {
      setMenuList(res.data)
    }).catch(err => {
      console.log('err', err)
      if (err.code === 403) {
      }
    })
  }

  const defaultAvatarUrl = 'https://media.retenggy.com/systemImage/defaultAvatar.png'

  return (
    <View className='mine-container'>
      <View className='base-info'>
        <AtAvatar image={userInfo?.avatar || defaultAvatarUrl} />
        <Text className='name'>{userInfo?.nickname || '未登录'}</Text>
      </View>
      {stat && <View className='count'>
        <View className='count-item'>
          <View>{stat.memberUserNum}</View>
          <View>用户数</View>
        </View>
        <View className='count-item'>
          <View>{stat.activityNum}</View>
          <View>活动数</View>
        </View>
      </View>}
      {menuList.length ? (
        <View className='function-title'>
          <Text>功能管理</Text>
        </View>
      ) : <></>}
      <View className='menu-list'>
        {menuList.map(i => (
          <View className='menu-item' key={i.id} onClick={() => Taro.navigateTo({url: `..${i.path.split('/pages')[1]}?from=admin`})}>
            <Image src={i.menuIconUrl} />
            <View>{i.menuName}</View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default Index
