import { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { getSchoolActivity, } from '@/api'
import { Garden, PageParams, IdType } from '@/types'
import RtList from '@/components/RtList'
import Taro from '@tarojs/taro'
import CheckLogin from '@/components/CheckLogin'
import '@/module/pages/garden-activity/index.scss'

function Index() {
  const [activityList, setList] = useState<Garden.ActivityDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })
  
  const [total, setTotal] = useState(0)
  const clubId = Garden.ActivityType.Theater
  const getList = () => {
    if (Taro.getStorageSync('userInfo')) {
      const params: {schoolId?: IdType, clubId?: IdType, cludGradeId?: IdType, cludGradeVolumeId?: IdType, searchKeyWord?: string} & PageParams = {clubId, ...page};
      getSchoolActivity(params).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...activityList, ...res.data.list])
      })
    }
  }
  const getIntroDetail = (details: string) => {
    try {
      return JSON.parse(details).filter(i => i.type === 'text').map(i => i.content).join('').slice(0, 40)
    } catch (error) {
      return ''
    }
  }
  useEffect(getList, [page, clubId])

  return (
    <View className='activity-container'>
      <RtList
        list={activityList.map(i => ({
          ...i,
          title: i.activityTitle,
          id: i.id!,
          coverImg: i.activityCoverUrl,
          date: i.createTime || '',
          intro: getIntroDetail(i.activityDetails),
          uvTotalCount: i?.uvTotalCount
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
      <CheckLogin onSuccess={getList} />
    </View>
  )
}

export default Index