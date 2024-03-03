import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import {  PageParams } from '@/types'
import './index.scss'

function ManageList(props: {
    list: {
        title: string;
    }[];
    cardContent: (item) => ReactElement;
    btns: (item) => ReactElement;
}) {
  const [page, setPage] = useState<PageParams>({
    pageNo: 1,
    pageSize: 10
  })

  return (
      <View className='manage-list'>
        {props.list.length ? props.list.map((item, index) => (
          <AtCard
            key={index}
            title={item.title}
          >
            {props.cardContent(item)}
            <View className='btn-group'>
              {props.btns(item)}
            </View>
          </AtCard>
        )) : <View className='empty'>无内容</View>}
      </View>
  )
}

export default ManageList
