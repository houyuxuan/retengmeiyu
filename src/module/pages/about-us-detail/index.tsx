import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getIntroDetail } from '@/api'
import { AboutUs } from '@/types'
import ArticleDetail from '@/components/ArticleDetail'
import { View } from '@tarojs/components'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const isPreview = +currPage.options.preview === 1

  const [detail, setDetail] = useState<AboutUs.IntroDetail>()

  const getDetail = () => {
    getIntroDetail({
      id: +currId
    }).then(res => {
      setDetail(res.data)
    })
  }

  useEffect(() => {
    if (isPreview) {
      Taro.setNavigationBarTitle({
        title: '关于我们-预览'
      })
    }
  }, [isPreview])

  return (
    <View className={(isPreview ? 'can-edit ' : '') + 'aboutus-detail'}>
      <ArticleDetail detail={
        detail ? {
          ...detail,
          title: detail.title,
          id: detail.id!,
          createTime: detail.createTime || ''
        } : undefined}
        editUrl={isPreview ? `/module/pages/about-us-edit/index?id=${currId}` : ''}
        getDetail={getDetail}
      />
    </View>
  )
}

export default Index
