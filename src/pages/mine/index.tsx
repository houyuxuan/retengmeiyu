import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtAvatar, AtGrid, AtIcon } from 'taro-ui'
import { UserManagement } from '@/types'
import { getMenu } from '@/api'
import './index.scss'

function Index() {
  const userName = 'aaaa'

  // const version = Taro.getAppBaseInfo().SDKVersion

  const [menuList, setMenuList] = useState<UserManagement.MenuListItem[]>([])

  const getMenuList = () => {
    getMenu().then(res => {
      setMenuList(res.data)
    })
  }

  useEffect(() => {
    getMenuList()
  }, [])

  return (
    <View className='mine-container'>
      <View className='base-info'>
        <AtAvatar openData={{type: 'userAvatarUrl'}}></AtAvatar>
        <Text className='name'>{userName}</Text>
      </View>
      <View className='count'>
        <View className='count-item'>
          <View>{1000}</View>
          <View>用户数</View>
        </View>
        <View className='count-item'>
          <View>{233}</View>
          <View>活动数</View>
        </View>
      </View>
      <View className='function-title'>
        <AtIcon value='settings' size='20' />
        <Text>功能管理</Text>
      </View>
      <AtGrid
        columnNum={4}
        data={menuList.map(i => ({
          value: i.menuName,
          iconInfo: {
            value: 'settings',
            size: 30
          }
        }))}
        onClick={(item, index) => {Taro.navigateTo({url: menuList[index].path})}}
      />
      <View className='function-title'>
        <AtIcon value='settings' size='20' />
        <Text>功能管理</Text>
      </View>
    </View>
  )
}

export default Index
