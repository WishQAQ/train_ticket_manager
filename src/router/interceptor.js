/**
 * @Description: 白名单设置 路由拦截
 * @author Wish
 * @date 2019/9/16
*/
import router from './index'
import store from '../store'

// 设置白名单
const whiteList = ['/404']

// 截取参数
function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) return unescape(r[2]); return null
}

// 路由拦截
// router.beforeEach((to, from, next) => {
//   if (whiteList.indexOf(to.path) !== -1) { // 检测是否为白名单
//     next()
//   } else {
//     // 是否是登陆状态-单点登录请求用户是否登录接口-》后台返回登陆页面地址或者已登陆的状态
//     // 这里看具体项目中如何判断当前是否登录状态（我们之前的项目是发送token到接口返回登录状态），这里我们暂用下面的方式
//     // 除了登录还可以做其他操作，具体看项目需要
//     if (!store.getters.isLogin) {// 未登陆
//       next('/login')
//     } else {
//       if (to.path === '/login' || to.path === '/') {
//         next('/index')
//       } else {
//         next()
//       }
//     }
//   }
// })