import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import { activityDelete, getActivityAdminList, getActivityList } from '@/api'
import { Garden, IdType, PageParams } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import moment from 'moment'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const isAdmin = currPage.options.from === 'admin'

  const [keyword, setKeyword] = useState('');

  const [activityList, setList] = useState<Garden.ActivityDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)
  const getList = () => {
    if (isAdmin) {
      getActivityAdminList({
        searchKeyWord: keyword,
        ...page
      }).then(res => {
        setTotal(res.data.total)
        setList([...activityList, ...res.data.list])
      })
    } else {
      getActivityList({
        searchKeyWord: keyword,
        ...page
      }).then(res => {
        setTotal(res.data.total)
        setList([...activityList, ...res.data.list])
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

  useDidShow(refresh)

  useEffect(() => {
    getList()
  }, [page])

  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `../activity-edit/index${id ? '?id=' + id : ''}`})
  }

  const goPreview = (id: IdType) => {
    Taro.navigateTo({url: `../activity-detail/index?id=${id}&preview=1`})
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
        list={activityList.map(i => ({
            ...i,
            id: i.id!,
            title: i.activityTitle,
            coverImg: i.activityCoverUrl,
            detailList: JSON.parse(i.activityDetails)
        }))}
        cardContent={(item: Garden.ActivityDetail) => (<>
            <View className='detail-text'>{item.detailList?.filter(i => i.type === 'text').map(i => i.content).join('').slice(0, 40)}...</View>
            <View>{moment(item.createTime).format('YYYY-MM-DD HH:mm')} {item.zanNumber || 0}点赞</View>
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
