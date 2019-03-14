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
    url: '/api/product/process/u9Conding',
    method: 'get', 
    params: query
  });
}

// 明细
export function getObj(id) {
  return fetch({
    url: '/api/product/process/getProcess/'+id,
    method: 'get'
  })
} 

// 删除上传图片 
export function deluploadObj(processId,type) {
  return fetch({
    url: '/api/product/process/photo/'+processId+'/'+type,
    method: 'delete', 
  })
}

// 查出图片
export function pic(id) {
  return fetch({
    url: '/api/product/process/photo/'+id,
    method: 'get'
  })
}