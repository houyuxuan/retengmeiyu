type IdType = string | number

interface PageParams {
    pageNo: number;
    pageSize: number;
}

interface PageResult<T> {
    total: number;
    list: T[]
}

export enum FileType {
    image = 1,
    video = 2,
    audio = 3
}

export interface FileListItem {
    url: string;
    type: FileType
}

export interface UploadFileResponse {
    fileURL: string;
    hash: string;
    imageURL: string;
    key: string;
}

export interface ContentItem {
    type: 'text' | keyof typeof FileType;
    content: string;
}

export enum PublicStatus {
    Draft = 0,
    Published = 1
}

// 关于我们
namespace AboutUs {
    // 关于我们-新增介绍
    export interface IntroDetail {
        id?: IdType; // 有：编辑/获取详情 无：新增
        title: string;
        coverUrl: string; // url
        details: string;
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
        zanNumber: number;
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

    export interface ActivityRemarkItem {
        id: IdType;
        commentContent: string;
        memberUserId: IdType;
        activityId: IdType;
        nickname: string;
        avatar: string;
        owner: boolean; // 为true说明评论属于自己本人，可以删除
        createTime: string;
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

    // 我的-统计数据
    export interface StatisticData{
        activityNum: number;
        memberUserNum: number;
    }

    // 用户详情
    export interface UserInfo {
        id: IdType;
        nickname: string;
        mobile: string;
        createTime: string; // 'yyyy-mm-dd HH-mm-ss'
        status: UserStatusEnum;
        avatar: string; // url
        sex: UserGenderEnum;
        // role: UserRoleEnum
        schoolIds: IdType[];
        schoolNames?: string; // 自己拼接
        memberUserRoleDTOList: RoleInfo[]
    }

    export interface RoleInfo {
        id: IdType;
        memberRoleName: string;
        code: RoleCodeEnum;
        status: 0;
        createTime: string;
    }

    export enum RoleCodeEnum {
        Member = 'member',
        Teacher = 'teacher',
        Admin = 'admin',
        SuperAdmin = 'super_admin'
    }

    export enum UserStatusEnum {
        Disabled = 1, // 禁用状态
        Normal = 0, // 正常
        All = 9, // 全部
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

namespace Resource {
    export enum ResourceType {
        Theater = 1,
        Music = 2,
        All = 100
    }

    export interface ResourceDetail {
        id: IdType;
        resourcesTitle: string;
        resourcesCoverUrl: string;
        publicStatus: PublicStatus;
        resourcesType: ResourceType;
        memberUserId: IdType;
        createTime: string;
        resourcesDetails: string;
        detailList: ContentItem[]
      }
}

export {
    IdType,
    AboutUs,
    Garden,
    UserManagement,
    PageParams,
    PageResult,
    Community,
    Resource
}
