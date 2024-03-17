import Taro, { UserInfo } from "@tarojs/taro";
import { AboutUs, Community, FileType, Garden, IdType, PageParams, PageResult, Resource, UploadFileResponse, UserManagement } from "@/types";
import { menuList } from "@/mock/data";
import request from "./request";
import { upload } from './qiniuUploader'

/**************************   登录  **************************/
export function login(params: { userInfo?: UserInfo; loginCode: string; phoneCode: string }) {
    return request({
        url: '/member/auth/wx-mini-app-login',
        method: 'POST',
        data: params
    }).then((res: any) => {
        Taro.setStorageSync('loginInfo', res.data)
        Taro.setStorageSync('token', res.data.accessToken)
        return res
    })
}

/**************************   关于我们  **************************/
// 关于我们-获取列表
export function getIntroList(params: { searchKeyWord: string } & PageParams) {
    return request<{
        list: AboutUs.IntroDetail[];
    } & PageResult>({
        url: '/rt/aboutus/list',
        method: 'POST',
        data: params
    })
}

// 关于我们-获取详情
export async function getIntroDetail(params: { id: IdType }) {
    return request<AboutUs.IntroDetail>({
        url: '/rt/aboutus/info',
        method: 'POST',
        data: params
    }).then(res => {
        return {
            ...res,
            data: {
                ...res.data,
                detailList: JSON.parse(res.data.details || '[]')
            }
        }
    })
}

// 关于我们-编辑
export async function introEdit(params: AboutUs.IntroDetail) {
    // params.id 有：编辑 无：新增
    return request({
        url: '/rt/aboutus/public',
        method: 'POST',
        data: params
    })
}

// 关于我们-删除
export function introDelete(params: { id: IdType }) {
    return request({
        url: '/rt/aboutus/delete',
        method: 'POST',
        data: params
    })
}

/**************************   花园  **************************/

// 花园-获取学校列表
export function getSchoolList(params?: { searchKeyWord?: string } & PageParams) {
    return request<{
        list: Garden.SchoolDetail[]
    } & PageResult>({
        url: '/rt/school/page',
        method: 'POST',
        data: params
    })
}

// 根据schoolIds获取学校列表
export function getSchoolListByIds(params: { ids: IdType[] }) {
return request<Garden.SchoolDetail[]>({
        url: '/rt/school/list',
        method: 'POST',
        data: params
    })
}

// 花园-获取学校详情
export async function getSchoolDetail(params: { id: IdType }) {
    return request<{
        schoolInfo: Garden.SchoolDetail
    }>({
        url: '/rt/school/info',
        method: 'POST',
        data: params
    }).then(res => {
        return {
            ...res,
            data: res.data.schoolInfo
        }
    })
}

// 花园-获取学校下活动列表
export function getSchoolActivity(params: { schoolId: IdType, searchKeyWord?: string } & PageParams) {
    return request<{
        list: Garden.ActivityDetail[]
    } & PageResult>({
        url: '/rt/school/activity/list',
        method: 'POST',
        data: params
    })
}

// 花园-获取学校下活动列表
export function getActivityList(params: { searchKeyWord?: string } & PageParams) {
    return request<{
        list: Garden.ActivityDetail[]
    } & PageResult>({
        url: '/rt/school/activity/list',
        method: 'POST',
        data: params
    })
}

