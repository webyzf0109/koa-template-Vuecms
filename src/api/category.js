import $axios from './index'

export function getList(params) {
  const url = '/v1/v2/category/getList'
  return $axios.get(url,params)
}


export function addCategory(params) {
  const url = '/v1/v2/category/addCategory'
  return $axios.get(url,params)
}

export function removeCategory(params) {
  const url = '/v1/v2/category/removeCategory/'+params.id
  return $axios.get(url)
}

export function editCategory(params) {
  const url = '/v1/v2/category/editCategory/'+params.id
  return $axios.get(url,{name:params.name})
}

