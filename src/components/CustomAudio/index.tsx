import React, { useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro'
import { View, Text } from "@tarojs/components";
import { AtIcon } from 'taro-ui';
import './index.scss'

function CustomAudio(props: {
  src: string;
}) {
  const audioCtx = useRef<any>();

  const [audioImg, setAudioImg] = useState<'loading' | 'play' | 'pause'>('loading')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0) // 总时长

  useEffect(() => {
    audioCtx.current = Taro.createInnerAudioContext()
    audioCtx.current.src = props.src
    // 当播放的时候通过TimeUpdate的回调去更改当前播放时长和总时长（总时长更新放到onCanplay回调中会出错）
    audioCtx.current.onTimeUpdate(() => {
      if (audioCtx.current.currentTime > 0 && audioCtx.current.currentTime <= 1) {
        setCurrentTime(1)
      } else if (audioCtx.current.currentTime !== Math.floor(audioCtx.current.currentTime)) {
        setCurrentTime(Math.floor(audioCtx.current.currentTime))
      }
      const tempDuration = Math.ceil(audioCtx.current.duration)
      if (duration !== tempDuration) {
        setDuration(tempDuration)
      }
      console.log('onTimeUpdate')
    })
    // 当音频可以播放就将状态从loading变为可播放
    audioCtx.current.onCanplay(() => {
      if (audioImg === 'loading') {
        setAudioImg('play')
        console.log('onCanplay')
      }
    })
    // 当音频在缓冲时改变状态为加载中
    audioCtx.current.onWaiting(() => {
      if (audioImg !== 'loading') {
        setAudioImg('loading')
      }
    })
    // 开始播放后更改图标状态为播放中
    audioCtx.current.onPlay(() => {
      console.log('onPlay')
      setAudioImg('pause')
    })
    // 暂停后更改图标状态为暂停
    audioCtx.current.onPause(() => {
      console.log('onPause')
      setAudioImg('play')
    })
    // 播放结束后更改图标状态
    audioCtx.current.onEnded(() => {
      console.log('onEnded')
      if (audioImg !== 'play') {
        setAudioImg('play')
      }
    })
    // 音频加载失败时 抛出异常
    audioCtx.current.onError((e) => {
      Taro.showToast({
        title: '音频加载失败',
        icon: 'none'
      })
      throw new Error(e.errMsg)
    })

    return () => {
      audioCtx.current.stop()
      audioCtx.current.destroy()
    }
  }, [props.src])

  // 播放或者暂停
  const playOrStopAudio = () => {
    if (audioCtx.current.paused) {
      audioCtx.current.play()
    } else {
      audioCtx.current.pause()
    }
  }

  const fmtSecond = (time: number) => {
    let hour = 0
    let min = 0
    let second = 0
   	if (typeof time !== 'number') {
   	  throw new TypeError('必须是数字类型')
	  } else {
        hour = Math.floor(time / 3600) >= 0 ? Math.floor(time / 3600) : 0;
        min = Math.floor(time % 3600 / 60) >= 0 ? Math.floor(time % 3600 / 60) : 0;
        second = Math.floor(time % 3600 % 60) >=0 ? Math.floor(time % 3600 % 60) : 0
	  }
    return `${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${second < 10 ? '0' + second : second}`
  }

  return (
    <View className='custom-audio'>
        <AtIcon className='audio-btn' onClick={() => playOrStopAudio()} value={audioImg} size={20} color="#78A4F4" />
      <View className='process-bar'>
        <View className='process-inner' style={{
          width: `${currentTime / duration}%`
        }}
        ></View>
      </View>
      <Text>{fmtSecond(Math.floor(currentTime))}/{fmtSecond(Math.floor(duration))}</Text>
    </View>
  )
}

export default CustomAudio