/*
set sidebar open or close,and some app setting
 */
const state = {
  msgIsShow: false,
  showDriver: sessionStorage.getItem('driver')
    ? sessionStorage.getItem('driver')
    : 'yes'
}
const mutations = {
  SET_OPENED(state, payload) {
    sessionStorage.setItem('open', payload)
  },
  SET_MSGISOPEN(state) {
    state.msgIsShow = !state.msgIsShow
  },
  SET_DRIVER(state, payload) {
    state.showDriver = payload
    sessionStorage.setItem('driver', payload)
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
