import { useState } from 'react'
import Taro, { getStorageSync } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

function activityTypeList() {
  
  const activityType = getStorageSync('clubList')

  return (
    <View className='activity-type-container'>
      {activityType.map(activity =>
        <View className='type-item' key={activity.id} onClick={() => Taro.navigateTo({ url: `/module/pages/garden-activity/index?clubId=${activity.id}&title=${encodeURIComponent(activity.title + '活动')}` })}>
          <Image mode="widthFix" style="width: 100%;" src={activity.img} />
        </View>
      )}
    </View>
  );
}
export default activityTypeList