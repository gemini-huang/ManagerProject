<template>
  <el-card>
    <Breadcrumbs level2="商品管理" level3="商品分类"></Breadcrumbs>
    <el-button plain type="success" @click="addCategory">添加分类</el-button>
    <el-table
      :data="pageList"
      style="width: 100%"
      row-key="cat_id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      v-loading="loading"
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
        <template slot-scope="scope">
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
            @click="deleteCategory(scope.row.cat_id)"
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
    <!-- 对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="categoryName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-cascader
            v-model="selectVal"
            :options="options"
            clearable
            :props="propsObj"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryFn"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Breadcrumbs from '@/components/common/breadcrumb'
export default {
  data () {
    return {
      categoryList: [],
      total: 0,
      pagenum: 1,
      pagesize: 5,
      pagesizes: [5, 10, 15],
      loading: true,
      // 手动分页
      pageList: [],
      dialogFormVisible: false,
      formLabelWidth: '80px',
      options: [],
      selectVal: [],
      propsObj: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: true
      },
      categoryName: ''
    }
  },
  components: {
    Breadcrumbs
  },
  methods: {
    getTableList () {
      this.$http({
        method: 'get',
        // url: `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        url: 'categories?type=3'
      }).then(res => {
        // console.log(res)
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.loading = false
          this.categoryList = data
          this.total = data.length
          // 手动设置分页
          let begin = this.pagesize * (this.pagenum - 1)
          let end = this.pagesize * this.pagenum
          this.pageList = this.categoryList.slice(begin, end + 1)
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
    addCategory () {
      this.dialogFormVisible = true
      this.$http({
        method: 'get',
        url: `categories?type=2`
      }).then(res => {
        let {meta, data} = res.data
        if (meta.status === 200) {
          this.options = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    addCategoryFn () {
      let pid = this.selectVal.length === 0 ? 0 : this.selectVal[this.selectVal.length - 1]
      let level = this.selectVal.length
      this.$http({
        method: 'post',
        url: `categories?type=2`,
        data: {
          cat_pid: pid,
          cat_name: this.categoryName,
          cat_level: level
        }
      }).then(res => {
        let {meta} = res.data
        if (meta.status === 201) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getTableList()
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 删除分类
    deleteCategory (id) {
      this.$http({
        method: 'delete',
        url: `categories/${id}`
      }).then(res => {
        let {meta} = res.data
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          this.getTableList()
        } else {
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
