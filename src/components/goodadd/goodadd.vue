<template>
  <div>
    <Breadcrumbs level2="商品管理" level3="商品列表"></Breadcrumbs>
    <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
    <el-steps :space="200" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form ref="addFormRef" label-position="top">
      <el-tabs tab-position="left">
        <el-tab-pane label="基本信息">
          <el-form-item label="商品名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input></el-input>
          </el-form-item>
          <el-form-ite>
            <el-select v-model="value" placeholder="请选择">
              <el-option>
              </el-option>
            </el-select>
          </el-form-ite>
        </el-tab-pane>
        <el-tab-pane label="商品参数">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/common/breadcrumb'
export default {
  data () {
    return {

    }
  },
  components: {
    Breadcrumbs
  }
}
</script>

<style>
.el-tabs {
  margin-top: 20px;
  height: 100%;
}

.el-alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
