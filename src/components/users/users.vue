<template>
  <div>
    <el-card>
      <!-- 面包屑区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="myelrow">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="query"
            @keyup.enter="searchUser"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click.prevent="searchUser"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" plain @click="dialogFormVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="用户状态">
          <!-- slot-scope: 当前行的数据源 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changState(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              @click.prevent="editUserOpen(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click.prevent="del(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              plain
              size="mini"
              @click.prevent="editOpen(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="pagenum"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 弹框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form :model="userObj" :rules="rules" ref="ruleForm">
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input v-model="userObj.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            :label-width="formLabelWidth"
            prop="password"
          >
            <el-input type="password" v-model="userObj.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="userObj.email"></el-input>
          </el-form-item>
          <el-form-item
            label="电话"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input v-model="userObj.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click.prevent="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改用户" :visible.sync="addUserFormVisible">
        <el-form :model="editUser" :rules="rules" ref="ruleForm">
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input v-model="editUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="editUser.email"></el-input>
          </el-form-item>
          <el-form-item
            label="电话"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input v-model="editUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserFormVisible = false">取 消</el-button>
          <el-button type="primary" @click.prevent="putUser">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="分配角色" :visible.sync="roleFormVisible">
        <el-form :model="roleObj">
          <el-form-item label="当前用户" :label-width="formLabelWidth">
            <span>{{ roleObj.username }}</span>
          </el-form-item>
          <el-form-item label="请选择角色" :label-width="formLabelWidth">
            <el-select v-model="roleObj.rid">
              <el-option label="请选择角色" disabled :value="-1"></el-option>
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleFormVisible = false">取 消</el-button>
          <el-button type="primary" @click.prevent="editRole">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 5,
      pagesizes: [2, 3, 5],
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: '90px',
      userObj: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '邮箱地址格式不正确', trigger: 'blur' }
        ],
        mobile: [{ type: '', message: '请输入用户名', trigger: 'blur' }]
      },
      roleFormVisible: false,
      roleObj: {
        id: '',
        username: '',
        roleName: '',
        rid: ''
      },
      options: [],
      addUserFormVisible: false,
      editUser: {
        id: '',
        // username: '',
        // email: '',
        mobile: ''
      }
    }
  },
  methods: {
    getTableList () {
      this.$http({
        method: 'get',
        url: `users?query=${
          this.query
        }&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      })
        .then(res => {
          let { data, meta } = res.data
          if (meta.status === 200) {
            this.userList = data.users
            this.total = data.total
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    currentChange (currentPage) {
      this.pagenum = currentPage
      this.getTableList()
    },
    sizeChange (size) {
      this.pagesize = size
      this.getTableList()
    },
    searchUser () {
      this.getTableList()
    },
    addUser () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http({
            method: 'post',
            url: 'users',
            data: this.userObj,
            headers: {
              Authorization: window.localStorage.getItem('token')
            }
          })
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'success'
                })
                this.getTableList()
              } else {
                this.$message.error(res.data.meta.msg)
              }
              // 清空新增面板
              this.userObj.username = ''
              this.userObj.password = ''
              this.userObj.email = ''
              this.userObj.mobile = ''
              // 关闭面板
              this.dialogFormVisible = false
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    del (id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            method: 'delete',
            url: 'users/' + id,
            headers: {
              Authorization: window.localStorage.getItem('token')
            }
          })
            .then(res => {
              if (res.data.meta.status === 200) {
                this.getTableList()
              }
            })
            .catch(err => {
              console.log(err)
            })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editOpen (id) {
      this.roleFormVisible = true
      this.showRole()
      this.$http({
        method: 'get',
        url: 'users/' + id
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.roleObj = data
        }
      })
    },
    showRole () {
      this.$http({
        method: 'get',
        url: 'roles'
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.options = data
        }
      })
    },
    editRole () {
      this.$http({
        method: 'put',
        url: `users/${
          this.roleObj.id
        }/role`,
        data: {
          rid: this.roleObj.rid
        }
      })
        .then(res => {
          let { meta } = res.data
          if (meta.status === 200) {
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
      this.roleFormVisible = false
    },
    changState (id, state) {
      this.$http({
        method: 'put',
        url: `users/${id}/state/${state}`
      }).then(res => {
        console.log(res)
        let { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            message: '状态设置成功',
            type: 'success'
          })
        }
      })
    },
    editUserOpen (id) {
      this.addUserFormVisible = true
      this.$http({
        method: 'get',
        url: 'users/' + id
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.editUser = data
        }
      })
    },
    putUser () {
      this.$http({
        method: 'put',
        url: 'users/' + this.editUser.id,
        data: this.editUser
      }).then(res => {
        let { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          this.addUserFormVisible = false
          this.getTableList()
        }
      })
    }
  },
  mounted () {
    this.getTableList()
  }
}
</script>

<style>
.myelrow {
  margin-top: 20px;
}
</style>
