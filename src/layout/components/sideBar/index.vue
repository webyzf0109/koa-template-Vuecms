<template>
  <div class="sideBar" id="domSideBar">
    <el-scrollbar>
      <ul class="menu-box">
        <li v-for="(item, index) in roles" :key="index">
          <div>
            <i class="el-icon-location"></i>
            <span>{{ item.name }}</span>
          </div>
          <ul v-if="item.list">
            <li v-for="(childItem, childIndex) in item.list" :key="childIndex">
              <div>
                <i class="el-icon-location"></i>
                <span>{{ childItem.name }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['roles', 'opened'])
  },
  created() {
    console.log(this.roles)
  },
  data() {
    return {
      activeMenu: '3-1'
    }
  }
}
</script>
