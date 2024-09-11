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

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const schoolId = +(currPage.options.id as string)
  const [activityList, setList] = useState<Garden.ActivityDetail[]>([])

  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })
  
  const [total, setTotal] = useState(0)
  const [clubId, setClubId] = useState(0)
  const [isArt, setIsArt] = useState(false)
  const [cludGradeId, setCludGradeId] = useState<IdType>() // 年级id
  const [cludGradeVolumeId, setCludGradeVolumeId] = useState<IdType>() // 上下册
  const [showFilter, setShowFilter] = useState(false)
  const getList = () => {
    if (Taro.getStorageSync('userInfo')) {
      const params: {schoolId?: IdType, clubId?: IdType, cludGradeId?: IdType, cludGradeVolumeId?: IdType, searchKeyWord?: string} & PageParams = {...page};
      if (schoolId) params.schoolId = schoolId;
      const club = clubId || Number(Taro.getCurrentInstance().router?.params.clubId);
      if (club) params.clubId = club
      if (cludGradeId) params.cludGradeId = cludGradeId;
      if (cludGradeVolumeId) params.cludGradeVolumeId = cludGradeVolumeId;
      getSchoolActivity(params).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...activityList, ...res.data.list])
      })
    }
  }
  const handleGradeChange = (id) => {
    if (cludGradeId === id) {
      setCludGradeId('')
    } else {
      setCludGradeId(id)
    }
  }
  const handleVolumeChange = (id) => {
    if (cludGradeVolumeId === id) {
      setCludGradeVolumeId('')
    } else {
      setCludGradeVolumeId(id)
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
  useEffect(getList, [page])
  useEffect(() => {
    // 假设你通过 URL 参数传递了标题、社团类型
    const titleParam = Taro.getCurrentInstance() && decodeURIComponent(Taro.getCurrentInstance().router?.params?.title || '')
    const clubIdParam = Taro.getCurrentInstance() && Taro.getCurrentInstance().router?.params.clubId
    if (clubIdParam) setClubId(Number(clubIdParam))
    if (titleParam) {
      // 设置导航栏标题
      Taro.setNavigationBarTitle({
        title: decodeURIComponent(`美育花园-${titleParam}`)
      });
      setIsArt(titleParam.indexOf('美术') !== -1)
    }
  }, []);

  return (
    <View className={`activity-container ${isArt ? 'art' : ''}`}>
      {isArt && (<View className="top-area">
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
                  (<Button className={`button ${cludGradeId === grade.value ? 'active': ''}`} onClick={() => handleGradeChange(grade.value)}>{grade.title}</Button>)
                )}
              </View>
              <View className='filter-title'>选择上下册</View>
              <View className="select-list">
                {bookVolumesList.map(volume => 
                  (<Button className={`button ${cludGradeVolumeId === volume.value ? 'active': ''}`} onClick={() => handleVolumeChange(volume.value)}>{volume.title}</Button>)
                )}
              </View>
            </View>
          )}
        </View>
        {showFilter && (
          <View className='mask'></View>
        )}
      </View>)}
      <RtList
        list={activityList.map(i => ({
          ...i,
          title: i.activityTitle,
          id: i.id!,
          coverImg: i.activityCoverUrl,
          date: i.createTime || '',
          intro: getIntroDetail(i.activityDetails),
          uvTotalCount: i.uvTotalCount
        }))}
        detailUrl='/module/pages/activity-detail/index'
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
