import { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import { getPostAdminList, getPostList, postDelete } from '@/api'
import { Community, IdType, PageParams } from '@/types'
import SearchAndAdd from '@/components/SearchAndAdd'
import ManageList from '@/components/ManageList'
import moment from 'moment'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const isAdmin = currPage.options.from === 'admin'

  const [keyword, setKeyword] = useState('');

  const [postList, setList] = useState<Community.PostDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)
  const getList = (pageParams?: PageParams) => {
    if (isAdmin) {
      getPostAdminList({
        searchKeyWord: keyword,
        ...page,
        ...pageParams
      }).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...postList, ...res.data.list])
      })
    } else {
      getPostList({
        searchKeyWord: keyword,
        ...page,
        ...pageParams
      }).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...postList, ...res.data.list])
      })
    }
  }

  const refresh = () => {
    setList([])
    setPage({
      ...page,
      pageNo: 1
    })
  }
  useEffect(getList, [page])

  useEffect(() => {
    refresh()
  }, [keyword])

  useDidShow(() => refresh())

  const goEdit = (id?: IdType) => {
    Taro.navigateTo({url: `../post-edit/index${id ? '?id=' + id : ''}`})
  }

  const deleteItem = (id: IdType) => {
    postDelete({ id }).then(res => {
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
        addText='发布新贴'
      />
      <ManageList
        list={postList.map(i => ({
            ...i,
            id: i.id,
            title: i.postTitle,
            coverImg: i.postCoverUrl
        }))}
        cardContent={(item: Community.PostDetail) => (<>
          <View>创建时间：{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</View>
        </>)}
        editFun={goEdit}
        deleteFun={deleteItem}
        otherBtn={isAdmin ? [{
          text: () => '讨论管理',
          fun(item) {
            Taro.navigateTo({url: `../discuss-manage/index?id=${item.id}`})
          }
        }] : undefined}
        total={total}
        onLoading={() => {
          setPage({
            ...page,
            pageNo: page.pageNo + 1
          })
        }}
      />
    </View>
  )
}

export default Index
