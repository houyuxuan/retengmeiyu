import React, { useEffect, useState } from 'react'
import Taro, { useDidShow, getStorageSync } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtMessage, AtTabs } from 'taro-ui'
import { getResourceAdminList, getResourceList, resourceDelete } from '@/api'
import { IdType, PageParams, Resource, Tab } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
// import { resourceTabList } from '@/utils/constant'
import moment from 'moment'
import './index.scss'

interface Params {
  // resourcesType?: Resource.ResourceType;
  clubId?: IdType; // 资源活动类型（这里产品设计有问题，资源和社团是分开管理的）
  clubTagId?: IdType; // 资源标签
  searchKeyWord: string;
}

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const isAdmin = currPage.options.from === 'admin'

  const [keyword, setKeyword] = useState('');
  const [resourceTabList, setTabs] = useState<Tab[]>([{ title: '全部', value: 0 }])

  const [resourceList, setList] = useState<Resource.ResourceDetail[]>([])
  const [currTab, setTab] = useState(0)

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)
  useDidShow(() => {
    getTabList()
  })
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
  const getList = () => {
    const params: Params & PageParams = {
      searchKeyWord: keyword,
      ...page
    }
    if (resourceTabList[currTab]?.value) params.clubId = resourceTabList[currTab]?.value
    if (isAdmin) {
      getResourceAdminList(params).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...resourceList, ...res.data.list])
      })
    } else {
      getResourceList(params).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...resourceList, ...res.data.list])
      })
    }
  }

  const refresh = () => {
    setList([])
    setPage({
      ...page,
      pageNo: 1,
    })
  }

  useEffect(() => {
    refresh()
  }, [currTab, keyword])

  useEffect(getList, [page])

  useDidShow(() => {
    refresh()
  })

  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `/editPackage/pages/resource-edit/index${id ? '?id=' + id : ''}`})
  }

  const goPreview = (id: IdType) => {
    Taro.navigateTo({ url: `/detailPackage/pages/resource-detail/index?id=${id}&preview=1` })
  }

  const deleteItem = (id: IdType) => {
    resourceDelete({ id }).then(res => {
      Taro.atMessage({
          type: 'success',
          message: res.msg
      })
      refresh()
    })
  }

  return (
    <View className='manage-container'>
      <AtMessage />
      <SearchAndAdd
        onAdd={() => goEdit()}
        onConfirm={refresh}
        onChange={setKeyword}
        addText='添加新资源'
      />
      <AtTabs
        current={currTab}
        tabList={resourceTabList}
        onClick={item => setTab(item)}
      />
      <ManageList
        list={resourceList.map(i => ({
          ...i,
          id: i.id!,
          title: i.resourcesTitle,
          coverImg: i.resourcesCoverUrl,
        }))}
        cardContent={(item) => (<>
            <View>序号：{item.id}</View>
            <View>创建时间：{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</View>
        </>)}
        editFun={goEdit}
        previewFun={goPreview}
        deleteFun={deleteItem}
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
