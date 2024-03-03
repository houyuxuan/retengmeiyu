import React, { useEffect, useState } from 'react'
import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getIntroList } from '@/api'
import { AboutUs } from '@/types'
import RtList from '@/components/RtList'
import './index.scss'

function Index() {
  const [introList, setIntro] = useState<AboutUs.IntroDetail[]>([])

  const getList = () => {
    getIntroList().then(res => {
      setIntro(res.data.aboutUsList)
    })
  }

  useEffect(getList, [])

  return (
    <View className='about-us'>
      <RtList
        list={introList.map(i => ({
          ...i,
          id: i.id!,
          coverImg: i.coverUrl,
          date: i.createTime || ''
        }))}
        detailUrl='/pages/about-us-detail/index'
      />
    </View>
  )
}

export default Index
