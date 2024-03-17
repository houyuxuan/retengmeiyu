import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { getIntroList } from '@/api'
import { AboutUs, PageParams } from '@/types'
import RtList from '@/components/RtList'
import './index.scss'

function Index() {
  const [introList, setIntro] = useState<AboutUs.IntroDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)

  const getList = () => {
    getIntroList({
      searchKeyWord: '',
      ...page
    }).then(res => {
      setTotal(res.data.total)
      setIntro([
        ...introList,
        ...res.data.list
      ])
    })
  }

  useEffect(getList, [page])

  return (
    <View className='about-us'>
      <RtList
        list={introList.map(i => ({
          ...i,
          id: i.id!,
          coverImg: i.coverUrl,
          date: i.createTime || ''
        }))}
        detailUrl='/pages/about-us-detail/index'
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
