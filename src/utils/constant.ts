import { Community, Resource, UserManagement } from "@/types";

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
}]

export const postTabList = [{
  title: '全部',
  value: Community.PostType.All
}, {
  title: '分享帖',
  value: Community.PostType.Share
}, {
  title: '讨论帖',
  value: Community.PostType.Discuss
}]

export const userTabList = [{
  title: '全部',
  value: UserManagement.UserStatusEnum.All
}, {
  title: '正常',
  value: UserManagement.UserStatusEnum.Normal
}, {
  title: '禁用',
  value: UserManagement.UserStatusEnum.Disabled
}]

export const menuInfoMap = {
  '发布活动': {
      icon: '/activity-add.png',
      path: '/pages/activity-manage/index'
  },
  '关于我们管理': {
      icon: 'https://media.retenggy.com/systemImage/fix.svg',
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
      icon: 'https://media.retenggy.com/systemImage/school.svg',
      path: '/pages/school-manage/index'
  },
  '活动管理': {
      icon: 'https://media.retenggy.com/systemImage/activity.svg',
      path: '/pages/activity-manage/index'
  },
  '帖子管理': {
      icon: 'https://media.retenggy.com/systemImage/tiezi.svg',
      path: '/pages/post-manage/index'
  },
  '资源管理': {
      icon: 'https://media.retenggy.com/systemImage/resource.svg',
      path: '/pages/resource-manage/index'
  },
  '用户管理': {
      icon: 'https://media.retenggy.com/systemImage/users.svg',
      path: '/pages/user-manage/index'
  },
}