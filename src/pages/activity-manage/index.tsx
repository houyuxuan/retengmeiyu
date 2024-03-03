import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtMessage } from 'taro-ui'
import { getActivityList, getSchoolActivity, getSchoolList, introDelete } from '@/api'
import { Garden, IdType, PageParams } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const [schoolList, setList] = useState<Garden.ActivityDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 10
  })

  const getList = () => {
    getActivityList({
      searchKeyWord: keyword,
      ...page
    }).then(res => {
      setList(res.data.activityList)
    })
  }

  useDidShow(() => {
    getList()
  })

  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `/pages/activity-edit/index${id ? '?id=' + id : ''}`})
  }

  const goPreview = (id: IdType) => {
    Taro.navigateTo({url: `/pages/activity-detail/index?id=${id}&preview=1`})
  }

  const deleteItem = (id: IdType) => {
    introDelete({ id })
  }

  return (
    <View className='manage-container'>
      <AtMessage />
      <SearchAndAdd
        onAdd={() => goEdit()}
        onConfirm={getList}
        onChange={setKeyword}
        addText='添加新活动'
      />
      <ManageList
        list={schoolList.map(i => ({
            ...i,
            title: i.activityTitle
        }))}
        cardContent={(item: Garden.ActivityDetail) => (<>
            <View>点赞数：{item.zanNumber}</View>
            <View>创建时间：{item.createTime}</View>
        </>)}
        btns={item => (
          <>
            <AtButton size="small" type='secondary' onClick={() => goEdit(item.id)}>编辑</AtButton>
            <AtButton size="small" type='secondary' onClick={() => goPreview(item.id)}>编辑</AtButton>
            <AtButton size="small" type='secondary' onClick={() => deleteItem(item.id!)}>删除</AtButton>
          </>
        )}
      />
    </View>
  )
}

export default Index
