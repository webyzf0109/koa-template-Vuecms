<template>
  <div class="sideBar" id="domSideBar">
    <el-scrollbar>
      <el-menu
        :default-active="activeIndex"
        background-color="rgb(58, 63, 81)"
        text-color="rgb(181, 182, 189)"
        active-text-color="rgb(79, 148, 212)"
        class="el-menu-vertical-demo"
        :unique-opened="true"
      >
        <el-row v-for="(item, index) in roles" :key="index + item.id">
          <el-menu-item
            @click="handleChildrenClick(item, index)"
            :index="item.id.toString()"
            v-if="!item.list"
          >
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
          <el-submenu :index="item.id.toString()" v-if="item.list">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                @click="handleChildrenClick(childItem, childIndex)"
                v-for="(childItem, childIndex) in item.list"
                :key="childIndex"
                :index="childItem.id.toString()"
                >{{ childItem.name }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-row>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  computed: {},
  data() {
    return {
      activeIndex: '0',
      roles: []
    }
  },
  created() {
    this.roles = JSON.parse(sessionStorage.getItem('roles'))
    if (this.roles[0].list) {
      this.activeIndex = this.roles[0].list[0].id.toString()
    } else {
      this.activeIndex = this.roles[0].id.toString()
    }
  },
  methods: {
    handleChildrenClick(item, index) {
      this.navListChildIndex = index
      this.activeIndex = item.id.toString()
      this.$router.push(item.path)
    }
  }
}
</script>

<style lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: rgb(46, 50, 65) !important;
}
.el-submenu__title:focus,
.el-submenu__title:hover {
  background-color: rgb(46, 50, 65) !important;
}
</style>
