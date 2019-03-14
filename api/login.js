import fetch from 'utils/fetch';

export function loginByEmail(username, password, code) {
  const data = {
    username,
    password,
    code,
  };
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}

export function logout(token) {
  return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'post',
    params: { token }
  });
}

export function getInfo(token) {
  return fetch({
    url: '/api/admin/user/front/info',
    method: 'get',
    params: { token }
    // Headers: {
    //   Authorization: token
    // }
  });
}

export function getMenus(token) {
  return fetch({
    url: '/api/admin/user/front/menus',
    method: 'get',
    params: { token } 
  });
}

export function getAllMenus() {
  return fetch({
    url: '/api/admin/user/front/menu/all',
    method: 'get'
  });
}

export function getyzm() {
  return fetch({
    url: '/api/auth/jwt/getcode',
    method: 'get'
  });
}