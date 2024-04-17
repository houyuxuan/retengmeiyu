import React, { useEffect, useState } from 'react'
import { Garden } from '@/types'
import { activityEdit, getActivityDetail } from '@/api'
import Taro from '@tarojs/taro'
import EditArticle, { ArticleDetail } from '@/components/EditArticle'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [activityDetail, setDetail] = useState<Garden.ActivityDetail>()

  const getDetail = () => {
    if (currId) {
      getActivityDetail({
        id: +currId
      }).then(res => {
        setDetail(res.data)
      })
    }
  }

  useEffect(() => {
    getDetail()
  }, [currId])

  const onSave = async (activity: ArticleDetail & Garden.ActivityDetail) => {
    const textCount = activity.detailList.reduce((pre, curr) => {
      return pre + (curr.type === 'text' ? curr.content : '')
    }, '')
    const fileCount = activity.detailList.filter(i => i.type !== 'text')
    if (textCount?.length < 300 || fileCount?.length < 9) {
      Taro.atMessage({
        type: 'warning',
        message: textCount?.length < 300 ? '活动描述字数不得少于300字！' : '活动图片/视频总计不得少于9个文件！'
      })
      return false
    }
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
    Taro.navigateBack()
  }

  return (
    <EditArticle
      article={activityDetail ? {
        ...activityDetail,
        coverImg: activityDetail.activityCoverUrl || '',
        title: activityDetail.activityTitle || '',
        detailList: activityDetail.detailList || []
      } : undefined}
      hasVideo
      onSave={onSave}
      showSchoolSelect
      headerTitle={currId ? '活动管理-编辑' : '活动管理-新增'}
      titleText='活动标题'
    />
  )
}

export default Index
