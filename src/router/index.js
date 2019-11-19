import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

import Layout from '@/layout'
import getTitle from '@/utils/getTitle'

/**
 * 路由相关属性说明
 * hidden: 当设置hidden为true时，意思不在sideBars侧边栏中显示
 * mete{
 * title: xxx,  设置sideBars侧边栏名称
 * icon: xxx,  设置ideBars侧边栏图标
 * noCache: true  当设置为true时不缓存该路由页面
 * }
 */

/*通用routers*/
export const currencyRoutes = [{
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录页'
    },
    hidden: true
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/home',
    children: [{
        path: 'home',
        name: 'home',
        component: () => import('@/views/home'),
        meta: {
          title: '首页',
          icon: 'el-icon-s-data'
        }
      },
      {
        path: '/activity',
        name: 'activity',
        component: () => import('@/views/activity'),
        meta: {
          title: '活动管理',
          icon: 'el-icon-s-data'
        }
      },
      {
        path: '/category',
        name: 'category',
        component: () => import('@/views/category'),
        meta: {
          title: '分类管理',
          icon: 'el-icon-s-data'
        }
      },
      /**商品管理 */
      {
        path: '/goods',
        name: 'goods',
        component: () => import('@/views/goods'),
        meta: {
          title: '商品管理',
          icon: 'el-icon-s-data',
          noCache: true 
        }
      },
      {
        path: '/goods/editGoods',
        name: 'editGoods',
        component: () => import('@/views/goods/editGoods'),
        meta: {
          title: '修改商品',
          icon: 'el-icon-s-data',
        }
      },
      /**预约管理 */
      {
        path: '/yuyue',
        name: 'yuyue',
        component: () => import('@/views/yuyue'),
        meta: {
          title: '预约管理',
          icon: 'el-icon-s-data'
        }
      },
    ]
  }
]

const creatRouter = () => {
  return new Router({
    routes: currencyRoutes,
    scrollBehavior() {
      return {
        x: 0,
        y: 0
      }
    }
  })
}

const router = creatRouter()

// 解决addRoute不能删除动态路由问题
export function resetRouter() {
  const reset = creatRouter()
  router.matcher = reset.matcher
}

// 导航守卫
router.beforeEach(async (to, from, next) => {
  document.title = getTitle(to.meta.title)
  if (to.path === '/login') {
    next()
  } else {
    if (store.getters.token) {
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  }
})
export default router