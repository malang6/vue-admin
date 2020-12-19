<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="sku" :rules="rules" ref="skuForm">
        <el-form-item label="SPU名称" prop="spuName" label-width="80px">
          <span>{{ spu.spuName }}</span>
        </el-form-item>
        <el-form-item label="SKU名称" prop="skuName" label-width="80px">
          <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price" label-width="80px">
          <el-input
            type="number"
            placeholder="SKU价格"
            v-model="sku.price"
            :min="0"
            :max="200000"
          ></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)" prop="weight" label-width="80px">
          <el-input
            type="number"
            placeholder="SKU重量"
            v-model="sku.weight"
            :min="0"
            :max="200000"
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
        <el-form-item
          label="平台属性"
          prop="skuAttrValueList"
          label-width="80px"
        >
          <el-form inline>
            <el-form-item
              v-for="(attrInfo, index) in attrInfoList"
              :key="attrInfo.id"
              :label="attrInfo.attrName"
              prop="spuName"
              label-width="100px"
            >
              <el-select
                placeholder="请选择"
                v-model="sku.skuAttrValueList[index]"
                @change="clearValidate('skuAttrValueList')"
              >
                <el-option
                  v-for="attrValue in attrInfo.attrValueList"
                  :label="attrValue.valueName"
                  :value="`${attrInfo.id}-${attrValue.id}`"
                  :key="attrValue.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item
          label="销售属性"
          prop="skuSaleAttrValueList"
          label-width="80px"
        >
          <el-form inline>
            <el-form-item
              :label="spuSaleAttr.saleAttrName"
              prop="spuName"
              label-width="100px"
              v-for="(spuSaleAttr, index) in spuSaleAttrList"
              :key="spuSaleAttr.id"
            >
              <el-select
                placeholder="请选择"
                v-model="sku.skuSaleAttrValueList[index]"
                @change="clearValidate('skuSaleAttrValueList')"
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
        <el-form-item label="图片列表" label-width="80px" prop="skuImageList">
          <el-table
            border
            :data="spuImageList"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
          >
            <el-table-column type="selection" width="55" reserve-selection>
            </el-table-column>
            <el-table-column label="图片" prop="imgUrl">
              <template slot-scope="scope">
                <img
                  style="width: 120px; height: 80px"
                  :src="scope.row.imgUrl"
                  :alt="scope.row.imgName"
                />
              </template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-tag v-if="row.isDefault" type="success">默认</el-tag>
                <el-button
                  v-else
                  type="primary"
                  size="mini"
                  @click="setDefault(row.id)"
                  >设为默认</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label-width="80px">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
      attrInfoList: [], //平台属性列表信息
      spuSaleAttrList: [], //SPU销售属性列表
      spuImageList: [], //SPU图片列表
      rules: {
        skuName: [
          {
            required: true,
            message: "请输入sku名称！",
            trigger: "change",
          },
        ],
        price: [
          {
            required: true,
            message: "请输入价格！",
            trigger: "change",
          },
        ],
        weight: [
          {
            required: true,
            message: "请输入重量！",
            trigger: "change",
          },
        ],
        skuDesc: [
          {
            required: true,
            message: "请输入规格描述！",
            trigger: "change",
          },
        ],
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
        skuSaleAttrValueList: [
          {
            required: true,
            validator: this.skuSaleAttrValueListValidator,
          },
        ],
        skuImageList: [
          {
            required: true,
            validator: this.skuImageListValidator,
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    // 点击取消退出
    cancle() {
      this.$emit("exit");
    },
    // 移除表单项验证
    clearValidate(prop) {
      // 清空表单校验
      this.$refs.skuForm.clearValidate(prop);
    },
    //平台属性校验
    skuAttrValueListValidator(rule, value, callback) {
      const {
        attrInfoList,
        sku: { skuAttrValueList },
      } = this;
      if (
        skuAttrValueList.length !== attrInfoList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback(new Error("请选择所有平台属性！"));
      }
      callback();
    },
    // 销售属性校验
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback(new Error("请选择所有销售属性！"));
      }
      callback();
    },
    // 默认图片校验
    skuImageListValidator(rule, value, callback) {
      const { skuImageList } = this.sku;
      if (skuImageList.length === 0) {
        callback(new Error("请选择至少一张图片"));
      }
      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error("请至少设置一张图片为默认图片！"));
      }
      callback();
    },
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
    //选中的图
    handleSelectionChange(skuImageList) {
      // console.log(skuImageList);
      this.sku.skuImageList = skuImageList;
    },
    //设置为默认图
    setDefault(id) {
      this.clearValidate("skuImageList");
      this.spuImageList = this.spuImageList.map((spuImg) => {
        return {
          ...spuImg,
          isDefault: spuImg.id === id ? true : false,
        };
      });
      this.sku.skuImageList = this.sku.skuImageList.map((skuImg) => {
        return {
          ...skuImg,
          isDefault: skuImg.id === id ? true : false,
        };
      });
    },
    // 保存sku信息
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          // console.log("校验成功");
          const { id: spuId, tmId, category3Id } = this.spu;
          const skuDefaultImg = this.sku.skuImageList.find(
            (img) => img.isDefault
          ).imgUrl;
          const skuAttrValueList = this.sku.skuAttrValueList.map((attr) => {
            const [attrId, valueId] = attr.split("-");
            return {
              attrId,
              valueId,
            };
          });
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );
          const result = await this.$API.sku.saveSkuInfo({
            ...this.sku,
            skuDefaultImg,
            skuAttrValueList,
            skuSaleAttrValueList,
            spuId,
            tmId,
            category3Id,
          });
          if (result.code === 200) {
            this.$message.success("保存SKU信息成功！");
            this.$emit("exit");
          } else {
            this.$message.error(result.message);
          }
        }
      });
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

