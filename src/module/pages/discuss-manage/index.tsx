import React, { useEffect, useState } from 'react'
import Taro, { useDidShow, useReachBottom } from '@tarojs/taro'
import { Image, Picker, Text, View } from '@tarojs/components'
import { AtActivityIndicator, AtButton, AtIcon, AtMessage, AtModal } from 'taro-ui'
import { discussDelete, getPostDiscuss } from '@/api'
import { Community, IdType, PageParams } from '@/types'
import moment from 'moment'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!
  const currId = +currPage.options.id
  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 20
  })


  const [dateRange, setDateRange] = useState<[string, string]>(['', ''])
  const [discussList, setList] = useState([] as Community.PostDiscussDetail[])
  const [total, setTotal] = useState(0)
  const getList = () => {
    getPostDiscuss({
      postId: currId,
      ...page,
      createTime: [
        dateRange[0] ? dateRange[0] + ' 00:00:00' : '',
        dateRange[1] ? dateRange[1] + ' 23:59:59' : '',
      ]
    }).then(res => {
      setTotal(res.data.total)
      setList([...discussList, ...res.data.list])
    })
  }

  const refresh = () => {
    setList([])
    setPage({
      ...page,
      pageNo: 1
    })
  }

  useEffect(refresh, [dateRange])

  useEffect(getList, [page])

  useDidShow(() => refresh())

  const [loading, setLoading] = useState(false)

  useReachBottom(() => {
    console.log('reach bottom')
    if (discussList.length < total) {
      setLoading(true)
      setPage({
        ...page,
        pageNo: page.pageNo + 1
      })
    }
  })

  const [deleteId, setDeleteId] = useState<IdType>()
  const [showConfirm, setShowConfirm] = useState(false)

  const cancel = () => {
    setShowConfirm(false)
  }

  const deleteItem = () => {
    discussDelete({ id: deleteId! }).then(res => {
      Taro.atMessage({
          type: 'success',
          message: res.msg
      })
      refresh()
    })
  }

  return (
    <View className='discuss-container'>
      <AtMessage />
      <View className='date-picker'>
        <Picker mode='date' className='picker' value={dateRange[0]} onChange={(e) => {
          setDateRange([e.detail.value, dateRange[1]])
        }}
        >
          <View className='start-date'>
            {dateRange[0]}
          </View>
        </Picker>
        <View className='split'>至</View>
        <Picker mode='date' className='picker' value={dateRange[1]} onChange={(e) => {
          setDateRange([dateRange[0], e.detail.value])
        }}
        >
          <View className='end-date'>
            {dateRange[1]}
          </View>
        </Picker>
        {(dateRange[0] || dateRange[1]) && <AtIcon value='close' size='12' color='#aaa' onClick={() => {
          setDateRange(['', ''])
        }}
        />}
      </View>
      <View className='discuss-list'>
        {discussList.length ? discussList.map((item, index) => (
          <View className='list-item' key={index}>
            <Image src={item.avatar} />
            <View className='text'>
              <View className='title'>
                <Text>{item.nickname}</Text>
                <Text className='date'>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
              </View>
              <View className='discuss-content'>
                {item.discussContent}
              </View>
            </View>
            <AtButton size="small" type='secondary' onClick={() => {
              setShowConfirm(true);
              setDeleteId(item.id)
              }}
            >
              删除
            </AtButton>
          </View>
        )) : <View className='empty'>无内容</View>}
        {loading && <AtActivityIndicator size={30} content='加载中...' />}
      </View>
      <AtModal
        title='请确认'
        isOpened={showConfirm}
        cancelText='取消'
        confirmText='确认'
        content='是否确认删除？'
        onConfirm={() => {
          deleteItem()
          cancel()
        }}
        onCancel={cancel}
      />
    </View>
  )
}

export default Index
