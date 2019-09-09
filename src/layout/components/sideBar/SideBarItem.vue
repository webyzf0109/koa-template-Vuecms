<template>
  <div class="sideItem" v-if="!item.hidden">
    <p>{{ !childItem.list }}</p>
    <template
      v-if="
        hasOnlyChild(item.list, item) && (!childItem.list || childItem.noChild)
      "
    >
      <page-link v-if="childItem.meta" :to="resolvePath(childItem.path)">
        <el-menu-item :index="resolvePath(childItem.path)">
          <i :class="childItem.meta.icon ? childItem.meta.icon : ''"></i>
          <span slot="title">{{ childItem.meta.title }}</span>
        </el-menu-item>
      </page-link>
    </template>
    <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <i :class="item.meta.icon ? item.meta.icon : ''"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.list"
        :key="child.path"
        :item="child"
        :basePath="resolvePath(child.path)"
      ></sidebar-item>
    </el-submenu>
  </div>
</template>

<script>
import PageLink from './Link'
import { isAbsolutePath } from '@/utils/validate'
import path from 'path'
export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      childItem: null
    }
  },
  created() {
    console.log(this.item, 'item')
  },
  methods: {
    hasOnlyChild(list = [], item) {
      // debugger
      let newlist = list.filter(obj => {
        if (obj.hidden) {
          return false
        } else {
          return true
        }
      })
      if (newlist.length === 1 && !item.meta) {
        this.childItem = newlist[0]
        return true
      }

      if (newlist.length === 0) {
        this.childItem = { ...item, path: '', noChild: true }
        return true
      }
      return false
    },
    resolvePath(router) {
      if (isAbsolutePath(router)) {
        return router
      }
      if (isAbsolutePath(this.basePath)) {
        return this.basePath
      }
      return path.join(this.basePath, router)
    }
  },
  components: {
    PageLink
  }
}
</script>
