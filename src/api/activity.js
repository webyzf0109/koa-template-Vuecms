import $axios from './index'

export function getList() {
  const url = '/v1/v2/activity/getList'
  return $axios.get(url)
}
