import React, { useEffect, useState } from 'react'
import { View, Text, Image, Button, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { AtAvatar, AtIcon } from 'taro-ui'
import { FileType, UserManagement } from '@/types'
import { getMenu, getMineInfo, getScore, getMySchool, qiniuUpload, updateMyInfo, userLogin } from '@/api'
import { systemImagePre } from '@/utils/constant'
import './index.scss'

function Index() {
  const [userInfo, setUserInfo] = useState<UserManagement.UserInfoStorage>()
  const [menuList, setMenuList] = useState<UserManagement.MenuListItem[]>([])
  const [manageItem, setManageItem] = useState<UserManagement.MenuListItem>()

  const [nameEditing, setEditing] = useState(false)

  const [score, setScore] = useState(0)

  useDidShow(() => {
    checkLogin()
  })

  const checkLogin = async () => {
    let user = userInfo || Taro.getStorageSync('userInfo')
    const loginInfo = Taro.getStorageSync('loginInfo')
    if (!user) {
      user = await getUserInfo()
    } else {
      setUserInfo(loginInfo ? {
        ...user,
        roleCode: loginInfo.roleCode
      } : undefined)
    }
    user?.roleCode === UserManagement.RoleCodeEnum.Teacher && getMySchool()
  }

  const getUserInfo = () => {
    return getMineInfo().then(user => {
      setUserInfo(user)
      return user
    })
  }

  useEffect(() => {
    getPageInfo()
  }, [])

  // getPageInfo
  const getPageInfo = async () => {
    await getMenu().then(res => {
      setMenuList(res.data)
      setManageItem(res.data.find(i => i.menuName === '后台管理'))
    }).catch(err => {
      console.log('err', err)
      if (err.code === 403) {
        // 登录状态失效
        Taro.setStorageSync('userInfo', undefined)
        setUserInfo(undefined)
      }
    })
    getScore().then(res => {
      setScore(res.data.total)
    })
  }

  const defaultAvatarUrl = `${systemImagePre}/defaultAvatar.png`

  const handleGetPhoneNumber = (res) => {
    userLogin(res).then(async () => {
      setUserInfo(Taro.getStorageSync('userInfo'))
      getPageInfo()
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

  const toScorePage = () => {
    Taro.navigateTo({
      url: '../../module/pages/score/index'
    })
  }

  return (
    <View className='mine-container' style={{ backgroundImage: `url(${systemImagePre}/mine-bg.png)`}}>
      <View className='base-info'>
        <Button
          className='get-avatar'
          open-type="chooseAvatar"
          onChooseAvatar={onChooseAvatar}
          disabled={!userInfo}
        >
          <AtAvatar circle image={userInfo?.avatar || defaultAvatarUrl} />
        </Button>
        {nameEditing ? (
            <Input
              className='nickname-input'
              type='nickname'
              onConfirm={(e) => changeInfo({nickname: e.detail.value})}
              onBlur={(e) => changeInfo({nickname: e.detail.value})}
            />
          ) : (
            <View className='name'>
              {!userInfo && <Button
                className='login-btn'
                open-type='getPhoneNumber|agreePrivacyAuthorization'
                onGetPhoneNumber={handleGetPhoneNumber}
                onAgreePrivacyAuthorization={handleAgreePrivacyAuthorization}
              >
                点击登录
              </Button>}
              <Text onClick={() => setEditing(true)}>{userInfo?.nickname || '未登录'}</Text>
              {(userInfo?.roleCode === 'teacher') && (
                <View className='score' onClick={toScorePage}>
                  总积分： {score}
                  <AtIcon value="chevron-right" size='20' color='#999' />
                </View>
              )}
            </View>
          )}
      </View>
      <View className='menu-list'>
        {!menuList.length ? (
          <View className='empty'>
            <Image src={`${systemImagePre}/empty.png`} />
            <View>暂无内容</View>
          </View>
        ) : menuList.filter(i => i.menuName !== '后台管理').map(i => (
          <View className='menu-item' key={i.id} onClick={() => Taro.navigateTo({url: `../../module${i.path}`})}>
            <Image src={`${systemImagePre}/${i.menuIconUrl}`} />
            <View>{i.menuName}</View>
          </View>
        ))}
      </View>
      {manageItem && (
        <View className='manage-item' onClick={() => Taro.navigateTo({url: `../../module${manageItem.path}`})}>
          <Image src={`${systemImagePre}/${manageItem.menuIconUrl}`} />
          <View>{manageItem.menuName}</View>
          <AtIcon value="chevron-right" size='20' color='#999' />
        </View>
      )}
    </View>
  )
}

export default Index
