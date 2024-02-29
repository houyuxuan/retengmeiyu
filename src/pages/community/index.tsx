import React, { useEffect, useState } from 'react'
import { View, Input } from '@tarojs/components'
import { Community, PageParams } from '@/types'
import { AtTabs, AtIcon } from 'taro-ui'
import { getPostList } from '@/api'
import RtList from '@/components/RtList'
import './index.scss'

function Index() {
  const [currTab, setTab] = useState<Community.PostType>(0)
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

  const handleChange = (e: any) => {
    setKeyword(e.detail.value)
  }

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 10
  })

  const [postList, setList] = useState<Community.PostDetail[]>([])

  const getList = () => {
    getPostList({
      postType: tabList[currTab].value,
      searchKeyWord: keyword,
      ...page
    }).then(res => {
      setList(res.data.postList)
    })
  }

  useEffect(getList, [currTab, keyword, page])

  return (
    <View className='community-container'>
      <View className='input-wrapper has-prefix'>
        <AtIcon value='search' size='20' color='#aaa' />
        <Input
          name='value'
          type='text'
          placeholder='搜索标题'
          value={keyword}
          onInput={(text) => handleChange(text)}
          onConfirm={() => getList()}
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
      />
    </View>
  )
}

export default Index
