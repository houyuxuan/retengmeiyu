export default defineAppConfig({
   pages: [
    'pages/index/index',
    'pages/home/index',
    'pages/garden-school/index',
    'pages/community/index',
    'pages/resource/index',
    'pages/mine/index',
  ],
  subPackages: [
    {
      root: "module",
      pages: [
        'pages/garden-activity/index',
        'pages/resource-detail/index',
        'pages/resource-manage/index',
        'pages/resource-edit/index',
        'pages/about-us/index',
        'pages/about-us-detail/index',
        'pages/about-us-manage/index',
        'pages/about-us-edit/index',
        'pages/activity-detail/index',
        'pages/post-manage/index',
        'pages/post-edit/index',
        'pages/community-post-detail/index',
        'pages/community-discuss-post/index',
        'pages/school-manage/index',
        'pages/activity-manage/index',
        'pages/user-manage/index',
        'pages/user-info/index',
        'pages/activity-edit/index',
        'pages/school-edit/index',
        'pages/discuss-manage/index',
        'pages/admin-page/index'
      ],
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#000000',
    selectedColor: '#79A1EB',
    backgroundColor: '#fff',
    list: [{
      pagePath: 'pages/home/index',
      text: '首页',
      iconPath: './assets/icon/home.png',
      selectedIconPath: './assets/icon/home_selected.png'
    }, {
      pagePath: 'pages/garden-school/index',
      text: '花园',
      iconPath: './assets/icon/garden.png',
      selectedIconPath: './assets/icon/garden_selected.png'
    }, {
      pagePath: 'pages/community/index',
      text: '社区',
      iconPath: './assets/icon/community.png',
      selectedIconPath: './assets/icon/community_selected.png'
    }, {
      pagePath: 'pages/resource/index',
      text: '资源',
      iconPath: './assets/icon/resource.png',
      selectedIconPath: './assets/icon/resource_selected.png'
    }, {
      pagePath: 'pages/mine/index',
      text: '我的',
      iconPath: './assets/icon/mine.png',
      selectedIconPath: './assets/icon/mine_selected.png'
    }],
  },
  __usePrivacyCheck__: true,
})