// 花园-获取活动详情
export function getActivityDetail(params: { id: IdType }) {
    return request<Garden.ActivityDetail>({
        url: '/rt/school/activity/info',
        method: 'POST',
        data: params
    }).then(res => {
        return {
            ...res,
            data: {
                ...res.data,
                detailList: JSON.parse(res.data.activityDetails || '[]')
            }
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
        method: 'POST',
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
    status?: UserManagement.UserStatusEnum,
} & PageParams) {
    return request<{
        list: UserManagement.UserInfo[]
    } & PageResult>({
        url: '/member/user/list',
        method: 'POST',
        data: params
    })
}

// 用户-获取用户列表 (超管权限)
export function getUserDetail(params: { id: IdType }) {
    return request<UserManagement.UserInfo>({
        url: '/member/user/info',
        method: 'POST',
        data: params
    })
}

// 用户-禁用/解禁用户
export function userStatusChange(params: {id: IdType}) {
    return request({
        url: '/member/user/disable',
        method: 'POST',
        data: params
    })
}

// 用户-修改所属学校
export function userInfoChange(params: {
    memberUserId: IdType;
    schoolId?: IdType;
    roleId?: IdType;
}) {
    return request({
        url: '/member/user/details/update',
        method: 'POST',
        data: params
    })
}

// 用户-删除
export function userDelete(params: { id: IdType }) {
    return request({
        url: '/member/user/delete',
        method: 'POST',
        data: params
    })
}

// 用户角色列表
export function getRoleList(params: { searchKeyWord?: string } & PageParams) {
    return request<{
        list: UserManagement.RoleInfo[];
    } & PageResult>({
        url: '/rt/member/role/page',
        method: 'POST',
        data: params
    })
}

// 我的-菜单列表
export function getMenu() {
    return request<UserManagement.MenuListItem[]>({
        url: '/rt/member/menu/me/list',
        method: 'GET',
    })
    .then(res => {
        return {
            ...res,
            data: menuList
            // res.data
        }
    })
}

// 我的-获取我的信息
export function getMineInfo() {
    return request({
        url: '/member/user/get',
        method: 'GET'
    })
}

// 我的-修改我的头像、昵称
export function updateMyInfo(params: {
    nickname: string;
    avatar: string;
    sex?: UserManagement.UserGenderEnum
}) {
    return request({
        url: '/member/user/update',
        method: 'POST',
        data: params
    })
}

// 获取统计数据
export function getStatistic() {
    return request<UserManagement.StatisticData>({
        url: '/rt/index/statistics/info',
        method: 'GET',
    })
}

// 管理后台-菜单
export function getManageMenu() {
    return request({
        url: '/rt/member/menu/admin/index/list',
        method: 'GET'
    })
}

/**************************   文件管理  **************************/
export function getUploadToken(params: {fileType: FileType; fileName: string}) {
    return request<any>({
        url: '/file/qiniu/getUploadToken',
        method: 'POST',
        data: params
    })
}

export async function qiniuUpload(params: {fileType: FileType; fileName: string; filePath: string}): Promise<UploadFileResponse> {
    const { data: uploadInfo } = await getUploadToken({
        fileType: params.fileType,
        fileName: params.fileName
    })

    const options = {
        region: 'NCN' as any,
        uptoken: uploadInfo.uploadToken,
        domain: 'https://media.retenggy.com',
        shouldUseQiniuFileName: false,
        key: uploadInfo.key
    }

    return new Promise((resolve, reject) => {
        upload({
            options,
            filePath: params.filePath,
            // before: () => {
            //     // 上传前
            //     console.log('before upload');
            // },
            success: (res: UploadFileResponse) => {
                resolve(res)
            },
            fail: (err) => {
                console.log('error:' + err);
                reject(err)
            },
            // progress: (res) => {
            //     console.log('上传进度', res.progress)
            //     console.log('已经上传的数据长度', res.totalBytesSent)
            //     console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
            // },
            // complete: () => {
            //     // 上传结束
            //     console.log('upload complete');
            // }
        });
    })
}

// 上传文件
export function uploadFile(params: {
    filePath: string;
    type: FileType;
    key: string;
    token: string;
}) {
    const fileName = params.filePath.split('/').pop() || ''

    return Taro.uploadFile({
        url: 'https://media.retenggy.com',
        filePath: params.filePath,
        header: {
            "Content-Type": "multipart/form-data"
        },
        name: fileName,
        formData: {
            key: params.key,
            fileName,
            token: params.token
        },
        success: (res) => {
            console.log('upload success', res)
        },
        fail: (err) => {
            console.log('upload fail', err)
        },
    }).then(res => {
        console.log('upload', res)
    })
}

/**************************   社区  **************************/

// 获取社区帖子列表
export function getPostList(params: {
    postType?: Community.PostType;
    searchKeyWord: string;
} & PageParams) {
    return request<{
        list: Community.PostDetail[]
    } & PageResult>({
        url: '/rt/post/list',
        method: 'POST',
        data: params
    })
}

// 获取帖子详情
export function getPostDetail(params: {
    id: IdType
}) {
    return request<Community.PostDetail>({
        url: '/rt/post/info',
        method: 'POST',
        data: params
    }).then(res => {
        return {
            ...res,
            data: {
                ...res.data,
                detailList: JSON.parse(res.data.postDetails || '[]')
            },
        }
    })
}

// 发布帖子
export function postPublic(params: Community.PostDetail) {
    return request({
        url: '/rt/post/public',
        method: 'POST',
        data: params
    })
}

// 删除帖子
export function postDelete(params: { id: IdType }) {
    return request({
        url: '/rt/post/delete',
        method: 'POST',
        data: params
    })
}

// 帖子讨论-列表
export function getPostDiscuss(params: {
    postId: IdType;
    createTime?: [string, string];
} & PageParams) {
    return request<{
        list: Community.PostDiscussDetail[]
    } & PageResult>({
        url: '/rt/post/discuss/list',
        method: 'POST',
        data: params
    })
}

// 帖子讨论-发布
export function publishDiscuss(params: {
    postId: IdType;
    discussContent: string;
    memberUserId: IdType;
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
        method: 'POST',
        data: params
    })
}

/**************************   资源  **************************/

export function getResourceList(params: {
    resourcesType: Resource.ResourceType;
    searchKeyWord: string;
} & PageParams) {
    if (params.resourcesType === Resource.ResourceType.All) {
        params.resourcesType = undefined as any
    }
    return request<{
        list: Resource.ResourceDetail[]
    } & PageResult>({
        url: '/rt/resources/list',
        method: 'POST',
        data: params
    })
}

// 资源详情
export function getResourceDetail(params: {id: IdType}) {
    return request<{resourcesInfo: Resource.ResourceDetail}>({
        url: '/rt/resources/info',
        method: 'POST',
        data: params
    }).then(res => {
        return {
            ...res,
            data: res.data.resourcesInfo
        }
    })
}

// 资源-删除
export function resourceDelete(params: { id: IdType }) {
    return request({
        url: '/rt/resources/delete',
        method: 'POST',
        data: params
    })
}

// 资源编辑
export function resourceEdit(params: Resource.ResourceDetail & {
    memberUserId: IdType;
}) {
    return request({
        url: '/rt/resources/public',
        method: 'POST',
        data: params
    })
}