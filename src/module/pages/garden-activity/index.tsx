import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getSchoolActivity, } from '@/api'
import { Garden, PageParams } from '@/types'
import RtList from '@/components/RtList'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const schoolId = +(currPage.options.id as string)

  const [activityList, setList] = useState<Garden.ActivityDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)

  const getList = () => {
    getSchoolActivity({ schoolId, ...page }).then(res => {
      setTotal(res.data.total)
      setList([...activityList,...res.data.list])
    })
  }

  useEffect(getList, [page])

  return (
    <View className='activity-container'>
      <RtList
        list={activityList.map(i => ({
          ...i,
          title: i.activityTitle,
          id: i.id!,
          coverImg: i.activityCoverUrl,
          date: i.createTime || ''
        }))}
        detailUrl='../activity-detail/index'
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
