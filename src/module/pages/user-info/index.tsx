import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Input, View, Picker, Checkbox, CheckboxGroup } from '@tarojs/components'
import { getRoleList, getSchoolList, getSchoolListByIds, getUserDetail, userInfoChange } from '@/api'
import { getClubList } from '@/api/club'
import { Garden, IdType, UserManagement, ClubManage } from '@/types'
import { AtAvatar, AtButton, AtIcon, AtMessage } from 'taro-ui'
import moment from 'moment'
import { systemImagePre } from '@/utils/constant'
import './index.scss'

interface clubItem {checked: boolean, id: IdType, title: string}

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = +currPage.options.id

  const [isModify, setIsModify] = useState(false)

  const [userInfo, setInfo] = useState<UserManagement.UserInfo>()
  const [userName, setName] = useState('')
  const [remarkName, setRemarkName] = useState('')
  const [schoolIndex, setSchoolIndex] = useState(-1)
  const [roleIndex, setRoleIndex] = useState(-1)
  const [clubList, setClubList] = useState<clubItem[]>()
  const [clubs, setClubs] = useState<IdType[]>([])
  const [clubNames, setClubNames] = useState('')
  const [showSchool, setShowSchool] = useState(false)
  const cloneDeep = (list: any) => {
    return JSON.parse(JSON.stringify(list))
  }
  const getInfo = () => {
    getUserDetail({
      id: currId
    }).then(res => {
      setInfo({...res.data, id: currId})
      const { data: {nickname, name = '' } } = res;
      setName(nickname)
      setRemarkName(name)
      const canShowSchool = res.data.memberUserRoleDTOList[0].code === UserManagement.RoleCodeEnum.Teacher
      setShowSchool(canShowSchool)
      if (canShowSchool) {
        getUserSchools(res.data.schoolIds).then(schoolRes => {
          setInfo({
            ...res.data as any,
            id: currId,
            schoolNames: schoolRes.data.map(i => i.schoolName).join(',')
          })
        })
      }
    })
  }

  const getUserSchools = (ids: IdType[]) => {
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
      currRole > -1 && setRoleIndex(currRole)
    })
  }

  const [allSchoolList, setAllSchoolList] = useState<Garden.SchoolDetail[]>()

  useEffect(() => {
    if (showSchool) {
      getAllSchool()
      getAllClub()
    }
  }, [showSchool])

  useEffect(() => {
    const canShowSchool = roleList?.[roleIndex].code === UserManagement.RoleCodeEnum.Teacher
    setShowSchool(canShowSchool)
  }, [roleIndex])

  const getAllSchool = () => {
    return allSchoolList || getSchoolList({
      pageNo: 1,
      pageSize: 100
    }).then(res => {
      setAllSchoolList(res.data.list || [])
      const currSchool = res.data.list.findIndex(i => i.id === userInfo?.schoolIds[0])
      currSchool > -1 && setSchoolIndex(currSchool)
    })
  }
  const getAllClub = () => {
    return clubList || getClubList({
      pageNo: 1,
      pageSize: 100
    }).then(res => {
      const { data: { list = [] } } = res
      const clubArr: clubItem[] = []
      let clubIdsList
      let names: string = ''
      const ids: IdType[] = []
      try {
        const arr = JSON.parse(userInfo?.clubIds || '')
        if(Array.isArray(arr)) clubIdsList = arr
      } catch (error) {
        clubIdsList = []
      }
      list.forEach((club: ClubManage.ClubDetail) => {
        const item: clubItem = {checked: false, id: club.id, title: club.clubTitle}
        
        if (clubIdsList.includes(Number(club.id))) {
          item.checked = true
          ids.push(Number(item.id))
          names = names.length ? names + '/' + item.title : item.title
        }
        clubArr.push(item);
      })
      setClubList(clubArr)
      setClubs(ids)
      setClubNames(names)
    })
  }

  const changeUser = () => {
    if (showSchool && schoolIndex < 0) {
      Taro.atMessage({type: 'warning', message: '请选择学校！'})
      return false
    }
    if (roleIndex < 0) {
      Taro.atMessage({type: 'warning', message: '请选择角色！'})
    }
    if (!userName) {
      Taro.atMessage({type: 'warning', message: '请填写用户昵称！'})
    }
    if (!remarkName) {
      Taro.atMessage({type: 'warning', message: '请填写备注名称！'})
    }
    if (showSchool && !clubs.length) {
      Taro.atMessage({type: 'warning', message: '请选择社团！'})
      return false
    }
    userInfoChange({
      memberUserId: userInfo!.id,
      schoolId: allSchoolList?.[schoolIndex]?.id,
      roleId: roleList?.[roleIndex]?.id,
      nickname: userName,
      name: remarkName,
      clubIds: JSON.stringify(clubs)
    }).then(res => {
      Taro.atMessage({type: 'success', message: res.msg})
      setIsModify(false)
      getInfo()
    })
  }

  useDidShow(() => {
    getInfo()
  })
  useEffect(() => {
    getInfo()
  }, [isModify])
  
  const handleChange = (e: any) => {
    setName(e.detail.value)
  }
  const handleChangeRemarkName = (e: any) => {
    setRemarkName(e.detail.value)
  }
  
  const getClubs = (e) => {
    const list = e.detail.value
    const ids: IdType[] = []
    let names: string = ''
    const clubArrr = cloneDeep(clubList)
    clubArrr.forEach(club => {
      if(list.includes(String(club.id))) {
        club.checked = true
        ids.push(Number(club.id))
        names = names.length ? names + '/' + club.title : club.title
      } else {
        club.checked = false
      }
    });
    setClubs(ids)
    setClubList(clubArrr)
    setClubNames(names)
  }
  const defaultAvatarUrl = systemImagePre + '/noLoginAvatar.png'

  return (
    <View className='user-detail'>
      <AtMessage />
      {userInfo && <View className={ isModify ? 'is-modify' : '' }>
        <AtAvatar size='large' image={userInfo.avatar || defaultAvatarUrl} />
        <View>
          <View className='line'>
            用户昵称：
            {isModify ? (
              <Input
                value={userName}
                placeholder='请填写'
                onInput={(text) => handleChange(text)}
              />
            ) : userInfo.nickname}
          </View>
          <View className='line'>手机号码：{userInfo.mobile}</View>
          <View className='line'>注册时间：{moment(userInfo.createTime).format('YYYY-MM-DD HH:mm')}</View>
          {/* <View>性别：{userInfo.sex === UserManagement.UserGenderEnum.Male ? '男' : '女'}</View> */}
          <View className='line'>
            用户角色：
            {isModify ? (
              <Picker mode='selector' range={roleList || []} rangeKey='memberRoleName' value={roleIndex} onChange={e => {
                  const index = +e.detail.value
                  setRoleIndex(index)
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
          {showSchool && <View  className='line'>
            所属学校：
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
          <View className='line'>
            备注名称：
            {isModify ? (
              <Input
                value={remarkName}
                placeholder='请填写'
                onInput={(text) => handleChangeRemarkName(text)}
              />
            ) : remarkName}
          </View>
          {showSchool && <View className='line'>
            所属社团：
            {isModify ? (
              <CheckboxGroup className='checkbox-list' onChange={getClubs}>
                {(clubList || []).map((item, i) => {
                  return (
                      <Checkbox className='checkbox-list__checkbox' key={i} value={String(item.id)} checked={item.checked}>{item.title}</Checkbox>
                  )
                })}
              </CheckboxGroup>
            ) : clubNames}
          </View>}
        </View>
        <AtButton onClick={async () => {
          if (isModify) {
            changeUser()
          } else {
            await getAllRole()
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
