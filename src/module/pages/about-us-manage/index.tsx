import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import { getIntroList, introDelete } from '@/api'
import { AboutUs, IdType, PageParams } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import moment from 'moment'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const [introList, setIntro] = useState<AboutUs.IntroDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)
  const getList = () => {
    getIntroList({
      searchKeyWord: keyword,
      ...page
    }).then(res => {
      setTotal(res.data.total)
      setIntro([...introList, ...res.data.list])
    })
  }

  const refresh = () => {
    setIntro([])
    setPage({
      ...page,
      pageNo: 1,
    })
  }

  useEffect(() => {
    getList()
  }, [page])

  useDidShow(() => {
    refresh()
  })

  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `../about-us-edit/index${id ? '?id=' + id : ''}`})
  }

  const goPreview = (id: IdType) => {
    Taro.navigateTo({ url: `../about-us-detail/index?id=${id}&preview=1` })
  }

  const deleteItem = (id: IdType) => {
    introDelete({ id }).then(res => {
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
      />
      <ManageList
        list={introList.map(i => ({
          ...i,
          id: i.id!,
          title: i.title
        }))}
        cardContent={(item) => (<>
            <View>序号：{item.id}</View>
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
