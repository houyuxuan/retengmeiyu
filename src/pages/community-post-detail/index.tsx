import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtMessage } from 'taro-ui'
import { getPostDetail, getPostDiscuss } from '@/api'
import { Community, PageParams } from '@/types'
import ArticleDetail from '@/components/ArticleDetail'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id

  const [detail, setDetail] = useState<Community.PostDetail>()

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 10
  })

  const [discussList, setDiscussList] = useState<Community.PostDiscussDetail[]>([])
  const getDetail = () => {
    getPostDetail({
      postId: +currId
    }).then(res => {
      setDetail(res.data)
    })
    getPostDiscuss({
      postId: +currId,
      ...page
    }).then(res => {
      setDiscussList(res.data.postDiscussList)
    })
  }

  useEffect(() => {
    currId && getDetail()
  }, [currId])

  const [currTab, setTab] = useState(0)
  const tabList = [{ title: '详情' }, { title: '讨论' }]

  return (
    <View>
      <AtMessage />
      {detail && <View className='post-title'>
        <Image src={detail?.postCoverUrl || ''} />
        <View className='title'>{detail?.postTitle}</View>
        <View className='date'>
          {detail.createTime}
        </View>
      </View>}
      <View>
        <AtTabs current={currTab} tabList={tabList} onClick={(index)=>setTab(index)}>
          <AtTabsPane current={currTab} index={0}>
            <ArticleDetail
              detail={
                detail ? {
                ...detail,
                title: detail.postTitle,
                id: detail.id!,
                createTime: detail.createTime || ''
                } : undefined
              }
              showTitle={false}
            />
          </AtTabsPane>
          <AtTabsPane current={currTab} index={1}>
            {discussList.map(item => (
              <View key={item.id}>
                <Image src={item.avatar} />
                <View>{item.nickname}</View>
                <View>{item.createTime}</View>
                <View>{item.discussContent}</View>
              </View>
            ))}
          </AtTabsPane>
        </AtTabs>
      </View>
    </View>
  )
}

export default Index
