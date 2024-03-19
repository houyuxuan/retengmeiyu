import React, { useEffect, useState } from 'react'
import { View, Input } from '@tarojs/components'
import { Community, PageParams } from '@/types'
import { AtTabs, AtIcon } from 'taro-ui'
import { getPostList } from '@/api'
import RtList from '@/components/RtList'
import { postTabList } from '@/utils/constant'
import './index.scss'

function Index() {
  const [currTab, setTab] = useState(0)

  const [keyword, setKeyword] = useState('');

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)

  const [postList, setList] = useState<Community.PostDetail[]>([])

  const getList = () => {
    getPostList({
      postType: postTabList[currTab].value || undefined,
      searchKeyWord: keyword,
      ...page
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
        tabList={postTabList}
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
        detailUrl='../../module/pages/community-post-detail/index'
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
