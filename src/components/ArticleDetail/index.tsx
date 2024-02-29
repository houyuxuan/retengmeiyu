import React from 'react'
import { View, Image } from '@tarojs/components'
import { ContentItem, IdType } from '@/types'
import { AtActivityIndicator, AtMessage } from 'taro-ui'
import './index.scss'

export default function ArticleDetail(props: {
  detail?: {
    id: IdType;
    title: string;
    createTime: string;
    detailList: ContentItem[]
  };
  showTitle: boolean
} = {
  showTitle: true
}) {
  return (
    <View className='detail-container'>
      <AtMessage />
      {props.detail?.id ? (
        <View className='detail'>
          {props.showTitle && (<>
            <View className='title'>{props.detail.title}</View>
            <View className='date'>
              {props.detail.createTime}
            </View>
          </>)}
          {props.detail.detailList.map((item, idx) => (
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
          <AtActivityIndicator size={50} content='加载中...' />
        </View>
      )}
    </View>
  )
}
