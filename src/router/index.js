import Vue from 'vue'
import Router from 'vue-router'
// import exceptionRouters from './exception'

Vue.use(Router);

/*公有router*/
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login')
    },{
      path: '/',
      component: () => import('@/views/Home'),
      children: [{
          path: '/',
          component: () => import('@/views/Index')
        },{
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/DocumentCenter/userSetting')
      }]
    },{
      path: '/404',
      name: '404',
      component: () => import('@/views/exception/404'),
    }
  ]
})

export function powerRouterLazy(name) {
  switch (name) {
    case 'home':
      return {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home')
      };
      break;

  }
}


