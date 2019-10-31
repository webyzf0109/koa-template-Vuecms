<template>
  <div class="pageMain">
    <transition name="fade-page" mode="out-in" v-if="!$route.meta.noCache">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <transition name="fade-page" mode="out-in" v-if="$route.meta.noCache">
      <router-view></router-view>
    </transition>
    
  </div>
</template>

<script>
export default {}
</script>
