type IdType = string | number

interface PageParams {
    pageNo: number;
    pageSize: number;
}

interface PageResult {
    total: number;
}

export enum FileType {
    Image = 1,
    Video = 2,
    Audio = 3
}

export interface ContentItem {
    type: 'text' | 'img' | 'video' | 'audio';
    content: string;
}
// 关于我们
namespace AboutUs {
    // 关于我们-新增介绍
    export interface IntroDetail {
        id?: IdType; // 有：编辑/获取详情 无：新增
        title: string;
        coverUrl: string; // url
        detail: string;
        detailList: ContentItem[];
        createTime?: string; // 'yyyy-mm-dd HH-mm-ss'
    }
}

// 美育花园
namespace Garden {
    // 学校列表
    export interface SchoolDetail {
        id?: IdType; // 有：编辑/获取详情 无：新增
        schoolLogoUrl: string;
        schoolName: string;
        createTime: string; // 'yyyy-mm-dd HH-mm-ss'
        schoolIntroduction: string; // 简介
    }

    // 学校-活动详情
    export interface ActivityDetail {
        id?: IdType; // 有：编辑/获取详情 无：新增
        schoolId: IdType;
        activityCoverUrl: string;
        activityTitle: string;
        createTime: string; // 'yyyy-mm-dd HH-mm-ss'
        activityDetails: string;
        detailList: ContentItem[];
    }

    // 活动-点赞详情
    export interface ActivityUpvoteInfo {
        zanFlag: number;
        zanNumber: number;
        memberUserZanList: {
            id: IdType;
            nickname: string;
            avatar: string;
        }[]
    }
}

namespace UserManagement {
    // 我的-菜单
    export interface MenuListItem {
        id: IdType;
        menuName: string;
        menuIconUrl: string;
        path: string;
    }

    // 用户详情
    export interface UserInfo {
        id: IdType;
        nickname: string;
        mobile: string;
        createTime: string; // 'yyyy-mm-dd HH-mm-ss'
        status: UserStatusEnum;
        avatar: string; // url
        sex: UserGenderEnum
        // role: UserRoleEnum
    }

    export enum UserRoleEnum {
        SuperAdmin = 1,
        Administrator = 2,
        CommonUser = 3,
        Visiter = 4
    }

    export enum UserStatusEnum {
        Disabled = 1, // 禁用状态
        Normal = 0, // 正常
    }
    
    export enum UserGenderEnum {
        Male = 0, // 男
        Female = 1, // 女
    }
}

namespace Community {
    export enum PostType {
        All = 0,
        Discuss = 1,
        Share = 2
    }

    export interface PostDetail {
        id: IdType;
        postTitle: string;
        postCoverUrl: string;
        postType: PostType;
        resourceLink: string;
        memberUserId: IdType;
        createTime: string;
        postDetails: string;
        detailList: ContentItem[];
    }

    export interface PostDiscussDetail {
        id: IdType;
        postId: IdType;
        discussContent: string;
        avatar: string;
        nickname: string;
        memberUserId: IdType;
        createTime: string;
    }
}

export {
    IdType,
    AboutUs,
    Garden,
    UserManagement,
    PageParams,
    PageResult,
    Community
}
