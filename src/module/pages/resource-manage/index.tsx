import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtMessage, AtTabs } from 'taro-ui'
import { getResourceAdminList, getResourceList, resourceDelete } from '@/api'
import { IdType, PageParams, Resource } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import { resourceTabList } from '@/utils/constant'
import moment from 'moment'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const isAdmin = currPage.options.from === 'admin'

  const [keyword, setKeyword] = useState('');

  const [resourceList, setList] = useState<Resource.ResourceDetail[]>([])
  const [currTab, setTab] = useState(0)

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)
  const getList = () => {
    if (isAdmin) {
      getResourceAdminList({
        resourcesType: resourceTabList[currTab]?.value,
        searchKeyWord: keyword,
        ...page
      }).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...resourceList, ...res.data.list])
      })
    } else {
      getResourceList({
        resourcesType: resourceTabList[currTab]?.value,
        searchKeyWord: keyword,
        ...page
      }).then(res => {
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
    Taro.navigateTo({url: `../resource-edit/index${id ? '?id=' + id : ''}`})
  }

  const goPreview = (id: IdType) => {
    Taro.navigateTo({ url: `../resource-detail/index?id=${id}&preview=1` })
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
