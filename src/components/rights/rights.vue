<template>
  <el-card>
    <Breadcrumb level2="权限管理" level3="权限列表"></Breadcrumb>
    <el-table :data="pageList" border style="width: 100%" class="mytable" v-loading="loading">
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
  </el-card>
</template>

<script>
import Breadcrumb from '@/components/common/breadcrumb'
export default {
  data () {
    return {
      tableData: [],
      loading: true,
      // 分页数据
      pageList: [],
      pagenum: 1,
      pagesize: 5,
      pagesizes: [5, 10, 15],
      total: 0
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
          this.total = data.length
          // 手动设置分页功能
          /*
            页容量 5
            当前页 1  0 ~ 4
            当前页 2  5 ~ 9
            当前页 3  10 ~ 14
            ......
            规律
              5(1 - 1) ~ 5 * 1 - 1
              pagesize(pagenum - 1) ~ pagesize * pagenum
              let begin = pagesize*(pagenum - 1)
              let end = pagesize * pagenum - 1
              然后使用数组截取的方法 slice() 这个方法不会影响原来的数组,截取的区间是左闭右开区间，不包括最后一位
              this.pageList = this.tableData.slice(begin, end + 1)
          */
          let begin = this.pagesize * (this.pagenum - 1)
          let end = this.pagesize * this.pagenum - 1
          this.pageList = this.tableData.slice(begin, end + 1)
        }
      })
    },
    sizeChange (size) {
      this.pagesize = size
      this.getTableData()
    },
    currentChange (currentPage) {
      this.pagenum = currentPage
      this.getTableData()
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
