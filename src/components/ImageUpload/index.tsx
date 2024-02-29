import React, { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import { AtImagePicker, AtMessage } from 'taro-ui'
import { uploadFile } from '@/api';
import { FileType } from '../../types';
import './index.scss'

interface IProps {
  multiple?: boolean;
  length: number;
  max?: number;
  fileList?: {
    url: string;
  }[];
  center?: boolean;
}

function Index(props: IProps) {
  const [showAddBtn, setShowAddBtn] = useState(true)

  const [fileList, setFiles] = useState<any[]>(props.fileList || [])

  const handleUploadFail = msg => {
    console.log(msg)
  }

  const handleImageChange = async (files: any[]) => {
    setFiles(files)

    uploadFile({
      filePath: files[files.length - 1].url,
      type: FileType.Image
    })
  }

  useEffect(() => {
    props.fileList && setFiles(props.fileList)
  }, [props.fileList])

  useEffect(() => {
    setShowAddBtn(fileList.length < (props.max || 1))
  }, [fileList, props.max])

  // useEffect(() => {
  //   Taro.cloud.getTempFileURL({
  //       fileList: fileList.map(i => i.url)
  //   }).then(res => {
  //       setFiles(res.fileList.map(i => ({
  //           url: i.tempFileURL
  //       })))
  //   }).catch(error => {
  //       console.error(222, error)
  //   })
  // }, [])

  const [previewUrl, setPreviewUrl] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const onImageClick = (index, file) => {
    setPreviewUrl(file.url)
    setShowPreview(true)
  }

  return (
    <View>
      <AtMessage />
      <View>
        <AtImagePicker
          length={props.length || 3}
          multiple={props.multiple}
          files={fileList}
          showAddBtn={showAddBtn}
          onChange={handleImageChange}
          onFail={handleUploadFail}
          onImageClick={onImageClick}
          className={props.center ? 'center' : ''}
        />
      </View>
      {showPreview && <View className='preview-content' onClick={() => setShowPreview(false)}>
        <View className='mask' />
        <Image className='preview-img' src={previewUrl} />
      </View>}
    </View>
  )
}

export default Index
