import { Resource, Garden, UserManagement } from "@/types";

export const systemImagePre = 'https://media.retenggy.com/frontImages'
export const resourceTabList = [{
  title: '全部',
  value: Resource.ResourceType.All
}, {
  title: '戏剧素材',
  value: Resource.ResourceType.Theater
}, {
  title: '音乐素材',
  value: Resource.ResourceType.Music
}, {
  title: '美术素材',
  value: Resource.ResourceType.Art
}]

export const communityList = [
  {
    title: '戏剧',
    value: Garden.ActivityType.Theater,
    checked: false
  }, {
    title: '音乐',
    value: Garden.ActivityType.Music,
    checked: false
  }, {
    title: '美术',
    value: Garden.ActivityType.Art,
    checked: false
  }
]

export const gardenTabList = [{
  title: '美育活动',
  value: Garden.GardenType.ACTIVITY,
}, {
  title: '项目学校',
  value: Garden.GardenType.SCHOOL
}]

export const userTabList = [{
  title: '全部',
  value: UserManagement.UserStatusEnum.All
}, {
  // TODO: 这里需要传递角色参数, 而不是用户状态参数
    title: '管理员',
    value: UserManagement.UserStatusEnum.Normal
  }, {
    title: '老师',
    value: UserManagement.UserStatusEnum.Disabled
  }
// {
//   title: '正常',
//   value: UserManagement.UserStatusEnum.Normal
// }, {
//   title: '禁用',
//   value: UserManagement.UserStatusEnum.Disabled
// }
]

export const gradeList = [
  { title: '一年级', value: 1 },
  { title: '二年级', value: 2 },
  { title: '三年级', value: 3 },
  { title: '四年级', value: 4 },
  { title: '五年级', value: 5 },
  { title: '六年级', value: 6 }
]

export const bookVolumesList = [
  { title: '上册', value: 1 },
  { title: '下册', value: 2 },
]

export const menuInfoMap = {
  '发布活动': {
      icon: '/activity-add.png',
      path: '/pages/activity-manage/index'
  },
  '关于我们管理': {
      icon: '/aboutus-manage-icon.png',
      path: '/pages/about-us-manage/index'
  },
  '发布资源': {
      icon: '/resource-add.png',
      path: '/pages/resource-manage/index'
  },
  '发布帖子': {
      icon: '/post-add.png',
      path: '/pages/post-manage/index'
  },
  '后台管理': {
      icon: '/setting.png',
      path: '/pages/admin-page/index'
  },
  '学校管理': {
      icon: '/school-manage-icon.png',
      path: '/pages/school-manage/index'
  },
  '活动管理': {
      icon: '/activity-manage-icon.png',
      path: '/pages/activity-manage/index'
  },
  '帖子管理': {
      icon: '/post-manage-icon.png',
      path: '/pages/post-manage/index'
  },
  '资源管理': {
      icon: '/resource-manage-icon.png',
      path: '/pages/resource-manage/index'
  },
  '用户管理': {
      icon: '/user-manage-icon.png',
      path: '/pages/user-manage/index'
  },
  // v3 新增模块
  '社团管理': {
      icon: '/user-manage-icon.png',
      path: '/pages/community-manage/index'
  },
  '资讯配置': {
      icon: '/user-manage-icon.png',
      path: '/pages/info-config/index'
  },
}

export const linkList = [{
  id: 1,
  title: '热腾美育｜我们将与这16所玉树...',
  coverImg: 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/Ipvwsqq7TkSCdaHrAVaBPIRWsYlUUW0jvW9okzyBetX6ZZhylVvD9p0wyWcz45dfyiaoqjcSKAxsJncPzAA3wtQ/0?wx_fmt=jpeg',
  intro: '经项目组综合评估，筛选出16所玉树学校为2024年美育项目的资助...',
  date: '2024-04-17 17:50',
  url: 'https://mp.weixin.qq.com/s/Lr565pHkIqKa3Is0XAgQMA'
}, {
  id: 2,
  title: '热腾公益丨以善心助老 让新年发...',
  coverImg: 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/Ipvwsqq7TkTaJBCkPuwAicq6h1elY4crqfwCdt2IcvvAWsXmdBUticQcDsvlm6gWnF6IpK4XHF0ZRh6C5A2H5icSQ/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1',
  intro: '倾注爱老之情，笃行为老之事。一谷一粟，浓缩着生活的味道，也...',
  date: '2024-02-06 15:23',
  url: 'https://mp.weixin.qq.com/s/2gkmd-FUxnxe1OYRgjRA4A'
}, {
  id: 3,
  title: '月捐人故事| 两年，我和“大闺女...',
  coverImg: 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/Ipvwsqq7TkToncwTHxjduodE0qe1A58Y8HoStmwM94alyB7Uy678vDI4ywibDt8wIMZHqDSsAt6X79ibqYXpibezA/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1',
  intro: '又是一年正月十五。在这个象征吉祥与团圆的日子里，热腾·嘉基...',
  date: '2024-02-23 11:49',
  url: 'https://mp.weixin.qq.com/s/LA4xlyCHo9SqQlOTmy7uOA'
}]
