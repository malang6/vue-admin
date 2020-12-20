<template>
  <div>
    <el-card>
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column prop="skuName" label="名称"> </el-table-column>
        <el-table-column prop="skuDesc" label="描述">
          <template> </template>
        </el-table-column>
        <el-table-column
          prop="skuDefaultImg"
          label="默认图片"
          width="130"
          align="center"
        >
          <template slot-scope="scope">
            <img
              class="trademark-img"
              :src="scope.row.skuDefaultImg"
              alt="logo"
              style="width: 100%; height: 80px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)"> </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="90">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <el-button
              v-show="!row.isSale"
              type="info"
              icon="el-icon-top"
              size="mini"
              class="button"
              @click="changeSale(row)"
            ></el-button>
            <el-button
              v-show="row.isSale"
              type="success"
              icon="el-icon-bottom"
              size="mini"
              class="button"
              @click="changeSale(row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              class="button"
              @click="edit"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              class="button"
              @click="showDraw(row.id)"
            ></el-button>
            <el-popconfirm
              :title="`确定要删除 ${row.skuName} 吗？`"
              @onConfirm="deleteSku(row.id)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                class="button"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="getPageList(page, $event)"
        @current-change="getPageList($event, limit)"
        :page-sizes="[5, 10, 20, 30, 40, 50]"
        :current-page="page"
        :page-size.sync="limit"
        layout="prev, pager, next ,jumper, sizes,total"
        :total="total"
        class="pagination"
      >
      </el-pagination>
    </el-card>

    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :show-close="false"
      size="50%"
      :with-header="false"
      :before-close="handleClose"
    >
      <el-row>
        <el-col :span="6"><div class="grid-content">名称</div></el-col>
        <el-col :span="18" class="content"
          ><div>{{ skuInfo.skuName }}</div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"><div class="grid-content">描述</div></el-col>
        <el-col :span="18" class="content"
          ><div>{{ skuInfo.skuDesc }}</div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"><div class="grid-content">价格</div></el-col>
        <el-col :span="18" class="content"
          ><div>{{ skuInfo.price }}</div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"><div class="grid-content">平台属性</div></el-col>
        <el-col
          :span="2"
          class="content"
          v-for="value in skuInfo.skuAttrValueList"
          :key="value.id"
          ><el-tag type="success">{{
            `${value.attrId}-${value.valueId}`
          }}</el-tag></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"><div class="grid-content">销售属性</div></el-col>
        <el-col
          :span="3"
          class="content"
          v-for="sale in skuInfo.skuSaleAttrValueList"
          :key="sale.id"
          ><el-tag type="success">{{
            `${sale.id}-${sale.saleAttrValueId}`
          }}</el-tag></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"><div class="grid-content">商品图片</div></el-col>
        <el-col :span="15" class="content">
          <div class="block">
            <el-carousel trigger="click" height="400px" class="carousel">
              <el-carousel-item
                v-for="img in skuInfo.skuImageList"
                :key="img.id"
              >
                <h3 class="small">
                  <img :src="img.imgUrl" :alt="img.imgName" />
                </h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "SKuList",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      skuList: [],
      drawer: false,
      skuInfo: {},
      loading: false,
    };
  },
  methods: {
    //获取SKU分页列表
    async getPageList(page, limit) {
      this.loading = true;
      const result = await this.$API.sku.getPageList(page, limit);
      if (result.code === 200) {
        // this.$message.success("获取SKU分页列表成功！");
        this.skuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    // 点击编辑
    edit() {
      this.$message.info("正在开发中...");
    },
    // 切换上下架
    async changeSale(row) {
      let result;
      if (row.isSale) {
        result = await this.$API.sku.cancelSale(row.id);
      } else {
        result = await this.$API.sku.onSale(row.id);
      }
      if (result.code === 200) {
        this.$message.success(`${row.isSale ? "下架" : "上架"}成功~`);
        this.getPageList(this.page, this.limit);
      }
    },
    //删除SKU
    async deleteSku(skuId) {
      const result = await this.$API.sku.deleteSku(skuId);
      if (result.code === 200) {
        this.$message.success("删除成功~");
        this.getPageList(this.page, this.limit);
      } else {
        this.$message.error(result.message);
      }
    },
    // 打开抽屉
    async showDraw(skuId) {
      this.drawer = true;
      const result = await this.$API.sku.getSkuById(skuId);
      if (result.code === 200) {
        // console.log(result);
        // this.skuInfo = JSON.parse(JSON.stringify(result.data));
        this.skuInfo = result.data;
      }
    },
    //关闭抽屉
    handleClose(done) {
      done();
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
};
</script>

<style lang="sass" scoped>
.button
  margin-left: 0
.grid-content
  font-size: 18px
  font-weight: bold
  text-align: right
  line-height: 40px
  padding-left: 100px
.content
  display: flex
  padding-left: 10px
  line-height: 40px
.carousel
  width: 450px
img
  width: 100%
  heigth: 100%
</style>
