import React, { useEffect, useState } from 'react'
import { AboutUs } from '@/types'
import { getIntroDetail, introEdit } from '@/api'
import Taro from '@tarojs/taro'
import EditArticle, { ArticleDetail } from '@/components/EditArticle'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [introDetail, setDetail] = useState<AboutUs.IntroDetail>()

  const getDetail = () => {
    if (currId) {
      getIntroDetail({
        id: +currId
      }).then(res => {
        setDetail(res.data)
      })
    }
  }

  useEffect(() => {
    getDetail()
  }, [currId])

  const onSave = async (intro: ArticleDetail) => {
    await introEdit({
      ...intro,
      coverUrl: intro.coverImg,
      detail: JSON.stringify(intro.detailList)
    })
    Taro.atMessage({
      message: '保存成功',
      type: 'success',
    })
    Taro.redirectTo({url: '/pages/about-us-manage/index'})
  }

  return (
    <EditArticle
      article={introDetail ? {
        ...introDetail,
        coverImg: introDetail.coverUrl,
        title: introDetail.title,
        detailList: introDetail.detailList
      } : undefined}
      onSave={onSave}
      headerTitle={currId ? '关于我们-编辑' : '关于我们-新增'}
    />
  )
}

export default Index
