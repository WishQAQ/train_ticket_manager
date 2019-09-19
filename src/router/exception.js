/**
 * @Description: 404等页面路由
 * @author Wish
 * @date 2019/9/16
*/
const exceptionRouters = [
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/exception/404.vue'),
    meta: { title: '404' },
    hidden: true
  },
]

export default exceptionRouters