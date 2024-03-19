import React, { useEffect, useState } from 'react'
import { View, Text, Image, Button, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtAvatar, AtButton, AtIcon } from 'taro-ui'
import { FileType, UserManagement } from '@/types'
import { getMenu, getMineInfo, login, qiniuUpload, updateMyInfo } from '@/api'
import './index.scss'

function Index() {
  const [userInfo, setUserInfo] = useState<UserManagement.UserInfo>()

  const [menuList, setMenuList] = useState<UserManagement.MenuListItem[]>([])

  const [nameEditing, setEditing] = useState(false)

  useEffect(() => {
    const user = userInfo || Taro.getStorageSync('userInfo')
    if (!user) {
      getUserInfo()
    } else {
      setUserInfo(user)
    }
  }, [userInfo])

  useEffect(() => {
    getMenuList()
  }, [])

  const getUserInfo = () => {
    getMineInfo().then(res => {
      setUserInfo(res.data as any)
      Taro.setStorageSync('userInfo', res.data)
    })
  }

  const getMenuList = () => {
    getMenu().then(res => {
      setMenuList(res.data)
    }).catch(err => {
      console.log('err', err)
      if (err.code === 403) {
      }
    })
  }

  const defaultAvatarUrl = 'https://media.retenggy.com/systemImage/defaultAvatar.png'

  const loginPage = (loginCode: string, phoneCode: string) => {
    return login({
      loginCode,
      phoneCode,
    }).then(() => {
      getUserInfo()
      getMenuList()
    })
  }

  const handleGetPhoneNumber = (res) => {
    console.log('handleGetPhoneNumber', res)
    Taro.login({
      success: res1 => {
        loginPage(res1.code, res.detail.code)
      }
    })
  }

  const handleAgreePrivacyAuthorization = (res) => {
    console.log('handleAgreePrivacyAuthorization', res)
  }

  const changeInfo = (params: {
    avatar?: string;
    nickname?: string;
  }) => {
    updateMyInfo({
      avatar: params.avatar || userInfo?.avatar || '',
      nickname: params.nickname || userInfo?.nickname || '',
    }).then(() => {
      getUserInfo()
      setEditing(false)
    })
  }

  const onChooseAvatar = (ev) => {
    qiniuUpload({
      fileName: ev.detail.avatarUrl?.split('/').pop() || defaultAvatarUrl,
      filePath: ev.detail.avatarUrl,
      fileType: FileType.image
    }).then(res => {
      changeInfo({avatar: res.fileURL})
    })
  }

  return (
    <View className='mine-container'>
      <View className='base-info'>
        <Button
          className='get-avatar'
          open-type="chooseAvatar"
          onChooseAvatar={onChooseAvatar}
        >
          <AtAvatar image={userInfo?.avatar || defaultAvatarUrl} />
        </Button>
        {userInfo ? (
          nameEditing ? (
            <Input
              className='nickname-input'
              type='nickname'
              onConfirm={(e) => changeInfo({nickname: e.detail.value})}
              onBlur={(e) => changeInfo({nickname: e.detail.value})}
            />
          ) : (
            <>
              <Text className='name'>{userInfo?.nickname || '未登录'}</Text>
              <AtIcon value='edit' size='16' color='#78A4F4' onClick={() => {
                setEditing(true)
              }}
              />
            </>
          )
        ) : (
          <>
            <Text className='name'>未登录</Text>
            <Button
              className='login-btn'
              open-type='getPhoneNumber|agreePrivacyAuthorization'
              onGetPhoneNumber={handleGetPhoneNumber}
              onAgreePrivacyAuthorization={handleAgreePrivacyAuthorization}
            >
              登录/注册
            </Button>
          </>
        )}
      </View>
      <View className='menu-list'>
        {menuList.map(i => (
          <View className='menu-item' key={i.id} onClick={() => Taro.navigateTo({url: `../../module${i.path}`})}>
            <Image src={i.menuIconUrl} />
            <View>{i.menuName}</View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default Index
