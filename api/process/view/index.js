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

// 明细
export function getObj(id) {
  return fetch({
    url: '/api/product/process/getProcess/'+id,
    method: 'get'
  })
} 

// 删除上传图片
export function deluploadObj(id,processId,type) {
  return fetch({
    url: '/api/product/process/photo/'+ id+'/'+processId+'/'+type,
    method: 'delete', 
  })
}