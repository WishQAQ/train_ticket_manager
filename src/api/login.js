import axios from "axios";
import store from '@/store'
import router from '@/router'

import {Message} from 'element-ui'

export function loginByUserInfo(username, password) {
   axios.post('http://oa.huimin.dev.cq1080.com/account/login', username, password).then(res =>{
    sessionStorage.setItem('CSRF', res.data.result.csrf);
    if(res.data.code === 0){
      // 页面跳转
      Message.success({
        message: '正在登录'
      })
      setTimeout(() =>{
        router.push('/');
      },300)
    }else {
      Message.error({
        message: res.data.msg,
        type: "error"
      })
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
       })
}


export function userExit() {
  axios.get('http://oa.huimin.dev.cq1080.com/user/account/exit')
      .then(res =>{
        this.$store.dispatch('Logout').then(() => {
          this.$router.push({ path: '/login' });
        }).catch(err => {
          this.$message.error(err);
        });

  }).catch(() =>{

      })
}