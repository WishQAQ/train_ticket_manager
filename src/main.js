import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { powerRouterLazy } from './router';//添加一个powerRouterLazy加载
import './plugins/element.js'

import store from './store'

import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


import axios from "axios";
Vue.prototype.$axios = axios;

import qs from 'qs'
// Vue.prototype.$axios = axios;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 请求拦截器
axios.interceptors.request.use(
    config => {
      if(sessionStorage.CSRF){
        config.headers['csrf'] = sessionStorage.CSRF;
      }
      if (config.method === 'post') {
        config.data = qs.stringify(config.data)
      }
      return config;
    },
    error => {
      console.log(error)
      Promise.reject(error)
    });


// 全局样式表
import "../public/base.less";
// 公用方法
import "../src/utlis/tools"

// 全局组件
/**
 * @Description: image组件，传值images，若无值则为默认无图状态
 * @author Wish
 * @date 2019/9/18
*/
import PublicImage from '@/components/public/public_image';
Vue.component('PublicImage', PublicImage);

Vue.config.productionTip = false;

let generaMenu = (obj,data) =>{
  data.forEach((v,i)=>{
    obj.push(powerRouterLazy(v.menu_english_name))
    if(v.children){
      generaMenu(obj[i].children,v.children) // 递归children
    }
    obj.map(res =>{
      if(res.name === v.menu_english_name){
        res['menuName'] = v.menu_name
        res['icon'] = v.icon
        if(res.children){
          res.children.forEach((cres,ci) =>{
            if(cres.name === v.childrenMenu[ci].menu_english_name){
              cres['menuName'] = v.childrenMenu[ci].menu_name
              cres['icon'] = v.childrenMenu[ci].icon
            }
          })
        }
      }
    })
  })

};
router.beforeEach((to, from, next) => {
  let _role= store.getters.role;
  if(_role){ //判断role 是否存在
    if(store.getters.newrouter.length !== 0){ // 判断newrouter是否为空
      next()
    }else{
      let newrouter=[]
      generaMenu(newrouter,_role); // router循环
      router.addRoutes(newrouter); // 添加动态路由
      store.dispatch('Roles',newrouter).then(res => {
        next({...to})
      }).catch(() => {

      })
    }
  }else{
    if (['/login'].indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
