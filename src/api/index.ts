import Taro, { UserInfo } from "@tarojs/taro";
import { AboutUs, Community, FileType, Garden, IdType, PageParams, PageResult, UserManagement } from "@/types";
import { activityList, discussList, introList, menuList, postList, schoolList, userList } from "@/mock/data";
import request from "./request";

/**************************   登录  **************************/
export function login(params: { userInfo: UserInfo; loginCode: string }) {
    return request({
        url: '/member/auth/wx-mini-app-login',
        method: 'POST',
        data: params
    })
}

/**************************   关于我们  **************************/
// 关于我们-获取列表
export function getIntroList(params?: { searchKeyWord: string } & PageParams) {
    // return request<{
    //     aboutUsList: AboutUs.IntroDetail[];
    // } & PageResult>({
    //     url: '/rt/aboutUs/list',
    //     method: 'GET',
    //     data: params
    // })
    const intro = Taro.getStorageSync('introList') || introList
    const list = intro.filter(i => params?.searchKeyWord ? i.title.includes(params.searchKeyWord) : true)
    return Promise.resolve({ data: {
        aboutUsList: list,
        total: list.length
    } })
}

// 关于我们-获取详情
export async function getIntroDetail(params: { id: IdType }) {
    // return request<{
    //     aboutUsInfo: AboutUs.IntroDetail
    // }>({
    //     url: '/rt/aboutUs/info',
    //     method: 'POST',
    //     data: params
    // }).then(res => {
    //     return {
    //         ...res,
    //         data: {
    //             ...res.data.aboutUsInfo,
    //             detailList: JSON.parse(res.data.aboutUsInfo.detail || '[]')
    //         }
    //     }
    // })
    const intro = ((Taro.getStorageSync('introList') || introList) as AboutUs.IntroDetail[]).find(i => i.id === params.id)!
    return Promise.resolve({ data: {
        ...intro,
        detailList: JSON.parse(intro.detail || '[]')
    } })
}

// 关于我们-编辑
export async function introEdit(params: AboutUs.IntroDetail) {
    // params.id 有：编辑 无：新增
    // return request({
    //     url: '/intro/edit',
    //     method: 'POST',
    //     data: params
    // })

    const intro = Taro.getStorageSync('introList') || introList
    if (params.id) {
        const index = intro.findIndex(i => i.id === params.id)
        intro[index] = params
    } else {
        intro.push(params)
    }
    Taro.setStorageSync('introList', intro)
    return Promise.resolve({
        data: 0,
        success: true
    })
}

// 关于我们-删除
export function introDelete(params: { id: IdType }) {
    return request({
        url: '/intro/delete',
        method: 'GET',
        data: params
    })
}

/**************************   花园  **************************/

// 花园-获取学校列表
export function getSchoolList(params?: { searchKeyWord: string } & PageParams) {
    // return request<{
    //     schoolList: Garden.SchoolDetail[];
    // } & PageResult>({
    //     url: '/rt/school/list',
    //     method: 'GET',
    //     data: params
    // })
    const list = ((Taro.getStorageSync('schoolList') || schoolList) as Garden.SchoolDetail[]).filter(i => params?.searchKeyWord ? i.schoolName.includes(params.searchKeyWord) : true)
    return Promise.resolve({
        data: {
            schoolList: list,
            total: list.length
        }
    })
}

// 花园-获取学校详情
export async function getSchoolDetail(params: { id: IdType }) {
    // return request<{
    //     schoolInfo: Garden.SchoolDetail
    // }>({
    //     url: '/rt/school/info',
    //     method: 'POST',
    //     data: params
    // }).then(res => {
    //     return {
    //         ...res,
    //         data: res.data.schoolInfo
    //     }
    // })
    const list = ((Taro.getStorageSync('schoolList') || schoolList) as Garden.SchoolDetail[]).find(i => i.id === params.id)!
    return Promise.resolve({ data: list })
}

// 花园-获取学校下活动列表
export function getSchoolActivity(params: { schoolId: IdType, searchKeyWord?: string } & PageParams) {
    // return request<{
    //     schoolActivityList: Garden.ActivityDetail[]
    // } & PageResult>({
    //     url: '/rt/school/activity/list',
    //     method: 'POST',
    //     data: params
    // })
    const list = ((Taro.getStorageSync('activityList') || activityList) as Garden.ActivityDetail[]).filter(i => i.schoolId === params.schoolId && i.activityTitle.includes(params.searchKeyWord || ''))
    return Promise.resolve({
        data: {
            schoolActivityList: list,
            total: list.length
        }
    })
}

