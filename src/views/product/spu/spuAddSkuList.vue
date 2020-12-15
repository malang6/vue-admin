<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form>
        <el-form-item label="SPU名称" prop="spuName" label-width="80px">
          <span>红米K30 Pro777</span>
        </el-form-item>
        <el-form-item label="SPU名称" prop="spuName" label-width="80px">
          <el-input placeholder="SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="spuPrice" label-width="80px">
          <el-input type="number" placeholder="SPU价格"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)" prop="spuWeight" label-width="80px">
          <el-input type="number" placeholder="SPU重量"></el-input>
        </el-form-item>
        <el-form-item label="规格描述" prop="spuDesc" label-width="80px">
          <el-input
            type="textarea"
            rows="4"
            placeholder="SPU规格描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性" prop="spuAttr" label-width="80px">
          <el-form inline :model="attrInfoList">
            <el-form-item
              v-for="attrInfo in attrInfoList"
              :key="attrInfo.id"
              :label="attrInfo.attrName"
              prop="spuName"
              label-width="100px"
            >
              <el-select placeholder="请输入">
                <el-option
                  label="saleAttr.name"
                  :value="attrValue.id"
                  v-for="attrValue in attrInfo.attrValueList"
                  :key="attrValue.id"
                  >{{ attrValue.valueName }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="销售属性" prop="saleAttrName" label-width="80px">
          <el-form inline :model="spuSaleAttrList">
            <el-form-item
              :label="spuSaleAttr.saleAttrName"
              prop="spuName"
              label-width="100px"
              v-for="spuSaleAttr in spuSaleAttrList"
              :key="spuSaleAttr.id"
            >
              <el-select placeholder="请输入">
                <el-option
                  :value="spuValue.id"
                  v-for="spuValue in spuSaleAttr.spuSaleAttrValueList"
                  :key="spuValue.id"
                  >{{ spuValue.saleAttrValueName }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="图片列表" label-width="80px">
          <el-table
            border
            :data="spuImageList"
            ref="multipleTable"
            tooltip-effect="dark"
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
            <el-table-column label="操作" show-overflow-tooltip>
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
export default {
  name: "SpuAddSkuList",
  props: {
    category: Object,
    spuInfo: Object,
  },
  data() {
    return {
      attrInfoList: [], //平台属性列表信息
      spuSaleAttrList: [], //SPU销售属性列表
      spuImageList: [], //SPU图片列表
    };
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
      const result = await this.$API.spu.getSpuSaleAttrList(this.spuInfo.id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
        this.$message.success("获取SPU销售属性列表成功！");
      } else {
        this.$message.error(result.message);
      }
    },
    //获取SPU图片列表
    async getSpuImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spuInfo.id);
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

