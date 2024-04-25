import React from 'react'
import { WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { linkList } from '@/utils/constant'

function Index() {
    const currPage = Taro.getCurrentPages().pop()!

    const currId = +currPage.options.id
    const currNews = linkList.find(i => i.id === currId)!
    return (
        <WebView src={currNews?.url} />
    )
}

export default Index
