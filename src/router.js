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
          {path: '/setting', name: 'setting', component: () => import('@/views/DocumentCenter/userSetting'),meta:{hidden: false}},  // 个人设置
          {path: '/addressBook', name: 'addressBook', component: () => import('@/views/DocumentCenter/addressBook'),meta:{hidden: false}},  // 内部通讯录
          {path: '/helpDocument', name: 'helpDocument', component: () => import('@/views/DocumentCenter/document'),meta:{hidden: false}},  // 帮助文档
          {path: '/newsCenter', name: 'newsCenter', component: () => import('@/views/DocumentCenter/document'),meta:{hidden: false}},  // 新闻中心
        ]};
      break;
    case 'orderSystem':  // 订单系统
      return {path: '/orderSystem', name: 'orderSystem', component: () => import('@/views/OrderSystem/index'),children: [
          {path: '/orderManagement', name: 'orderManagement', component: () => import('@/views/OrderSystem/orderManagement'),meta:{name: '订单管理',hidden: false}},  // 订单管理
          {path: '/orderDetails', name: 'orderDetails', component: () => import('@/views/OrderSystem/orderDetails'),meta:{name: '订单详情',hidden: true}},  // 订单详情
          {path: '/historicalOrder', name: 'historicalOrder', component: () => import('@/views/OrderSystem/orderManagement'),meta:{name: '历史订单查询',hidden: false}},  // 历史订单查询
          {path: '/UnOrder', name: 'UnOrder', component: () => import('@/views/OrderSystem/orderManagement'),meta:{name: '不明订单',hidden: false}},  // 不明订单
          {path: '/remarksOrder', name: 'remarksOrder', component: () => import('@/views/OrderSystem/orderManagement'),meta:{name: '新备注订单列表',hidden: false}},  // 新备注订单列表
          {path: '/recyclingOrder', name: 'recyclingOrder', component: () => import('@/views/OrderSystem/orderManagement'),meta:{name: '回收订单',hidden: false}},  // 回收订单
        ]};
      break;
    case 'financialSystem':  // 财务系统
      return { path: '/financialSystem', name: 'financialSystem', component: () => import('@/views/FinancialSystem/index'),children: [
          { path: '/settledOrder', name: 'settledOrder', component: () => import('@/views/FinancialSystem/settledOrder'),meta:{name: '已结算订单',hidden: false}},  // 已结算订单
          { path: '/openOrder', name: 'openOrder', component: () => import('@/views/FinancialSystem/settledOrder'),meta:{name: '待结算订单',hidden: false}},  // 待结算订单
          { path: '/chargeOffOrder', name: 'chargeOffOrder', component: () => import('@/views/FinancialSystem/settledOrder'),meta:{name: '出账中订单',hidden: false}},  // 出账中订单
          { path: '/notChargeOff', name: 'notChargeOff', component: () => import('@/views/FinancialSystem/settledOrder'),meta:{name: '未出账订单',hidden: false}},  // 未出账订单
          { path: '/statement', name: 'statement', component: () => import('@/views/FinancialSystem/statement'),meta:{hidden: false}},  // 对账单查询
          { path: '/statementInfo', name: 'statementInfo', component: () => import('@/views/FinancialSystem/statementInfo'),meta:{hidden: true}},  // 对账单详情
          { path: '/batchStatement', name: 'batchStatement', component: () => import('@/views/FinancialSystem/batchStatement'),meta:{hidden: true}},  // 批量对账
        ]};
      break;
    case 'passengerSystem':  // 乘客系统
      return { path: '/passengerSystem', name: 'passengerSystem', component: () => import('@/views/PassengerSystem/index'),children: [
          { path: '/allTickets', name: 'allTickets', component: () => import('@/views/PassengerSystem/allTickets'),meta:{name: '全部车票',hidden: false}},  // 全部车票
          { path: '/notIssued', name: 'notIssued', component: () => import('@/views/PassengerSystem/allTickets'),meta:{name: '未出票订单',hidden: false}},  // 未出票订单
        ]};
      break;
    case 'systemSetting':  // 系统配置
      return { path: '/systemSetting', name: 'systemSetting', component: () => import('@/views/SystemSettings/index'),children: [
          {path: '/menuSetting', name: 'menuSetting', component: () => import('@/views/SystemSettings/menuSetting'),meta:{hidden: false}},  // 菜单管理
          {path: '/userSetting', name: 'userSetting', component: () => import('@/views/SystemSettings/userSetting'),meta:{hidden: false}},  // 用户管理
          {path: '/roleSetting', name: 'roleSetting', component: () => import('@/views/SystemSettings/roleSetting'),meta:{hidden: false}},  // 权限管理
          {path: '/seatSetting', name: 'seatSetting', component: () => import('@/views/SystemSettings/seatSetting'),meta:{name: '席别管理',hidden: false}},  // 席别管理
          {path: '/ticketSetting', name: 'ticketSetting', component: () => import('@/views/SystemSettings/seatSetting'),meta:{name: '票种管理',hidden: false}},  // 票种管理
          {path: '/clientSetting', name: 'clientSetting', component: () => import('@/views/SystemSettings/clientSetting'),meta:{hidden: false}},  // 客户管理
          {path: '/ticketStatistics', name: 'ticketStatistics', component: () => import('@/views/SystemSettings/ticketStatistics'),meta:{name: '网票统计',hidden: false}},  // 网票统计
          {path: '/paperTicket', name: 'paperTicket', component: () => import('@/views/SystemSettings/ticketStatistics'),meta:{name: '纸票统计',hidden: false}},  // 纸票统计
          {path: '/eTicket', name: 'eTicket', component: () => import('@/views/SystemSettings/ticketStatistics'),meta:{name: '电子票统计',hidden: false}},  // 电子票统计
          {path: '/accountSetting', name: 'accountSetting', component: () => import('@/views/SystemSettings/accountSetting'),meta:{name: '账号管理',hidden: false}},  // 12306账号管理
          {path: '/account', name: 'account', component: () => import('@/views/SystemSettings/account'),meta:{hidden: false}},  // 12306账号
          {path: '/billerSetting', name: 'billerSetting', component: () => import('@/views/SystemSettings/billerSetting'),meta:{hidden: false}},  // 发单人配置
          {path: '/optionLog', name: 'optionLog', component: () => import('@/views/SystemSettings/optionLog'),meta:{hidden: false}},  // 操作日志
        ]};
      break;
    default:
      return {path: '/404', name: '404', component: () => import('@/views/404'),}
  }
}

