<template>
  <div class="sideBar" id="domSideBar">
    <el-scrollbar>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        :unique-opened="true"
      >
        <el-submenu
          :index="item.id.toString()"
          v-for="(item, index) in roles"
          :key="index"
        >
          <template slot="title">
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
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  computed: {
    activeMenu() {
      return this.$route.path
    }
  },
  data() {
    return {
      activeIndex: '0',
      roles: []
    }
  },
  created() {
    this.roles = JSON.parse(sessionStorage.getItem('roles'))
    this.roles.forEach(item => {
      item.list.forEach(childItem => {
        if (childItem.path == this.$route.path) {
          this.activeIndex = childItem.id.toString()
        }
      })
    })
  },
  watch: {
    '$route.path': function(newValue) {
      this.roles.forEach(item => {
        item.list.forEach(childItem => {
          if (childItem.path == newValue) {
            this.activeIndex = childItem.id.toString()
          }
        })
      })
    }
  },
  methods: {
    handleChildrenClick(item, index) {
      this.navListChildIndex = index
      this.$router.push(item.path)
    }
  }
}
</script>
