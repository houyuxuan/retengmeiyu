import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtButton, AtMessage } from 'taro-ui'
import { getIntroList, introDelete } from '@/api'
import { AboutUs, IdType, PageParams } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const [introList, setIntro] = useState<AboutUs.IntroDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 10
  })

  const getList = () => {
    getIntroList(keyword ? {
      searchKeyWord: keyword,
      ...page
    } : undefined).then(res => {
      setIntro(res.data.aboutUsList)
    })
  }

  useDidShow(() => {
    getList()
  })

  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `/pages/about-us-edit/index${id ? '?id=' + id : ''}`})
  }

  const goPreview = (id: IdType) => {
    Taro.navigateTo({ url: `/pages/about-us-detail/index?id=${id}&preview=1` })
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
      />
      <ManageList
        list={introList}
        cardContent={(item) => (<>
            <View>序号：{item.id}</View>
            <View>创建时间：{item.createTime}</View>
        </>)}
        btns={item => (
          <>
            <AtButton size="small" type='secondary' onClick={() => goEdit(item.id)}>编辑</AtButton>
              <AtButton size="small" type='secondary' onClick={() => goPreview(item.id!)}>预览</AtButton>
              <AtButton size="small" type='secondary' onClick={() => deleteItem(item.id!)}>删除</AtButton>
          </>
        )}
      />
    </View>
  )
}

export default Index
