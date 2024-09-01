import React, { useEffect, useState } from 'react'
import { ClubManage } from '@/types'
import { clubEdit, getClubDetail } from '@/api/club'
import Taro from '@tarojs/taro'
import EditClub, { ClubDetail } from '@/components/EditClub'


function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [clubDetail, setDetail] = useState<ClubManage.ClubDetail>()

  const getDetail = () => {
    if (currId) {
      getClubDetail({
        id: +currId
      }).then(res => {
        setDetail(res.data)
      })
    }
  }
  useEffect(() => {
    getDetail()
  }, [currId])

  const onSave = async (club: ClubDetail & ClubManage.ClubDetail) => {
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
    const params: ClubManage.ClubDetail = {
      ...club,
      clubTitle: club.title,
      clubCoverUrl: club.coverImg,
      clubDetails: JSON.stringify(club.detailList),
    }
    await clubEdit(params)
    Taro.atMessage({
      message: '保存成功',
      type: 'success',
    })
    Taro.navigateBack()
  }

  return (
    <EditClub
      article={clubDetail ? {
        ...clubDetail,
        coverImg: clubDetail.clubCoverUrl || '',
        title: clubDetail.clubTitle || '',
        detailList: clubDetail.detailList || []
      } : undefined}
      onSave={onSave}
      headerTitle={currId ? '社团管理-编辑' : '社团管理-新增'}
      titleText='社团标题'
    />
  )
}

export default Index
