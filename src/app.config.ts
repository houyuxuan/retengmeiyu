export default defineAppConfig({
   pages: [
    'pages/index/index',
    'pages/home/index',
    'pages/garden-school/index',
    'pages/garden-activity/index',
    'pages/community/index',
    'pages/resource/index',
    'pages/mine/index',
    'pages/about-us/index',
    'pages/about-us-detail/index',
    'pages/about-us-manage/index',
    'pages/about-us-edit/index',
    'pages/activity-detail/index',
    'pages/community-post-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#000000',
    selectedColor: '#000000',
    backgroundColor: '#fff',
    list: [{
      pagePath: 'pages/home/index',
      text: '首页',
      // iconPath: 'home'
    }, {
      pagePath: 'pages/garden-school/index',
      text: '花园'
    }, {
      pagePath: 'pages/community/index',
      text: '社区'
    }, {
      pagePath: 'pages/resource/index',
      text: '资源'
    }, {
      pagePath: 'pages/mine/index',
      text: '我的'
    }],
  },
})
