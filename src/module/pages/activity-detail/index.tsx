import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { AtMessage } from 'taro-ui'
import { activityUpvote, getActivityDetail, getActivityUpvote, getRemarks, submitRemark } from '@/api'
import ArticleDetail from '@/components/ArticleDetail'
import { Garden, IdType } from '@/types'
import { View, Image, Input, Text } from '@tarojs/components'
import { systemImagePre } from '@/utils/constant'
import moment from 'moment'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = +currPage.options.id
  const isPreview = +currPage.options.preview === 1

  const [detail, setDetail] = useState<Garden.ActivityDetail>()
  const [remark, setRemark] = useState('')
  const [voteInfo, setVoteInfo] = useState<Garden.ActivityUpvoteInfo>()
  const [remarkList, setRemarkList] = useState<Garden.ActivityRemarkItem[]>([])

  const getDetail = () => {
    getActivityDetail({
      id: currId
    }).then(res => {
      setDetail(res.data)
      getVoteCount(res.data.schoolId)
    })
  }

  useEffect(() => {
    if (isPreview) {
      Taro.setNavigationBarTitle({
        title: '活动预览'
      })
    }
  }, [isPreview])

  useEffect(() => {
    if (currId) {
      getDetail()
      getRemarkList()
    }
  }, [currId])

  const handleChange = (e: any) => {
    setRemark(e.detail.value)
  }

  const getVoteCount = (schoolActivityId: IdType) => {
    getActivityUpvote({
      schoolActivityId,
      memberUserId: Taro.getStorageSync('loginInfo')?.userId
    }).then(res => {
      setVoteInfo(res.data)
    })
  }

  const getRemarkList = () => {
    return getRemarks({
      pageNo:1,
      pageSize: 100,
      activityId: currId
    }).then(res => {
      setRemarkList(res.data.list)
    })
  }
  const submit = (e: any) => {
    submitRemark({
      activityId: currId,
      commentContent: e.detail.value,
      memberUserId: Taro.getStorageSync('loginInfo')?.userId
    }).then(res => {
      Taro.atMessage({
        type: 'success',
        message: '发表成功'
      })
      getRemarkList()
    })
  }

  const upVote = () => {
    if (voteInfo?.zanFlag) {
      return
    }
    activityUpvote({
      schoolActivityId: currId,
      memberUserId: Taro.getStorageSync('loginInfo')?.userId
    }).then(() => {
      Taro.atMessage({
        type: 'success',
        message: '操作成功'
      })
    })
  }

  return (
    <View className='activity-detail'>
      <AtMessage />
      <ArticleDetail detail={
        detail ? {
          ...detail,
          title: detail.activityTitle,
          id: detail.id!,
          createTime: detail.createTime || ''
        } : undefined}
      />
      <View className='remarks'>
        <View className='remark-title'>
          评论{remarkList.length || ''}
        </View>
        <View className='publish'>
          <Input
            type='text'
            placeholder='讨论一下'
            value={remark}
            onInput={(e) => handleChange(e)}
            onConfirm={(e) => submit(e)}
          />
          <Image className='up-vote' src={`${systemImagePre}/upvote${voteInfo?.zanFlag ? 'd' : ''}.png`} onClick={upVote} />
        </View>
        <Text>{voteInfo?.zanNumber}</Text>
        <View className='remark-list'>
          {remarkList.map(item => (
            <View className='remark-item' key={item.id}>
              <Image src={item.avatar} />
              <View>{item.nickname}</View>
              <View className='content'>{item.commentContent}</View>
              <View>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default Index
