import { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { InfoManage, PageParams, IdType } from '@/types'
import { AtMessage } from 'taro-ui'
import SearchAndAdd from '@/components/SearchAndAdd'
import { getInfoList, infoDelete } from '@/api/info'
import ManageList from '@/components/ManageList'
import CheckLogin from '@/components/CheckLogin'

import Taro from '@tarojs/taro'
import './index.scss'

function Index() {

  const [keyword, setKeyword] = useState('');

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)

  const [infoList, setList] = useState<InfoManage.Info[]>([])

  const getList = () => {
    if (Taro.getStorageSync('userInfo')) {
      getInfoList({
        searchKeyWord: keyword,
        ...page
      }).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...infoList, ...res.data.list])
      })
    }
  }
  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `../info-edit/index${id ? '?id=' + id : ''}`})
  }
  const deleteItem = (id: IdType) => {
    infoDelete({ id }).then(res => {
      Taro.atMessage({
          type: 'success',
          message: res.msg
      })
      refresh()
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

  useEffect(refresh, [keyword])

  return (
    <View className='club-container'>
      <AtMessage />
      <SearchAndAdd
        onAdd={() => goEdit()}
        onConfirm={refresh}
        onChange={setKeyword}
        addText='新增资讯'
      />
      <ManageList
        list={infoList.map(i => ({
          ...i,
          id: i.id!,
          coverImg: i.informationCoverUrl,
          title: i.informationTitle,
          date: i.createTime || ''
        }))}
        cardContent={() => (<></>)}
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
      <CheckLogin onSuccess={getList} />
    </View>
  )
}

export default Index
