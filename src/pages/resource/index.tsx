import React, { useEffect, useState } from 'react'
import { View, Input } from '@tarojs/components'
import { PageParams, Resource } from '@/types'
import { AtTabs, AtIcon } from 'taro-ui'
import { getResourceList } from '@/api'
import RtList from '@/components/RtList'
import { resourceTabList } from '@/utils/constant'
import './index.scss'

function Index() {
  const [currTab, setTab] = useState(0)

  const [keyword, setKeyword] = useState('');

  const handleChange = (e: any) => {
    setKeyword(e.detail.value)
  }

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [resourceList, setList] = useState<Resource.ResourceDetail[]>([])

  const [total, setTotal] = useState(0)

  const getList = () => {
    getResourceList({
      resourcesType: resourceTabList[currTab].value,
      searchKeyWord: keyword,
      ...page
    }).then(res => {
      setTotal(res.data.total)
      setList([...resourceList, ...res.data.list])
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
    <View className='resource-container'>
      <View className='input-wrapper has-prefix'>
        <AtIcon value='search' size='20' color='#aaa' />
        <Input
          name='value'
          type='text'
          placeholder='搜索标题'
          value={keyword}
          onInput={(text) => handleChange(text)}
          onConfirm={() => refresh()}
        />
      </View>
      <AtTabs
        current={currTab}
        tabList={resourceTabList}
        onClick={item => setTab(item)}
      />
      <RtList
        list={resourceList.map(i => ({
          ...i,
          id: i.id!,
          coverImg: i.resourcesCoverUrl,
          title: i.resourcesTitle,
          date: i.createTime || ''
        }))}
        detailUrl='../../module/pages/resource-detail/index'
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
