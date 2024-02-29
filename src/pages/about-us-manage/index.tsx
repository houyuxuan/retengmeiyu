import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtCard, AtButton, AtIcon, AtMessage } from 'taro-ui'
import { getIntroList, introDelete } from '@/api'
import { AboutUs, IdType, PageParams } from '@/types'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e: any) => {
    setKeyword(e.detail.value)
  }

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
      <View className='form'>
        <View className='input-wrapper has-prefix'>
          <AtIcon value='search' size='20' color='#aaa' />
          <Input
            name='value'
            type='text'
            placeholder='搜索标题'
            value={keyword}
            onInput={(text) => handleChange(text)}
            onConfirm={() => getList()}
          />
        </View>
        <AtButton onClick={() => goEdit()} size='small'>
          <AtIcon value='add' size='20' />
          添加文章
        </AtButton>
      </View>
      <View>
        {introList.length ? introList.map((item, index) => (
          <AtCard
            key={index}
            title={item.title}
          >
            <View>序号：{item.id}</View>
            <View>创建时间：{item.createTime}</View>
            <View className='btn-group'>
              <AtButton size="small" type='secondary' onClick={() => goEdit(item.id)}>编辑</AtButton>
              <AtButton size="small" type='secondary' onClick={() => goPreview(item.id!)}>预览</AtButton>
              <AtButton size="small" type='secondary' onClick={() => deleteItem(item.id!)}>删除</AtButton>
            </View>
          </AtCard>
        )) : <View className='empty'>无内容</View>}
      </View>
    </View>
  )
}

export default Index
