import { Garden } from '@/types/index'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import communityMusicImage from '../../assets/image/community_music.png';
import communityArtImage from '../../assets/image/community_art.png';
import communityTheaterImage from '../../assets/image/community_theater.png';
import './index.scss'

function activityTypeList() {
  const activityType = [
    { title: '美术', id: Garden.ActivityType.Art, img: communityArtImage },
    { title: '音乐', id: Garden.ActivityType.Music, img: communityMusicImage },
    { title: '戏剧', id: Garden.ActivityType.Theater, img: communityTheaterImage },
  ];
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