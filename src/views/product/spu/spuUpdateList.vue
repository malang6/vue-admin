<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="spu">
        <!-- prop 是用来表单校验时用的。不做表单校验就没必要写。 -->
        <el-form-item label="SPU名称" prop="spuName" label-width="80px">
          <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="attrName" label-width="80px">
          <el-select placeholder="请选择品牌">
            <el-option
              v-for="tm in trademarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description" label-width="80px">
          <el-input
            type="textarea"
            rows="4"
            placeholder="SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片" prop="logoUrl">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="spuImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="visible">
            <img width="100%" :src="dialogImageUrl" alt="img" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性" prop="attrName" label-width="80px">
          <el-select :placeholder="`还有个${filterSaleAttrList.length}未选择`">
            <el-option
              v-for="saleAttr in filterSaleAttrList"
              :key="saleAttr.id"
              :label="saleAttr.name"
              :value="saleAttr.id"
            ></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" disabled
            >添加销售属性</el-button
          >
          <el-table
            :data="spuSaleAttrList"
            border
            style="width: 100%; margin: 10px 0"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column prop="saleAttrName" label="属性名">
              <template> </template>
            </el-table-column>
            <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
              <template v-slot="{ row }">
                <el-tag
                  style="margin-right: 5px"
                  v-for="saleAttrValue in row.spuSaleAttrValueList"
                  :key="saleAttrValue.id"
                  >{{ saleAttrValue.saleAttrValueName }}</el-tag
                >
                <template>
                  <el-button size="mini">+ 添加</el-button>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </template>
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
  name: "SpuUpdateList",
  props: {
    item: Object,
  },
  data() {
    return {
      // spu: {},
      spu: this.item,
      trademarkList: [], //品牌列表
      spuImageList: [], //SPU图片列表
      spuSaleAttrList: [], //当前SPU销售属性列表（下面表格里的数据）
      baseSaleAttrList: [], //所有销售属性列表(下拉列表里的数据)
      dialogImageUrl: "",
      visible: false,
    };
  },
  computed: {
    filterSaleAttrList() {
      return this.baseSaleAttrList.filter((baseSaleAttr) => {
        return !this.spuSaleAttrList.find(
          (spuSaleAttr) => spuSaleAttr.baseSaleAttrId === baseSaleAttr.id
        );
      });
    },
  },
  methods: {
    //获取品牌列表
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        // console.log(result);
        this.trademarkList = result.data;
        this.$message.success("获取品牌列表成功");
      } else {
        this.$message.error(result.message);
      }
    },
    //获取SPU图片列表
    async getSpuImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      if (result.code === 200) {
        this.spuImageList = result.data.map((img) => {
          // 处理数据
          // [{imgName: '', imgUrl: ''}]
          // [{name: '', url: ''}]
          return {
            id: img.id,
            name: img.imgName,
            url: img.imgUrl,
          };
        });
        this.$message.success("获取SPU图片列表成功");
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
        this.$message.success("获取SPU销售属性列表");
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取基本销售属性列表
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList();
      if (result.code === 200) {
        this.baseSaleAttrList = result.data;
        this.$message.success("获取基本销售属性列表");
      } else {
        this.$message.error(result.message);
      }
    },
    //显示大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.visible = true;
    },
    // 处理删除
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.imageList = this.imageList.filter((img) => img.id !== file.id);
    },
  },

  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getBaseSaleAttrList();
  },

  //如果前面使用v-show切换 要使用watch监视item的变化，因为一开始拿到的是{}
  /*   watch: {
    item(val) {
      console.log(val);
      this.spu = val;
    },
  }, */
};
</script>

<style lang="less" scoped>
</style>

