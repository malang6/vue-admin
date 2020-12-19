<template>
  <div>
    <!-- 自定义事件，但是后面的spu不能用 所以修改为了全局事件总线 -->
    <!-- <Category
      @change="getAttrList"
      :isShowList="isShowList"
      @clearList="clearList"
    /> -->
    <Category :isShowList="isShowList" />
    <el-card style="margin-top: 20px" v-show="isShowList">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="addAttr"
        >添加属性</el-button
      >
      <el-table :data="attrList" border style="width: 100%; margin: 10px 0">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column prop="attrValueList" label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(row)"
            ></el-button>
            <el-popconfirm
              :title="`确定要删除 ${row.attrName} 吗？`"
              @onConfirm="deleteAttr(row)"
            >
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
    </el-card>

    <el-card style="margin-top: 20px" v-show="!isShowList">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 10px"
        @click="addAttrValue"
        :disabled="!attr.attrName"
        >添加属性</el-button
      >
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 10px 0"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column prop="attrName" label="属性名称">
          <template v-slot="{ row, $index }">
            <!--
              事件修饰符：
                .native
                专门给组件绑定事件使用的
                会给组件中的第一个标签绑定相应的原生DOM事件
             -->
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              autofocus
              ref="input"
              size="mini"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
            >
            </el-input>
            <!-- 直接给对象添加新属性不是响应式数据, 通过this.$set添加的属性才是响应式 -->
            <span
              v-else
              style="display: block; width: 100%"
              @click="edit(row)"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <!-- 文档有问题：onConfirm -->
            <el-popconfirm
              :title="`确定要删除 ${row.valueName} 吗？`"
              @onConfirm="deleteAttrValue($index)"
            >
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
      <el-button type="primary" @click="save" :disabled="!attr.attrName"
        >保存</el-button
      >
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Category from "@/components/Category";
/*
categoryId:61
categoryLevel:3
id:3467
attrName:"屏幕尺寸"
attrValueList:Array[3]
  attrId:3467
  id:18904
  valueName:"5.0~5.49英寸"
*/
export default {
  name: "AttrList",
  data() {
    return {
      attrList: [], //属性列表
      isShowList: true, //true显示属性列表 false显示修改列表
      attr: {
        //每一行的
        attrName: "",
        attrValueList: [],
      },
      // category: {
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    "category.category3Id"(category3Id) {
      this.getAttrList();
    },
    "category.category1Id"() {
      this.clearList();
    },
    "category.category2Id"() {
      this.clearList();
    },
  },
  methods: {
    //获取属性列表信息
    async getAttrList() {
      //发送请求 获取属性列表信息
      const result = await this.$API.attr.getAttrInfoList({ ...this.category });
      if (result.code === 200) {
        // console.log(result.data);
        // 子组件给父组件传递参数 自定义事件
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //点击修改属性
    handleEdit(attr) {
      this.isShowList = false;
      // console.log(attr);
      // 为了防止attr变化时直接修改原数据
      // this.attr = {
      //   ...attr,
      // };

      // 深度克隆：防止对象中对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(attr));
    },
    //点击开始切换成input框
    edit(row) {
      //给引用类型新增一个响应式属性，要使用edit。
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //input框失去焦点时触发
    editCompleted(row, index) {
      // console.log(row, index);
      if (!row.valueName) {
        //值清空了 就表示想删除这个属性
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    //添加属性的属性值
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //删除属性
    deleteAttrValue(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    //保存修改
    async save() {
      // 判断是否是添加 (新添加的是没有id的。添加之后后台才会生成一个id)
      const isAdd = !this.attr.id;
      const data = this.attr;
      if (isAdd) {
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }
      const result = await this.$API.attr.saveAttrInfo(data);
      if (result.code === 200) {
        this.isShowList = true;
        this.getAttrList();
        this.$message.success("保存属性成功");
      } else {
        this.$message.error(result.message);
      }
    },
    //添加属性
    addAttr() {
      this.isShowList = false;
      //清空数据。为了保证后续里面还是响应式的数据，所以采用下面方式清空。如果直接将attr赋值为{}，会导致里面的数据不是响应式的
      this.attr.attrName = "";
      this.attr.attrValueList = [];
      this.attr.id = "";
    },
    clearList() {
      // 清空数据
      this.attrList = [];
      // 禁用按钮
      this.category.category3Id = "";
    },
    async deleteAttr(row) {
      await this.$API.attr.deleteAttr(row.id);
      this.getAttrList();
    },
  },
  mounted() {
    // this.$bus.$on("change", this.getAttrList);
    // this.$bus.$on("clearList", this.clearList);
  },
  // 组件中绑定的全局事件总线 要在组件卸载的时候，将绑定的事件解绑
  beforeDestroy() {
    // this.$bus.$off("change", this.getAttrList);
    // this.$bus.$off("clearList", this.clearList);
    this.$store.commit("category/SET_CATEGORY");
  },
  components: {
    Category,
  },
};
</script>
