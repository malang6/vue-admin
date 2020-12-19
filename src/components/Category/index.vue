<template>
  <el-card>
    <el-form inline :model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="handleSelectChange1"
          :disabled="!isShowList"
        >
          <el-option
            v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="handleSelectChange2"
          :disabled="!isShowList"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          @change="handleSelectChange3"
          :disabled="!isShowList"
        >
          <el-option
            v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Category",
  data() {
    const { category } = this.$store.state.category;
    return {
      category: {
        category1Id: category.category1Id,
        category2Id: category.category2Id,
        category3Id: category.category3Id,
      },

      // category: {
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // },
      // category1List: [],
      // category2List: [],
      // category3List: [],
    };
  },
  props: ["isShowList"],
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
      // 不行：数据代理是先代理data数据，再代理计算属性
      // category: (state) => state.category.category,
    }),
  },
  methods: {
    ...mapMutations(["category/SET_CATEGORY3_ID"]),
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),
    handleSelectChange1(category1Id) {
      this.category.category2Id = "";
      this.category.category3Id = "";
      this["category/getCategory2List"](category1Id);
      // this.$bus.$emit("clearList");
    },
    handleSelectChange2(category2Id) {
      this.category.category3Id = "";
      this["category/getCategory3List"](category2Id);
      // this.$bus.$emit("clearList");
    },
    handleSelectChange3(category3Id) {
      this["category/SET_CATEGORY3_ID"](category3Id);
      // this.$bus.$emit("change",this.category);
    },
    /* async handleSelectChange1(category1Id) {
      // console.log(category1Id);
      this.category.category2Id = "";
      this.category.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      const result = await this.$API.attr.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      } else {
        this.$message.error(result.message);
      }
      this.$bus.$emit("clearList");
    },
    async handleSelectChange2(category2Id) {
      this.category.category3Id = "";
      this.category3List = [];
      const result = await this.$API.attr.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      } else {
        this.$message.error(result.message);
      }
      this.$bus.$emit("clearList");
    },
    async handleSelectChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };
      this.$bus.$emit("change", this.category);
    }, */
  },
  async mounted() {
    this["category/getCategory1List"]();
    /* const result = await this.$API.attr.getCategory1();
    if (result.code === 200) {
      this.category1List = result.data;
    } else {
      this.$message.error(result.message);
    } */
  },
};
</script>
