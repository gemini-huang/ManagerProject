<template>
  <el-menu class="el-menu-vertical-demo" :unique-opened="true" :router="true">
    <el-submenu :index="index + ''" v-for="(role, index) in roles" :key="index">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{role.authName}}</span>
      </template>
      <el-menu-item :index="'/' + subRole.path" v-for="(subRole, index) in role.children" :key="index">
        <i class="el-icon-menu"></i>
        <span>{{subRole.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
      roles: []
    }
  },
  methods: {
    getRoles () {
      this.$http({
        method: 'get',
        url: 'menus'
      }).then(res => {
        let {data, meta} = res.data
        if (meta.status === 200) {
          this.roles = data
        }
      })
    }
  },
  mounted () {
    this.getRoles()
  }
}
</script>

<style>
</style>
