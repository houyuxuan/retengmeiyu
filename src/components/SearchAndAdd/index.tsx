import React, { useState } from "react";
import { Input, View } from "@tarojs/components";
import { AtIcon, AtButton } from "taro-ui";
import './index.scss'

export default function (props: {
  onConfirm?: (val: string) => any;
  onChange?: (val: string) => any;
  onAdd?: () => any;
  addText?: string;
}) {
  const [keyword, setKeyword] = useState('')
  const handleChange = (e: any) => {
      setKeyword(e.detail.value)
      props.onChange && props.onChange(e.detail.value)
  }
  return (
    <View className='form'>
      <View className='input-wrapper has-prefix'>
      <AtIcon value='search' size='20' color='#aaa' />
      <Input
        name='value'
        type='text'
        placeholder='请输入关键字搜索'
        value={keyword}
        onInput={(e) => handleChange(e)}
        onConfirm={(e) => props.onConfirm && props.onConfirm(e.detail.value)}
      />
      </View>
      {props.onAdd && <AtButton type='secondary' className="add-icon" onClick={() => props.onAdd!()} size='small'>
        <AtIcon value='add' size='30' color='#fff' />
      </AtButton>}
    </View>
  )
}
