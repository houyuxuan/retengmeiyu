import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
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
  const [hasPerms, setPerm] = useState(false)
  const hasPermRoles = ['super_admin', 'teacher', 'admin'] // 超级管理员、老师和管理员能下载资源文件
  const getDetail = () => {
    getResourceDetail({
      id: +currId
    }).then(res => {
      setDetail(res.data)
    })
  }
  useDidShow(() => {
    const { roleCode = '' } = Taro.getStorageSync('userInfo')
    const hasPerm = hasPermRoles.includes(roleCode)
    setPerm(hasPerm)
  })
  useEffect(() => {
    if (isPreview) {
      Taro.setNavigationBarTitle({
        title: '美育资源-详情预览'
      })
    }
  }, [isPreview])

  return (
    <View className={(isPreview ? 'can-edit ' : '') + 'resource-detail'}>
      <ArticleDetail detail={
        detail ? {
          ...detail,
          title: detail.resourcesTitle,
          id: detail.id!,
          createTime: detail.createTime || '',
          detailList: JSON.parse(detail.resourcesDetails)
        } : undefined}
        editUrl={isPreview ? `/editPackage/pages/resource-edit/index?id=${currId}` : ''}
        getDetail={getDetail}
        hasPermission={hasPerms}
      />
    </View>
  )
}

export default Index
