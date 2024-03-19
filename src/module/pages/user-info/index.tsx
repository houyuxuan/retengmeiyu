import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Input, View, Picker } from '@tarojs/components'
import { getRoleList, getSchoolList, getSchoolListByIds, getUserDetail, userInfoChange } from '@/api'
import { Garden, IdType, UserManagement } from '@/types'
import { AtAvatar, AtButton, AtIcon, AtMessage } from 'taro-ui'
import moment from 'moment'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = +currPage.options.id

  const [isModify, setIsModify] = useState(false)

  const [userInfo, setInfo] = useState<UserManagement.UserInfo>()

  const [schoolIndex, setSchoolIndex] = useState(-1)
  const [roleIndex, setRoleIndex] = useState(-1)

  const [showSchool, setShowSchool] = useState(false)

  const defaultAvatarUrl = 'https://media.retenggy.com/systemImage/defaultAvatar.png'

  const getInfo = () => {
    getUserDetail({
      id: currId
    }).then(res => {
      setInfo({...res.data, id: currId})
      const canShowSchool = res.data.memberUserRoleDTOList[0].code === UserManagement.RoleCodeEnum.Teacher
      setShowSchool(canShowSchool)
      if (canShowSchool) {
        getUserSchool(res.data.schoolIds).then(schoolRes => {
          setInfo({
            ...res.data as any,
            id: currId,
            schoolNames: schoolRes.data.map(i => i.schoolName).join(',')
          })
        })
      }
    })
  }

  const getUserSchool = (ids: IdType[]) => {
    return getSchoolListByIds({ ids })
  }

  const [roleList, setRoleList] = useState<UserManagement.RoleInfo[]>()
  const getAllRole = () => {
    return roleList || getRoleList({
      pageNo: 1,
      pageSize: 100
    }).then(res => {
      setRoleList(res.data.list || [])
      const currRole = res.data.list.findIndex(i => i.memberRoleName === userInfo?.memberUserRoleDTOList[0]?.memberRoleName)

      console.log(1111, currRole)
      currRole > -1 && setRoleIndex(currRole)
    })
  }

  const [allSchoolList, setAllSchoolList] = useState<Garden.SchoolDetail[]>()

  const getAllSchool = () => {
    return showSchool ? (allSchoolList || getSchoolList({
      pageNo: 1,
      pageSize: 100
    }).then(res => {
      setAllSchoolList(res.data.list || [])
      const currSchool = res.data.list.findIndex(i => i.id === userInfo?.schoolIds[0])
      currSchool > -1 && setSchoolIndex(currSchool)
    })) : []
  }

  const changeUser = () => {
    if (showSchool && schoolIndex < 0) {
      Taro.atMessage({type: 'warning', message: '请选择学校！'})
      return false
    }
    if (roleIndex < 0) {
      Taro.atMessage({type: 'warning', message: '请选择角色！'})
    }
    userInfoChange({
      memberUserId: userInfo!.id,
      schoolId: allSchoolList?.[schoolIndex]?.id,
      roleId: roleList?.[roleIndex]?.id
    }).then(res => {
      Taro.atMessage({type: 'success', message: res.msg})
      setIsModify(false)
      getInfo()
    })
  }

  useDidShow(() => {
    getInfo()
  })

  return (
    <View className='user-detail'>
      <AtMessage />
      {userInfo && <View>
        <AtAvatar size='large' image={userInfo.avatar || defaultAvatarUrl} />
        <View>
          <View>用户昵称：{userInfo.nickname}</View>
          <View>手机号码：{userInfo.mobile}</View>
          <View>注册时间：{moment(userInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</View>
          {/* <View>性别：{userInfo.sex === UserManagement.UserGenderEnum.Male ? '男' : '女'}</View> */}
          <View>
            用户角色：
            {isModify ? (
              <Picker mode='selector' range={roleList || []} rangeKey='memberRoleName' value={roleIndex} onChange={e => {
                  const index = +e.detail.value
                  setRoleIndex(index)
                  const canShowSchool = roleList?.[index].code === UserManagement.RoleCodeEnum.Teacher
                  setShowSchool(canShowSchool)
                  getAllSchool()
                }}
              >
                <View className='select-wrapper'>
                  <Input
                    value={roleList?.[roleIndex]?.memberRoleName}
                    placeholder='请选择'
                    disabled
                  />
                  <AtIcon value='chevron-right' size='20' color='#aaa'></AtIcon>
                </View>
              </Picker>
            ) : userInfo.memberUserRoleDTOList[0]?.memberRoleName}
          </View>
          {showSchool && <View>
            所属学校：{}
            {isModify ? (
              <Picker mode='selector' range={allSchoolList || []} rangeKey='schoolName' value={schoolIndex} onChange={e => {
                  const index = +e.detail.value
                  setSchoolIndex(index)
                }}
              >
                  <View className='select-wrapper'>
                    <Input
                      value={allSchoolList?.[schoolIndex]?.schoolName}
                      placeholder='请选择'
                      disabled
                    />
                    <AtIcon value='chevron-right' size='20' color='#aaa'></AtIcon>
                  </View>
                </Picker>
            ) : userInfo.schoolNames}
          </View>}
        </View>
        <AtButton onClick={async () => {
          if (isModify) {
            changeUser()
          } else {
            await getAllRole()
            await getAllSchool()
            setIsModify(true)
          }
        }}
        >
          {isModify ? '保存' : '修改'}
        </AtButton>
      </View>}
    </View>
  )
}

export default Index
