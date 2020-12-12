<template>
  <div>
    <Category @change="getAttrList" :isShowList="isShowList" />
    <el-card style="margin-top: 20px" v-show="isShowList">
      <el-button type="primary" icon="el-icon-plus" disabled
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
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
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
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "./category";
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
      attrList: [],
      isShowList: true,
      attr: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  methods: {
    //获取属性列表信息
    async getAttrList(category) {
      this.category = category;
      const result = await this.$API.attr.getAttrInfoList(category);
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
    //添加属性
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
      const result = await this.$API.attr.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.isShowList = true;
        this.getAttrList(this.category);
        this.$message.success("保存属性成功");
      } else {
        this.$message.error(result.message);
      }
    },
  },
  components: {
    Category,
  },
};
</script>
