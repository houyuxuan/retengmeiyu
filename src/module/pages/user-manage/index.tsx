import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtMessage, AtTabs } from 'taro-ui'
import { getRoleList, getUserList, userDelete, userStatusChange } from '@/api'
import { IdType, PageParams, UserManagement } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import { systemImagePre, userTabList } from '@/utils/constant'
import moment from 'moment'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const [userList, setList] = useState<UserManagement.UserInfo[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [currTab, setTab] = useState(0)

  const [total, setTotal] = useState(0)
  const [roleList, setRoleList] = useState<{ [key: string]: string }>()
  const getAllRole = () => {
    return roleList || getRoleList({
      pageNo: 1,
      pageSize: 100
    }).then(res => {
      const {data: { list = []}} = res
      const obj: { [key: string]: string } = {}
      list.forEach((item) => {
        obj[item.id] = item.memberRoleName
      })
      setRoleList(obj)
    })
  }
  const getList = () => {
    const member = userTabList[currTab].value
    getUserList({
      searchKeyWord: keyword,
      roleId: member === UserManagement.RoleIdEnum.All ? undefined : member,
      ...page
    }).then(res => {
      setTotal(res.data.total)
      setList(page.pageNo === 1 ? res.data.list : [...userList, ...res.data.list])
    })
  }

  useEffect(getList, [page])

  const refresh = () => {
    setList([])
    setPage({
      ...page,
      pageNo: 1,
    })
  }

  useEffect(() => {
    refresh()
  }, [currTab])

  useDidShow(async () => {
    await getAllRole()
    refresh()
  })

  const goDetail = (id: IdType) => {
    Taro.navigateTo({url: `../user-info/index?id=${id}`})
  }

  const deleteItem = (id: IdType) => {
    userDelete({id}).then(res => {
      Taro.atMessage({
          type: 'success',
          message: res.msg
      })
      refresh()
    })
  }

  const changeStatus = (id, index) => {
    const status = userList[index].status
    userStatusChange({ id }).then(res => {
      Taro.atMessage({
        type: 'success',
        message: res.msg
      })
      userList[index].status = status === UserManagement.UserStatusEnum.Normal ? UserManagement.UserStatusEnum.Disabled : UserManagement.UserStatusEnum.Normal
      setList([...userList])
    })
  }
  const getRoleName = (id) => {
    if (id) {
      return roleList?.[id] || ''
    } else {
      return ''
    }
  }
  const defaultAvatarUrl = `${systemImagePre}/defaultAvatar.png`

  return (
    <View className='manage-container'>
      <AtMessage />
      <SearchAndAdd
        onConfirm={refresh}
        onChange={setKeyword}
        addText='新增用户'
      />
      <AtTabs
        current={currTab}
        tabList={userTabList}
        onClick={item => setTab(item)}
      />
      <ManageList
        list={userList.map(i => ({
            ...i,
            title: i.nickname,
            coverImg: i.avatar || defaultAvatarUrl
        }))}
        cardContent={(item: UserManagement.UserInfo) => (<>
            <View>手机：{item.mobile}</View>
            {currTab !== 2 &&  <View>角色：{getRoleName(item.memberRoleId)}</View>}
            {currTab === 2 &&  <View>学校：{item.schoolName || ''}</View>}
            {item.creditTotalValue ? <View>积分：{item.creditTotalValue}</View> : ''}
        </>)}
        editFun={goDetail}
        deleteFun={deleteItem}
        otherBtn={[{
          text: item => item.status === UserManagement.UserStatusEnum.Disabled ? '恢复正常' : '禁用',
          fun(item, index) {
            changeStatus(item.id, index)
          }
        }]}
        total={total}
        onLoading={() => {
          setPage({
            ...page,
            pageNo: page.pageNo + 1,
          })
        }}
      />
    </View>
  )
}

export default Index
