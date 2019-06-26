<template>
  <div>
    <Breadcrumbs level2="商品管理" level3="商品参数"></Breadcrumbs>
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon
      :closable="false"
    >
    </el-alert>
    <el-row class="myelrow">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <span>请选择商品分类：</span>
          <el-cascader
            clearable
            placeholder="请选择商品分类"
            :options="options"
            v-model="selectedOptions"
            expand-trigger="hover"
            :show-all-levels="false"
            :props="{ label: 'cat_name', value: 'cat_id' }"
            @change="handleChange"
          ></el-cascader>
        </div>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-table style="width: 100%" :data="dynamicTableData">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row>
                <el-col :span="24">
                  <el-tag
                    class="myeltag"
                    closable
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                  >
                    {{ item }}
                  </el-tag>
                  <el-button class="button-new-tag" size="small"
                    >+ New Tag</el-button
                  >
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="商品参数" width="200">
          </el-table-column>
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
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-table :data="staticTableData" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200">
          </el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="200">
          </el-table-column>
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
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Breadcrumbs from '../../components/common/breadcrumb'
export default {
  data () {
    return {
      options: [],
      activeName: 'many',
      selectedOptions: [],
      dynamicTableData: [],
      staticTableData: []
    }
  },
  components: {
    Breadcrumbs
  },
  methods: {
    getCategoryList () {
      this.$http({
        method: 'get',
        url: 'categories?type=3'
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.options = data
        }
      })
    },
    getTableList () {
      this.$http({
        method: 'get',
        url: `categories/${this.selectedOptions[2]}/attributes?sel=${
          this.activeName
        }`
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          if (this.activeName === 'many') {
            this.dynamicTableData = data
            // this.dynamicTableData.forEach(item => {
            //   let arr = []
            //   item.attr_vals
            //     .trim()
            //     .split(',')
            //     .forEach(item1 => {
            //       if (item1) {
            //         arr.push(item1)
            //       }
            //     })
            //   console.log(arr)
            //   this.$set(item, 'params', arr)
            // })
            this.dynamicTableData.forEach(item => {
              item.attr_vals =
                  item.attr_vals.trim().length <= 0
                    ? []
                    : item.attr_vals.trim().split(',')
            })
            console.log(data)
          } else {
            this.staticTableData = data
          }
        }
      })
    },
    handleChange () {
      this.getTableList()
    },
    handleClick () {
      this.getTableList()
    }
  },
  mounted () {
    this.getCategoryList()
  }
}
</script>

<style>
.myelrow {
  margin-top: 20px;
}
.myeltag {
  margin-right: 10px;
}
</style>
