import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from './store'
import '@/style/index.scss' // glob scss
import './plugins/element.js'
import animated from 'animate.css'
import '@/assets/iconfont/iconfont.css'
import './utils/filter.js'
Vue.use(animated)
// import SlideVerify from 'vue-monoplasty-slide-verify'

import yzfwork from 'yzfwork'
Vue.use(yzfwork)


import Highlight from '@/utils/highlight';
import 'highlight.js/styles/monokai-sublime.css';
Vue.use(Highlight);
// Vue.use(SlideVerify)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
