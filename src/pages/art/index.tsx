import { useEffect, useState } from 'react'
import { View, Image, Button } from '@tarojs/components'
import { getSchoolActivity, } from '@/api'
import { Garden, PageParams, IdType } from '@/types'
import { gradeList, bookVolumesList } from '@/utils/constant'
import RtList from '@/components/RtList'
import filterIcon from '@/assets/icon/filter.png'
// import CheckLogin from '@/components/CheckLogin'
import '@/module/pages/garden-activity/index.scss'

function Index() {
  const [activityList, setList] = useState<Garden.ActivityDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })
  
  const [total, setTotal] = useState(0)
  const clubId = Garden.ActivityType.Art
  const [cludGradeId, setCludGradeId] = useState<IdType[]>([]) // 年级id
  const [cludGradeVolumeId, setCludGradeVolumeId] = useState<IdType[]>([]) // 上下册
  const [showFilter, setShowFilter] = useState(false)
  const getList = () => {
    // if (Taro.getStorageSync('userInfo')) {
      const params: {schoolId?: IdType, clubId?: IdType, cludGradeId?: IdType[], cludGradeVolumeId?: IdType[], searchKeyWord?: string} & PageParams = {clubId, ...page};
      if (cludGradeId) params.cludGradeId = cludGradeId;
      if (cludGradeVolumeId) params.cludGradeVolumeId = cludGradeVolumeId;
      getSchoolActivity(params).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...activityList, ...res.data.list])
      })
    // }
  }
  const handleGradeChange = (id) => {
    if (cludGradeId.includes(id)) {
      const filterArray = cludGradeId.filter((grade) => grade !== id)
      setCludGradeId(filterArray)
    } else {
      const addArr = cludGradeId.concat([id])
      setCludGradeId(addArr)
    }
  }
  const handleVolumeChange = (id) => {
    if (cludGradeVolumeId.includes(id)) {
      const filterArray = cludGradeVolumeId.filter((volume) => volume !== id)
      setCludGradeVolumeId(filterArray)
    } else {
      const addArr = cludGradeVolumeId.concat([id])
      setCludGradeVolumeId(addArr)
    }
  }
  const handleFilterClick = () => {
    setShowFilter(!showFilter)
    if (showFilter) {
      getList()
    }
  }
  useEffect(getList, [page, clubId])

  return (
    <View className='activity-container art'>
      <View className="top-area">
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
                  (<Button className={`button ${cludGradeId.includes(grade.value) ? 'active': ''}`} onClick={() => handleGradeChange(grade.value)}>{grade.title}</Button>)
                )}
              </View>
              <View className='filter-title'>选择上下册</View>
              <View className="select-list">
                {bookVolumesList.map(volume => 
                  (<Button className={`button ${cludGradeVolumeId.includes(volume.value) ? 'active': ''}`} onClick={() => handleVolumeChange(volume.value)}>{volume.title}</Button>)
                )}
              </View>
            </View>
          )}
        </View>
        {showFilter && (
          <View className='mask'></View>
        )}
      </View>
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