<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="attr">
        <el-form-item label="SPU名称" prop="attrName" label-width="80px">
          <el-input placeholder="SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="attrName" label-width="80px">
          <el-select placeholder="请选择品牌">
            <el-option>11</el-option>
            <el-option>22</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="attrName" label-width="80px">
          <el-input type="textarea" placeholder="SPU描述"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片" prop="logoUrl">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="销售属性" prop="attrName" label-width="80px">
          <el-select placeholder="还有3个未选择">
            <el-option>11</el-option>
            <el-option>22</el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" disabled
            >添加销售属性</el-button
          >
          <el-table :data="[]" border style="width: 100%; margin: 10px 0">
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column prop="attrName" label="属性名">
              <template> </template>
            </el-table-column>
            <el-table-column prop="attrName" label="属性值名称列表">
              <template> </template>
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuUpdateList",
};
</script>

<style lang="less" scoped>
</style>

