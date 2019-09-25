import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login')
    },{
      path: '/404',
      name: '404',
      component: () => import('@/views/404'),
    }
  ]
})
export function powerRouterLazy(name) {
  switch (name) {
    case 'home':
      return {path: '/', name: 'home', component: () => import('@/views/index')}
      break;
    case 'setting':
      return {path: '/setting', name: 'setting', component: () => import('@/views/DocumentCenter/userSetting')}
      break;
    case 'systemSetting':
      return { path: '/systemSetting', name: 'systemSetting' ,component: () => import('@/views/SystemSettings/index'),children: [
          {path: '/menuSetting', name: 'menuSetting', component: () => import('@/views/SystemSettings/menuSetting')},
          {path: '/userSetting', name: 'userSetting', component: () => import('@/views/SystemSettings/userSetting')},
          {path: '/roleSetting', name: 'roleSetting', component: () => import('@/views/SystemSettings/roleSetting')},
        ]}
      break;
    // case 'all':
    //   return {path: '/all', name: 'all', component: all,children: []}
    //   break;
    default:
      return {path: '/404', name: '404', component: () => import('@/views/404'),}
  }
}

