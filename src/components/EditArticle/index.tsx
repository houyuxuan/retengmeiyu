import React, { useEffect, useState } from 'react'
import { View, Input, Label, Textarea } from '@tarojs/components'
import { AtAccordion, AtButton, AtIcon, AtModal, AtMessage } from 'taro-ui'
import { ContentItem } from '@/types'
import Taro from '@tarojs/taro'
import ImageUpload from '../../components/ImageUpload'
import './index.scss'

export interface ArticleDetail {
  title: string;
  coverImg: string;
  detailList: ContentItem[];
  intro?: string;
}

export default function EditArticle(props: {
  article?: ArticleDetail;
  onSave: (info: any) => any;
  hideDetail?: boolean;
  headerTitle?: string;
  hasIntro?: boolean;
  titleText?: string
}) {
  const [article, setArticle] = useState(props.article || {
    title: '',
    coverImg: '',
    detailList: []
  })

  const [contentOpen, setContentOpen] = useState(true)

  const addContent = (type: 'text' | 'img' | 'video' | 'audio') => {
    setArticle({
      ...article,
      detailList: [
        ...article.detailList,
        {
          type,
          content: ''
        }
      ]
    })
  }

  useEffect(() => {
    if (props.headerTitle) {
      Taro.setNavigationBarTitle({
        title: props.headerTitle
      })
    }
  }, [props.headerTitle])

  const [contentCount, setCount] = useState([0, 0]) // [文字数, 图片数]

  useEffect(() => {
    props.article && setArticle(props.article)
    if (article.detailList.length) {
      const textCount = article.detailList.filter(i => i.type === 'text').length
      setCount([textCount, article.detailList.length - textCount])
    }
  }, [props.article])

  const handleChange = (e: any) => {
    setArticle({
      ...article!,
      title: e.detail.value
    })
  }

  const handleContentChange = (e: any, index) => {
    article.detailList[index].content = e.detail.value
    setArticle({
      ...article
    })
  }

  const [showConfirm, setShowConfirm] = useState(false)

  const cancel = () => {
    setShowConfirm(true)
  }

  const handleSave = () => {
    if (!article.title) {
      Taro.atMessage({type: 'warning', message: '请输入标题！'})
      return
    }
    if (props.hasIntro && !article.intro) {
      Taro.atMessage({type: 'warning', message: '请上传封面图！'})
      return
    }
    if (!props.hasIntro && !article.coverImg){
      Taro.atMessage({type: 'warning', message: '请上传封面图！'})
      return
    }
    article.detailList.filter(i => !!i.content)
    if (!article.detailList.length) {
      Taro.atMessage({type: 'warning', message: '请填写内容！'})
      return
    }
    props.onSave(article)
  }

  const getButtons = () => {
    return (
      <View className='btn-group'>
        <AtMessage />
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
      <AtMessage />
      <View className='content-wrapper'>
        <View className='info'>
          <View className='input-wrapper has-label required'>
            <Label>{props.titleText}</Label>
            <Input
              name='value1'
              type='text'
              placeholder={`请输入${props.titleText || '标题'}`}
              maxlength={20}
              value={article.title}
              onInput={(text) => handleChange(text)}
            />
          </View>
          {props.hasIntro ? (
            <View className='input-wrapper has-label required'>
              <Label>学校简介</Label>
              <Textarea
                value={article.intro}
                onInput={e => setArticle({...article, intro: e.detail.value})}
                placeholder='请输入学校简介'
              />
            </View>) : (
            <View className='input-wrapper has-label required'>
              <Label>封面图上传(每张不超过10M)</Label>
              <ImageUpload
                length={2}
                max={1}
                fileList={article.coverImg? [{ url: article.coverImg }] : []}
              />
            </View>)
          }
        </View>
        {!props.hideDetail && (
          <View className='detail'>
            <AtAccordion
              title={`${article.title}详细内容`}
              open={contentOpen}
              onClick={setContentOpen}
              note={props.article?.detailList.length ? `${contentCount[0]}段文字，${contentCount[0]}张图片` : ''}
            >
              {article.detailList.length ? (
                <View className='content-list'>
                  {article.detailList.map((item, idx) => (
                    item.type === 'img' ? (
                    <View key={idx} className='img'>
                      <ImageUpload fileList={[{ url: item.content }]} length={1} max={1} center multiple />
                      {getButtons()}
                    </View>
                    ) : (
                    <View key={idx}>
                      <Textarea value={item.content} onInput={e => handleContentChange(e, idx)} />
                      {getButtons()}
                    </View>
                    )
                  ))}
                </View>
              ) : (getButtons())}
            </AtAccordion>
          </View>
        )}
      </View>
      <View className='fixed-buttons'>
        <AtButton onClick={cancel}>取消</AtButton>
        <AtButton onClick={() => handleSave()}>保存</AtButton>
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
