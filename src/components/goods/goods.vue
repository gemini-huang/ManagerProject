<template>
  <el-card>
    <Breadcrumbs level2="商品管理" level3="商品列表"></Breadcrumbs>
    <el-row class="myelrow">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" plain @click="goodsAdd"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="120">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80">
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.add_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            icon="el-icon-edit"
            plain></el-button>
          <el-button type="danger"
            size="mini"
            icon="el-icon-delete"
            plain
            @click="delGoods(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
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
      pagenum: 1,
      pagesize: 10,
      total: 0,
      pagesizes: [10, 20, 100],
      loading: true
    }
  },
  components: {
    Breadcrumbs
  },
  methods: {
    getTableList () {
      this.$http({
        method: 'get',
        url: `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      }).then(res => {
        console.log(res)
        let { data, meta } = res.data
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
    },
    goodsAdd () {
      this.$router.push('/goods/add')
    },
    // 删除商品
    delGoods(id) {
      id = parseInt(id)
      this.$http({
        method:'delete',
        url: `goods/${id}`
      }).then(res =>{
        let {meta} = res.data
        if(meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          this.getTableList()
        }else {
          this.$message.error(meta.msg)
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
</style>
