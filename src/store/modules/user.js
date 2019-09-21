import { login } from '@/api/login'
import { Message } from 'element-ui'
import router, { resetRouter } from '@/router'

const state = {
  token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '', // 认证凭证'
  userName: '',
  introduce: ''
}
const mutations = {
  SET_TOKEN(state, val) {
    state.token = val
    sessionStorage.setItem('token', val)
  },
  // SET_ROLES
  DEL_TOKEN() {
    sessionStorage.clear()
  },
  SET_NAME(state, payload) {
    sessionStorage.setItem('userName', payload)
  },
  SET_INTRODUCE(state, payload) {
    sessionStorage.setItem('introduce', payload)
  },
  SET_ROLES(state, payload) {
    sessionStorage.roles = JSON.stringify(payload)
  }
}
const actions = {
  // user login
  _login({ commit }, formdatas) {
    return new Promise((resolve, reject) => {
      login(formdatas)
        .then(res => {
          if (res.data) {
            Message.success(res.data.message)
            commit('SET_TOKEN', res.data.token)
            commit('SET_ROLES', res.data.resourceList)
            commit('SET_NAME', res.data.username)
            commit(
              'SET_INTRODUCE',
              res.data.scope == 8 ? '管理员' : '超级管理员'
            )
          } else {
            Message.error(res.data.message)
          }
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  loginOut({ commit }) {
    commit('DEL_TOKEN')
    resetRouter()
    router.push({
      path: '/login',
      query: {
        redirect: router.currentRoute.fullPath
      }
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
