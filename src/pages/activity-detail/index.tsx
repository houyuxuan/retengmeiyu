import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getActivityDetail } from '@/api'
import ArticleDetail from '@/components/ArticleDetail'
import { Garden } from '@/types'

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

  return <ArticleDetail detail={
    detail ? {
      ...detail,
      title: detail.activityTitle,
      id: detail.id!,
      createTime: detail.createTime || ''
    } : undefined}
  />
}

export default Index
