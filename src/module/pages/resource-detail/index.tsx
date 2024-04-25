import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getResourceDetail } from '@/api'
import { Resource } from '@/types'
import ArticleDetail from '@/components/ArticleDetail'
import { View } from '@tarojs/components'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const isPreview = +currPage.options.preview === 1

  const [detail, setDetail] = useState<Resource.ResourceDetail>()

  const getDetail = () => {
    getResourceDetail({
      id: +currId
    }).then(res => {
      setDetail(res.data)
    })
  }

  useEffect(() => {
    if (isPreview) {
      Taro.setNavigationBarTitle({
        title: '美育资源-详情预览'
      })
    }
  }, [isPreview])

  useEffect(() => {
    currId && getDetail()
  }, [currId])

  return (
    <View className={(isPreview ? 'can-edit ' : '') + 'resource-detail'}>
      <ArticleDetail detail={
        detail ? {
          ...detail,
          title: detail.resourcesTitle,
          id: detail.id!,
          createTime: detail.createTime || '',
          detailList: detail.detailList
        } : undefined}
        editUrl={isPreview ? `/module/pages/resource-edit/index?id=${currId}` : ''}
      />
    </View>
  )
}

export default Index
