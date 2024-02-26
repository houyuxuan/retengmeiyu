import Taro from "@tarojs/taro";
import { introList } from "@/pages/about-us/data";
import { AboutUs, Garden, IdType, UserManagement } from "types";

/**************************   关于我们  **************************/
// 关于我们-获取列表
export function getIntroList(params?: { name: string }) {
    // return Taro.request<AboutUs.IntroDetail[]>({
    //     url: '/intro/list',
    //     method: 'GET',
    //     data: params
    // })
    return Promise.resolve({ data: params?.name ? introList.filter(i => i.title === params.name) : introList})
}

// 关于我们-获取详情
export function getIntroDetail(params: { id: IdType }) {
    // return Taro.request<AboutUs.IntroDetail>({
    //     url: '/intro/detail',
    //     method: 'GET',
    //     data: params
    // })
    const intro = JSON.parse(localStorage.getItem('introList') || 'null') || introList
    return Promise.resolve({ data: (intro).find(i => i.id === params.id)! })
}

// 关于我们-编辑
export function introEdit(params: AboutUs.IntroDetail) {
    // params.id 有：编辑 无：新增
    // return Taro.request({
    //     url: '/intro/edit',
    //     method: 'POST',
    //     data: params
    // })

    const intro = JSON.parse(localStorage.getItem('introList') || 'null') || introList
    if (params.id) {
        const index = intro.findIndex(i => i.id === params.id)
        intro[index] = params
    } else {
        intro.push(params)
    }
    localStorage.setItem('introList', JSON.stringify(intro))
    return Promise.resolve({
        data: 0,
        success: true
    })
}

// 关于我们-删除
export function introDelete(params: { id: IdType }) {
    return Taro.request({
        url: '/intro/delete',
        method: 'GET',
        data: params
    })
}

/**************************   花园  **************************/

// 花园-获取学校列表
export function getSchoolList(query: { name?: string }) {
    return Taro.request<Garden.SchoolDetail[]>({
        url: '/garden/school/search',
        method: 'GET',
        data: query
    })
}

// 花园-获取学校下活动列表
export function getSchoolActivity(params: { schoolId: IdType, name?: string }) {
    return Taro.request<Garden.ActivityDetail[]>({
        url: '/garden/school/activity',
        method: 'GET',
        data: params
    })
}

// 花园-获取活动详情
export function getActivityDetail(params: { activityId: IdType }) {
    return Taro.request<Garden.ActivityDetail>({
        url: '/garden/school/activity',
        method: 'GET',
        data: params
    })
}

// 花园-活动编辑
export function activityEdit(params: Garden.ActivityDetail) {
    // params.id 有：编辑 无：新增
    return Taro.request({
        url: '/garden/activity/edit',
        method: 'POST',
        data: params
    })
}

// 花园-活动删除
export function activityDelete(params: { activityId: IdType }) {
    // params.id 有：编辑 无：新增
    return Taro.request({
        url: '/garden/activity/delete',
        method: 'GET',
        data: params
    })
}

// 花园-学校编辑
export function schoolEdit(params: Garden.SchoolDetail) {
    // params.id 有：编辑 无：新增
    return Taro.request({
        url: '/garden/school/edit',
        method: 'POST',
        data: params
    })
}

// 花园-学校删除
export function schoolDelete(params: { SchoolId: IdType }) {
    return Taro.request({
        url: '/garden/school/delete',
        method: 'GET',
        data: params
    })
}

/**************************   用户管理  **************************/
// 用户-获取用户列表 (超管权限)
export function getUserList(params: { name: string }) {
    return Taro.request<UserManagement.UserInfo>({
        url: '/user/list',
        method: 'GET',
        data: params
    })
}

// 用户-禁用/解禁用户
export function userStatusChange(params: { status: UserManagement.UserStatusEnum }) {
    return Taro.request({
        url: '/user/statusChange',
        method: 'GET',
        data: params
    })
}

// 用户-删除
export function userDelete(params: { userId: IdType }) {
    return Taro.request({
        url: '/user/delete',
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
