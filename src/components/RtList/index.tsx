import React from 'react'
import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { IdType } from '@/types'
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
    detailUrl: string;
}) {
  const toDetail = (id) => {
    Taro.navigateTo({ url: `${props.detailUrl}?id=${id}` })
  }

  return (
    <View className='list-content'>
      {props.list.length ? props.list.map((item, index) => (
        <View className='list-item' key={index} onClick={() => toDetail(item.id)}>
          <Image src={item.coverImg} />
          <View className='text'>
            <View className='title'>{item.title}</View>
            <View className='date'>{item.date}</View>
          </View>
        </View>
      )) : <View className='empty'>无内容</View>}
    </View>
  )
}

export default Index
