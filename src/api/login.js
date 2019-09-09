import $axios from './index'

export function login(data) {
  const url = '/v1/token'
  return $axios.post(url, data)
}
export function getInfo() {
  const url = '/getInfo'
  return $axios.get(url)
}
