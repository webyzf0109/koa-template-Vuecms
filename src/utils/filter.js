import Vue from 'vue'
import { GMTToStr } from './dateFormat.js'
Vue.filter('dateFormat', function(value) {
  return GMTToStr('yyyy-MM-dd hh:mm:ss', new Date(value))
})
