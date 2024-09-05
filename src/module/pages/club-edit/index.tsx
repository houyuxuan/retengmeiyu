import React, { useEffect, useState } from 'react'
import { ClubManage } from '@/types'
import { clubEdit, getClubDetail, getTagList } from '@/api/club'
import Taro from '@tarojs/taro'
import EditClub, { ClubDetail } from '@/components/EditClub'

type Tags = ClubManage.Tag[];

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [clubDetail, setDetail] = useState<ClubManage.ClubDetail>()
  const [tagList, setTagList] = useState<Tags>([])
  const getDetail = () => {
    if (currId) {
      getClubDetail({
        id: +currId
      }).then(res => {
        setDetail(res.data)
      })
      getTagList({
        clubId: +currId
      }).then(res => {
        setTagList(res.data)
      })
    }
  }
  useEffect(() => {
    getDetail()
  }, [currId])

  const onSave = async (club: ClubDetail & ClubManage.ClubDetail) => {
    const textCount = club.clubDetails.reduce((pre, curr) => {
      return pre + (curr.type === 'text' ? curr.content : '')
    }, '')
    // const fileCount = club.clubDetails.filter(i => i.type !== 'text')
    if (textCount?.length < 300) {
      Taro.atMessage({
        type: 'warning',
        message: '社团描述字数不得少于300字！'
      })
      return false
    }
    const params: ClubManage.ClubDetail = {
      ...club,
      clubTitle: club.clubTitle,
      clubCoverUrl: club.clubCoverUrl,
      clubDetails: JSON.stringify(club.clubDetails),
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
        clubCoverUrl: clubDetail.clubCoverUrl || '',
        clubTitle: clubDetail.clubTitle || '',
        clubDetails: JSON.parse(clubDetail.clubDetails) || []
      } : undefined}
      onSave={onSave}
      tagList={[...tagList]}
      headerTitle={currId ? '社团管理-编辑' : '社团管理-新增'}
      titleText='社团标题'
    />
  )
}

export default Index
