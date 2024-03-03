import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Textarea, Label } from '@tarojs/components'
import { AtButton, AtMessage, AtTextarea } from 'taro-ui'
import { publishDiscuss } from '@/api'
import './index.scss'

function Index() {
  const currPage = Taro.getCurrentPages().pop()!

  const currId = currPage.options.id

  const [discuss, setDiscuss] = useState('')

  const handleInput = (val) => {
    setDiscuss(val)
  }

  const publish = () => {
    if (!discuss) {
        Taro.atMessage({ type: 'warning', message: '请填写内容！'})
        return false
    }
    publishDiscuss({
        postId: +currId,
        discussContent: discuss,
        memberUserId: 1,
    }).then(() => {
        Taro.atMessage({ type: 'success', message: '发布成功！' })
        Taro.navigateBack()
    })
  }

  return (
    <View className='discuss-container'>
        <AtMessage />
        <View className='input-wrapper has-label required'>
            <Label>标题</Label>
            <AtTextarea
              placeholder='请填写讨论内容'
              value={discuss}
              onChange={handleInput}
              maxLength={500}
              count
            />
        </View>
        <AtButton onClick={() => publish()}>提交</AtButton>
    </View>
  )
}

export default Index
