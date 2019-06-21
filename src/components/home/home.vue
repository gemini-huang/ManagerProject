<template>
  <el-container>
    <el-header>
      <TopHead></TopHead>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <SideBar></SideBar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TopHead from '@/components/layout/tophead.vue'
import SideBar from '@/components/layout/sidebar.vue'
export default {
  components: {
    TopHead,
    SideBar
  },
  mounted () {
    let token = window.localStorage.getItem('token')
    if (!token) {
      this.$router.push('/login')
      this.$message.error('请先登录！')
    }
  }
}
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
  line-height: 200px;
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 100%;
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
.el-menu {
  height: 100%;
}
</style>
