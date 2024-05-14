import React, { useEffect, useState } from 'react'
import { Community } from '@/types'
import { getPostDetail, postPublic } from '@/api'
import Taro from '@tarojs/taro'
import EditArticle, { ArticleDetail } from '@/components/EditArticle'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id
  const [postDetail, setDetail] = useState({} as Community.PostDetail)

  const getDetail = () => {
    if (currId) {
      getPostDetail({
        id: +currId
      }).then(res => {
        setDetail(res.data)
      })
    }
  }

  useEffect(() => {
    getDetail()
  }, [currId])

  const onSave = async (postInfo: ArticleDetail & Community.PostDetail) => {
    await postPublic({
      ...postInfo,
      postTitle: postInfo.title,
      postCoverUrl: postInfo.coverImg,
      postDetails: JSON.stringify(postInfo.detailList),
      memberUserId: Taro.getStorageSync('loginInfo')?.userId
    })
    Taro.atMessage({
      message: '保存成功',
      type: 'success',
    })
    Taro.navigateBack()
  }

  return (
    <EditArticle
      article={postDetail ? {
        ...postDetail,
        coverImg: postDetail.postCoverUrl || '',
        title: postDetail.postTitle || '',
        detailList: postDetail.detailList || []
      } : undefined}
      onSave={onSave}
      headerTitle={currId ? '编辑帖子' : '发布帖子'}
      titleText='帖子标题'
    />
  )
}

export default Index
