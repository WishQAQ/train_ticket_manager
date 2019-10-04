import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login')
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
      return {path: '/', name: 'home', component: () => import('@/views/Index')}
      break;
    case 'documentSystem':  // 文档中心
      return {path: '/documentSystem', name: 'documentSystem', component: () => import('@/views/DocumentCenter/index'),children: [
          {path: '/setting', name: 'setting', component: () => import('@/views/DocumentCenter/userSetting')},
          {path: '/addressBook', name: 'addressBook', component: () => import('@/views/DocumentCenter/addressBook')},
          {path: '/helpDocument', name: 'helpDocument', component: () => import('@/views/DocumentCenter/helpDocument')},
        ]};
      break;
    case 'passengerSystem':  // 乘客系统
      return { path: '/passengerSystem', name: 'passengerSystem', component: () => import('@/views/PassengerSystem/index'),children: [
          { path: '/allTickets', name: 'allTickets', component: () => import('@/views/PassengerSystem/allTickets') },
    ]};
      break;
    case 'systemSetting':  // 系统配置
      return { path: '/systemSetting', name: 'systemSetting', component: () => import('@/views/SystemSettings/index'),children: [
          {path: '/menuSetting', name: 'menuSetting', component: () => import('@/views/SystemSettings/menuSetting')},
          {path: '/userSetting', name: 'userSetting', component: () => import('@/views/SystemSettings/userSetting')},
          {path: '/roleSetting', name: 'roleSetting', component: () => import('@/views/SystemSettings/roleSetting')},
        ]};
      break;
    default:
      return {path: '/404', name: '404', component: () => import('@/views/404'),}
  }
}

