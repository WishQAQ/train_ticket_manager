import axios from 'axios';
// import {Toast} from "cube-ui";
// import { Loading } from 'element-ui';
import store from "../store";
//
// /*请求合并只出现一次loading*/
// let needLoadingRequestCount = 0
//
// function showFullScreenLoading() {
//   if (needLoadingRequestCount === 0) {
//     loading('start')/*loading加载*/
//   }
//   needLoadingRequestCount++
// }
//
// function tryHideFullScreenLoading() {
//   if (needLoadingRequestCount <= 0) return
//   needLoadingRequestCount--
//   if (needLoadingRequestCount === 0) {
//     setTimeout(tryCloseLoading,300)/*300ms 间隔内的 loading 合并为一次*/
//   }
// }
// const tryCloseLoading = () => {
//   if (needLoadingRequestCount === 0) {
//     loading('end')/*loading加载*/
//   }
// }
/*loading加载*/
// function loading (str){
//   let toast = Toast.$create({/*滴滴弹框*/
//     txt: 'Loading...',
//     mask: true,
//     time: 0
//   })
//   if(str=='start'){
//     toast.show()
//   }else if(str=='end'){
//     toast.hide()
//   }
// }
/*请求拦截*/
axios.interceptors.request.use(
    config => {
      const token = store.state.token;
      config.baseURL ='';
      config.timeout = 5000;
      // if (config.showLoading) {
      //   showFullScreenLoading()
      // }
      config.headers['TOKEN']=token;
      return config;
    },
    error => {
      return Promise.reject(err);
    }
);
/*请求响应拦截*/
axios.interceptors.response.use(
    response => {
      // if(response.config.showLoading){
      //   tryHideFullScreenLoading()
      // }
      return response;
    },
    error => {
      // Toast.$create({
      //   txt: error.message,//错误信息
      //   type: 'error',
      //   time:2000,
      //   onTimeout: () => {
      //     if(error.config.showLoading){
      //       tryHideFullScreenLoading()//消除loading
      //     }
      //   }
      // }).show()
      return Promise.reject(error)
    }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url){
  return new Promise((resolve,reject) => {
    axios.get(url,config)
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err)
        })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.post(url,data,config)
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err)
        })
  })
}