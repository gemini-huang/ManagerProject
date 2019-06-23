<template>
  <el-card>
    <Breadcrumb level2="权限管理" level3="角色管理"></Breadcrumb>
    <el-button type="success" class="myButton">添加角色</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row
            class="level1-row"
            v-for="level1 in scope.row.children"
            :key="level1.id"
          >
            <el-col :span="4">
              <el-tag closable type="" @close="handleClose(scope.row, level1)">
                {{ level1.authName }}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row
                class="level2-row"
                v-for="level2 in level1.children"
                :key="level2.id"
              >
                <el-col :span="5">
                  <el-tag
                    closable
                    type="success"
                    @close="handleClose(scope.row, level2)"
                  >
                    {{ level2.authName }}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <!-- 三级菜单 -->
                  <el-tag
                    class="level3-row"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    closable
                    type="warning"
                    @close="handleClose(scope.row, level3)"
                  >
                    {{ level3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              没有分配权限
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="showRightsDialog(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="权限分配" :visible.sync="dialogFormVisible">
      <div>
        <el-tree
          :data="rightsData"
          ref="tree"
          default-expand-all
          :default-checked-keys="checkedKeys"
          show-checkbox
          node-key="id"
          :props="defaultProps"
        >
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Breadcrumb from '@/components/common/breadcrumb'
export default {
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      rightsData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      checkedKeys: [],
      currentRole: {}
    }
  },
  components: {
    Breadcrumb
  },
  methods: {
    getTableList () {
      this.$http({
        method: 'get',
        url: '/roles'
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.tableData = data
        }
      })
    },
    handleClose (role, rights) {
      this.$http({
        method: 'delete',
        url: `roles/${role.id}/rights/${rights.id}`
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: meta.msg
          })
          role.children = data
        }
      })
    },
    showRightsDialog (role) {
      // 获取当前角色具有的权限id
      function getLevel3Ids (rightsList) {
        let arr = []
        let fn = function (list) {
          list.forEach(item => {
            if (!item.children) {
              arr.push(item.id)
            } else {
              fn(item.children)
            }
          })
        }
        fn(rightsList)
        return arr
      }
      this.$http({
        method: 'get',
        url: 'rights/tree'
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.rightsData = data
          this.checkedKeys = getLevel3Ids(role.children)
          // 记住当前的角色
          this.currentRole = role
        }
      })
      this.dialogFormVisible = true
    },
    handleRights () {
      const nodes = this.$refs.tree.getCheckedNodes()
      let arr = []
      nodes.forEach(item => {
        // 选中的子权限id
        arr.push(item.id.toString())

        // 子权限的id 对应的父权限的id
        if (typeof item.pid === 'number') {
          arr.push(item.pid.toString())
        } else {
          arr = arr.concat(item.pid.split(','))
        }
      })
      // 数组去重
      const set = new Set(arr)
      const ids = [...set].join(',')
      // const ids = arr.join(',')
      this.$http({
        method: 'post',
        url: `roles/${this.currentRole.id}/rights`,
        data: {
          rids: ids
        }
      }).then(res => {
        console.log(res)
        let {meta} = res.data
        if (meta.status === 200) {
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: meta.msg
          })
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
.myButton {
  margin-top: 20px;
}
.level1-row {
  margin-bottom: 10px;
}
.level3-row {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
