import React, { useEffect, useState } from 'react'
import { View, Input, Image, Button } from '@tarojs/components'
import { PageParams, Resource, IdType, Tab } from '@/types'
import { AtTabs, AtIcon } from 'taro-ui'
import { getResourceList } from '@/api'
import { getTagList } from '@/api/club'
import RtList from '@/components/RtList'
import CheckLogin from '@/components/CheckLogin'
import Taro, { getStorageSync, useDidShow } from '@tarojs/taro'
import filterIcon from '@/assets/icon/filter.png'
import './index.scss'

interface Params {
  // resourcesType?: Resource.ResourceType;
  clubId?: IdType; // 资源活动类型（这里产品设计有问题，资源和社团是分开管理的）
  clubTagId?: IdType; // 资源标签
  searchKeyWord: string;
}

function Index() {
  const [currTab, setTab] = useState(0)
  const [tagList, setTags] = useState<Resource.Tag[]>([])
  const [resourceTabList, setTabs] = useState<Tab[]>([{ title: '全部', value: 0 }])
  const [keyword, setKeyword] = useState('');

  useDidShow(() => {
    getTabList()
  })
  const handleChange = (e: any) => {
    setKeyword(e.detail.value)
  }

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [resourceList, setList] = useState<Resource.ResourceDetail[]>([])
  const [total, setTotal] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const [tagId, setTagId] = useState<number | null>(null)
  const handleTagChange = (id) => {
    if (tagId === id) {
      setTagId(null)
    } else {
      setTagId(id)
    }
  }
  const getTags = async (no) => {
    const { data } = await getTagList({ clubId: no })
    setTags(data);
  }
  const getList = () => {
      const params: Params & PageParams  = {
        clubId: resourceTabList?.[currTab]?.value,
        searchKeyWord: keyword,
        ...page
      }
      if (tagId) params.clubTagId = tagId;
      getResourceList(params).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...resourceList, ...res.data.list])
      })
    }

  const refresh = () => {
    setList([])
    getTags(resourceTabList?.[currTab].value)
    setPage({
      ...page,
      pageNo: 1
    })
  }

  const getTabList = () => {
    if (Taro.getStorageSync('userInfo')) {
        const clubList = getStorageSync('clubList')
        const arr = [{ title: '全部', value: 0 }];
        (clubList || []).forEach((club: { id: number, title: string, [key: string]: any}) => {
          arr.push({
            value: Number(club.id),
            title: club.title + '素材'
          })
        })
        setTabs(arr)
    }
  }
  useEffect(getList, [page])

  useEffect(refresh, [currTab, keyword])
  const handleFilterClick = () => {
    setShowFilter(!showFilter)
    if (showFilter) {
      getList()
    }
  }
  return (
    <View className='resource-container'>
      <View className='top-filter'>
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
      </View>
      <AtTabs
        current={currTab}
        tabList={resourceTabList || []}
        onClick={item => setTab(item)}
      />
      {!!tagList.length && (
          <View className="top-area">
            <View className='filter-wrapper'>
              <View className="filter-btn" onClick={handleFilterClick}>
                <Image mode="widthFix" className='img' src={filterIcon} />
                <View className="name">筛选</View>
              </View>
              {showFilter && (
                <View className='filter-content'>
                  <View className='select-list'>
                    {tagList.map(tag =>
                      (<Button className={`button ${tagId === tag.id ? 'active': ''}`} onClick={() => handleTagChange(tag.id)}>{tag.clubTagName}</Button>)
                    )}
                  </View>
                </View>
              )}
            </View>
            {showFilter && (
              <View className='mask'></View>
            )}
          </View>
        )}
      <View className={!tagList.length ? '' : 'has-filter'}>
        <RtList
          list={resourceList.map(i => ({
            ...i,
            id: i.id!,
            coverImg: i.resourcesCoverUrl,
            title: i.resourcesTitle,
            date: i.createTime || '',
            uvTotalCount: i?.uvTotalCount
          }))}
          detailUrl='/detailPackage/pages/resource-detail/index'
          total={total}
          onLoading={() => {
            setPage({
              ...page,
              pageNo: page.pageNo + 1,
            })
          }}
        />
      </View>

      <CheckLogin onSuccess={getList} />
    </View>
  )
}

export default Index
