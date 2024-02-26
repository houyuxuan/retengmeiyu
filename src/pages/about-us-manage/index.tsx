import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Input, Label } from '@tarojs/components'
import { AtCard, AtButton, AtIcon } from 'taro-ui'
import { getIntroList } from '@/api'
import { AboutUs } from 'types'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e: any) => {
    setKeyword(e.detail.value)
  }

  const [introList, setIntro] = useState<AboutUs.IntroDetail[]>([])

  const getList = () => {
    getIntroList(keyword ? {
      name: keyword
    } : undefined).then(res => {
      setIntro(res.data)
    })
  }

  useEffect(getList, [keyword])

  const goEdit = (id) => {
    Taro.navigateTo({url: `/pages/about-us-edit/index${id ? '?id=' + id : ''}`})
  }

  const goPreview = (id) => {
    Taro.navigateTo({ url: `/pages/about-us-detail/index?id=${id}&preview=1` })
  }

  const deleteItem = () => {
    console.log(22222, 'delete')
  }

  return (
    <View className='manage-container'>
      <View className='form'>
        <View className='input-wrapper has-prefix'>
          <AtIcon value='search' size='20' color='#aaa' />
          <Input
            name='value'
            type='text'
            placeholder='搜索标题'
            value={keyword}
            onInput={(text) => handleChange(text)}
          />
        </View>
        <AtButton onClick={goEdit} size='small'>
          <AtIcon value='add' size='20' />
          添加文章
        </AtButton>
      </View>
      <View>
        {introList.map((item, index) => (
          <AtCard
            key={index}
            title={item.title}
          >
            <View>序号：{item.id}</View>
            <View>创建时间：{item.createTime}</View>
            <View className='btn-group'>
              <AtButton size="small" type='secondary' onClick={() => goEdit(item.id)}>编辑</AtButton>
              <AtButton size="small" type='secondary' onClick={() => goPreview(item.id)}>预览</AtButton>
              <AtButton size="small" type='secondary' onClick={deleteItem}>删除</AtButton>
            </View>
          </AtCard>
        ))}
        
      </View>
    </View>
  )
}

export default Index
