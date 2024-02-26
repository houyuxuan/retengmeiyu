import React, { useEffect, useState } from 'react'
import { View, Image, Input, Label, Textarea } from '@tarojs/components'
import { AtCard, AtAccordion, AtButton, AtIcon, AtModal, AtMessage } from 'taro-ui'
import { AboutUs } from 'types'
import { getIntroDetail, introEdit } from '@/api'
import Taro from '@tarojs/taro'
import ImageUpload from '../../components/ImageUpload'
import './index.scss'

function Index() {
  const route = Taro.getCurrentPages().pop()!

  const currId = route.options.id
  const [detail, setDetail] = useState<AboutUs.IntroDetail>({
    title: '',
    coverImg: '',
    detailList: [],
  })

  const getDetail = () => {
    if (currId) {
      getIntroDetail({
        id: +currId
      }).then(res => {
        setDetail(res.data)
      })
    }
  }

  useEffect(() => {
    currId && getDetail()
  }, [currId])

  const [contentOpen, setContentOpen] = useState(false)

  const addContent = (type: 'text' | 'img') => {
    setDetail({
      ...detail,
      detailList: [
        ...detail.detailList,
        {
          type,
          content: ''
        }
      ]
    })
  }

  const [contentCount, setCount] = useState([1, 0]) // [文字数, 图片数]

  useEffect(() => {
    if (detail.detailList.length) {
      const textCount = detail.detailList.filter(i => i.type === 'text').length
      setCount([textCount, detail.detailList.length - textCount])
    }
  }, [detail])

  const handleChange = (e: any) => {
    setDetail({
      ...detail!,
      title: e.detail.value
    })
  }

  const [showConfirm, setShowConfirm] = useState(false)

  const save = async () => {
    await introEdit(detail)
    Taro.atMessage({
      message: '保存成功',
      type: 'success',
    })
  }

  const cancel = () => {
    setShowConfirm(true)
  }

  const getButtons = () => {
    return (
      <View className='btn-group'>
        <AtButton type='secondary' size='small' onClick={() => addContent('text')}>
          <AtIcon value='add' size='16' />
          添加文本
        </AtButton>
        <AtButton type='secondary' size='small' onClick={() => addContent('img')}>
          <AtIcon value='edit' size='16' />
          添加图片
        </AtButton>
      </View>
    )
  }

  return (
    <View className='edit-container'>
      <View className='content-wrapper'>
        <View className='info'>
          <View className='input-wrapper has-label required'>
            <Label>标题</Label>
            <Input
              name='value1'
              type='text'
              placeholder='输入介绍'
              maxlength={20}
              value={detail?.title}
              onInput={(text) => handleChange(text)}
            />
          </View>
          <View className='input-wrapper has-label required'>
            <Label>封面图上传(每张不超过10M)</Label>
            <ImageUpload
              length={3}
              max={1}
            />
          </View>
        </View>
        <View className='detail'>
          <AtAccordion
            title={`${detail.title}详细内容`}
            open={contentOpen}
            onClick={setContentOpen}
            note={`${contentCount[0]}段文字，${contentCount[0]}张图片`}
          >
            <View className='content-list'>
              {detail.detailList.map((item, idx) => (
                item.type === 'img' ? (
                  <View key={idx} className='img'>
                    <ImageUpload fileList={[{ url: item.content }]} length={2} max={1} center multiple />
                    {getButtons()}
                  </View>
                ) : (
                  <View key={idx}>
                    <Textarea value={item.content} />
                    {getButtons()}
                  </View>
                )
              ))}
            </View>
          </AtAccordion>
        </View>
      </View>
      <View className='fixed-buttons'>
        <AtButton onClick={cancel}>取消</AtButton>
        <AtButton onClick={save}>保存</AtButton>
      </View>
      <AtModal
        isOpened={showConfirm}
        cancelText='取消'
        confirmText='确认'
        content='取消后编辑的内容会丢失，是否确认？'
        onConfirm={() => {Taro.navigateBack()}}
        onCancel={() => setShowConfirm(false)}
      >
      </AtModal>
    </View>
  )
}

export default Index