// 花园-获取学校下活动列表
export function getActivityList(params: { searchKeyWord?: string } & PageParams) {
    // return request<{
    //     schoolActivityList: Garden.ActivityDetail[]
    // } & PageResult>({
    //     url: '/rt/school/activity/list',
    //     method: 'POST',
    //     data: params
    // })
    const list = ((Taro.getStorageSync('activityList') || activityList) as Garden.ActivityDetail[]).filter(i => i.activityTitle.includes(params.searchKeyWord || ''))
    return Promise.resolve({
        data: {
            activityList: list,
            total: list.length
        }
    })
}

// 花园-获取活动详情
export function getActivityDetail(params: { activityId: IdType }) {
    // return request<{
    //     schoolActivityInfo: Garden.ActivityDetail
    // }>({
    //     url: '/rt/school/activity/info',
    //     method: 'GET',
    //     data: params
    // }).then(res => {
    //     return {
    //         ...res,
    //         data: {
    //             ...res.data.schoolActivityInfo,
    //             detailList: JSON.parse(res.data.schoolActivityInfo.activityDetails || '[]')
    //         }
    //     }
    // })
    const detail = ((Taro.getStorageSync('activityList') || activityList) as Garden.ActivityDetail[]).find(i => i.id === params.activityId)!

    return Promise.resolve({
        data: {
            ...detail,
            detailList: JSON.parse(detail?.activityDetails)
        }
    })
}

// 活动-点赞
export function activityUpvote(params: {
    schoolActivityId: IdType;
    memberUserId: IdType;
}) {
    return request({
        url: '/rt/school/activity/zan/save',
        method: 'POST',
        data: params
    })
}

// 活动-点赞详情
export function getActivityUpvote(params: {
    schoolActivityId: IdType;
}) {
    return request<{
        zanInfo: Garden.ActivityUpvoteInfo
    }>({
        url: '/rt/school/activity/zan/info',
        method: 'POST',
        data: params
    }).then(res => {
        return {
            ...res,
            data: res.data.zanInfo
        }
    })
}

// 我的-菜单列表
export function getMenu() {
    // return request<{
    //     memberMenuList: UserManagement.MenuListItem[]
    // }>({
    //     url: '/rt/aboutMe/memberMenu/list',
    //     method: 'POST',
    // }).then(res => {
    //     return {
    //         ...res,
    //         data: res.data.memberMenuList
    //     }
    // })
    return Promise.resolve({
        data: menuList
    })
}

// 上传文件
export function uploadFile(params: {
    filePath: string;
    type: FileType;
}) {
    const pathArr = params.filePath.split('/')
    const name = pathArr[pathArr.length - 1]

    return Taro.uploadFile({
        url: 'https://media.retenggy.com',
        filePath: params.filePath,
        name: name,
        formData: {
            fileType: params.type,
            fileName: name
        }
    }).then(res => {
        console.log('upload', res)
    })
}

// 花园-活动编辑
export function activityEdit(params: Garden.ActivityDetail) {
    // params.id 有：编辑 无：新增
    return request({
        url: '/rt/school/activity/public',
        method: 'POST',
        data: params
    })
}

// 花园-活动删除
export function activityDelete(params: { id: IdType }) {
    // params.id 有：编辑 无：新增
    return request({
        url: '/rt/school/activity/delete',
        method: 'GET',
        data: params
    })
}

// 花园-学校编辑
export function schoolEdit(params: Garden.SchoolDetail) {
    // params.id 有：编辑 无：新增
    return request({
        url: '/rt/school/save',
        method: 'POST',
        data: params
    })
}

// 花园-学校删除
export function schoolDelete(params: { id: IdType }) {
    return request({
        url: '/rt/school/delete',
        method: 'POST',
        data: params
    })
}

