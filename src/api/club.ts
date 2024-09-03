import { ClubManage, IdType, PageParams, PageResult } from "@/types";
import request from "./request";

/**************************   社团管理  **************************/
// 社团管理-获取列表
export function getClubList(params: { searchKeyWord: string } & PageParams) {
  return request<PageResult<ClubManage.Club>>({
      url: '/rt/v2/club/page',
      method: 'POST',
      data: params
  })
}

// 删除社团
export function clubDelete(params: { id: IdType }) {
  return request({
      url: '/rt/v2/club/delete',
      method: 'POST',
      data: params
  })
}

// 编辑/新增社团
export function clubEdit(params: ClubManage.ClubDetail) {
  return request({
      url: '/rt/v2/club/save',
      method: 'POST',
      data: params
  })
}

// 社团详情
export function getClubDetail(params: { id: IdType }) {
  return request<ClubManage.ClubDetail>({
    url: '/rt/v2/club/info',
    method: 'POST',
    data: params
  })
}
