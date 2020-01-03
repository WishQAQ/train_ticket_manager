import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 引入布局框架组件
import Frame from './components/layout/Frame.vue'
// 异步加载页面组件
const importPage = view => () => import(/* webpackChunkName: "p-[request]" */ `./views/${view}.vue`)
// RouterTab 内置路由
import { RouterTabRoutes } from 'vue-router-tab'

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackPrefetch: true */ '@/views/Login')
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
      return {path: '/', name: 'home', component: Frame,children: [...RouterTabRoutes,{path: '/', name: 'home',component: importPage(/* webpackPrefetch: true */ 'index'),meta:{title: '首页',aliveId: 'home'}}]}
      break;
    case 'documentSystem':  // 文档中心
      return {path: '/documentSystem', name: 'documentSystem', component: Frame,children: [
          ...RouterTabRoutes,
          {path: '/setting', name: 'setting', component: importPage('DocumentCenter/userSetting'),meta:{hidden: false,title: '个人设置',aliveId: 'setting'}},  // 个人设置
          {path: '/addressBook', name: 'addressBook', component: importPage('DocumentCenter/addressBook'),meta:{hidden: false,title: '内部通讯录',aliveId: 'addressBook'}},  // 内部通讯录
          {path: '/helpDocument', name: 'helpDocument', component: importPage('DocumentCenter/document'),meta:{hidden: false,title: '帮助文档',aliveId: 'helpDocument'}},  // 帮助文档
          {path: '/newsCenter', name: 'newsCenter', component: importPage('DocumentCenter/document'),meta:{hidden: false,title: '通知公告',aliveId: 'newsCenter'}},  // 新闻中心
        ]};
      break;
    case 'orderSystem':  // 订单系统
      return {path: '/orderSystem', name: 'orderSystem',component: Frame,children: [
          ...RouterTabRoutes,
          {path: '/orderManagement', name: 'orderManagement', component: importPage('OrderSystem/orderManagement'),meta:{name: '订单管理',hidden: false,title: '订单管理',aliveId: 'orderManagement'}},  // 订单管理
          {path: '/orderDetails', name: 'orderDetails', component: importPage('OrderSystem/orderDetails'),meta:{name: '订单详情',hidden: true,title: '订单详情',aliveId: 'orderDetails'}},  // 订单详情
          {path: '/addOrder', name: 'addOrder', component: importPage('OrderSystem/orderDetails'),meta:{name: '新增订单',hidden: false,title: '新增订单',aliveId: 'addOrder'}},  // 新增订单
          {path: '/editOrder', name: 'editOrder', component: importPage('OrderSystem/orderDetails'),meta:{name: '订单编辑',hidden: true,title: '订单编辑',aliveId: 'editOrder'}},  // 订单编辑
          {path: '/historicalOrder', name: 'historicalOrder', component: importPage('OrderSystem/orderManagement'),meta:{name: '历史订单查询',hidden: false,title: '历史订单查询',aliveId: 'historicalOrder'}},  // 历史订单查询
          {path: '/UnOrder', name: 'UnOrder', component: importPage('OrderSystem/orderManagement'),meta:{name: '不明订单',hidden: false,title: '不明订单',aliveId: 'UnOrder'}},  // 不明订单
          {path: '/remarksOrder', name: 'remarksOrder', component: importPage('OrderSystem/orderManagement'),meta:{name: '新备注订单列表',hidden: false,title: '新备注订单列表',aliveId: 'remarksOrder'}},  // 新备注订单列表
          {path: '/recyclingOrder', name: 'recyclingOrder', component: importPage('OrderSystem/orderManagement'),meta:{name: '回收订单',hidden: false,title: '回收订单',aliveId: 'recyclingOrder'}},  // 回收订单
        ]};
      break;
    case 'financialSystem':  // 财务系统
      return { path: '/financialSystem', name: 'financialSystem', component: Frame,children: [
          ...RouterTabRoutes,
          { path: '/settledOrder', name: 'settledOrder', component: importPage('FinancialSystem/settledOrder'),meta:{name: '已结算订单',hidden: false,title: '已结算订单',aliveId: 'settledOrder'}},  // 已结算订单
          { path: '/openOrder', name: 'openOrder', component: importPage('FinancialSystem/settledOrder'),meta:{name: '待结算订单',hidden: false,title: '待结算订单',aliveId: 'openOrder'}},  // 待结算订单
          { path: '/chargeOffOrder', name: 'chargeOffOrder', component: importPage('FinancialSystem/settledOrder'),meta:{name: '出账中订单',hidden: false,title: '出账中订单',aliveId: 'chargeOffOrder'}},  // 出账中订单
          { path: '/notChargeOff', name: 'notChargeOff', component: importPage('FinancialSystem/settledOrder'),meta:{name: '未出账订单',hidden: false,title: '未出账订单',aliveId: 'notChargeOff'}},  // 未出账订单
          { path: '/statement', name: 'statement', component: importPage('FinancialSystem/statement'),meta:{hidden: false,title: '对账单查询',aliveId: 'statement'}},  // 对账单查询
          { path: '/statementInfo', name: 'statementInfo', component: importPage('FinancialSystem/statementInfo'),meta:{hidden: true,keepAlive: true,title: '对账单详情',aliveId: 'statementInfo'}},  // 对账单详情
          { path: '/batchStatement', name: 'batchStatement', component: importPage('FinancialSystem/batchStatement'),meta:{hidden: true,title: '批量对账',aliveId: 'batchStatement'}},  // 批量对账
        ]};
      break;
    case 'passengerSystem':  // 乘客系统
      return { path: '/passengerSystem', name: 'passengerSystem', component: Frame,children: [
          ...RouterTabRoutes,
          { path: '/allTickets', name: 'allTickets', component: importPage('PassengerSystem/allTickets'),meta:{name: '全部车票',hidden: false,title: '全部车票',aliveId: 'allTickets'}},  // 全部车票
          { path: '/notIssued', name: 'notIssued', component: importPage('PassengerSystem/allTickets'),meta:{name: '未出票订单',hidden: false,title: '未出票订单',aliveId: 'notIssued'}},  // 未出票订单
        ]};
      break;
    case 'systemSetting':  // 系统配置
      return { path: '/systemSetting', name: 'systemSetting', component: Frame,children: [
          ...RouterTabRoutes,
          {path: '/menuSetting', name: 'menuSetting', component: importPage('SystemSettings/menuSetting'),meta:{hidden: false,title: '菜单管理',aliveId: 'menuSetting'}},  // 菜单管理
          {path: '/userSetting', name: 'userSetting', component: importPage('SystemSettings/userSetting'),meta:{hidden: false,title: '用户管理',aliveId: 'userSetting'}},  // 用户管理
          {path: '/roleSetting', name: 'roleSetting', component: importPage('SystemSettings/roleSetting'),meta:{hidden: false,title: '权限管理',aliveId: 'roleSetting'}},  // 权限管理
          {path: '/seatSetting', name: 'seatSetting', component: importPage('SystemSettings/seatSetting'),meta:{name: '席别管理',hidden: false,title: '席别管理',aliveId: 'seatSetting'}},  // 席别管理
          {path: '/ticketSetting', name: 'ticketSetting', component: importPage('SystemSettings/seatSetting'),meta:{name: '票种管理',hidden: false,title: '票种管理',aliveId: 'ticketSetting'}},  // 票种管理
          {path: '/clientSetting', name: 'clientSetting', component: importPage('SystemSettings/clientSetting'),meta:{hidden: false,title: '客户管理',aliveId: 'clientSetting'}},  // 客户管理
          {path: '/ticketStatistics', name: 'ticketStatistics', component: importPage('SystemSettings/ticketStatistics'),meta:{name: '网票统计',hidden: false,title: '网票统计',aliveId: 'ticketStatistics'}},  // 网票统计
          {path: '/paperTicket', name: 'paperTicket', component: importPage('SystemSettings/ticketStatistics'),meta:{name: '纸票统计',hidden: false,title: '纸票统计',aliveId: 'paperTicket'}},  // 纸票统计
          {path: '/eTicket', name: 'eTicket', component: importPage('SystemSettings/ticketStatistics'),meta:{name: '电子票统计',hidden: false,title: '电子票统计',aliveId: 'eTicket'}},  // 电子票统计
          {path: '/dataAnalysis', name: 'dataAnalysis', component: importPage('SystemSettings/dataAnalysis'),meta:{name: '数据分析',hidden: false,title: '数据分析',aliveId: 'dataAnalysis'}},  // 数据分析
          {path: '/accountSetting', name: 'accountSetting', component: importPage('SystemSettings/accountSetting'),meta:{name: '账号管理',hidden: false,title: '账号管理',aliveId: 'accountSetting'}},  // 12306账号管理
          {path: '/account', name: 'account', component: importPage('SystemSettings/account'),meta:{hidden: false,title: '12306账号',aliveId: 'account'}},  // 12306账号
          {path: '/billerSetting', name: 'billerSetting', component: importPage('SystemSettings/billerSetting'),meta:{hidden: false,title: '发单人配置',aliveId: 'billerSetting'}},  // 发单人配置
          {path: '/operationLog', name: 'operationLog', component: importPage('SystemSettings/optionLog'),meta:{hidden: false,title: '操作日志',aliveId: 'operationLog'}},  // 操作日志
          {path: '/apply', name: 'apply', component: importPage('SystemSettings/apply'),meta:{hidden: false,title: '应用',aliveId: 'apply'}},  // 应用
        ]};
      break;
    default:
      return {path: '/404', name: '404', component: () => import('@/views/404'),}
  }
}

