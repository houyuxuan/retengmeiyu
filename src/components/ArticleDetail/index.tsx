import React, { useEffect, useState } from 'react'
import { View, Image, Text, Video, Button } from '@tarojs/components'
import { ContentItem, IdType, UserManagement } from '@/types'
import { AtActivityIndicator, AtAvatar, AtButton } from 'taro-ui'
import moment from 'moment'
import Taro, { useDidShow } from '@tarojs/taro'
import CustomAudio from '@/components/CustomAudio'
import { downloadFile } from '@/utils/downloadFile'
import './index.scss'


export default function ArticleDetail(props: {
  detail?: {
    id: IdType;
    title: string;
    createTime: string;
    detailList: ContentItem[];
    uvTotalCount?: IdType | null
  };
  showTitle?: boolean;
  author?: UserManagement.UserInfo;
  editUrl?: string;
  hasPermission: boolean;
  getDetail: () => void
}) {
  const [titleVisible, setVisible] = useState(true)
  const [loading, setLoading] = useState(false)

  useDidShow(() => {
    props.getDetail()
  })

  useEffect(() => {
    if (props.showTitle === false) {
      setVisible(props.showTitle)
    }
  }, [props.showTitle])

  const previewImage = (url) => {  //这里获取到的是一张本地的图片
    Taro.previewImage({
      current: url,//需要预览的图片链接列表
      urls: [url],  //当前显示图片的链接
    })
  }

  return (
    <View className='detail-wrapper'>
      {props.detail?.id ? (
        <View className='detail'>
          {titleVisible && (<>
            <View className='title'>{props.detail.title}</View>
            {props.author ? (
              <View className="author">
                <AtAvatar circle image={props.author.avatar} size='small' />
                <Text className='nickname'>{props.author.nickname}</Text>
                <View className='date'>
                  {moment(props.detail.createTime).format('YYYY-MM-DD HH:mm')}
                </View>
              </View>
            ) : (
              <View className='date'>
              {moment(props.detail.createTime).format('YYYY-MM-DD HH:mm')}
              </View>
            )}
          </>)}
          <View className='content'>
            {props.detail?.detailList?.map((item, idx) => (
              item.type === 'image' ? (
                <View key={idx} className='img'>
                  <Image mode="widthFix" src={item.content} onClick={() => {props.hasPermission && previewImage(item.content)}} />
                </View>
              ) : item.type === 'video' ? (
                <View key={idx} className='img'>
                  <Video src={item.content} />
                  {props.hasPermission && <View className='download'>
                    <Button className='icon' size='mini' onClick={() => {
                      setLoading(true)
                      if (!loading)
                        downloadFile(item.content).finally(() => {
                          setLoading(false)
                        })
                      }
                    }
                    >下载</Button>
                  </View>}
                </View>
              ) : item.type === 'audio' ? (
                <CustomAudio src={item.content} hasPermission={props.hasPermission} />
              ) : (
                <View className='text' key={idx}>
                  {item.content}
                </View>
              )
            ))}
          </View>
          {props.editUrl && (
            <View className='btn-group'>
              <AtButton type='secondary' onClick={() => {
                Taro.navigateBack()
              }}
              >取消</AtButton>
              <AtButton type='primary' className='edit-btn' onClick={() => {
                Taro.navigateTo({
                  url: props.editUrl!
                })
              }}
              >编辑</AtButton>
            </View>
          )}
          {(props.detail.uvTotalCount  || props.detail.uvTotalCount === 0) && <View className='date'>
            访问量：{props.detail.uvTotalCount}
          </View>}
        </View>
      ) : (
        <View>
          <AtActivityIndicator size={50} content='加载中...' />
        </View>
      )}
      {loading && <AtActivityIndicator size={30} content='下载中...' />}
    </View>
  )
}
