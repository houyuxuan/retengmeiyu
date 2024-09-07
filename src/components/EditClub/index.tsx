import React, { useEffect, useState } from 'react'
import { View, Input, Label, Textarea } from '@tarojs/components'
import { AtAccordion, AtButton, AtIcon, AtModal, AtMessage } from 'taro-ui'
import { ClubManage, ContentItem, FileType, IdType } from '@/types'
import { addTagAPI, deleteTagAPI } from '@/api/club'
import Taro from '@tarojs/taro'
import FileUpload from '../FileUpload'
import './index.scss'

export interface ClubDetail {
  id: IdType;
  clubTitle: string;
  clubCoverUrl: string;
  clubId?: IdType;
  clubDetails: ContentItem[];
}
type Tags = ClubManage.Tag[];
export default function EditArticle(props: {
  article?: ClubDetail;
  onSave: (info: any) => any;
  headerTitle?: string;
  titleText?: string
  tagList?: Tags
}) {
  const [article, setArticle] = useState(props.article || {
    id: '',
    clubTitle: '',
    clubCoverUrl: '',
    clubDetails: [],
  })

  const [currentTag, setCurrentTag] = useState('')

  const [tagList, setTags] = useState<Tags>([])

  const addContent = (type: ContentItem['type'], index) => {
    article.clubDetails.splice(index + 1, 0, {
      type,
      content: ''
    })
    setArticle({
      ...article,
    })
  }

  const addTag = async () => {
    await addTagAPI({
      id: '',
      clubId: article.id,
      clubTagName: currentTag
    }).then(() => {
      tagList.push({
        id: '',
        clubId: article.id,
        clubTagName: currentTag
      })
      setTags(tagList)
      setCurrentTag('')
    })
    
  }
  const deleteTag = async (i) => {
    await deleteTagAPI({
      id: tagList[i].id as string
    }).then(() => {
      const list = [...tagList]
      list.splice(i, 1)
      setTags(list)
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
  }, [props.article])

  useEffect(() => {
    setTags(props.tagList || [])
  }, [props.tagList])

  useEffect(() => {
    if (article.clubDetails.length) {
      console.log('article.clubDetails', article.clubDetails)
      const textCount = article.clubDetails.filter(i => i.type === 'text').length
      setCount([textCount, article.clubDetails.length - textCount])
    }
  }, [article])

  const handleChange = (e: any) => {
    setArticle({
      ...article!,
      clubTitle: e.detail.value
    })
  }

  const tagchange = (e: any) => {
    setCurrentTag(e.detail.value)
  }

  const handleContentChange = (e: any, index) => {
    article.clubDetails[index].content = e.detail.value
    setArticle({
      ...article
    })
  }

  const [showConfirm, setShowConfirm] = useState(false)

  const cancel = () => {
    setShowConfirm(true)
  }

  const handleSave = () => {
    if (!article.clubTitle) {
      Taro.atMessage({ type: 'warning', message: '请输入标题！' })
      return
    }
    if (!article.clubCoverUrl) {
      Taro.atMessage({ type: 'warning', message: '请上传封面图！' })
      return
    }
    article.clubDetails = article.clubDetails.filter(i => !!i.content)
    props.onSave(article)
  }

  const getButtons = (index: number) => {
    return (
      <View className='btn-group'>
        {index > -1 && <AtIcon value='close' size={20} color='#333' className='minus-icon' onClick={() => {
          article.clubDetails.splice(index, 1)
          setArticle({
            ...article,
            clubDetails: article.clubDetails
          })
        }}
        />}
        <AtButton type='secondary' size='small' onClick={() => addContent('text', index)}>
          添加文本
        </AtButton>
        <AtButton type='secondary' size='small' onClick={() => addContent('image', index)}>
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
          <View className='input-wrapper has-label'>
            <Label className='required'>{props.titleText || '标题'}</Label>
            <Input
              name='value1'
              type='text'
              placeholder={`请输入${props.titleText || '标题'}`}
              maxlength={20}
              value={article.clubTitle}
              onInput={(text) => handleChange(text)}
            />
          </View>
          <View className='input-wrapper has-label'>
            <Label className='required'>封面上传</Label>
            <View className="tips">每张不超过10M</View>
            <FileUpload
              fileType={FileType.image}
              length={2}
              max={1}
              fileList={article.clubCoverUrl ? [{
                url:
                  article.clubCoverUrl, type: FileType.image
              }] : []}
              onUploadSuccess={
                res => setArticle({
                  ...article,
                  clubCoverUrl: res[0].url
                })
              }
            />
          </View>
          <View className='input-wrapper has-label'>
          <Label>资源标签</Label>
          <View className='tag-box'>
            {tagList.map(
              (tag, index) => (
                <View key={index} className="tag">
                  {tag.clubTagName}
                  <AtIcon className='delete-icon' value='close' size={14} color='#C0182F' onClick={() => deleteTag(index)} />
                </View>
              ) 
            )}
          </View>
          <View className="input-btn">
            <Input
              className='input'
              value={currentTag}
              type='text'
              placeholder='请输入'
              maxlength={10}
              onInput={(text) => tagchange(text)} />
              <View className={`abb-btn ${currentTag ? '' : 'disabled'}`} onClick={() => {
                currentTag && addTag()
              }}>新增</View>
            </View>
          </View>
        </View>
        
        <View className='detail'>
          <AtAccordion
            title={`${article.clubTitle} 详细内容`}
            open
            note={props.article?.clubDetails.length ? `${contentCount[0]}段文字，${contentCount[0]}张图片` : ''}
          >
            {article.clubDetails.length ? (
              <View className='content-list'>
                {article.clubDetails.map((item, idx) => (
                  item.type !== 'text' ? (
                    <View key={idx} className='edit-item img'>
                      <FileUpload
                        fileType={FileType.image}
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
                          article.clubDetails.splice(idx, 1, ...list)
                          setArticle({
                            ...article,
                            clubDetails: [...article.clubDetails]
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
