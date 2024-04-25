import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtAvatar } from 'taro-ui'
import { UserManagement } from '@/types'
import { getManageMenu, getStatistic } from '@/api'
import { systemImagePre } from '@/utils/constant'
import './index.scss'

function Index() {
  const [userInfo, setUserInfo] = useState<UserManagement.UserInfoStorage>()

  const [menuList, setMenuList] = useState<UserManagement.MenuListItem[]>([])

  const [stat, setStat] = useState<UserManagement.StatisticData>()

  useEffect(() => {
    const user = Taro.getStorageSync('userInfo')
    if (!userInfo) {
      setUserInfo(user)
    }
    if (user?.roleCode && [UserManagement.RoleCodeEnum.Admin, UserManagement.RoleCodeEnum.SuperAdmin].includes(user?.roleCode)) {
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

  const defaultAvatarUrl = systemImagePre + '/noLoginAvatar.png'

  return (
    <View className='mine-container'>
      <View className='base-info'>
        <AtAvatar circle size='large' image={userInfo?.avatar || defaultAvatarUrl} />
        <Text className='name'>{userInfo?.nickname}</Text>
        {stat && <View>
          <Text className='count-item'>
            用户数：{stat.memberUserNum}
          </Text>
          <Text className='count-item'>
            活动数：{stat.activityNum}
          </Text>
        </View>}
      </View>
      {menuList.length ? (
        <View className='function-title'>
          <Text>功能管理</Text>
        </View>
      ) : <></>}
      <View className='menu-list'>
        {menuList.map(i => (
          <View className='menu-item' key={i.id} onClick={() => Taro.navigateTo({url: `..${i.path.split('/pages')[1]}?from=admin`})}>
            <Image src={`${systemImagePre}${i.menuIconUrl}`} />
            <View>{i.menuName}</View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default Index
