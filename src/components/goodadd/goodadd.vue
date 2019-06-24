<template>
  <div>
    <Breadcrumbs level2="商品管理" level3="商品列表"></Breadcrumbs>
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false"
    >
    </el-alert>
    <el-steps
      :space="200"
      align-center
      finish-status="success"
      :active="activeTabName - 0"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-position="top"
    >
      <el-tabs
        tab-position="left"
        @tab-click="handleClick"
        v-model="activeTabName"
      >
        <el-tab-pane label="基本信息">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              clearable
              placeholder="请选择商品分类"
              :options="options"
              v-model="addForm.goods_cat"
              expand-trigger="hover"
              :show-all-levels="true"
              :props="{ label: 'cat_name', value: 'cat_id' }"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <el-form-item
            v-for="item in dynamicTableData"
            :key="item.attr_id"
            :label="item.attr_name"
          >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                v-for="(val, index) in item.attr_vals"
                border
                :key="index"
                :label="val"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
          <el-form-item
            v-for="item in staticTableData"
            :key="item.attr_id"
            :label="item.attr_name"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片">
          <el-form-item>
            <el-upload
              class="upload-demo"
              :headers="uploadHeaders"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-success="uploadSuccess"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <el-button class="myBtn" type="primary">添加商品</el-button>
          <quillEditor v-model="addForm.goods_introduce" class="editor"></quillEditor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/common/breadcrumb'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  data() {
    return {
      activeTabName: '0',
      options: [],
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [],
        pics: [],
        // 商品介绍
        goods_introduce: ''
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      dynamicTableData: [],
      staticTableData: [],
      uploadHeaders: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  components: {
    Breadcrumbs,
    quillEditor
  },
  methods: {
    handleClick() {
      // console.log(tab, event)
      // console.log(this.activeTabName)
      if (this.activeTabName === '1' || this.activeTabName === '2') {
        if (this.addForm.goods_cat.length !== 3) {
          return this.$message.error('请选择商品分类')
        }
        let sel = this.activeTabName === '1' ? 'many' : 'only'
        this.$http({
          method: 'get',
          url: `categories/${this.addForm.goods_cat[2]}/attributes?sel=${sel}`
        }).then(res => {
          let { data, meta } = res.data
          if (meta.status === 200) {
            if (this.activeTabName === '1') {
              this.dynamicTableData = data
              // console.log(this.dynamicTableData)
              data.forEach(item => {
                // 把逗号分隔的字符串转换成数组
                item.attr_vals =
                  item.attr_vals.trim().length <= 0
                    ? []
                    : item.attr_vals.trim().split(',')
              })
            } else {
              this.staticTableData = data
            }
          }
        })
      }
    },
    loadCascader() {
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
    uploadSuccess(response) {
      // console.log(response.meta.status)
      if (response.meta.status === 200) {
        this.$message({
          message: response.meta.msg,
          type: 'success'
        })
        const o = { pic: response.data.tmp_path }
        this.addForm.pics.push(o)
      } else {
        this.$message.error(reponse.meta.msg)
      }
    },
    handleRemove(file) {
      console.log(file)
      let index = this.addForm.pics.findIndex(
        item => file.response.data.tmp_path === item.pic
      )
      this.addForm.pics.splice(index, 1)
    }
  },
  mounted() {
    this.loadCascader()
  }
}
</script>

<style>
.el-tabs {
  margin-top: 20px;
  height: 100%;
}

.el-alert {
  margin-top: 20px;
  margin-bottom: 20px;
}

.myBtn {
  margin-bottom: 20px;
}

.editor {
  height: 400px;
}
</style>
