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
            v-for="c1 in category1"
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
            v-for="c2 in category2"
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
            v-for="c3 in category3"
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
export default {
  name: "Category",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1: [],
      category2: [],
      category3: [],
    };
  },
  props: ["isShowList"],
  methods: {
    async handleSelectChange1(category1Id) {
      // console.log(category1Id);
      this.category.category2Id = "";
      this.category.category3Id = "";
      this.category2 = [];
      this.category3 = [];
      const result = await this.$API.attr.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2 = result.data;
      } else {
        this.$message.error(result.message);
      }
      this.$emit("clearList");
    },
    async handleSelectChange2(category2Id) {
      this.category.category3Id = "";
      this.category3 = [];
      const result = await this.$API.attr.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3 = result.data;
      } else {
        this.$message.error(result.message);
      }
      this.$emit("clearList");
    },
    async handleSelectChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };
      this.$emit("change", this.category);
    },
  },
  async mounted() {
    const result = await this.$API.attr.getCategory1();
    if (result.code === 200) {
      this.category1 = result.data;
    } else {
      this.$message.error(result.message);
    }
  },
};
</script>
