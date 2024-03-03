import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtMessage } from 'taro-ui'
import { getSchoolList, introDelete } from '@/api'
import { Garden, IdType, PageParams } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const [schoolList, setList] = useState<Garden.SchoolDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 10
  })

  const getList = () => {
    getSchoolList(keyword ? {
      searchKeyWord: keyword,
      ...page
    } : undefined).then(res => {
      setList(res.data.schoolList)
    })
  }

  useDidShow(() => {
    getList()
  })

  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `/pages/school-edit/index${id ? '?id=' + id : ''}`})
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
        addText='添加学校'
      />
      <ManageList
        list={schoolList.map(i => ({
            ...i,
            title: i.schoolName
        }))}
        cardContent={(item: Garden.SchoolDetail) => (<>
            <View>简介：{item.schoolIntroduction}</View>
            <View>创建时间：{item.createTime}</View>
        </>)}
        btns={item => (
          <>
            <AtButton size="small" type='secondary' onClick={() => goEdit(item.id)}>编辑</AtButton>
            <AtButton size="small" type='secondary' onClick={() => deleteItem(item.id!)}>删除</AtButton>
          </>
        )}
      />
    </View>
  )
}

export default Index
