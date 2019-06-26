<template>
  <el-card>
    <Breadcrumbs level2="订单管理" level3="订单列表"></Breadcrumbs>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="200">
      </el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="180">
      </el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" v-if="scope.row.order_pay === '0'">未付款</el-button>
          <el-button type="success" plain size="mini" v-else>已付款</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"> </el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
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
  </el-card>
</template>

<script>
import Breadcrumbs from '@/components/common/breadcrumb'
export default {
  data () {
    return {
      tableData: [],
      query: '',
      total: 0,
      pagenum: 1,
      pagesize: 5,
      pagesizes: [10, 15, 20],
      loading: true
    }
  },
  methods: {
    getTableList () {
      this.$http({
        method: 'get',
        url: `orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      }).then(res => {
        let {data, meta} = res.data
        if (meta.status === 200) {
          this.loading = false
          this.tableData = data.goods
          this.total = data.total
        }
      })
    },
    sizeChange (size) {
      this.pagesize = size
      this.getTableList()
    },
    currentChange (currentPage) {
      this.pagenum = currentPage
      this.getTableList()
    }
  },
  components: {
    Breadcrumbs
  },
  mounted () {
    this.getTableList()
  }
}
</script>

<style>
</style>
