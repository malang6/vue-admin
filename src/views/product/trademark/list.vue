<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
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
        <template>
          <el-button type="warning" icon="el-icon-edit" size="mini"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
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
    };
  },
  methods: {
    // 请求分页列表数据
    async getPageList(page, limit) {
      try {
        const result = await this.$API.tradeMark.getPageList(page, limit);
        if (result.code === 200) {
          this.$message.success("获取品牌信息列表成功~");
          this.tradeMarkList = result.data.records;
          this.total = result.data.total; // 总数
          this.page = result.data.current; // 代表当前页码
          this.limit = result.data.size; // 代表每页显示的条数
        } else {
          this.$message.error("获取品牌信息列表失败");
        }
      } catch (e) {
        console.log(e);
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
</style>
