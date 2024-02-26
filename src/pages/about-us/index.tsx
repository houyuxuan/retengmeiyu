import React, { useEffect, useState } from 'react'
import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getIntroList } from '@/api'
import { AboutUs } from 'types'
import './index.scss'

function Index() {
  const toDetail = (id) => {
    Taro.navigateTo({ url: `/pages/about-us-detail/index?id=${id}` })
  }

  const [introList, setIntro] = useState<AboutUs.IntroDetail[]>([])

  const getList = () => {
    getIntroList().then(res => {
      setIntro(res.data)
    })
  }

  useEffect(getList)

  return (
    <View className='about-us'>
      <View className='intro-list'>
        {introList.map((item, index) => (
          <View className='intro-item' key={index} onClick={() => toDetail(item.id)}>
            <Image src={item.coverImg} />
            <View className='text'>
              <View className='title'>{item.title}</View>
              <View className='date'>{item.updateTime}</View>
            </View>
          </View>
        ))}
        <Button onClick={() => Taro.navigateTo({url: '/pages/about-us-manage/index'})}>管理</Button>
      </View>
    </View>
  )
}

export default Index
