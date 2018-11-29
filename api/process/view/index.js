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
    url: '/pro/process/maxVersion',
    method: 'post',
    data: obj
  });
}
// 明细
export function getObj(id) {
  return fetch({
    url: ' /api/product/process/getProcess/'+id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/pro/process/maxVersion/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/pro/process/maxVersion/' + id,
    method: 'put',
    data: obj
  })
}
