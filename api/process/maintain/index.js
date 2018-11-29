import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/product/process/maxVersion/page',
    method: 'get',
    params: query
  });
}

export function query(query) {
  return fetch({
    url: '/api/product/process/u9Conding/'+query,
    method: 'get', 
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/product/process/save',
    method: 'post',
    data: obj
  });
}

export function saveQuery() {
  return fetch({
    url: '/api/product/process/saveU9Conding',
    method: 'get', 
  });
}

export function delObj(obj) {
  return fetch({
    url: '/api/product/process/updateInvalid',
    method: 'put',
    data: obj
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/product/process/update/'+ id,
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/api/product/process/' + id,
    method: 'get'
  })
}

// 明细
export function info(id) {
  return fetch({
    url: ' /api/product/process/getProcess/'+id,
    method: 'get'
  })
}

// 恢复版本
export function restore(id) {
    return fetch({
      url: '/api/product/process/updateRegain/' + id,
      method: 'put'
  })
}

// 导入
export function importObj(Obj) {
  return fetch({
    url: ' /api/product/process/excelInport',
    method: 'post',
    data: Obj
  })
}
// 下載
export function downloadObj() {
  return fetch({
    url: ' /api/product/process/ftpDownload',
    method: 'get' 
  })
}
// 上传
export function uploadObj(Obj) {
  return fetch({
    url: ' /api/product/process/ftpUploadImg',
    method: 'post',
    data: Obj
  })
}
// 版本历史
export function getVersion(query) {
  return fetch({
    url: ' /api/product/process/historyVersion/page',
    method: 'get',
    params: query
  })
}