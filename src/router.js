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
      return {path: '/', name: 'home', component: () => import('@/views/index')}
      break;
    case 'documentSystem':  // 文档中心
      return {path: '/documentSystem', name: 'documentSystem', component: () => import('@/views/DocumentCenter/index'),children: [
          {path: '/setting', name: 'setting', component: () => import('@/views/DocumentCenter/userSetting')},  // 个人设置
          {path: '/addressBook', name: 'addressBook', component: () => import('@/views/DocumentCenter/addressBook')},  // 内部通讯录
          {path: '/helpDocument', name: 'helpDocument', component: () => import('@/views/DocumentCenter/helpDocument')},  // 帮助文档
        ]};
      break;
    case 'passengerSystem':  // 乘客系统
      return { path: '/passengerSystem', name: 'passengerSystem', component: () => import('@/views/PassengerSystem/index'),children: [
          { path: '/allTickets', name: 'allTickets', component: () => import('@/views/PassengerSystem/allTickets') },  // 全部车票
    ]};
      break;
    case 'systemSetting':  // 系统配置
      return { path: '/systemSetting', name: 'systemSetting', component: () => import('@/views/SystemSettings/index'),children: [
          {path: '/menuSetting', name: 'menuSetting', component: () => import('@/views/SystemSettings/menuSetting')},  // 菜单管理
          {path: '/userSetting', name: 'userSetting', component: () => import('@/views/SystemSettings/userSetting')},  // 用户管理
          {path: '/roleSetting', name: 'roleSetting', component: () => import('@/views/SystemSettings/roleSetting')},  // 权限管理
          {path: '/seatSetting', name: 'seatSetting', component: () => import('@/views/SystemSettings/seatSetting'),meta:{name: '席别管理'}},  // 席别管理
          {path: '/ticketSetting', name: 'ticketSetting', component: () => import('@/views/SystemSettings/seatSetting'),meta:{name: '票种管理'}},  // 票种管理
          {path: '/clientSetting', name: 'clientSetting', component: () => import('@/views/SystemSettings/clientSetting')},  // 客户管理
          {path: '/ticketStatistics', name: 'ticketStatistics', component: () => import('@/views/SystemSettings/ticketStatistics'),meta:{name: '网票统计'}},  // 客户管理
        ]};
      break;
    default:
      return {path: '/404', name: '404', component: () => import('@/views/404'),}
  }
}