/**************************   用户管理  **************************/
// 用户-获取用户列表 (超管权限)
export function getUserList(params: {
    searchKeyWord: string,
    status: UserManagement.UserStatusEnum,
} & PageParams) {
    // return request<{
    //     memberUserList: UserManagement.UserInfo[]
    // } & PageResult>({
    //     url: '/rt/member/user/list',
    //     method: 'POST',
    //     data: params
    // })

    const list = ((Taro.getStorageSync('userList') || userList) as UserManagement.UserInfo[]).filter(i => i.nickname.includes(params.searchKeyWord || '') && (params.status === UserManagement.UserStatusEnum.All || params.status === i.status))
    return Promise.resolve({
        data: {
            memberUserList: list,
            total: list.length
        }
    })
}

// 用户-获取用户列表 (超管权限)
export function getUserDetail(params: { id: IdType }) {
    // return request<{memberUserInfo: UserManagement.UserInfo}>({
    //     url: '/rt/member/user/Info',
    //     method: 'POST',
    //     data: params
    // }).then(res => {
    //     return {
    //         ...res,
    //         data: res.data.memberUserInfo
    //     }
    // })

    const detail = ((Taro.getStorageSync('userList') || userList) as UserManagement.UserInfo[]).find(i => i.id === params.id)!

    return Promise.resolve({
        data: detail
    })
}

// 用户-禁用/解禁用户
export function userStatusChange(params: {id: IdType}) {
    return request({
        url: '/rt/member/user/disable',
        method: 'GET',
        data: params
    })
}

// 用户-删除
export function userDelete(params: { id: IdType }) {
    return request({
        url: '/rt/member/user/delete',
        method: 'GET',
        data: params
    })
}

/**************************   文件管理  **************************/
export function fileUpload<T extends {} = any>(params: {filePath: string; name: string, formData: T}) {
    return new Promise((res, rej) => {
        Taro.uploadFile({
            url: '/app-api/file/qiniu/getUploadToken',
            filePath: params.filePath,
            name: params.name,
            formData: params.formData,
            success: response => res(response),
            fail: err => rej(err)
        })
    })
}

/**************************   社区  **************************/

// 获取社区帖子列表
export function getPostList(params: {
    postType: Community.PostType;
    searchKeyWord: string;
} & PageParams) {
    // return request<{
    //     postList: Community.PostDetail
    // } & PageResult>({
    //     url: '/rt/post/list',
    //     method: 'POST',
    //     data: params
    // })
    const list = ((Taro.getStorageSync('postList') || postList) as Community.PostDetail[]).filter(i => (i.postTitle.includes(params.searchKeyWord)) && (!params.postType || i.postType === params.postType))
    return Promise.resolve({
        data: {
            postList: list,
            total: list.length
        }
    })
}

// 获取帖子详情
export function getPostDetail(params: {
    postId: IdType
}) {
    // return request<{
    //     postInfo: Community.PostDetail
    // }>({
    //     url: '/rt/post/info',
    //     method: 'POST',
    //     data: params
    // }).then(res => {
    //     return {
    //         ...res,
    //         data: res.data.postInfo
    //     }
    // })
    const intro = ((Taro.getStorageSync('postList') || postList) as Community.PostDetail[]).find(i => i.id === params.postId)!
    return Promise.resolve({ data: {
        ...intro,
        detailList: JSON.parse(intro.postDetails || '[]')
    } })
}

// 帖子讨论-列表
export function getPostDiscuss(params: {
    postId: IdType;
    createdTime?: [string, string];
} & PageParams) {
    // return request<{
    //     postDiscussList: Community.PostDiscussDetail[]
    // } & PageResult>({
    //     url: '/rt/post/discuss/list',
    //     method: 'POST',
    //     data: params
    // })
    const list = ((Taro.getStorageSync('discussList') || discussList) as Community.PostDiscussDetail[])
    return Promise.resolve({
        data: {
            postDiscussList: list,
            total: list.length
        }
    })
}

export function publishDiscuss(params: {
    postId: IdType;
    discussContent: string;
    memberUserId: number;
}) {
    return request({
        url: '/rt/post/discuss/public',
        method: 'POST',
        data: params
    })
}

// 帖子讨论-删除
export function discussDelete(params: { id: IdType }) {
    // params.id 有：编辑 无：新增
    return request({
        url: '/rt/post/discuss/delete',
        method: 'GET',
        data: params
    })
}
