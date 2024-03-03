import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtMessage, AtTabs } from 'taro-ui'
import { getUserList, userDelete, userStatusChange } from '@/api'
import { IdType, PageParams, UserManagement } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const [userList, setList] = useState<UserManagement.UserInfo[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 10
  })

  const [currTab, setTab] = useState<UserManagement.UserStatusEnum>(0)

  const tabList = [{
    title: '全部',
    value: UserManagement.UserStatusEnum.All
  }, {
    title: '正常',
    value: UserManagement.UserStatusEnum.Normal
  }, {
    title: '禁用',
    value: UserManagement.UserStatusEnum.Disabled
  }]

  useEffect(() => {
    getList()
  }, [currTab])

  const getList = () => {
    getUserList({
      searchKeyWord: keyword,
      status: tabList[currTab].value,
      ...page
    }).then(res => {
      setList(res.data.memberUserList)
    })
  }

  useDidShow(() => {
    getList()
  })

  const goDetail = (id: IdType) => {
    Taro.navigateTo({url: `/pages/user-info/index?id=${id}`})
  }

  const deleteItem = (id: IdType) => {
    userDelete({id})
  }

  const changeStatus = (id) => {
    userStatusChange({ id })
  }

  return (
    <View className='manage-container'>
      <AtMessage />
      <SearchAndAdd
        onConfirm={getList}
        onChange={setKeyword}
        addText='添加新活动'
      />
      <AtTabs
        current={currTab}
        tabList={tabList}
        onClick={item => setTab(item)}
      />
      <ManageList
        list={userList.map(i => ({
            ...i,
            title: i.nickname,
        }))}
        cardContent={(item: UserManagement.UserInfo) => (<>
            <View>手机：{item.mobile}</View>
            <View>创建时间：{item.createTime}</View>
        </>)}
        btns={(item: UserManagement.UserInfo) => (
          <>
            <AtButton size="small" type='secondary' onClick={() => goDetail(item.id!)}>查看</AtButton>
            <AtButton size="small" type='secondary' onClick={() => changeStatus(item.id)}>
              {item.status === UserManagement.UserStatusEnum.Disabled ? '恢复正常' : '禁用'}
            </AtButton>
            <AtButton size="small" type='secondary' onClick={() => deleteItem(item.id!)}>删除</AtButton>
          </>
        )}
      />
    </View>
  )
}

export default Index
