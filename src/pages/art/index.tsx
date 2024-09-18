import { useState } from 'react'
import { View } from '@tarojs/components'
import { getStorageSync, useDidShow } from '@tarojs/taro'
import ActivityPage from '../components/activityPage'

function Index() {

  const [clubId, setClub] = useState<number>(-1)
  useDidShow(async () => {
    const list = await getStorageSync('clubList')
    const artClub = (list || []).filter((item) => item.title === '美术')[0]
    setClub(artClub.id)
  })

  return (
    <View>
      <ActivityPage
        clubId={clubId}
        isArt
      ></ActivityPage>
    </View>
  )
}

export default Index
