<template>
  <el-card>
    <Breadcrumbs level2="商品管理" level3="商品分类"></Breadcrumbs>
    <el-table
      :data="categoryList"
      style="width: 100%"
      row-key="cat_id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="cat_name" label="分类名称" width="180">
      </el-table-column>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-if="scope.row.cat_level === 1">二级</span>
          <span v-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template slot-scope="scope">
          {{ !scope.row.cat_deleted ? '有效' : '无效' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            plain
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            plain
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
  data() {
    return {
      categoryList: [],
      total: 0,
      pagenum:1,
      pagesize: 5,
      pagesizes: [5, 10, 15]
    }
  },
  components: {
    Breadcrumbs
  },
  methods: {
    getTableList() {
      this.$http({
        method: 'get',
        url: `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      }).then(res => {
        // console.log(res)
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.categoryList = data.result
          this.total = data.total
        }
      })
    },
    sizeChange(size) {
      this.pagesize = size
      this.getTableList()
    },
    currentChange(currentPage) {
      this.pagenum = currentPage
      this.getTableList()
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>

<style>
</style>
