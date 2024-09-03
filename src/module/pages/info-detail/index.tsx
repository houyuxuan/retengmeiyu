import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import { InfoManage } from '@/types'
import { getInfoDetail } from '@/api/info'
import ArticleDetail from '@/components/ArticleDetail'
import moment from 'moment'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [detail, setDetail] = useState<InfoManage.Info>()

  const getDetail = () => {
    getInfoDetail({
      id: +currId
    }).then(res => {
      setDetail(res.data)
    })
  }

  useDidShow(() => {})

  return (
    <View className='post-container'>
      <AtMessage />
      {detail && <View className='post-title'>
        <Image src={detail?.infoCoverUrl || ''} mode='aspectFill' />
        <View className='title'>{detail?.infoTitle}</View>
        <View className='date'>
          {moment(detail.createTime).format('YYYY-MM-DD HH:mm')}
        </View>
      </View>}
      <ArticleDetail
        detail={
          detail ? {
          ...detail,
          title: detail.infoTitle,
          id: detail.id!,
          createTime: detail.createTime || '',
          detailList: detail.infoDetails && JSON.parse(detail.infoDetails)
          } : undefined
        }
        showTitle={false}
        getDetail={getDetail}
      />
    </View>
  )
}

export default Index
