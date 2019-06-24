import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Users from '@/components/users/users'
import Rights from '@/components/rights/rights'
import RoleList from '@/components/rolelist/rolelist'
import Goods from '@/components/goods/goods'
import GoodsAdd from '@/components/goodadd/goodadd'
import Categories from '@/components/categories/categories'
import Report from '@/components/report/report'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/roles',
          // name: rolelist,
          component: RoleList
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods/add',
          component: GoodsAdd
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})
// 设置全局前置路由守卫，完成登录验证
router.beforeEach(function (to, from, next) {
  if (to.name !== 'login') {
    let token = window.localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
