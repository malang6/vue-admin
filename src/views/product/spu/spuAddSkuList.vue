<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :label-position="labelPosition">
        <el-form-item label="SPU名称" prop="spuName" label-width="80px">
          <span>红米K30 Pro777</span>
        </el-form-item>
        <el-form-item label="SPU名称" prop="spuName" label-width="80px">
          <el-input placeholder="SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="spuName" label-width="80px">
          <el-input type="number" placeholder="SPU价格"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)" prop="spuName" label-width="80px">
          <el-input type="number" placeholder="SPU重量"></el-input>
        </el-form-item>
        <el-form-item label="规格描述" prop="spuName" label-width="80px">
          <el-input
            type="textarea"
            rows="4"
            placeholder="SPU规格描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性" prop="spuName" label-width="80px">
          <el-form inline>
            <el-form-item label="升级比较快" prop="spuName" label-width="100px">
              <el-select :placeholder="请输入">
                <el-option label="saleAttr.name" value="放公共"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="受控" prop="spuName" label-width="100px">
              <el-select :placeholder="请输入">
                <el-option label="saleAttr.name" value="放公共"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="销售属性" prop="spuName" label-width="80px">
          <el-form inline>
            <el-form-item label="选择颜色" prop="spuName" label-width="100px">
              <el-select :placeholder="请输入">
                <el-option label="saleAttr.name" value="放公共"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择版本" prop="spuName" label-width="100px">
              <el-select :placeholder="请输入">
                <el-option label="saleAttr.name" value="放公共"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="图片列表" label-width="80px">
          <el-table
            border
            ref="multipleTable"
            tooltip-effect="dark"
            style="width: 100%; margin-bottom: 20px"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="address" label="操作" show-overflow-tooltip>
              <el-button type="primary" size="mini"></el-button>
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
  name: "SpuAddSkuList",
  data() {
    return {
      labelPosition: "right",
      isIndeterminate: true,
    };
  },
};
</script>

<style lang="less" scoped>
</style>

