import React, { useEffect, useState } from 'react'
import { ClubManage } from '@/types'
import { clubEdit, getClubDetail } from '@/api/club'
import Taro from '@tarojs/taro'
import EditClub, { ClubDetail } from '@/components/EditClub'

type Tags = ClubManage.Tag[];


const filterEmptyObj = (obj: {[key: string]: any}): {[key: string]: any} => {
  const newObj = {}
  Object.keys(obj).forEach(item => {
    if (obj[item]) newObj[item] = obj[item]
  })
  return newObj
}
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
        const { clubTagRespVOList: tagAll } = res.data
        if (tagAll) {
          setTagList(tagAll);
        }
      })
    }
  }
  useEffect(() => getDetail(), [currId])

  const onSave = async (club: ClubDetail & ClubManage.ClubDetail) => {
    const textCount = club.clubDetails.reduce((pre, curr) => {
      return pre + (curr.type === 'text' ? curr.content : '')
    }, '')
    // const fileCount = club.clubDetails.filter(i => i.type !== 'text')
    if (textCount?.length <= 0) {
      Taro.atMessage({
        type: 'warning',
        message: '请填写社团描述！'
      })
      return false
    }
    const params: ClubManage.ClubDetail = {
      ...club,
      clubTitle: club.clubTitle,
      clubCoverUrl: club.clubCoverUrl,
      clubDetails: club.clubDetails &&  JSON.stringify(club.clubDetails),
      clubTagList: club.clubDetails && club.clubTagList
    }
    const paramsFilter = filterEmptyObj(params)
    await clubEdit(paramsFilter as ClubManage.ClubDetail)
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
        clubDetails: JSON.parse(clubDetail.clubDetails) || [],
        clubTagList: [...tagList]
      } : undefined}
      onSave={onSave}
      headerTitle={currId ? '社团管理-编辑' : '社团管理-新增'}
      titleText='社团标题'
    />
  )
}

export default Index
