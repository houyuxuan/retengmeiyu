import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import { getSchoolList, schoolDelete } from '@/api'
import { Garden, IdType, PageParams } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import moment from 'moment'
import './index.scss'

function Index() {
  const [keyword, setKeyword] = useState('');

  const [schoolList, setList] = useState<Garden.SchoolDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)

  const getList = () => {
    getSchoolList({
      searchKeyWord: keyword || '',
      ...page
    }).then(res => {
      setTotal(res.data.total)
      setList([...schoolList, ...res.data.list])
    })
  }

  useEffect(getList, [page])

  useDidShow(() => refresh())

  const refresh = () => {
    setList([])
    setPage({
      ...page,
      pageNo: 1,
    })
  }

  useDidShow(() => {
    refresh()
  })

  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `../school-edit/index${id ? '?id=' + id : ''}`})
  }

  const deleteItem = (id: IdType) => {
    schoolDelete({ id }).then(res => {
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
        addText='添加学校'
      />
      <ManageList
        list={schoolList.map(i => ({
            ...i,
            id: i.id!,
            title: i.schoolName,
            coverImg: i.schoolLogoUrl
        }))}
        cardContent={(item: Garden.SchoolDetail) => (<>
            <View>简介：{item.schoolIntroduction}</View>
            <View>创建时间：{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</View>
        </>)}
        editFun={goEdit}
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
