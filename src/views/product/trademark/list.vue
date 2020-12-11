<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="visible = true"
      >添加</el-button
    >
    <el-table :data="tradeMarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column prop="img" label="品牌LOGO">
        <template slot-scope="scope">
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-edit" size="mini"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(scope.$index, tradeMarkList)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 原来的方法 -->
    <!-- <el-pagination
      class="trademark-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination> -->

    <!--
      :page-size.sync="limit"   可以让limit更新变成同步更新
      :current-page.sync="page" 可以让page更新变成同步更新

      $event
        1.  在DOM事件中代表 event
        <button @click="handle(123, $event)"></button>
        触发事件是浏览器的行为，所以$event代表event

        2. 在自定义事件中代表 第一个参数
          <button @aaa="handle($event)"></button>
          假设这样触发自定义事件： this.$emit('aaa', 123, 456);
          那么$event就为123（第一个参数）
    -->

    <el-pagination
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :current-page="page"
      :page-size.sync="limit"
      layout="prev, pager, next ,jumper, sizes,total"
      :total="total"
      class="trademark-pagination"
    >
    </el-pagination>

    <el-dialog
      title="添加品牌"
      :visible.sync="visible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="tradeMarkForm"
        :rules="rules"
        ref="tradeMarkForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="tradeMarkForm.tmName"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tradeMarkForm.logoUrl"
              :src="tradeMarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('tradeMarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 原来是这么写，但是这里在main.js中将api代理到了Vue.prototype.$API上，所以可以直接使用this.$API来获取。
// import { trademark } from "@/api";

export default {
  name: "TrademarkList",
  data() {
    return {
      tradeMarkList: [], // 所有数据
      total: 0, // 总数
      page: 1, // 页码
      limit: 3, // 每页条数
      visible: false,
      tradeMarkForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传品牌图片" }],
      },
    };
  },
  methods: {
    // 请求分页列表数据
    async getPageList(page, limit) {
      const result = await this.$API.tradeMark.getPageList(page, limit);
      if (result.code === 200) {
        // this.$message.success("获取品牌信息列表成功~");
        this.tradeMarkList = result.data.records;
        this.total = result.data.total; // 总数
        this.page = result.data.current; // 代表当前页码
        this.limit = result.data.size; // 代表每页显示的条数
      } else {
        this.$message.error("获取品牌信息列表失败");
      }
    },
    /* // 老方法，可以使用上面的简写
    handleSizeChange(limit) {
      this.getPageList(this.page, limit);
    },
    handleCurrentChange(page) {
      this.getPageList(page, this.limit);
    }, */
    //点 X 关闭弹窗
    handleClose() {
      this.visible = false;
      this.tradeMarkForm.tmName = "";
      this.tradeMarkForm.logoUrl = "";
    },
    //点取消按钮 关闭弹窗
    cancel() {
      this.visible = false;
      this.tradeMarkForm.tmName = "";
      this.tradeMarkForm.logoUrl = "";
    },
    //图片上传之前的回调
    beforeAvatarUpload(file) {
      const logoType = ["image/jpeg", "image/jpg", "image/png"];
      const isVailImg = logoType.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;

      if (!isVailImg) {
        this.$message.error("上传品牌LOGO图片只能是 JPG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO图片大小不能超过 50kb!");
      }
      return isVailImg && isLt;
    },
    //图片上传成功的回调
    handleAvatarSuccess(res, file) {
      this.tradeMarkForm.logoUrl = URL.createObjectURL(file.raw);
    },
    //提交表单
    submitForm(tradeMarkForm) {
      this.$refs[tradeMarkForm].validate(async (valid) => {
        if (valid) {
          this.$message.success("添加品牌信息成功~");
          const result = await this.$API.tradeMark.addTrademark(
            this.tradeMarkForm
          );
          if (result.code === 200) {
            this.visible = false;
            this.tradeMarkForm.tmName = "";
            this.tradeMarkForm.logoUrl = "";
            this.getPageList(this.page, this.limit);
          }
        } else {
          return false;
        }
      });
    },
    //删除品牌信息
    deleteTrademark(index, tradeMarkList) {
      this.$confirm(`确定删除 ${tradeMarkList[index].tmName} 吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const id = tradeMarkList[index].id;
          const result = await this.$API.tradeMark.deleteTrademark(id);
          if (result.code === 200) {
            this.$message.success("删除成功！");
            this.getPageList(this.page, this.limit);
          } else {
            this.$message.error("删除品牌信息失败！");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },

  /*
  lang="less"
    完整写法
    深度选择器 /deep/

  lang="sass"
    可以省略 {}
    可以省略 ;
    深度选择器 /deep/  >>>
  lang="scss"
    完整写法

  lang="stylus"
    可以省略 {}
    可以省略 :
    可以省略 ;

  scoped
    让样式只在当前组件生效
    问题：加上scoped，会让设置的子组件样式失效
    解决：使用深度选择器
*/
};
</script>
<style lang="sass" scoped>
.trademark-img
  width: 110px
  height: 70px
.trademark-pagination
  text-align: right
>>>.el-pagination__sizes
  margin-left: 250px
>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

  .avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

  .avatar
    width: 178px
    height: 178px
    display: block
</style>
