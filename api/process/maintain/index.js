import fetch from 'utils/fetch';
// 分页查询
export function page(query) {
  return fetch({
    url: '/api/product/process/maxVersion/page',
    method: 'get',
    params: query
  });
}

// export function query(query) {
//   return fetch({
//     url: '/api/product/process/u9Conding/'+query,
//     method: 'get', 
//   });
// }
export function query(u9listQuery) {
  return fetch({
    url: '/api/product/process/u9Conding',
    method: 'get', 
    params: u9listQuery
  });
}

// u9编码的 
// export function queryAdd(query) {
//   return fetch({
//     url: '/api/product/process/saveU9Conding/'+query,
//     method: 'get', 
//   });
// }

export function u9query(u9listQuery) {
  return fetch({
    url: '/api/product/process/saveU9Coding',
    method: 'get', 
    params: u9listQuery
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

//  查出其他的4个资料
export function selectViewForU9Conding(query) {
  return fetch({
    url: '/api/product/process/selectViewForU9Conding/'+query,
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

export function deleteObj(id) {
  return fetch({
    url: '/api/product/process/' + id,
    method: 'delete'
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
    url: '/api/product/process/getProcess/'+id,
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
    url: '/api/product/process/excelInport',
    method: 'post',
    data: Obj
  })
}

// 导出
export function exportObj(u9Coding,customer,status) {
  return fetch({
    url: '/api/product/process/photo/export',
    method: 'get',
    // params:Obj
    params: {
      u9Coding:u9Coding,
      customer:customer,
      status:status
    }
  })
}

// 下載
export function downloadObj() {
  return fetch({
    url: '/api/product/process/ftpDownload',
    method: 'get' 
  })
}
// 上传 没用到
// export function uploadObj(Obj) {
//   return fetch({
//     url: ' /api/product/process/ftpUploadImg',
//     method: 'post',
//     data: Obj
//   })
// }

// 删除上传图片
export function deluploadObj(processId,type) {
  return fetch({
    url: '/api/product/process/photo/'+processId+'/'+type,
    method: 'delete', 
  })
}

// 版本历史
export function getVersion(query) {
  return fetch({
    url: '/api/product/process/historyVersion/page',
    method: 'get',
    params: query
  })
}

export function pic(id) {
  return fetch({
    url: '/api/product/process/photo/'+id,
    method: 'get'
  })
}