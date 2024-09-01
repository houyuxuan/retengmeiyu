import { ClubManage, IdType, PageParams, PageResult } from "@/types";
import request from "./request";

/**************************   社团管理  **************************/
// 社团管理-获取列表
export function getClubList(params: { searchKeyWord: string } & PageParams) {
  return request<PageResult<ClubManage.Club>>({
      url: '/rt/club/page',
      method: 'POST',
      data: params
  })
}

// 删除社团
export function clubDelete(params: { id: IdType }) {
  return request({
      url: '/rt/club/delete',
      method: 'POST',
      data: params
  })
}

// 编辑/新增社团
export function clubEdit(params: ClubManage.ClubDetail) {
  return request({
      url: '/rt/club/save',
      method: 'POST',
      data: params
  })
}

// 社团详情
export function getClubDetail(params: { id: IdType }) {
  return request<ClubManage.ClubDetail>({
    url: '/rt/club/info',
    method: 'POST',
    data: params
  })
}
