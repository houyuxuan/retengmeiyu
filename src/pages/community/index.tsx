import React, { useEffect, useState } from 'react'
import { View, Input } from '@tarojs/components'
import { Community, PageParams } from '@/types'
import { AtTabs, AtIcon } from 'taro-ui'
import { getPostList } from '@/api'
import RtList from '@/components/RtList'
import './index.scss'

function Index() {
  const [currTab, setTab] = useState(0)
  const tabList = [{
    title: '全部',
    value: Community.PostType.All
  }, {
    title: '分享帖',
    value: Community.PostType.Share
  }, {
    title: '讨论帖',
    value: Community.PostType.Discuss
  }]

  const [keyword, setKeyword] = useState('');

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)

  const [postList, setList] = useState<Community.PostDetail[]>([])

  const getList = (pageParams?: PageParams) => {
    getPostList({
      postType: tabList[currTab].value || undefined,
      searchKeyWord: keyword,
      ...page,
      ...pageParams
    }).then(res => {
      setList([...postList, ...res.data.list])
      setTotal(res.data.total)
    })
  }

  const refresh = () => {
    setList([])
    setPage({
      ...page,
      pageNo: 1
    })
  }

  useEffect(getList, [page])

  useEffect(refresh, [currTab, keyword])

  return (
    <View className='community-container'>
      <View className='input-wrapper has-prefix'>
        <AtIcon value='search' size='20' color='#aaa' />
        <Input
          name='value'
          type='text'
          placeholder='搜索标题'
          value={keyword}
          onInput={e => setKeyword(e.detail.value)}
          onConfirm={refresh}
        />
      </View>
      <AtTabs
        current={currTab}
        tabList={tabList}
        onClick={item => setTab(item)}
      />
      <RtList
        list={postList.map(i => ({
          ...i,
          id: i.id!,
          coverImg: i.postCoverUrl,
          title: i.postTitle,
          date: i.createTime || ''
        }))}
        detailUrl='/pages/community-post-detail/index'
        total={total}
        onLoading={() => {
          setPage({
            ...page,
            pageNo: page.pageNo + 1,
          })
        }}
      />
    </View>
  )
}

export default Index
