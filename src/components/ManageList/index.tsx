import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { AtActivityIndicator, AtButton, AtCard, AtModal } from 'taro-ui'
import {  IdType } from '@/types'
import { useReachBottom } from '@tarojs/taro'
import './index.scss'

function ManageList(props: {
    list: {
        title: string;
        id: IdType;
    }[];
    cardContent: (item) => ReactElement;
    deleteFun?: (id: IdType) => void;
    previewFun?: (id: IdType) => void;
    editFun?: (id: IdType) => void;
    otherBtn?: {
      text: ((item?: any) => string);
      fun(item, index): void
    }[];
    onLoading(): void;
    total: number
}) {
  const [deleteId, setDeleteId] = useState<IdType>()
  const [showConfirm, setShowConfirm] = useState(false)

  const cancel = () => {
    setShowConfirm(false)
  }

  const [loading, setLoading] = useState(false)

  useReachBottom(() => {
    console.log('reach bottom')
    if (props.list.length < props.total) {
      setLoading(true)
      props.onLoading()
    }
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
              {props.editFun && <AtButton size="small" type='secondary' onClick={() => props.editFun && props.editFun(item.id)}>
                编辑
              </AtButton>}
              {props.previewFun && <AtButton size="small" type='secondary' onClick={() => props.previewFun && props.previewFun(item.id)}>
                预览
              </AtButton>}
              {props.deleteFun && (
                <AtButton size="small" type='secondary' onClick={() => {
                  setShowConfirm(true);
                  setDeleteId(item.id)
                  }}
                >
                  删除
                </AtButton>
              )}
              {props.otherBtn?.map((i, idx) => (
                <AtButton key={idx} size="small" type='secondary' onClick={() => i.fun(item, index)}>
                  {i.text(item)}
              </AtButton>
              ))}
            </View>
          </AtCard>
        )) : <View className='empty'>无内容</View>}
        {loading && <AtActivityIndicator size={30} content='加载中...' />}
        <AtModal
          title='请确认'
          isOpened={showConfirm}
          cancelText='取消'
          confirmText='确认'
          content='是否确认删除？'
          onConfirm={() => {
            props.deleteFun && props.deleteFun(deleteId!)
            cancel()
          }}
          onCancel={cancel}
        />
      </View>
  )
}

export default ManageList
