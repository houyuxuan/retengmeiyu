import { useEffect, useState } from "react"
import { gardenTabList } from '@/utils/constant'
import { View } from "@tarojs/components"
import { AtTabs } from 'taro-ui'
import GardenSchoolList from '@/components/SchoolList'
import ActivityTypeList from '@/components/ActivityTypeList'

import './index.scss'

function Index() {
  const [currTab, setTab] = useState(0)
  const [pageView, setPageView] = useState<any>()
  
  
  const changeTab = () => {
    if (currTab === 0) {
      setPageView(<ActivityTypeList />)
    } else {
      setPageView(<GardenSchoolList />)
    }
    
  }
  useEffect(changeTab, [currTab])

  
  return (
    <View  className='garden-container'>
      <AtTabs
        current={currTab}
        tabList={gardenTabList}
        onClick={item => setTab(item)}
      />
      <View>
        {pageView}
      </View>
    </View>
  )
}

export default Index