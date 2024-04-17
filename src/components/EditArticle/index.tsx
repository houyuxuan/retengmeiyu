import React, { useEffect, useState } from 'react'
import { View, Input, Label, Textarea, Picker } from '@tarojs/components'
import { AtAccordion, AtButton, AtIcon, AtModal, AtMessage } from 'taro-ui'
import { ContentItem, FileType, Garden } from '@/types'
import Taro from '@tarojs/taro'
import { getSchoolList } from '@/api'
import FileUpload from '../FileUpload'
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
  showSchoolSelect?: boolean
  hasVideo?: boolean
  hasAudio?: boolean
}) {
  const [article, setArticle] = useState(props.article || {
    title: '',
    coverImg: '',
    detailList: []
  })

  const [contentOpen, setContentOpen] = useState(true)

  const addContent = (type: ContentItem['type'], index) => {
    article.detailList.splice(index + 1, 0, {
      type,
      content: ''
    })
    setArticle({
      ...article,
    })
  }

  const [schoolIndex, setSchoolIndex] = useState<number>(-1)
  const [schoolList, setSchoolList] = useState<Garden.SchoolDetail[]>([])

  useEffect(() => {
    if (props.showSchoolSelect) {
      getSchoolList({
        pageNo: 1,
        pageSize: 100
      }).then(res => {
        setSchoolList(res.data.list)
      })
    }
  }, [props.showSchoolSelect])

  useEffect(() => {
    if ((props.article as any)?.schoolId) {
      const index = schoolList.findIndex(i => i.id === (props.article as any).schoolId)
      setSchoolIndex(index)
    }
  }, [schoolList, props.article])

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
  }, [props.article])

  useEffect(() => {
    if (article.detailList.length) {
      const textCount = article.detailList.filter(i => i.type === 'text').length
      setCount([textCount, article.detailList.length - textCount])
    }
  }, [article])

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
    if (props.showSchoolSelect && schoolIndex < 0) {
      Taro.atMessage({type: 'warning', message: '请选择所属学校！'})
    }
    if (props.hasIntro && !article.intro) {
      Taro.atMessage({type: 'warning', message: '请输入介绍！'})
      return
    }
    if (!article.coverImg){
      Taro.atMessage({type: 'warning', message: '请上传封面图！'})
      return
    }
    article.detailList = article.detailList.filter(i => !!i.content)
    if (!props.hasIntro && !article.detailList.length) {
      Taro.atMessage({type: 'warning', message: '请填写内容！'})
      return
    }
    props.onSave(article)
  }

  const getButtons = (index: number) => {
    return (
      <View className='btn-group'>
        {index > -1 && <AtIcon value='subtract' size={20} color='#fff' className='minus-icon' onClick={() => {
            article.detailList.splice(index, 1)
            setArticle({
              ...article,
              detailList: article.detailList
            })
          }}
        />}
        <AtButton type='secondary' size='small' onClick={() => addContent('text', index)}>
          <AtIcon value='add' size='16' />
          添加文本
        </AtButton>
        <AtButton type='secondary' size='small' onClick={() => addContent('image', index)}>
          <AtIcon value='edit' size='16' />
          添加图片{props.hasVideo && '/视频'}
        </AtButton>
        {props.hasAudio && <AtButton type='secondary' size='small' onClick={() => addContent('audio', index)}>
          <AtIcon value='file-audio' size='16' />
          添加音频
        </AtButton>}
      </View>
    )
  }

  return (
    <View className='edit-container'>
      <AtMessage />
      <View className='content-wrapper'>
        <View className='info'>
          <View className='input-wrapper has-label'>
            <Label className='required'>{props.titleText || '标题'}</Label>
            <Input
              name='value1'
              type='text'
              placeholder={`请输入${props.titleText || '标题'}`}
              maxlength={20}
              value={article.title}
              onInput={(text) => handleChange(text)}
            />
          </View>
          {props.showSchoolSelect && (
            <View className='select-wrapper'>
              <Label className='required'>学校</Label>
              <Picker mode='selector' range={schoolList} rangeKey='schoolName' value={schoolIndex} onChange={e => {
                const index = +e.detail.value
                setSchoolIndex(index)
                setArticle({
                  ...article,
                  schoolId: schoolList[index].id!
                } as any)
              }}
              >
                <Input
                  value={schoolList[schoolIndex]?.schoolName}
                  placeholder='请选择'
                  disabled
                />
                <AtIcon value='chevron-right' size='20' color='#aaa'></AtIcon>
              </Picker>
            </View>
          )}
          {props.hasIntro && (
            <View className='input-wrapper has-label'>
              <Label className='required'>学校简介</Label>
              <Textarea
                value={article.intro}
                onInput={e => setArticle({...article, intro: e.detail.value})}
                placeholder='请输入学校简介'
              />
            </View>)
          }
          <View className='input-wrapper has-label'>
            <Label className='required'>封面图上传(每张不超过10M)</Label>
            <FileUpload
              fileType={FileType.image}
              length={2}
              max={1}
              showClose
              fileList={article.coverImg? [{ url:
                  article.coverImg, type: FileType.image }] : []}
              onUploadSuccess={
                res => setArticle({
                  ...article,
                  coverImg: res[0].url
                })
              }
            />
          </View>
        </View>
        {!props.hideDetail && (
          <View className='detail'>
            <AtAccordion
              title={`${article.title} 详细内容`}
              open={contentOpen}
              onClick={setContentOpen}
              note={props.article?.detailList.length ? `${contentCount[0]}段文字，${contentCount[0]}张图片` : ''}
            >
              {article.detailList.length ? (
                <View className='content-list'>
                  {article.detailList.map((item, idx) => (
                    item.type !== 'text' ? (
                      <View key={idx} className='edit-item img'>
                        <FileUpload
                          fileType={item.type === 'audio' ? FileType.audio : (props.hasVideo ? [FileType.image, FileType.video] : FileType.image)}
                          fileList={item.content ? [{ url: item.content, type: FileType[item.type] }] : []}
                          length={1}
                          max={1}
                          center
                          multiple
                          showClose={false}
                          onUploadSuccess={url => {
                            const list = url.map(i => ({
                              type: FileType[i.type] as any,
                              content: i.url
                            }))
                            article.detailList.splice(idx, 1, ...list)
                            setArticle({
                              ...article,
                              detailList: [...article.detailList]
                            })
                          }}
                        />
                        {getButtons(idx)}
                      </View>
                    ) : (
                    <View className='edit-item text' key={idx}>
                      <Textarea maxlength={-1} value={item.content} onInput={e => handleContentChange(e, idx)} />
                      {getButtons(idx)}
                    </View>
                    )
                  ))}
                </View>
              ) : (getButtons(-1))}
            </AtAccordion>
          </View>
        )}
      </View>
      <View className='fixed-buttons'>
        <AtButton onClick={cancel}>取消</AtButton>
        <AtButton onClick={() => handleSave()}>保存</AtButton>
      </View>
      <AtModal
        title='请确认'
        isOpened={showConfirm}
        cancelText='取消'
        confirmText='确认'
        content='取消后编辑的内容会丢失，是否确认？'
        onConfirm={() => {Taro.navigateBack()}}
        onCancel={() => setShowConfirm(false)}
      />
    </View>
  )
}
