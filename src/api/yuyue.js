import $axios from './index'

export function getList(params) {
  const url = '/v1/v2/yuyue/getList'
  return $axios.get(url, params)
}

export function editOrderRemark(params) {
  const url = '/v1/v2/yuyue/editOrderRemark/' + params.id
  return $axios.get(url, {
    remark: params.remark
  })
}

export function editPayState(params) {
  const url = '/v1/v2/yuyue/editPayState/' + params.id
  return $axios.get(url, {
    payState: params.payState
  })
}