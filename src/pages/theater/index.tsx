import { useState } from 'react'
import { View } from '@tarojs/components'
import { getStorageSync, useDidShow } from '@tarojs/taro'
import ActivityPage from '../components/activityPage'

function Index() {

  const [clubId, setClub] = useState<number>(-1)
  useDidShow(() => {
    const list = getStorageSync('clubList')
    const artClub = (list || []).filter((item) => item.title === '戏剧')[0]
    setClub(artClub.id)
  })

  return (
    <View>
      <ActivityPage
        clubId={clubId}
        isArt={false}
      ></ActivityPage>
    </View>
  )
}

export default Index
