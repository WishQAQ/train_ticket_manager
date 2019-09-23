import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { powerRouterLazy } from './router';//添加一个powerRouterLazy加载
import './plugins/element.js'

import store from './store'

import axios from "axios";
Vue.prototype.$axios = axios;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 请求拦截器
axios.interceptors.request.use(
    config => {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
      // config.headers['X-CSRFToken'] = 'QGOLEav1Ze';
      config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
      const token = store.state.token;
      token && (config.headers.Authorization = token);
      return config;
    },
    error => {
      return Promise.error(error);
    });

// 全局样式表
import "../public/base.less";

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
    obj.push(powerRouterLazy(v.name))
    if(v.children){
      generaMenu(obj[i].children,v.children) // 递归children
    }
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
