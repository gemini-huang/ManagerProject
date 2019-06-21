<template>
  <el-row>
    <el-col :span="4">
      <img src="../../assets/img/logo.png" />
    </el-col>
    <el-col :span="16">
      <h1 class="title">电商后台管理系统</h1>
    </el-col>
    <el-col :span="4">
      <a href="#" class="mylink" @click.prevent="logout">退出</a>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('此操作将退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push('/login')
          window.localStorage.removeItem('token')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
    }
  }
}
</script>

<style>
</style>
