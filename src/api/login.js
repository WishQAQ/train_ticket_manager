import axios from "axios";
export function loginByUserInfo(username, password) {
  return axios.post('/api/user/account/login', username, password).then(res =>{})
}

// export const loginByUserInfo = [
//   {"id": 1, "username": "admin", "pew": 123456, "role": [{ "name":"/"},{ "name":"Setting"}, {"name": "yellow"}, {"name": "blue"},{ "name":"all"}] , "introduce":"我可以看见全部页面"},
//   {"id": 2, "username": "a", "pew": 123456, "role": [{ "name":"home"},{"name": "blue"},{ "name":"all"}] , "introduce":"我可以看到home,blue和all页面"},
//   {"id": 3, "username": "b", "pew": 123456, "role": [{ "name":"home"},{ "name":"red"}], "introduce":"我可以看见red和home页面"},
//   {"id": 3, "username": "c", "pew": 123456, "role": [{ "name":"home"},{ "name":"red"},{ "name":"all"}], "introduce":"我可以看见home，red和all页面"},
// ]