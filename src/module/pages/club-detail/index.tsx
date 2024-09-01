import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import { ClubManage } from '@/types'
import { getClubDetail } from '@/api/club'
import ArticleDetail from '@/components/ArticleDetail'
import moment from 'moment'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [detail, setDetail] = useState<ClubManage.Club>()

  const getDetail = () => {
    getClubDetail({
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
        <Image src={detail?.clubCoverUrl || ''} mode='aspectFill' />
        <View className='title'>{detail?.clubTitle}</View>
        <View className='date'>
          {moment(detail.createTime).format('YYYY-MM-DD HH:mm')}
        </View>
      </View>}
      <ArticleDetail
        detail={
          detail ? {
          ...detail,
          title: detail.clubTitle,
          id: detail.id!,
          createTime: detail.createTime || '',
          detailList: detail.clubDetails && JSON.parse(detail.clubDetails)
          } : undefined
        }
        showTitle={false}
        getDetail={getDetail}
      />
    </View>
  )
}

export default Index
