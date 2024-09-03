import React, { useEffect, useState } from 'react'
import { InfoManage } from '@/types'
import { infoEdit, getInfoDetail } from '@/api/info'
import Taro from '@tarojs/taro'
import EditInfo, { InfoDetail } from '@/components/EditInfo'


function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [clubDetail, setDetail] = useState<InfoManage.InfoDetail>()

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
    // const textCount = club.detailList.reduce((pre, curr) => {
    //   return pre + (curr.type === 'text' ? curr.content : '')
    // }, '')
    // const fileCount = club.detailList.filter(i => i.type !== 'text')
    // if (textCount?.length < 300 || fileCount?.length < 9) {
    //   Taro.atMessage({
    //     type: 'warning',
    //     message: textCount?.length < 300 ? '活动描述字数不得少于300字！' : '活动图片/视频总计不得少于9个文件！'
    //   })
    //   return false
    // }
    const params: InfoManage.InfoDetail = {
      ...info,
      infoTitle: info.title,
      infoCoverUrl: info.coverImg,
      infoDetails: JSON.stringify(info.detailList),
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
      article={clubDetail ? {
        ...clubDetail,
        coverImg: clubDetail.infoCoverUrl || '',
        title: clubDetail.infoTitle || '',
        detailList: clubDetail.detailList || []
      } : undefined}
      onSave={onSave}
      headerTitle={currId ? '资讯管理-编辑' : '资讯管理-新增'}
      titleText='资讯标题'
    />
  )
}

export default Index
