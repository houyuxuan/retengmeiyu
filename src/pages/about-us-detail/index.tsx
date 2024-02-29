import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { getIntroDetail } from '@/api'
import { AboutUs } from '@/types'
import ArticleDetail from '@/components/ArticleDetail'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const isPreview = currPage.options.preview

  const [detail, setDetail] = useState<AboutUs.IntroDetail>()

  const getDetail = () => {
    getIntroDetail({
      id: +currId
    }).then(res => {
      setDetail(res.data)
    })
  }

  useEffect(() => {
    if (+isPreview === 1) {
      Taro.setNavigationBarTitle({
        title: '关于我们-预览'
      })
    }
  }, [isPreview])

  useEffect(() => {
    currId && getDetail()
  }, [currId])

  return <ArticleDetail detail={
    detail ? {
      ...detail,
      title: detail.title,
      id: detail.id!,
      createTime: detail.createTime || ''
    } : undefined}
  />
}

export default Index
