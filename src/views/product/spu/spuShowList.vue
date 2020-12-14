<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table
        :data="spuList"
        border
        style="width: 100%; margin: 10px 0"
        v-loading="loading"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述">
          <template> </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="$bus.$emit('showSpuList', row)"
            ></el-button>
            <el-button type="info" icon="el-icon-info" size="mini"></el-button>
            <el-popconfirm :title="`确定要删除 吗？`">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuShowList",
  data() {
    return {
      spuList: [],
      page: 1,
      limit: 3,
      total: 0,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      loading: false,
    };
  },
  methods: {
    async getPageList(page, limit) {
      this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
        this.$message.success("获取SPU分页列表信息成功~");
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    // 处理category的change（当选中三级分类时触发）
    handleCategoryChange(category) {
      this.category = category;
      this.getPageList(this.page, this.limit);
    },
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category.category3Id = "";
    },
  },
  mounted() {
    this.$bus.$on("change", this.handleCategoryChange);
    this.$bus.$on("clearList", this.clearList);
  },
  // 组件中绑定的全局事件总线 要在组件卸载的时候，将绑定的事件解绑
  beforeDestroy() {
    this.$bus.$off("change", this.handleCategoryChange);
    this.$bus.$off("clearList", this.clearList);
  },
};
</script>

<style lang="less" scoped>
</style>

