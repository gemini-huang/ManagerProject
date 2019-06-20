<template>
  <div class="login">
    <div class="content">
      <h2>用户登录</h2>
      <el-form
        label-position="top"
        :model="userObj"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="userObj.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userObj.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="myLink" @click.prevent="login"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userObj: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http({
            method: 'post',
            url: 'http://localhost:8888/api/private/v1/login',
            data: this.userObj
          })
            .then(res => {
              // console.log(res);
              let { data, meta } = res.data
              if (meta.status === 200) {
                // console.log(res.data)
                this.$router.push('/')
                window.localStorage.setItem('token', data.token)
                this.$message({
                  message: meta.msg,
                  type: 'success'
                })
              } else {
                this.$message.error(meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  background-color: #324152;
  position: relative;
}
.content {
  width: 580px;
  height: 440px;
  padding: 40px;
  background: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.myLink {
  width: 100%;
}
</style>
