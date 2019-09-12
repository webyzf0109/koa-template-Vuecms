const getters = {
  token: state => state.user.token,
  userName: state => state.user.userName,
  introduce: state => state.user.introduce,
  msgIsShow: state => state.app.msgIsShow,
  showDriver: state => state.app.showDriver
}
export default getters
