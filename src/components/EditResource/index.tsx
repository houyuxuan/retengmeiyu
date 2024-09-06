import React, { useEffect, useState } from 'react'
import { View, Input, Label, Textarea, Picker } from '@tarojs/components'
import { AtAccordion, AtButton, AtIcon, AtModal, AtMessage } from 'taro-ui'
import { Resource, ContentItem, FileType, IdType } from '@/types'
import Taro from '@tarojs/taro'
import FileUpload from '../FileUpload'
import { communityList } from '@/utils/constant'
import './index.scss'
import { getTagList } from '@/api/club'

export interface ArticleDetail {
  resourcesTitle: string;
  resourcesCoverUrl: string;
  resourcesDetails: ContentItem[];
  resourcesType?: number;
  clubId?: number;
  clubTagId?: IdType;
}

export default function EditArticle(props: {
  article?: ArticleDetail;
  onSave: (info: any) => any;
  hideDetail?: boolean;
  headerTitle?: string;
  titleText?: string
  hasVideo?: boolean
  hasAudio?: boolean
}) {
  const [article, setArticle] = useState(props.article || {
    resourcesTitle: '',
    resourcesCoverUrl: '',
    resourcesDetails: [],
  })

  const addContent = (type: ContentItem['type'], index) => {
    article.resourcesDetails.splice(index + 1, 0, {
      type,
      content: ''
    })
    setArticle({
      ...article,
    })
  }
  const [tags, setTags] = useState<Resource.Tag[]>([])
  const [tagIndex, setTagIndex] = useState<number>()
  const [clubIndex, setClubIndex] = useState<number>()

  const changeClub = (e) => {
      const index = +e.detail.value
      const clubNo = communityList[index].value
      setClubIndex(index)
      setArticle({
        ...article,
        clubId: clubNo
      } as any)
      getTags(clubNo)
  }
  const getTags = async (no) => {
    const { data } = await getTagList({ clubId: no })
    setTags(data);
  } 

  useEffect(() => {
    props.article && setArticle(props.article)
    if (props.article?.clubId) {
      const no = props.article?.clubId;
      const index = communityList.findIndex(i => i.value === no)
      setClubIndex(index)
      getTags(no)
    }
  }, [props.article])
  
  useEffect(() => {
    const no = communityList[clubIndex as number]?.value;
    if (no && props.article?.clubTagId) {
      const index = tags.findIndex(i => i.id === props.article?.clubTagId)
      setTagIndex(index)
    }
  }, [clubIndex, tags])

  useEffect(() => {
    if (props.headerTitle) {
      Taro.setNavigationBarTitle({
        title: props.headerTitle
      })
    }
  }, [props.headerTitle])

  const [contentCount, setCount] = useState([0, 0]) // [文字数, 图片数]

  useEffect(() => {
    if (article.resourcesDetails.length) {
      const textCount = article.resourcesDetails.filter(i => i.type === 'text').length
      setCount([textCount, article.resourcesDetails.length - textCount])
    }
  }, [article])

  const handleChange = (e: any) => {
    setArticle({
      ...article!,
      resourcesTitle: e.detail.value
    })
  }

  const handleContentChange = (e: any, index) => {
    article.resourcesDetails[index].content = e.detail.value
    setArticle({
      ...article
    })
  }

  const [showConfirm, setShowConfirm] = useState(false)

  const cancel = () => {
    setShowConfirm(true)
  }

  const handleSave = () => {
    if (!article.resourcesTitle) {
      Taro.atMessage({ type: 'warning', message: '请输入标题！' })
      return
    }
    if (!article.clubId) {
      Taro.atMessage({ type: 'warning', message: '请选择所属社团！' })
    }
    if (!article.resourcesCoverUrl) {
      Taro.atMessage({ type: 'warning', message: '请上传封面图！' })
      return
    }
    article.resourcesDetails = article.resourcesDetails.filter(i => !!i.content)
    if (!article.resourcesDetails.length) {
      Taro.atMessage({ type: 'warning', message: '请填写内容！' })
      return
    }
    if (!article.clubId) {
      Taro.atMessage({ type: 'warning', message: '请填写社团！' })
      return
    }
    // 资源类型
    article.resourcesType = article.clubId as number;
    props.onSave(article)
  }

  const getButtons = (index: number) => {
    return (
      <View className='btn-group'>
        {index > -1 && <AtIcon value='close' size={20} color='#333' className='minus-icon' onClick={() => {
          article.resourcesDetails.splice(index, 1)
          setArticle({
            ...article,
            resourcesDetails: article.resourcesDetails
          })
        }}
        />}
        <AtButton type='secondary' size='small' onClick={() => addContent('text', index)}>
          添加文本
        </AtButton>
        <AtButton type='secondary' size='small' onClick={() => addContent('image', index)}>
          添加图片/视频'
        </AtButton>
        {props.hasAudio && <AtButton type='secondary' size='small' onClick={() => addContent('audio', index)}>
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
              value={article.resourcesTitle}
              onInput={(text) => handleChange(text)}
            />
          </View>
          <View className='select-wrapper input-wrapper'>
            <Label className='required'>资源类型</Label>
            <Picker mode='selector' range={communityList} rangeKey='title' value={clubIndex} onChange={changeClub}
            >
              <Input
                value={(clubIndex || clubIndex === 0) ? communityList[clubIndex]?.title : ''}
                placeholder='请选择'
                disabled
              />
              <AtIcon value='chevron-right' size='20' color='#aaa'></AtIcon>
            </Picker>
          </View>
          {!!tags.length && (<View className='select-wrapper input-wrapper'>
              <Label className='required'>资源标签</Label>
              <Picker mode='selector' range={tags} rangeKey='clubTagName' value={tagIndex} onChange={e => {
                  const index = +e.detail.value
                  setTagIndex(index)
                  setArticle({
                    ...article,
                    clubTagId: tags[index].id
                  } as any)
                }}
              >
                <Input
                  value={(tagIndex || tagIndex === 0) ? tags[tagIndex]?.clubTagName : ''}
                  placeholder='请选择'
                  disabled
                />
                <AtIcon value='chevron-right' size='20' color='#aaa'></AtIcon>
              </Picker>
            </View>)
          }
          <View className='input-wrapper has-label'>
            <Label className='required'>封面上传</Label>
            <View className="tips">每张不超过10M</View>
            <FileUpload
              fileType={FileType.image}
              length={2}
              max={1}
              fileList={article.resourcesCoverUrl ? [{
                url:
                  article.resourcesCoverUrl, type: FileType.image
              }] : []}
              onUploadSuccess={
                res => setArticle({
                  ...article,
                  resourcesCoverUrl: res[0].url
                })
              }
            />
          </View>
        </View>
        {!props.hideDetail && (
          <View className='detail'>
            <AtAccordion
              title={`${article.resourcesTitle} 详细内容`}
              open
              note={props.article?.resourcesDetails.length ? `${contentCount[0]}段文字，${contentCount[0]}张图片` : ''}
            >
              {article.resourcesDetails.length ? (
                <View className='content-list'>
                  {article.resourcesDetails.map((item, idx) => (
                    item.type !== 'text' ? (
                      <View key={idx} className='edit-item img'>
                        <FileUpload
                          fileType={item.type === 'audio' ? FileType.audio : (props.hasVideo ? [FileType.image, FileType.video] : FileType.image)}
                          fileList={item.content ? [{ url: item.content, type: FileType[item.type] }] : []}
                          length={2}
                          max={1}
                          center
                          multiple
                          onUploadSuccess={url => {
                            const list = url.map(i => ({
                              type: FileType[i.type] as any,
                              content: i.url
                            }))
                            article.resourcesDetails.splice(idx, 1, ...list)
                            setArticle({
                              ...article,
                              resourcesDetails: [...article.resourcesDetails]
                            })
                          }}
                        />
                        {getButtons(idx)}
                      </View>
                    ) : (
                      <View className='edit-item text' key={idx}>
                        <Textarea placeholder='请输入内容，输入下一段内容请点击添加文本' maxlength={-1} value={item.content} onInput={e => handleContentChange(e, idx)} />
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
        <AtButton className='save-btn' onClick={() => handleSave()}>保存</AtButton>
      </View>
      <AtModal
        title='请确认'
        isOpened={showConfirm}
        cancelText='取消'
        confirmText='确认'
        content='取消后编辑的内容会丢失，是否确认？'
        onConfirm={() => { Taro.navigateBack() }}
        onCancel={() => setShowConfirm(false)}
      />
    </View>
  )
}
