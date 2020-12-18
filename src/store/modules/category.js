import * as API from "@/api";
import { Message } from "element-ui";

export default {
  namespaced: true,
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: ""
    },
    category1List: [],
    category2List: [],
    category3List: []
  },
  getters: {},
  actions: {
    async getCategory1List({ commit }) {
      const result = await API.attr.getCategory1();
      if (result.code === 200) {
        commit("GET_CATEGORY1_LIST", result.data);
      } else {
        Message.error(result.message);
      }
    },
    async getCategory2List({ commit }, category1Id) {
      const result = await API.attr.getCategory2(category1Id);
      if (result.code === 200) {
        commit("GET_CATEGORY2_LIST_SUCCESS", {
          category2List: result.data,
          category1Id
        });
      } else {
        Mmessage.error(result.message);
        commit("GET_CATEGORY2_LIST_ERROR", category1Id);
      }
    },
    async getCategory3List({ commit }, category2Id) {
      const result = await API.attr.getCategory3(category2Id);
      if (result.code === 200) {
        commit("GET_CATEGORY3_LIST_SUCCESS", {
          category3List: result.data,
          category2Id
        });
      } else {
        Message.error(result.message);
        commit("GET_CATEGORY3_LIST_ERROR", category2Id);
      }
    }
  },
  mutations: {
    GET_CATEGORY1_LIST(state, category1List) {
      // 获取1级分类列表（此时还未选择1级分类）
      state.category1List = category1List;
    },
    GET_CATEGORY2_LIST_SUCCESS(state, { category2List, category1Id }) {
      // 获取2级分类列表（此时选择了1级分类， 清空2级和3级分类）
      state.category2List = category2List;
      state.category.category1Id = category1Id;
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY2_LIST_ERROR(state, category1Id) {
      state.category.category1Id = category1Id;
      state.category2List = [];
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_SUCCESS(state, { category3List, category2Id }) {
      // 获取3级分类列表（此时选择了2级分类， 清空3级分类）
      state.category.category2Id = category2Id;
      state.category3List = category3List;
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_ERROR(state, category2Id) {
      state.category.category2Id = category2Id;
      state.category3List = [];
      state.category.category3Id = "";
    },
    SET_CATEGORY3_ID(state, category3Id) {
      state.category.category3Id = category3Id;
    },
    SET_CATEGORY(state){
      state.category.category1Id="";
      state.category.category2Id="";
      state.category.category3Id="";
    }
  }
};
