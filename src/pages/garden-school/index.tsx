import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { getSchoolList } from '@/api'
import { Garden, PageParams } from '@/types'
import RtList from '@/components/RtList'

function Index() {
  const [schoolList, setList] = useState<Garden.SchoolDetail[]>([])
  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)

  const getList = () => {
    getSchoolList(page).then(res => {
      setTotal(res.data.total)
      setList([...schoolList, ...res.data.list])
    })
  }

  useEffect(getList, [page])

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
        detailUrl='../../module/pages/garden-activity/index'
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
