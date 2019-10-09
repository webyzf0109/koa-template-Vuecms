import $axios from './index'

export function getList(params) {
  const url = '/v1/v2/goods/getList'
  return $axios.get(url,params)
}

export function webGetList(params) {
  const url = '/v1/v2/goods/web/getList'
  return $axios.get(url,params)
}

export function getCategoryList(params) {
  const url = '/v1/v2/category/getList'
  return $axios.get(url,params)
}

export function addGoods(params) {
  const url = '/v1/v2/goods/addGoods'
  return $axios.get(url,params)
}

export function removeGoods(params) {
  const url = '/v1/v2/goods/removeGoods/'+params.id
  return $axios.get(url)
}

export function editGoods(params) {
  const url = '/v1/v2/goods/editGoods/'+params.id
  return $axios.get(url,params)
}

export function upload(params) {
  const url = '/v1/upload'
  return $axios.post(url,params)
}