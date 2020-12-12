<template>
  <div>
    <el-card>
      <el-form inline :model="category" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select v-model="category.category1Id" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="category.category2Id" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="category.category3Id" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px">
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
        <el-table-column prop="tmName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column prop="img" label="属性值列表">
          <template> </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
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
    </el-card>
  </div>
</template>

<script>
import { category } from "@/api";
export default {
  name: "AttrList",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      attrList: [],
    };
  },
};
</script>
