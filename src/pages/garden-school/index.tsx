import React, { useEffect, useState } from 'react'
import { View, Button } from '@tarojs/components'
import { getSchoolList } from '@/api'
import { Garden } from '@/types'
import RtList from '@/components/RtList'
import './index.scss'

function Index() {
  const [schoolList, setList] = useState<Garden.SchoolDetail[]>([])

  const getList = () => {
    getSchoolList().then(res => {
      setList(res.data.schoolList)
    })
  }

  useEffect(getList, [])

  return (
    <View className='school-container'>
      <RtList
        list={schoolList.map(i => ({
          ...i,
          title: i.schoolName,
          coverImg: i.schoolLogoUrl,
          id: i.id!,
          date: i.createTime || ''
        }))}
        detailUrl='/pages/garden-activity/index'
      />
      {/* <Button onClick={() => Taro.navigateTo({url: '/pages/about-us-manage/index'})}>管理</Button> */}
    </View>
  )
}

export default Index
