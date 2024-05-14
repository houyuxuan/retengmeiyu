import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { getScoreDetail } from '@/api'
import { UserManagement } from '@/types'
import Taro, { useReachBottom } from '@tarojs/taro'
import { AtActivityIndicator } from 'taro-ui'
import moment from 'moment'
import './index.scss'

function Index() {
  const [scoreList, setList] = useState<UserManagement.ScoreDetail[]>([])
  const [total, setTotal] = useState(0)

  const totalScore = Taro.getStorageSync('myScore')
  const [page, setPage] = useState({
    pageNo: 1,
    pageSize: 20
  })

  const getList = () => {
    getScoreDetail(page).then(res => {
      setTotal(res.data.total)
      setList(page.pageNo === 1 ? res.data.list : [...scoreList, ...res.data.list])
      setLoading(false)
    })
  }

  useEffect(() => {
    getList()
  }, [page])

  const [loading, setLoading] = useState(false)
  useReachBottom(() => {
    console.log('reach bottom')
    if (scoreList.length < total) {
      setLoading(true)
      setPage({
        ...page,
        pageNo: page.pageNo + 1
      })
    }
  })

  return (
    <View className='score-container'>
      <View className="title">
        总积分：
        <Text className='number'>{totalScore}</Text>
      </View>
      <View className="list">
        {scoreList.map(item => (
          <View className="score-item" key={item.id}>
            <View>{item.creditSourceDesc}</View>
            <View className='activity'>{item.sourceTitle}</View>
            <View>{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</View>
            <View className='number'>{item.creditValue}</View>
          </View>
        ))}
        {loading && <AtActivityIndicator size={30} content='加载中...' />}
      </View>
    </View>
  )
}

export default Index
