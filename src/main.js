import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { powerRouterLazy } from './router';//添加一个powerRouterLazy加载
import './plugins/element.js'

import {Message} from 'element-ui'

import store from './store'

import Router from 'vue-router'

// vue-tab组件
import RouterTab from 'vue-router-tab'
import 'vue-router-tab/dist/lib/vue-router-tab.css'

Vue.use(RouterTab)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

import './directives'

import axios from "axios";
Vue.prototype.$axios = axios;

import qs from 'qs'
Vue.prototype.$qs = qs
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.withCredentials = true
// 请求拦截器
axios.interceptors.request.use(
    config => {
      if(sessionStorage.CSRF){
        config.headers['csrf'] = sessionStorage.CSRF;
      }
      // if (config.method === 'post') {
      //   config.data = qs.stringify(config.data)
      // }
      return config;
    },
    error => {
      return Promise.reject(error);
    });


// 全局样式表
import "../public/base.less";
// 公用方法
import "../src/utlis/tools"
// 全局防抖or节流
// import Debounce from '../src/utlis/DebounceOrThrottle'

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
    obj.forEach((res, index) =>{
      if(res.name === v.menu_english_name){
        res['menuName'] = v.menu_name
        res['icon'] = v.icon
        if(res.children){
          v.childrenMenu.map(rcrs =>{
            res.children.forEach(cres =>{
              if(cres.name === rcrs.menu_english_name){
                cres['menuName'] = rcrs.menu_name
                cres['icon'] = rcrs.icon
              }
              // if(cres.name !== 'home'){
              //   if(cres['menuName'] === '' || cres['menuName'] === null || cres['menuName'] === undefined){
              //     console.log(cres);
              //     cres.path = ''
              //     cres.name = ''
              //     // obj[index].children.splice(index,1)
              //   }
              // }
            })
          })
        }
      }
    })

  })
  // obj.map((item, index) =>{
  //   item.children.forEach((cItem, cIndex) =>{
  //     if(cItem.name !== 'home'){
  //       if(cItem['menuName'] === '' || cItem['menuName'] === null || cItem['menuName'] === undefined){
  //         console.log(cItem);
  //         cItem.path = ''
  //         cItem.name = ''
  //         // obj[index].children.splice(index,1)
  //       }
  //     }
  //
  //   })
  // })
  // console.log(obj);
  // obj = []
};
router.beforeEach((to, from, next) => {
  let _role= store.getters.role;
  if(_role){ //判断role 是否存在
    if(store.getters.newrouter.length !== 0){ // 判断newrouter是否为空
      const list = store.getters.newrouter;
      //如果没有匹配到，证明没有权限
      if(String(JSON.stringify(list)).indexOf(to.name) === -1) {
        if(to.name !== 'login'){
          Message.error('当前账号暂无权限')
          next('/login')
          sessionStorage.clear()
        }
      }else {
        if (to.matched.length ===0) {
          from.name ? next({ name:from.name }) : next('/');
          Message.error('当前账号暂无权限')
          next('/login')
          sessionStorage.clear()
        } else {
          next();
        }
      }
    }else{
      if(_role){
        let newrouter=[]
        generaMenu(newrouter,_role); // router循环
        router.addRoutes(newrouter); // 添加动态路由
        store.dispatch('Roles',newrouter).then(res => {
          next({...to})
        }).catch(() => {

        })
      }
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
