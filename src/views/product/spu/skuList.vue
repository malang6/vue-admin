<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="sku">
        <el-form-item label="SPU名称" prop="spuName" label-width="80px">
          <span>{{ spu.spuName }}</span>
        </el-form-item>
        <el-form-item label="SKU名称" prop="skuName" label-width="80px">
          <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price" label-width="80px" :min="0">
          <el-input
            type="number"
            placeholder="SKU价格"
            v-model="sku.price"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="重量(千克)"
          prop="weight"
          label-width="80px"
          :min="0"
        >
          <el-input
            type="number"
            placeholder="SKU重量"
            v-model="sku.weight"
          ></el-input>
        </el-form-item>
        <el-form-item label="规格描述" prop="skuDesc" label-width="80px">
          <el-input
            type="textarea"
            rows="4"
            placeholder="SKU规格描述"
            v-model="sku.skuDesc"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性" prop="spuAttr" label-width="80px">
          <el-form inline>
            <el-form-item
              v-for="attrInfo in attrInfoList"
              :key="attrInfo.id"
              :label="attrInfo.attrName"
              prop="spuName"
              label-width="100px"
            >
              <el-select placeholder="请选择" v-model="attrInfo.attrValueId">
                <el-option
                  v-for="attrValue in attrInfo.attrValueList"
                  :label="attrValue.valueName"
                  :value="attrValue.id"
                  :key="attrValue.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="销售属性" prop="saleAttrName" label-width="80px">
          <el-form inline>
            <el-form-item
              :label="spuSaleAttr.saleAttrName"
              prop="spuName"
              label-width="100px"
              v-for="spuSaleAttr in spuSaleAttrList"
              :key="spuSaleAttr.id"
            >
              <el-select
                placeholder="请选择"
                v-model="spuSaleAttr.saleAttrValueId"
              >
                <el-option
                  :label="spuValue.saleAttrValueName"
                  :value="spuValue.id"
                  v-for="spuValue in spuSaleAttr.spuSaleAttrValueList"
                  :key="spuValue.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="图片列表" label-width="80px">
          <el-table
            border
            :data="spuImageList"
            ref="multipleTable"
            style="width: 100%; margin-bottom: 20px"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="图片" prop="imgUrl">
              <template slot-scope="scope">
                <img
                  style="width: 120px; height: 80px"
                  :src="scope.row.imgUrl"
                  alt="spuImage"
                />
              </template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini">设为默认</el-button>
            </el-table-column>
          </el-table>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {mapState} from "vuex"
export default {
  name: "SkuList",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      sku: {
        skuName: "", //sku名称
        price: "", //价格
        weight: "", //重量
        skuDesc: "", //规格描述
      },
      attrInfoList: [], //平台属性列表信息
      spuSaleAttrList: [], //SPU销售属性列表
      spuImageList: [], //SPU图片列表
    };
  },
  computed:{
    ...mapState({
          category:(state)=>state.category.category
        }),
  },
  methods: {
    // 获取属性列表
    async getAttrInfoList() {
      const result = await this.$API.attr.getAttrInfoList({ ...this.category });
      if (result.code === 200) {
        this.attrInfoList = result.data;
        this.$message.success("获取属性列表成功！");
      } else {
        this.$message.error(result.message);
      }
    },
    //获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
        this.$message.success("获取SPU销售属性列表成功！");
      } else {
        this.$message.error(result.message);
      }
    },
    //获取SPU图片列表
    async getSpuImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      if (result.code === 200) {
        this.spuImageList = result.data;
        this.$message.success("获取SPU销售属性列表成功！");
      } else {
        this.$message.error(result.message);
      }
    },
  },

  mounted() {
    this.getAttrInfoList();
    this.getSpuSaleAttrList();
    this.getSpuImageList();
  },
};
</script>

<style lang="less" scoped>
</style>

