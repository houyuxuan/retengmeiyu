import React, { useEffect, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { ContentItem, IdType, UserManagement } from '@/types'
import { AtActivityIndicator, AtAvatar } from 'taro-ui'
import moment from 'moment'
import './index.scss'

export default function ArticleDetail(props: {
  detail?: {
    id: IdType;
    title: string;
    createTime: string;
    detailList: ContentItem[];
  };
  showTitle?: boolean;
  author?: UserManagement.UserInfo
}) {
  const [titleVisible, setVisible] = useState(true)

  useEffect(() => {
    if (props.showTitle === false) {
      setVisible(props.showTitle)
    }
  }, [props.showTitle])

  return (
    <View className='detail-wrapper'>
      {props.detail?.id ? (
        <View className='detail'>
          {titleVisible && (<>
            <View className='title'>{props.detail.title}</View>
            {props.author ? (
              <View className="author">
                <AtAvatar circle image={props.author.avatar} size='small' />
                <Text className='nickname'>{props.author.nickname}</Text>
                <View className='date'>
                  {moment(props.detail.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </View>
              </View>
            ) : (
              <View className='date'>
                {moment(props.detail.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </View>
            )}
          </>)}
          <View className='content'>
            {props.detail.detailList.map((item, idx) => (
              item.type === 'image' ? (
                <View key={idx} className='img'><Image mode="widthFix" src={item.content} /></View>
              ) : (
                <View className='text' key={idx}>
                  {item.content}
                </View>
              )
            ))}
          </View>
        </View>
      ) : (
        <View>
          <AtActivityIndicator size={50} content='加载中...' />
        </View>
      )}
    </View>
  )
}
