import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { getSchoolList } from '@/api'
import { Garden, PageParams, UserManagement } from '@/types'
import RtList from '@/components/RtList'
import CheckLogin from '@/components/CheckLogin'
import Taro from '@tarojs/taro'
import './index.scss'

function Index() {
  const [schoolList, setList] = useState<Garden.SchoolDetail[]>([])
  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })

  const [total, setTotal] = useState(0)
  const [userInfo, setUserInfo] = useState<any>()

  useEffect(() => {
    setUserInfo(Taro.getStorageSync('userInfo'))
  }, [])

  const getList = () => {
    if (Taro.getStorageSync('userInfo')) {
      setUserInfo(userInfo)
      getSchoolList(page).then(res => {
        setTotal(res.data.total)
        setList(page.pageNo === 1 ? res.data.list : [...schoolList, ...res.data.list])
      })
    }
  }

  useEffect(getList, [page])

  return (
    <View className='school-container'>
      {userInfo?.roleCode !== UserManagement.RoleCodeEnum.SuperAdmin ? (
        <RtList
          list={schoolList.map(i => ({
            ...i,
            title: i.schoolName,
            coverImg: i.schoolLogoUrl,
            id: i.id!,
            date: i.createTime || '',
            intro: i.schoolIntroduction
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
      ) : (
        '无权限'
      )}
      <CheckLogin onSuccess={getList} />
    </View>
  )
}

export default Index
