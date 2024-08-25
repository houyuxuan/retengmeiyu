import { Garden } from '@/types/index'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { systemImagePre } from '@/utils/constant'
import './index.scss'

function activityTypeList() {
  const activityType = [
    { title: '美术', id: Garden.ActivityType.Art, img: 'resourceBg.png' },
    { title: '音乐', id: Garden.ActivityType.Music, img: 'resourceBg.png' },
    { title: '戏剧', id: Garden.ActivityType.Theater, img: 'resourceBg.png' },
  ];
  return (
    <View className='activity-type-container'>
      {activityType.map(activity =>
        <View className='type-item' key={activity.id} onClick={() => Taro.navigateTo({ url: `/module/pages/garden-activity/index?id=${activity.id}&title=${encodeURIComponent(activity.title + '活动')}` })}>
          <Image className='type-img' src={`${systemImagePre}/gardenBg.png`} />
          <View className='type-name'>{activity.title}</View>
        </View>
      )}
    </View>
  );
}
export default activityTypeList