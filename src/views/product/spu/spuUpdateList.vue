<template>
  <div>
    <el-card style="margin-top: 20px">
      <!--
      表单校验：
        1. 整体form表单中
        2. 通过prop属性来定义表单项名称
        3. 定义表单校验规则
          - 在data中定义rules
          - 绑定给form
        4. 校验表单
          - 给form绑定ref
          - this.$refs.spuForm.validate 校验表单
     -->
      <el-form :model="spu" :rules="rules" ref="spuForm">
        <!-- prop 是用来表单校验时用的。不做表单校验就没必要写。 -->
        <el-form-item label="SPU名称" prop="spuName" label-width="80px">
          <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="tmId" label-width="80px">
          <el-select placeholder="请选择品牌" v-model="spu.tmId">
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
        <el-form-item label="SPU图片" prop="spuImageList" label-width="80px">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="formatImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
          <el-dialog :visible.sync="visible">
            <img width="100%" :src="dialogImageUrl" alt="img" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性" prop="sale" label-width="80px">
          <!-- 方法一 -->
          <!-- <el-select
            :placeholder="
              filterSaleAttrList.length
                ? `还有个${filterSaleAttrList.length}未选择`
                : '没有啦！'
            "
            v-model="spu.sale"
          >
            <el-option
              v-for="saleAttr in filterSaleAttrList"
              :key="saleAttr.id"
              :label="saleAttr.name"
              :value="saleAttr.id"
            ></el-option>
          </el-select> -->
          <!-- 方法二更好，可以后续不用find遍历查找了，直接就split分割就拿到了 -->
          <!-- select中 v-model的值（select选中的值）就是option中value的值 -->
          <el-select
            :placeholder="
              filterSaleAttrList.length
                ? `还有个${filterSaleAttrList.length}未选择`
                : '没有啦！'
            "
            v-model="spu.sale"
          >
            <el-option
              v-for="saleAttr in filterSaleAttrList"
              :key="saleAttr.id"
              :label="saleAttr.name"
              :value="`${saleAttr.id}-${saleAttr.name}`"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!spu.sale"
            @click="addSaleAttr"
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
              <template v-slot="{ row, $index }">
                <el-tag
                  style="margin-right: 5px"
                  v-for="saleAttrValue in row.spuSaleAttrValueList"
                  :key="saleAttrValue.id"
                  closable
                  @close="handleClose(saleAttrValue.saleAttrValueName, row)"
                  >{{ saleAttrValue.saleAttrValueName }}</el-tag
                >
                <el-input
                  placeholder="名称"
                  ref="input"
                  v-model.trim="attrValue"
                  v-if="row.edit"
                  size="small"
                  style="width: 80px"
                  @blur="editCompleted(row, $index)"
                  @keyup.enter.native="editCompleted(row, $index)"
                ></el-input>
                <el-button size="mini" @click="edit(row)" v-else
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteAttr(row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="saveUpdateSpuInfo">保存</el-button>
          <el-button @click="$emit('exit')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {mapState} from "vuex";
export default {
  name: "SpuUpdateList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      // spu: {},
      spu: this.spuItem,
      trademarkList: [], //品牌列表
      spuImageList: [], //SPU图片列表
      spuSaleAttrList: [], //当前SPU销售属性列表（下面表格里的数据）
      baseSaleAttrList: [], //所有销售属性列表(下拉列表里的数据)
      dialogImageUrl: "",
      visible: false,
      attrValue: "",
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称！" }],
        tmId: [{ required: true, message: "请选择品牌！" }],
        description: [{ required: true, message: "请输入SPU描述！" }],
        spuImageList: [
          { validator: this.spuImageListValidator, required: true },
        ],
        sale: [{ validator: this.saleValidator, required: true }],
      },
    };
  },
  computed: {
    ...mapState({
      category:(state)=>state.category.category
    }),
    filterSaleAttrList() {
      return this.baseSaleAttrList.filter((baseSaleAttr) => {
        return !this.spuSaleAttrList.find(
          (spuSaleAttr) => spuSaleAttr.baseSaleAttrId === baseSaleAttr.id
        );
      });
    },
    formatImageList() {
      return this.spuImageList.map((img) => {
        // 处理数据
        // [{imgName: '', imgUrl: ''}]
        // [{name: '', url: ''}]
        return {
          // 一上来请求回来的数据只有id
          // 新添加的数据不能设置id（由后台设置），所以写的是uid
          // 总之，id一定由后台服务器生成
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
  },
  methods: {
    //上传图片校验
    spuImageListValidator(rule, value, callback) {
      if (this.spuImageList.length === 0) {
        return callback(new Error("请至少上传一张图片！"));
      }
      callback();
    },
    //销售属性校验
    saleValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        return callback(new Error("请至少选择一个销售属性！"));
      }
      const isNotOk = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      );
      if (isNotOk) {
        return callback(new Error("请至少给销售属性添加一个属性值！"));
      }
      callback();
    },
    //获取品牌列表
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        // console.log(result);
        this.trademarkList = result.data;
        // this.$message.success("获取品牌列表成功");
      } else {
        this.$message.error(result.message);
      }
    },
    //获取SPU图片列表
    async getSpuImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      if (result.code === 200) {
        this.spuImageList = result.data;
        // this.$message.success("获取SPU图片列表成功");
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
        // this.$message.success("获取SPU销售属性列表");
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取基本销售属性列表
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList();
      if (result.code === 200) {
        this.baseSaleAttrList = result.data;
        // this.$message.success("获取基本销售属性列表");
      } else {
        this.$message.error(result.message);
      }
    },
    //显示大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.visible = true;
    },
    //图片上传之前的回调
    beforeAvatarUpload(file) {
      const logoTypes = ["image/jpeg", "image/jpg", "image/png"];
      // 检测文件类型
      const isVailImg = logoTypes.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;

      if (!isVailImg) {
        this.$message.error("上传品牌LOGO图片只能是 JPG 格式!");
      }
      // 检测文件大小
      if (!isLt) {
        this.$message.error("上传品牌LOGO图片大小不能超过 50kb!");
      }
      // 返回值为true，代表可以上传
      // 返回值为false，代表不可以上传
      return isVailImg && isLt;
    },
    //图片上传成功的回调
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      this.spuImageList.push({
        uid: file.uid,
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
      });
    },
    // 处理上传图片删除功能
    handleRemove(file) {
      // console.log(fileList); 第二个参数得到的是删除后的图片数组，但是里面数据格式不是未来发请求用的，还得转。所以不使用它，采用下面的方式去处理
      this.spuImageList = this.spuImageList.filter(
        (img) => img.imgUrl !== file.url
      );
    },
    //添加销售属性按钮事件 方法一
    /* addSaleAttr() {
      let spuSaleAttr = this.baseSaleAttrList.find(
        (baseSaleAttr) => baseSaleAttr.id === this.spu.sale
      );
      spuSaleAttr = {
        baseSaleAttrId: this.spu.sale,
        spuId: this.spu.id,
        saleAttrName: spuSaleAttr.name,
        spuSaleAttrValueList: [],
      };
      this.spuSaleAttrList.push(spuSaleAttr);
      this.selectId = "";
    }, */
    // 方法二
    addSaleAttr() {
      const { sale, id } = this.spu;
      const [baseSaleAttrId, saleAttrName] = sale.split("-");
      const spuSaleAttr = {
        baseSaleAttrId: +baseSaleAttrId,
        spuId: id,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuSaleAttrList.push(spuSaleAttr);
      this.spu.sale = "";
    },
    //点击开始切换成input框
    edit(row) {
      this.$set(row, "edit", true);
      //获取焦点
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //input框失去焦点时触发
    editCompleted(row, index, a) {
      if (!this.attrValue) return;
      const isNotOk = row.spuSaleAttrValueList.find(
        (sale) => sale.saleAttrValueName === this.attrValue
      );
      if (isNotOk) {
        this.$message.warning("销售属性值不能重复，请修改！");
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
        return;
      }
      const spuSaleAttrValue = {
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrName: row.saleAttrName,
        saleAttrValueName: this.attrValue,
        spuId: row.spuId,
      };
      row.spuSaleAttrValueList.push(spuSaleAttrValue);
      this.attrValue = "";
      row.edit = false;
    },
    //删除一个tag标签
    handleClose(tag, row) {
      row.spuSaleAttrValueList = row.spuSaleAttrValueList.filter(
        (spuSale) => spuSale.saleAttrValueName !== tag
      );
    },
    //删除一行销售属性
    deleteAttr(row) {
      this.spuSaleAttrList = this.spuSaleAttrList.filter(
        (spuSale) => spuSale.baseSaleAttrId !== row.baseSaleAttrId
      );
    },
    //保存SPU修改的数据
    saveUpdateSpuInfo() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          /* const spuInfo = {
            id: this.spu.id,
            spuName: this.spu.spuName,
            description: this.spu.description,
            category3Id: this.spu.category3Id,
            tmId: this.spu.tmId,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.spuSaleAttrList,
          }; */
          const spuInfo = {
            ...this.spu,
            category3Id:this.category.category3Id,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };
          let result;
          if (this.spu.id) {
            result = await this.$API.spu.getAttrValueList(spuInfo);
          } else {
            result = await this.$API.spu.getAttrInfoList(spuInfo);
          }
          if (result.code === 200) {
            this.$message.success(
              `${this.spu.id ? "修改" : "添加"}SPU的数据成功！`
            );
            this.$emit("exit");
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
  },

  mounted() {
    this.getTrademarkList();
    this.getBaseSaleAttrList();
    if (this.spu.id) {
      this.getSpuImageList();
      this.getSpuSaleAttrList();
    }
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

