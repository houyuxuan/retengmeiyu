import React, { useEffect, useState } from 'react'
import { InfoManage } from '@/types'
import { infoEdit, getInfoDetail } from '@/api/info'
import Taro from '@tarojs/taro'
import EditInfo, { InfoDetail } from '@/components/EditInfo'


function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [infoDetail, setDetail] = useState<InfoManage.InfoDetail>()

  const getDetail = () => {
    if (currId) {
      getInfoDetail({
        id: +currId
      }).then(res => {
        setDetail(res.data)
      })
    }
  }
  useEffect(() => {
    getDetail()
  }, [currId])

  const onSave = async (info: InfoDetail & InfoManage.InfoDetail) => {
    const textCount = info.detailList.reduce((pre, curr) => {
      return pre + (curr.type === 'text' ? curr.content : '')
    }, '')
    if (textCount?.length < 300) {
      Taro.atMessage({
        type: 'warning',
        message: '资讯字数不得少于300字！'
      })
      return false
    }
    const params: InfoManage.InfoDetail = {
      ...info,
      informationTitle: info.title,
      informationCoverUrl: info.coverImg,
      informationDetails: JSON.stringify(info.detailList),
    }
    await infoEdit(params)
    Taro.atMessage({
      message: '保存成功',
      type: 'success',
    })
    Taro.navigateBack()
  }

  return (
    <EditInfo
      article={infoDetail ? {
        ...infoDetail,
        coverImg: infoDetail.informationCoverUrl || '',
        title: infoDetail.informationTitle || '',
        detailList: infoDetail.informationDetails ? JSON.parse(infoDetail.informationDetails) : []
      } : undefined}
      onSave={onSave}
      headerTitle={currId ? '资讯管理-编辑' : '资讯管理-新增'}
      titleText='资讯标题'
    />
  )
}

export default Index
