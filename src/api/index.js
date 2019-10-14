import axios from 'axios'
// import Qs from 'qs'
import store from '@/store'
import router from '@/router'
import Vue from 'vue'
import { Loading, Message } from 'element-ui' // 引用element-ui的加载和消息提示组件

axios.defaults.timeout = 30000
// axios.defaults.baseURL = process.env.VUE_APP_BASE_API
Vue.prototype.$http = axios // 并发请求
// 在全局请求和响应拦截器中添加请求状态
let loading = null
import { Base64 } from '@/api/base64.js'
// 请求拦截器
axios.interceptors.request.use(
  config => {
    loading = Loading.service({ text: '拼命加载中' })
    const token = store.getters.token
    const base64 = new Base64()
    const result = base64.encode(token + ':')
    if (token) {
      config.headers.Authorization = 'Basic ' + result // 请求头部添加token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (loading) {
      loading.close()
    }
    const code = response.status
    if ((code >= 200 && code < 300) || code === 304) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (loading) {
      loading.close()
    }
    if (error.response) {
      switch (error.response.status) {
        case 403:
          // 返回403 清除token信息并跳转到登陆页面
          store.commit('DEL_TOKEN')
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
        case 404:
          Message.error('网络请求不存在')
          break
        default:
          if (typeof error.response.data.message == 'string') {
            Message.error(error.response.data.message)
          } else if (typeof error.response.data.message == 'array') {
            Message.error(error.response.data.message[0])
          }
      }
    } else {
      // 请求超时或者网络有问题
      if (error.message.includes('timeout')) {
        Message.error('请求超时！请检查网络是否正常')
      } else {
        Message.error('请求失败，请检查网络是否已连接')
      }
    }
    return Promise.reject(error)
  }
)

// get，post请求方法
export default {
  post(url, data) {
    return axios.post(url, data)
  },
  get(url, params) {
    return axios({
      method: 'get',
      url,
      params
    })
  }
}
