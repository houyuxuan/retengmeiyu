import React, { useState } from 'react'
import { View, Image, Button, ScrollView } from '@tarojs/components'
import Taro, { useReachBottom } from '@tarojs/taro'
import { IdType } from '@/types'
import moment from 'moment'
import { AtActivityIndicator, AtMessage } from 'taro-ui'
import './index.scss'

interface ListItem {
    coverImg: string;
    title: string;
    date: string;
    id: IdType;
    [key: string]: any;
}

function Index(props: {
    list: ListItem[];
    detailUrl?: string;
    onLoading: () => void;
    total: number
}) {
  const toDetail = (id) => {
    if (props.detailUrl) {
      Taro.navigateTo({ url: `${props.detailUrl}?id=${id}` })
    }
  }

  const [loading, setLoading] = useState(false)
  useReachBottom(() => {
    console.log('reach bottom')
    if (props.list.length < props.total) {
      setLoading(true)
      props.onLoading()
    }
  })

  return (
    <View className='list-content'>
      <AtMessage />
      {props.list.length ? props.list.map((item, index) => (
        <View className='list-item' key={index} onClick={() => toDetail(item.id)}>
          <Image src={item.coverImg} mode='aspectFill' />
          <View className='text'>
            <View className='title'>{item.title}</View>
            <View className='date'>{moment(item.date).format('YYYY-MM-DD HH:mm:ss')}</View>
          </View>
        </View>
      )) : <View className='empty'>无内容</View>}
      {loading && <AtActivityIndicator size={30} content='加载中...' />}
    </View>
  )
}

export default Index
