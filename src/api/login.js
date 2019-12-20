import axios from "axios";
import store from '@/store'
import router from '@/router'

import bus from '../utlis/bus'

import {Message} from 'element-ui'

export function loginByUserInfo(username, password) {
   axios.post('/account/login', username, password).then(res =>{
     sessionStorage.setItem('CSRF', res.data.result.csrf);
     sessionStorage.setItem('FieldInfo', JSON.stringify(res.data.result.fieldInfo))
     sessionStorage.setItem('FieldInfoAll', JSON.stringify(res.data.result.fieldAllInfo))
     if(res.data.result.permission.isHighest){
       sessionStorage.setItem('isHighest', '超级管理员');
     }
     if(res.data.result.permission.role_name === '普通用户'){
       sessionStorage.setItem('roleUserStatus', '[\'paa47tbjsoje\',\'dju63yicid7h\']');
     }

    if(res.data.code === 0){
      // 页面跳转
      Message.success({
        message: '登录成功'
      })
      setTimeout(() =>{
        router.push({
          name: 'home'
        });
      },300)
    }else {
      Message.error({
        message: res.data.msg,
        type: "error"
      })
      bus.$emit('loginError', 'error')
    }

    // 验证权限信息
    store.dispatch('Logins',res.data.result).then(res => {

    }).catch(() => {

    })
     return res.data.result
  }).catch(() =>{
         Message.error({
           message: '登录失败，请稍后重试',
           type: "error"
         })
     bus.$emit('loginError', 'error')
       })
}


export function userExit() {
  store.dispatch('Logout').then(() => {
    router.push({ path: '/login' });
    localStorage.clear();
    sessionStorage.clear();

  }).catch(err => {
    Message.error(err);
  });
}
