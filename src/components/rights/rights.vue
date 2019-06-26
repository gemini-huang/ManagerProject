<template>
  <el-card>
    <Breadcrumb level2="权限管理" level3="权限列表"></Breadcrumb>
    <el-table :data="tableData" border style="width: 100%" class="mytable" v-loading="loading">
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"> </el-table-column>
      <el-table-column prop="path" label="路径" width="200"> </el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import Breadcrumb from '@/components/common/breadcrumb'
export default {
  data () {
    return {
      tableData: [],
      loading: true
    }
  },
  components: {
    Breadcrumb
  },
  methods: {
    getTableData () {
      this.$http({
        method: 'get',
        url: 'rights/list'
      }).then(res => {
        let {data, meta} = res.data
        if (meta.status === 200) {
          this.loading = false
          this.tableData = data
        }
      })
    }
  },
  mounted () {
    this.getTableData()
  }
}
</script>

<style>
.mytable {
  margin-top: 20px;
}
</style>
