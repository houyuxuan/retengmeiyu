import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { activityUpvote, getActivityDetail } from '@/api'
import ArticleDetail from '@/components/ArticleDetail'
import { Garden } from '@/types'
import { View, Image } from '@tarojs/components'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const isPreview = +currPage.options.preview === 1

  const [detail, setDetail] = useState<Garden.ActivityDetail>()

  const getDetail = () => {
    getActivityDetail({
      id: +currId
    }).then(res => {
      setDetail(res.data)
    })
  }

  useEffect(() => {
    if (isPreview) {
      Taro.setNavigationBarTitle({
        title: '活动预览'
      })
    }
  }, [isPreview])

  useEffect(() => {
    currId && getDetail()
  }, [currId])

  const upVote = () => {
    activityUpvote({
      schoolActivityId: currId,
      memberUserId: Taro.getStorageSync('loginInfo')?.userId
    }).then(() => {
      Taro.atMessage({
        type: 'success',
        message: '操作成功'
      })
    })
  }

  return (
    <View className='activity-detail'>
      <ArticleDetail detail={
        detail ? {
          ...detail,
          title: detail.activityTitle,
          id: detail.id!,
          createTime: detail.createTime || ''
        } : undefined}
      />
      <Image className='up-vote' src='https://media.retenggy.com/systemImage/upvote.svg' onClick={upVote} />
    </View>
  )
}

export default Index
