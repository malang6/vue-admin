import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取基本销售属性列表
  */
  getBaseSaleAttrList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  },
  /*
  获取SPU分页列表信息
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET"
    });
  },
  /*
  获取SPU基本信息
  */
  getSpuById(spuId) {
    return request({
      url: `${api_name}/getSpuById/${spuId}`,
      method: "GET"
    });
  },
  /*
  添加SPU信息
  */
  getAttrInfoList(spuInfo) {
    return request({
      url: `${api_name}/saveSpuInfo`,
      method: "POST",
      spuInfo
    });
  },
  /*
  更改SPU信息
  */
  getAttrValueList(spuInfo) {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: "POST",
      spuInfo
    });
  },
  /*
  删除SPU
  */
  deleteAttr(spuId) {
    return request({
      url: `${api_name}/deleteSpu/${spuId}`,
      method: "DELETE"
    });
  },
