import React, { useEffect, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import Taro, { setStorageSync, useDidShow } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { systemImagePre } from '@/utils/constant'
import RtList from '@/components/RtList'
import { Article, InfoManage , ClubManage } from '@/types/index'
import { getClubList } from '@/api/club'
import { getInfoList } from '@/api/info'
import './index.scss'
import communityMusicImage from '../../assets/image/community_music.png'
import communityArtImage from '../../assets/image/community_art.png'
import communityTheaterImage from '../../assets/image/community_theater.png'


function Index() {
  const [articleList, setList] = useState<Article[]>([])
  const enterList = [{
    pagePath: '/systemPackage/pages/about-us/index',
    text: '关于我们',
    bg: 'aboutusBg.png',
    icon: 'aboutus.png'
  }, {
    pagePath: '/module/pages/garden/index',
    text: '美育花园',
    bg: 'gardenBg.png',
    icon: 'garden.png'
  }, {
    pagePath: '/module/pages/community/index',
    text: '美育论坛',
    bg: 'communityBg.png',
    icon: 'community.png'
  }, {
    pagePath: '/module/pages/resource/index',
    text: '美育资源',
    bg: 'resourceBg.png',
    icon: 'resource.png'
  }]

  useEffect(() => {
    Taro.getPrivacySetting({
      success: res => {
        if (res.needAuthorization) {
          // 需要弹出隐私协议
          // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
          // this.setData({
          //   showPrivacy: true
          // })
        } else {
          // getArticleList().then(res => {
          //   const { data } = res;
          //   if (data) {
          //     setList(data);
          //   }
          // })
          // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
          // wx.getUserProfile()
          // wx.chooseMedia()
          // wx.getClipboardData()
          // wx.startRecord()
        }
      },
      fail: () => {},
      complete: () => {}
    })
    // getClubList()
  }, [])
  useDidShow(() => {
    getClubStore()
    getArticleList()
  })
  const getContent = (details: string) => {
    try {
      return JSON.parse(details).filter(i => i.type === 'text').map(i => i.content).join('').slice(0, 40)
    } catch (error) {
      return ''
    }
  }
  const imgList = {
    美术: communityArtImage,
    音乐: communityMusicImage,
    戏剧: communityTheaterImage
  }
  const getClubStore = async () => {
    if (Taro.getStorageSync('userInfo')) {
      const result: { id: number, title: string, img: any }[] = []
      const idMap: { [key: string]: any } = {}
      await getClubList({
        pageNo: 1,
        pageSize: 100
      }).then(res => {
        const { data: { list = [] } } = res
        list.forEach((club: ClubManage.ClubDetail) => {
          result.push({
            id: club.id as number,
            title: club.clubTitle,
            img: imgList[club.clubTitle] || club.clubCoverUrl
          })
          idMap[club.clubTitle] = club.id;
        })
      })
      setStorageSync('clubList', result);
      setStorageSync('clubMap', idMap);
    }
  }
  const getArticleList = async () => {
    const { data: {list = []} } = await getInfoList({ pageNo: 1, pageSize: 5, searchKeyWord: '' })
    const result: Article[] = []
    list.forEach((a: InfoManage.InfoDetail) => {
      const { articleAddress = '', id = '', informationCoverUrl = '', informationDetails = '', informationTitle = '', date = '' } = a
      result.push({
        id,
        title: informationTitle,
        coverImg: informationCoverUrl,
        intro: getContent(informationDetails),
        url: articleAddress,
        date
      })
    })
    setList(result)
  }

  const rect = Taro.getMenuButtonBoundingClientRect()

  return (
    <View className='home-container' style={{ paddingTop: rect.top }}>
      <Image className='logo-top' mode='widthFix' src={`${systemImagePre}/logo-top.png`} />
      <View className="title">
        <Text>热腾美育</Text>
        <Image src={systemImagePre + '/banner.png'} />
      </View>
      <View className="enter-list">
        {
          enterList.map(item => (
            <View className='item' key={item.pagePath} onClick={() => Taro.navigateTo({ url: item.pagePath })}>
              <Image className='item-bg' src={`${systemImagePre}/${item.bg}`} />
              <View className='item-text'>
                <Image className='item-icon' src={`${systemImagePre}/${item.icon}`} />
                <Text className='text'>{item.text}</Text>
                <AtIcon value="chevron-right" size='20' color='#fff' />
              </View>
            </View>
          ))
        }
      </View>
      <View className='link'>
        <View className="link-title">资讯推荐</View>
          <RtList
            list={articleList}
            detailUrl='/systemPackage/pages/news/index'
            onLoading={() => null}
            total={articleList.length}
          />
      </View>
    </View>
  )
}

export default Index
