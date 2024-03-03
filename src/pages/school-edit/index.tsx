import React, { useEffect, useState } from 'react'
import { Garden } from '@/types'
import { getSchoolDetail, schoolEdit } from '@/api'
import Taro from '@tarojs/taro'
import EditArticle, { ArticleDetail } from '@/components/EditArticle'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [schoolDetail, setDetail] = useState<Garden.SchoolDetail>()

  const getDetail = () => {
    if (currId) {
      getSchoolDetail({
        id: +currId
      }).then(res => {
        setDetail(res.data)
      })
    }
  }

  useEffect(() => {
    getDetail()
  }, [currId])

  const onSave = async (schoolInfo: ArticleDetail & Garden.SchoolDetail) => {
    await schoolEdit({
      ...schoolInfo,
      schoolName: schoolInfo.title,
      schoolLogoUrl: schoolInfo.coverImg,
      schoolIntroduction: schoolInfo.intro || ''
    })
    Taro.atMessage({
      message: '保存成功',
      type: 'success',
    })
    Taro.redirectTo({url: '/pages/about-us-manage/index'})
  }

  return (
    <EditArticle
      article={schoolDetail ? {
        ...schoolDetail,
        coverImg: schoolDetail.schoolLogoUrl,
        title: schoolDetail.schoolName,
        detailList: [],
        intro: schoolDetail.schoolIntroduction
      } : undefined}
      onSave={onSave}
      hideDetail
      hasIntro
      headerTitle={currId ? '学校管理-编辑' : '学校管理-新增'}
      titleText='学校名称'
    />
  )
}

export default Index
