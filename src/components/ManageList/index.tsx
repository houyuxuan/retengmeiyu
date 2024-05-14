import React, { ReactElement, useEffect, useState } from 'react'
import { Image, View } from '@tarojs/components'
import { AtActivityIndicator, AtButton, AtCard, AtModal } from 'taro-ui'
import {  IdType } from '@/types'
import { useReachBottom } from '@tarojs/taro'
import './index.scss'

function ManageList(props: {
    list: {
        title: string;
        id: IdType;
        coverImg: string
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

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [props.list, loading])

  return (
      <View className='manage-list'>
        {props.list.length ? props.list.map((item, index) => (
          <View className='manage-item' key={item.id} onClick={() => {
            if (props.previewFun) {
              props.previewFun(item.id)
            } else if (props.editFun) {
              props.editFun(item.id)
            }
          }}
          >
            <Image className='cover-img' src={item.coverImg} />
            <View className='title'>{item.title}</View>
            {props.cardContent(item)}
            {props.deleteFun && (
              <Image className='delete-btn' onClick={e => {
                e.stopPropagation()
                setShowConfirm(true);
                setDeleteId(item.id)
              }} src='https://media.retenggy.com/frontImages/delete-icon.png'
              />
            )}
            {props.otherBtn && <View className='btn-group'>
              {props.otherBtn.map((i, idx) => (
                <AtButton key={idx} size="small" type='secondary' onClick={(e) => {
                  e.stopPropagation()
                  i.fun(item, index)
                }}
                >
                  {i.text(item)}
                </AtButton>
              ))}
            </View>}
          </View>
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
