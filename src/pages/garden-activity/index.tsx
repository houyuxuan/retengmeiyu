import React, { useEffect, useState } from 'react'
import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getSchoolActivity, } from '@/api'
import { Garden, PageParams } from '@/types'
import RtList from '@/components/RtList'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const schoolId = +(currPage.options.id as string)

  const [schoolList, setList] = useState<Garden.ActivityDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 10
  })

  const getList = () => {
    getSchoolActivity({ schoolId, ...page }).then(res => {
      setList(res.data.schoolActivityList)
    })
  }

  useEffect(getList, [])

  return (
    <View className='activity-container'>
      <RtList
        list={schoolList.map(i => ({
          ...i,
          title: i.activityTitle,
          id: i.id!,
          coverImg: i.activityCoverUrl,
          date: i.createTime || ''
        }))}
        detailUrl='/pages/activity-detail/index'
      />
      {/* <Button onClick={() => Taro.navigateTo({url: '/pages/about-us-manage/index'})}>管理</Button> */}
    </View>
  )
}

export default Index
