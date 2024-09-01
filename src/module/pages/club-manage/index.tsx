import { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { ClubManage, PageParams, IdType } from '@/types'
import { AtMessage } from 'taro-ui'
import SearchAndAdd from '@/components/SearchAndAdd'
import { getClubList, clubDelete } from '@/api/club'
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

  const [clubList, setList] = useState<ClubManage.Club[]>([])

  const getList = () => {
    if (Taro.getStorageSync('userInfo')) {
      getClubList({
        searchKeyWord: keyword,
        ...page
      }).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...clubList, ...res.data.list])
      })
    }
  }
  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `../club-edit/index${id ? '?id=' + id : ''}`})
  }
  const deleteItem = (id: IdType) => {
    clubDelete({ id }).then(res => {
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
        addText='新增社团'
      />
      <ManageList
        list={clubList.map(i => ({
          ...i,
          id: i.id!,
          coverImg: i.clubCoverUrl,
          title: i.clubTitle,
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
