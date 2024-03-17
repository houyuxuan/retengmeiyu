import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import { activityDelete, getActivityList } from '@/api'
import { Garden, IdType, PageParams } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import moment from 'moment'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const [schoolList, setList] = useState<Garden.ActivityDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)
  const getList = () => {
    getActivityList({
      searchKeyWord: keyword,
      ...page
    }).then(res => {
      setTotal(res.data.total)
      setList([...schoolList, ...res.data.list])
    })
  }

  const refresh = () => {
    setList([])
    setPage({
      ...page,
      pageNo: 1,
    })
  }

  useDidShow(refresh)

  useEffect(() => {
    getList()
  }, [page])

  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `/pages/activity-edit/index${id ? '?id=' + id : ''}`})
  }

  const goPreview = (id: IdType) => {
    Taro.navigateTo({url: `/pages/activity-detail/index?id=${id}&preview=1`})
  }

  const deleteItem = (id: IdType) => {
    activityDelete({ id }).then(res => {
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
        addText='添加新活动'
      />
      <ManageList
        list={schoolList.map(i => ({
            ...i,
            id: i.id!,
            title: i.activityTitle
        }))}
        cardContent={(item: Garden.ActivityDetail) => (<>
            <View>点赞数：{item.zanNumber}</View>
            <View>创建时间：{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</View>
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
