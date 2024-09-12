import React from 'react'
import { WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'

function Index() {
    const currPage = Taro.getCurrentPages().pop()!

    const currId = +currPage.options.id
    return (
        <WebView src={String(currId)} />
    )
}

export default Index
