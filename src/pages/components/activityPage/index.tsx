import { useEffect, useState } from 'react'
import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getSchoolActivity, } from '@/api'
import { Garden, PageParams, IdType } from '@/types'
import { gradeList, bookVolumesList } from '@/utils/constant'
import RtList from '@/components/RtList'
import filterIcon from '@/assets/icon/filter.png'
import CheckLogin from '@/components/CheckLogin'
import './index.scss'

function Index(props: {
  clubId: number;
  isArt: boolean;
}) {
  const [activityList, setList] = useState<Garden.ActivityDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)
  const [clubGradeId, setClubGradeId] = useState<IdType>() // 年级id
  const [clubGradeVolumeId, setClubGradeVolumeId] = useState<IdType>() // 上下册
  const [showFilter, setShowFilter] = useState(false)
  const getList = () => {
    if (Taro.getStorageSync('userInfo') && props.clubId !== -1) {
      const params: {schoolId?: IdType, clubId?: IdType, clubGradeId?: IdType, clubGradeVolumeId?: IdType, searchKeyWord?: string} & PageParams = {clubId: props.clubId, ...page};
      if (clubGradeId) params.clubGradeId = clubGradeId;
      if (clubGradeVolumeId) params.clubGradeVolumeId = clubGradeVolumeId;
      getSchoolActivity(params).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...activityList, ...res.data.list])
      })
    }
  }
  const handleGradeChange = (id) => {
    if (clubGradeId === id) {
      setClubGradeId('')
    } else {
      setClubGradeId(id)
    }
  }
  const handleVolumeChange = (id) => {
    if (clubGradeVolumeId === id) {
      setClubGradeVolumeId('')
    } else {
      setClubGradeVolumeId(id)
    }
  }
  const handleFilterClick = () => {
    setShowFilter(!showFilter)
    if (showFilter) {
      getList()
    }
  }
  const getIntroDetail = (details: string) => {
    try {
      return JSON.parse(details).filter(i => i.type === 'text').map(i => i.content).join('').slice(0, 40)
    } catch (error) {
      return ''
    }
  }
  useEffect(getList, [page, props.clubId])

  return (
    <View className={`activity-container ${props.isArt ? 'art' : ''}`}>
      {props.isArt && <View className="top-area">
        <View className='filter-wrapper'>
          <View className="filter-btn" onClick={handleFilterClick}>
            <Image mode="widthFix" className='img' src={filterIcon} />
            <View className="name">筛选</View>
          </View>
          {showFilter && (
            <View className='filter-content'>
              <View className='filter-title'>选择年级</View>
              <View className='select-list'>
                {gradeList.map(grade =>
                  (<Button className={`button ${clubGradeId === grade.value ? 'active': ''}`} onClick={() => handleGradeChange(grade.value)}>{grade.title}</Button>)
                )}
              </View>
              <View className='filter-title'>选择上下册</View>
              <View className="select-list">
                {bookVolumesList.map(volume =>
                  (<Button className={`button ${clubGradeVolumeId === volume.value ? 'active': ''}`} onClick={() => handleVolumeChange(volume.value)}>{volume.title}</Button>)
                )}
              </View>
            </View>
          )}
        </View>
        {showFilter && (
          <View className='mask'></View>
        )}
      </View>}
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
        detailUrl='/detailPackage/pages/activity-detail/index'
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
