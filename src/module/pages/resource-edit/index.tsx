import React, { useEffect, useState } from 'react'
import { Resource } from '@/types'
import { getResourceDetail, resourceEdit } from '@/api'
import Taro from '@tarojs/taro'
import EditArticle, { ArticleDetail } from '@/components/EditArticle'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [resourceDetail, setDetail] = useState({} as Resource.ResourceDetail)

  const getDetail = () => {
    if (currId) {
      getResourceDetail({
        id: +currId
      }).then(res => {
        setDetail(res.data)
      })
    }
  }

  useEffect(() => {
    getDetail()
  }, [currId])

  const onSave = async (resource: ArticleDetail & Resource.ResourceDetail) => {
    await resourceEdit({
      ...resource,
      id: resource.id,
      resourcesCoverUrl: resource.coverImg,
      resourcesDetails: JSON.stringify(resource.detailList),
      memberUserId: Taro.getStorageSync('loginInfo')?.userId
    })
    Taro.atMessage({
      message: '保存成功',
      type: 'success',
    })
    Taro.navigateBack()
  }

  return (
    <EditArticle
      titleText='资源标题'
      hasAudio
      hasVideo
      article={resourceDetail ? {
        ...resourceDetail,
        coverImg: resourceDetail.resourcesCoverUrl || '',
        title: resourceDetail.resourcesTitle || '',
        detailList: resourceDetail.detailList || []
      } : undefined}
      onSave={onSave}
      headerTitle={currId ? '美育资源-编辑' : '美育资源-新增'}
    />
  )
}

export default Index
