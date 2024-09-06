import React, { useEffect, useState } from 'react'
import { Resource } from '@/types'
import { getResourceDetail, resourceEdit } from '@/api'
import Taro from '@tarojs/taro'
import EditResource, { ArticleDetail } from '@/components/EditResource'

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
    const params = {
      ...resource,
      id: resource.id,
      resourcesTitle: resource.resourcesTitle,
      resourcesCoverUrl: resource.resourcesCoverUrl,
      resourcesDetails: JSON.stringify(resource.resourcesDetails),
      memberUserId: Taro.getStorageSync('loginInfo')?.userId
    }
    await resourceEdit(params)
    Taro.atMessage({
      message: '保存成功',
      type: 'success',
    })
    Taro.navigateBack()
  }
  return (
    <EditResource
      titleText='资源标题'
      hasAudio
      hasVideo
      article={resourceDetail ? {
        ...resourceDetail,
        resourcesCoverUrl: resourceDetail.resourcesCoverUrl || '',
        resourcesTitle: resourceDetail.resourcesTitle || '',
        resourcesDetails: resourceDetail.resourcesDetails ? JSON.parse(resourceDetail.resourcesDetails) : []
      } : undefined}
      onSave={onSave}
      headerTitle={currId ? '美育资源-编辑' : '美育资源-新增'}
    />
  )
}

export default Index
