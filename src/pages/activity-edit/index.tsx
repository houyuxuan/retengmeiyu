import React, { useEffect, useState } from 'react'
import { AboutUs, Garden } from '@/types'
import { activityEdit, getActivityDetail, introEdit } from '@/api'
import Taro from '@tarojs/taro'
import EditArticle, { ArticleDetail } from '@/components/EditArticle'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [activityDetail, setDetail] = useState<Garden.ActivityDetail>()

  const getDetail = () => {
    if (currId) {
      getActivityDetail({
        activityId: +currId
      }).then(res => {
        setDetail(res.data)
      })
    }
  }

  useEffect(() => {
    getDetail()
  }, [currId])

  const onSave = async (activity: ArticleDetail & Garden.ActivityDetail) => {
    await activityEdit({
      ...activity,
      activityTitle: activity.title,
      activityCoverUrl: activity.coverImg,
      activityDetails: JSON.stringify(activity.detailList)
    })
    Taro.atMessage({
      message: '保存成功',
      type: 'success',
    })
    Taro.redirectTo({url: '/pages/about-us-manage/index'})
  }

  return (
    <EditArticle
      article={activityDetail ? {
        ...activityDetail,
        coverImg: activityDetail.activityCoverUrl,
        title: activityDetail.activityTitle,
        detailList: activityDetail.detailList
      } : undefined}
      onSave={onSave}
      headerTitle={currId ? '活动管理-编辑' : '活动管理-新增'}
      titleText='活动标题'
    />
  )
}

export default Index
