type IdType = string | number
// 关于我们
namespace AboutUs {
    // 关于我们-新增介绍
    export interface IntroDetail {
        id?: IdType; // 有：编辑/获取详情 无：新增
        title: string;
        coverImg: string; // url
        detailList: IntroContentItem[]
        createTime?: string; // 'yyyy-mm-dd HH-mm-ss'
        updateTime?: string; // 'yyyy-mm-dd HH-mm-ss'
    }

    // 关于我们-内容详情
    export interface IntroContentItem {
        type: 'text' | 'img';
        content: string;
    }
}

// 美育花园
namespace Garden {
    // 学校列表
    export interface SchoolDetail {
        id?: IdType; // 有：编辑/获取详情 无：新增
        imgUrl: string;
        name: string;
        createdTime: string; // 'yyyy-mm-dd HH-mm-ss'
        updateTime: string; // 'yyyy-mm-dd HH-mm-ss'
        intro: string; // 简介
    }

    // 学校-活动详情
    export interface ActivityDetail {
        id?: IdType; // 有：编辑/获取详情 无：新增
        coverImg: string;
        name: string;
        createdTime: string; // 'yyyy-mm-dd HH-mm-ss'
        updateTime: string; // 'yyyy-mm-dd HH-mm-ss'
        detail: ActivityDetailItem[];
        upvoteNum: number; // 点赞数 要不要？？
        affiliateSchool: IdType; // 学校id
    }

    // 学校-活动详情
    export interface ActivityDetailItem {
        type: 'text' | 'img';
        content: string;
    }
}

namespace UserManagement {
    // 用户详情
    export interface UserInfo {
        id: IdType;
        name: string;
        phone: string;
        createdTime: string; // 'yyyy-mm-dd HH-mm-ss'
        status: UserStatusEnum;
        avatar: string; // url
        gender: UserGenderEnum
        role: UserRoleEnum
    }

    export enum UserRoleEnum {
        SuperAdmin = 1,
        Administrator = 2,
        CommonUser = 3,
        Visiter = 4
    }

    export enum UserStatusEnum {
        Disabled = 0, // 禁用状态
        Normal = 1, // 正常
    }
    
    export enum UserGenderEnum {
        Male = 0, // 男
        Female = 1, // 女
    }
}

export {
    IdType,
    AboutUs,
    Garden,
    UserManagement
}
