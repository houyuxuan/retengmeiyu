export default defineAppConfig({
   pages: [
    'pages/index/index',
    'pages/home/index',
    'pages/garden/index',
    'pages/community/index',
    'pages/resource/index',
    'pages/mine/index',
    'pages/about-us/index',
    'pages/about-us-detail/index',
    'pages/about-us-manage/index',
    'pages/about-us-edit/index',
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
      pagePath: 'pages/about-us/index',
      text: '关于我们'
    }, {
      pagePath: 'pages/mine/index',
      text: '我的'
    }],
  },
})
