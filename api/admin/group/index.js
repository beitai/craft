import fetch from 'utils/fetch';
// 获取所有组类型
export function getAllGroupTypes() {
  return fetch({
    url: '/api/admin/groupType/all',
    method: 'get'
  });
}
// 获取数组件。
export function fetchTree(query) {
  return fetch({
    url: '/api/admin/group/tree',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: 'api/admin/group/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/group',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'get'
  });
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'delete'
  });
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'put',
    data: obj
  });
}

// 获取所有用户
export function getAllUsers() {
  return fetch({
    url: '/api/admin/user/query',
    method: 'get' 
  });
}

// 获得初始化用户授权
export function getUsers(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/user',
    method: 'get',
    params: data
  });
}

// 修改用户 -- 添加？
export function modifyUsers(id,data) {
  return fetch({
    url: '/api/admin/group/' + id + '/user',
    method: 'post',
    params:data
  });
}

//  删除用户分配权限
export function delUsers(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/user',
    method: 'put',
    data: data
  });
}

//  删除用户权限
export function removeElementAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element/remove',
    method: 'post',
    params: data
  });
}

//  添加用户权限  按钮
export function addElementAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element/add',
    method: 'post',
    params: data
  });
}
//  获得用户权限
export function getElementAuthority(id,data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element',
    method: 'get',
    params: data
  });
}

// 修改菜单权限
export function modifyMenuAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/menu',
    method: 'post',
    params: data
  });
}

// 获取菜单权限
export function getMenuAuthority(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/menu',
    method: 'get'
  });
}


