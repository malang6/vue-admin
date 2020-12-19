import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取基本销售属性列表
  */
  saveSkuInfo(skuInfo) {
    return request({
      url: `${api_name}/saveSkuInfo`,
      method: "POST",
      data: skuInfo
    });
  },
  /*
  获取SKU分页列表
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/list/${page}/${limit}`,
      method: "GET"
    });
  },
  /**
   *上架/admin/product/cancelSale/{skuId}
   */
  onSale(skuId) {
    return request({
      url: `${api_name}/onSale/${skuId}`,
      method: "GET"
    });
  },
  /**
   *下架
   */
  cancelSale(skuId) {
    return request({
      url: `${api_name}/cancelSale/${skuId}`,
      method: "GET"
    });
  },
  // 删除SKU
  deleteSku(skuId) {
    return request({
      url: `${api_name}/deleteSku/${skuId}`,
      method: "DELETE"
    });
  },
  ///admin/product/getSkuById/{skuId}
  getSkuById(skuId) {
    return request({
      url: `${api_name}/getSkuById/${skuId}`,
      method: "GET"
    });
  }
};
