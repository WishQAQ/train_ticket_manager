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
      path: '/',
      component: () => import('@/views/home'),
      children: [{
        path: '/',
        component: () => import('@/views/index')
      },{
        path: '/setting',
        name: '个人设置',
        component: () => import('@/views/DocumentCenter/userSetting')
      },{
        path: '/menuSetting',
        name: '菜单设置',
        component: () => import('@/views/SystemSettings/menuSetting')
      }]
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
      return {path: '/', name: 'home', component: () => import('@/views/login')}
      break;
    case 'setting':
      return {path: '/setting', name: 'setting', component: () => import('@/views/DocumentCenter/userSetting')}
      break;
    // case 'all':
    //   return {path: '/all', name: 'all', component: all,children: []}
    //   break;
    default:
      return {path: '/404', name: '404', component: () => import('@/views/404'),}
  }
}

