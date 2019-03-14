import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/product/process/historyProcess/page',
    method: 'get',
    params: query
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/product/process/getProcess/' + id,
    method: 'get'
  })
}

export function query(query) {
  return fetch({
    url: '/api/product/process/u9Conding',
    method: 'get', 
    params: query
  });
}

export function pic(id) {
  return fetch({
    url: '/api/product/process/photo/'+id,
    method: 'get'
  })
}