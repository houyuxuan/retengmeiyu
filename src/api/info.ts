import { InfoManage, IdType, PageParams, PageResult } from "@/types";
import request from "./request";

/**************************   资讯管理  **************************/
// 资讯管理-获取列表
export function getInfoList(params: { searchKeyWord: string } & PageParams) {
  return request<PageResult<InfoManage.Info>>({
      url: '/rt/v2/information/page',
      method: 'POST',
      data: params
  })
}

// 删除资讯
export function infoDelete(params: { id: IdType }) {
  return request({
      url: '/rt/v2/information/delete',
      method: 'POST',
      data: params
  })
}

// 编辑/新增资讯
export function infoEdit(params: InfoManage.InfoDetail) {
  return request({
      url: '/rt/v2/information/public',
      method: 'POST',
      data: params
  })
}

// 资讯详情
export function getInfoDetail(params: { id: IdType }) {
  return request<InfoManage.InfoDetail>({
    url: '/rt/v2/information/info',
    method: 'POST',
    data: params
  })
}
