<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTrademark"
      >添加</el-button
    >
    <el-table
      :data="tradeMarkList"
      border
      style="width: 100%; margin: 20px 0"
      v-loading="loading"
    >
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
        <!-- v-slot="scoped" 作用域插槽  elementUI里用的slot-scoped是老语法，即将被废弃的 -->
        <template v-slot="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTrademark(scope.row)"
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
      class="pagination"
    >
    </el-pagination>

    <el-dialog
      :title="`${tradeMarkForm.id ? '修改' : '添加'}品牌`"
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
          <!--
            前提允许跨域
              action="http://182.92.128.115/admin/product/fileUpload"
              目标服务器地址: 代理配置中 (vue.config.js)

            不允许跨域，就使用proxy
              action="/dev-api/admin/product/fileUpload"
              /dev-api -> request.js 代理
             在main.js中定义 Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API
           -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
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
      visible: false, // 对话框显示&隐藏
      tradeMarkForm: {
        // 表单数据
        tmName: "",
        logoUrl: "",
      },
      rules: {
        // 表单校验规则
        tmName: [
          // { required: true, message: "请输入品牌名称", trigger: "blur" },

          //自定义校验规则
          {
            validator: this.validator,
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌图片" }],
      },
      loading: true,
    };
  },
  methods: {
    //自定义表单校验
    validator(rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入品牌名称"));
      } else if (value.length < 2 || value.length > 10) {
        return callback(new Error("输入的品牌名称长度为2-10"));
      }
      callback();
    },
    // 请求分页列表数据
    async getPageList(page, limit) {
      this.loading = true;
      const result = await this.$API.tradeMark.getPageList(page, limit);
      this.loading = false;
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
      this.tradeMarkForm = {};
    },
    //点取消按钮 关闭弹窗
    cancel() {
      this.visible = false;
      this.tradeMarkForm = {};
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
    handleAvatarSuccess(res) {
      // console.log(res.data); // 图片地址
      this.tradeMarkForm.logoUrl = res.data;
    },
    //提交表单
    submitForm(form) {
      const { id } = this.tradeMarkForm;
      // 校验表单
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          let result;
          // 表单校验通过
          if (id) {
            const tm = this.tradeMarkList.find((tm) => tm.id === id);
            if (
              tm.tmName !== this.tradeMarkForm.tmName ||
              tm.logoUrl !== this.tradeMarkForm.logoUrl
            ) {
              result = await this.$API.tradeMark.updateTrademark(
                this.tradeMarkForm
              );
            } else {
              return this.$message.warning("请修改了数据再提交表单");
            }
          } else {
            result = await this.$API.tradeMark.addTrademark(this.tradeMarkForm);
          }
          if (result.code === 200) {
            this.visible = false; // 隐藏对话框
            this.getPageList(this.page, this.limit); // 请求加载新数据
          }
          this.$message.success(`${id ? "修改" : "添加"}品牌信息成功~`);
        } else {
          // this.$message.error(result.message);
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
    //添加品牌信息
    addTrademark() {
      this.visible = true;
      //清空表单校验失败的提示
      this.$refs.tradeMarkForm && this.$refs.tradeMarkForm.clearValidate();
      this.tradeMarkForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    //修改品牌信息
    updateTrademark(row) {
      //清空表单校验失败的提示
      this.$refs.tradeMarkForm && this.$refs.tradeMarkForm.clearValidate();
      /*
        const a = [{x: 1}];
        const b = a[0];
        b.x = 2;

        trademarkList: [row]
        trademarkForm = row
        trademarkForm.x = 2
      */
      // console.log(row);
      this.visible = true;
      // row 代表当前行的数据 {}
      // this.trademarkForm = row; // 地址值一样，修改trademarkForm会导致trademarkList发生变化
      this.tradeMarkForm = { ...row };
      // this.trademarkForm = JSON.parse(JSON.stringify(row)); 数据里没有函数可以用这个方法深度克隆
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
