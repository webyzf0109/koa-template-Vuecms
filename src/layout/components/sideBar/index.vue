<template>
  <div class="sideBar" id="domSideBar">
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        background-color="#3a3f51"
        text-color="#b5b6bd"
        active-text-color="rgb(79, 148, 212)"
        mode="vertical"
        :collapse-transition="false"
        :collapse="opened"
      >
        <sidebar-item
          v-for="item in routerList"
          :key="item.path"
          :item="item"
          :basePath="item.path"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Layout from '@/layout'
import SidebarItem from './SideBarItem'
import { mapGetters } from 'vuex'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['roles', 'opened']),
    // booleanOpen() {
    //   return this.opened === 'true' ? true : false
    // },
    activeMenu() {
      return this.$route.path
    }
  },
  data() {
    return {
      routerList: [
        {
          path: '/permission',
          name: 'Permission',
          component: Layout,
          redirect: '/permission/page-use',
          meta: {
            title: '权限许可',
            icon: 'el-icon-lock'
          },
          children: [
            {
              path: 'page-user',
              name: 'PageUser',
              component: () => import('@/views/permission/page-user'),
              meta: { title: '用户页面', icon: 'el-icon-user' }
            },
            {
              path: 'page-admin',
              name: 'PageAdmin',
              component: () => import('@/views/permission/page-admin'),
              meta: {
                title: '管理员页面',
                icon: 'el-icon-user-solid'
              }
            },
            {
              path: 'roles',
              name: 'Roles',
              component: () => import('@/views/permission/roles'),
              meta: { title: '权限设置', icon: 'el-icon-s-tools' }
            }
          ]
        },
        {
          path: '/table',
          name: 'Table',
          redirect: '/table/base-table',
          component: Layout,
          meta: {
            title: 'Table',
            icon: 'el-icon-table iconfont'
          },
          children: [
            {
              path: 'base-table',
              name: 'BaseTable',
              component: () => import('@/views/table/common-table'),
              meta: { title: '普通表格' }
            },
            {
              path: 'complex-table',
              name: 'ComplexTable',
              component: () => import('@/views/table/complex-table'),
              meta: { title: '复杂表格' }
            }
          ]
        },
        {
          path: '/icons',
          component: Layout,
          name: 'Icons',
          redirect: '/icons/index',
          children: [
            {
              path: 'index',
              name: 'Icons-index',
              component: () => import('@/views/icons'),
              meta: { title: 'Icons图标', icon: 'el-icon-picture-outline' }
            }
          ]
        },
        {
          path: '/components',
          component: Layout,
          name: 'Components',
          redirect: '/components/slide-yz',
          meta: { icon: 'el-icon-coin', title: '部分组件' },
          children: [
            {
              path: 'slide-yz',
              name: 'Sldie-yz',
              component: () => import('@/views/components/slide-yz'),
              meta: { icon: 'el-icon-s-claim', title: '滑动验证' }
            },
            {
              path: 'upload',
              name: 'Upload',
              component: () => import('@/views/components/pushImg'),
              meta: { icon: 'el-icon-upload', title: '上传图片' }
            },
            {
              path: 'carousel',
              name: 'Carousel',
              component: () => import('@/views/components/carousel'),
              meta: { icon: 'el-icon-lunbo iconfont', title: '轮播' }
            }
          ]
        },
        {
          path: '/echarts',
          component: Layout,
          name: 'Echarts',
          redirect: '/echarts/slide-chart',
          meta: { icon: 'el-icon-s-marketing', title: 'Echarts' },
          children: [
            {
              path: 'slide-chart',
              name: 'Sldie-chart',
              component: () => import('@/views/echarts/slide-chart'),
              meta: { title: '滑动charts' }
            },
            {
              path: 'dynamic-chart',
              name: 'Dynamic-chart',
              component: () => import('@/views/echarts/dynamic-chart'),
              meta: { title: '切换charts' }
            },
            {
              path: 'map-chart',
              name: 'Map-chart',
              component: () => import('@/views/echarts/map-chart'),
              meta: { title: 'map' }
            }
          ]
        },
        {
          path: '/excel',
          component: Layout,
          name: 'Excel',
          redirect: '/excel-operate/excel-out',
          meta: { icon: 'el-icon-excel iconfont', title: 'Excel' },
          children: [
            {
              path: 'excel-out',
              name: 'Excel-out',
              component: () => import('@/views/excel-operate/excel-out'),
              meta: { title: 'Excel导出' }
            },
            {
              path: 'excel-in',
              name: 'Excel-in',
              component: () => import('@/views/excel-operate/excel-in'),
              meta: { title: 'Excel导入' }
            },
            {
              path: 'mutiheader-out',
              name: 'Mutiheader-out',
              component: () => import('@/views/excel-operate/mutiheader-out'),
              meta: { title: '多级表头导出' }
            }
          ]
        },
        {
          path: '/error',
          component: Layout,
          name: 'Error',
          redirect: '/error/404',
          children: [
            {
              path: '404',
              name: 'Page404',
              component: () => import('@/views/error-page/404'),
              meta: { title: '404', icon: 'el-icon-s-release' }
            }
          ]
        },
        {
          path: 'https://github.com/gcddblue/vue-admin-webapp',
          name: 'Github',
          meta: { icon: 'el-icon-link', title: '项目链接' }
        },
        {
          path: '*',
          name: '*404',
          redirect: '/404',
          hidden: true
        }
      ]
    }
  }
}
</script>
