import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { getIntroDetail } from '@/api'
import { AboutUs } from 'types'
import { AtIcon } from 'taro-ui'
import './index.scss'

function Index() {
  const route = Taro.getCurrentPages().pop()!

  const currId = route.options.id
  const isPreview = route.options.preview

  const [detail, setDetail] = useState<AboutUs.IntroDetail>()

  const getDetail = () => {
    getIntroDetail({
      id: +currId
    }).then(res => {
      setDetail(res.data)
    })
  }

  useEffect(() => {
    if (+isPreview === 1) {
      Taro.setNavigationBarTitle({
        title: '关于我们-预览'
      })
    }
  })

  useEffect(() => {
    currId && getDetail()
  }, [currId])

  return (
    <View className='detail-container'>
      {detail?.id ? (
        <View className='detail'>
          <View className='title'>{detail.title}</View>
          <View className='date'>
            {detail.updateTime}
          </View>
          {detail.detailList.map((item, idx) => (
            item.type === 'img' ? (
              <View key={idx} className='img'><Image src={item.content} /></View>
            ) : (
              <View key={idx}>
                {item.content}
              </View>
            )
          ))}
        </View>
      ) : (
        <View>
          <AtIcon value='loading' size='50' color='#666'></AtIcon>
        </View>
      )}
    </View>
  )
}

export default Index
