import React, { useEffect, useRef, useState } from 'react'
import Taro from '@tarojs/taro';
import { View, Image, Video } from '@tarojs/components'
import { AtIcon } from 'taro-ui';
import { qiniuUpload } from '@/api';
import { FileListItem, FileType } from '../../types';
import './index.scss'
import CustomAudio from '../CustomAudio';

interface IProps {
  multiple?: boolean;
  length: number;
  max?: number;
  fileList?: FileListItem[];
  center?: boolean;
  onUploadSuccess: (fileList: {
    url: string;
    type: FileType
  }[]) => void
  fileType: FileType | FileType[];
}

function Index(props: IProps) {
  const [showAddBtn, setShowAddBtn] = useState(true)

  const [fileList, setFiles] = useState<{
    url: string;
    type: FileType
  }[]>(props.fileList || [])

  const handleUploadFail = msg => {
    console.log(msg)
  }

  const ref = useRef<any>()

  const handleUpload = async (files: FileListItem[]) => {
    Promise.all(files.map(i => {
      return qiniuUpload({
        filePath: i.url,
        fileName: i.url.split('/').pop() || 'file',
        fileType: i.type
      }).then(res => {
        return {
          url: res.fileURL,
          type: i.type
        }
      })
    })).then(res => {
      props.onUploadSuccess(res)
    })
  }

  useEffect(() => {
    props.fileList && setFiles(props.fileList)
  }, [props.fileList])

  useEffect(() => {
    setShowAddBtn(fileList.length < (props.max || 1))
  }, [fileList, props.max])

  const [previewUrl, setPreviewUrl] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const onImageClick = (file) => {
    setPreviewUrl(file.url)
    setShowPreview(true)
  }

  const chooseFile = () => {
    if (props.fileType === FileType.audio) {
      Taro.chooseMessageFile({
        count: 1,
        type: 'file',
        success: res => {
          const list = res.tempFiles.map(i => ({
            url: i.path,
            type: FileType.audio
          }))
          setFiles(list)
          handleUpload(list)
        },
        fail: handleUploadFail
      })
    } else {
      Taro.chooseMedia({
        mediaType: props.fileType === FileType.image ? ['image'] : ['image', 'video'],
        count: props.multiple ? 9 : 1,
        maxDuration: 60,
        success: res => {
          const list = res.tempFiles.map(i => ({
            url: i.tempFilePath,
            type: FileType[i.fileType]
          }))
          setFiles(list)
          handleUpload(list)
        },
        fail: handleUploadFail
      })
    }
  }

  return (
    <View className='file-uploader'>
      <View>
        <View className={`file-list ${props.center ? ' center' : ''}`} ref={ref}>
          {fileList.map((item, index) => (
            <View className='file-item' key={item.url}>
              {item.type === FileType.image ? (
                <Image onClick={() => onImageClick(item)} src={item.url} mode='widthFix' />
              ) : item.type === FileType.video ? (
                <Video
                  src={item.url}
                  showFullscreenBtn={false}
                />
              ) : (
                <CustomAudio src={item.url} />
              )}
              <AtIcon value='close' size='10' color='#fff' onClick={() => {
                fileList.splice(index, 1)
                setFiles([...fileList])
              }}
              />
            </View>
          ))}
          {showAddBtn && (
            <View className='add-file' onClick={() => {chooseFile()}}>
              <View className='add-icon'></View>
              <View className='tip-text'>
                {props.fileType === FileType.audio ? '从聊天窗口中选择音频文件' : `选择图片${props.fileType instanceof Array ? '/视频' : ''}`}
              </View>
            </View>
          )}
        </View>
      </View>
      {showPreview && <View className='preview-content' onClick={() => setShowPreview(false)}>
        <View className='mask' />
        <Image className='preview-img' mode='widthFix'  src={previewUrl} />
      </View>}
    </View>
  )
}

export default Index
