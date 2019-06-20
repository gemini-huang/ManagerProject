<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="../../assets/img/logo.png" />
        </el-col>
        <el-col :span="16">
          <h1 class="title">电商后台管理系统</h1>
        </el-col>
        <el-col :span="4">
          <a href="#" class="mylink">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        Aside
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {};
</script>

<style>
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  height: 100%;
  line-height: 160px;
}
.el-container h1 {
  margin: 0;
  padding: 0;
  color: #fff;
  font-weight: 400;
}

.mylink {
  float: right;
  color: orange;
  text-decoration: none;
}
</style>
