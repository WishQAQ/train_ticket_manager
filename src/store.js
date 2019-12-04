import Vue from 'vue'
import Vuex from 'vuex'
import { loginByUserInfo }from '@/api/login'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: sessionStorage.getItem('USERNAME'),
    role: JSON.parse(sessionStorage.getItem('ROLE')),
    newrouter: [],
    showHeader: true
  },
  getters: {
    username: state => state.nickname,
    role: state => state.role,
    newrouter: state => state.newrouter
  },
  mutations: {
    SET_USERNAME:(state, username) => {
      state.nickname = username;
    },
    SET_ROLE:(state, role) => {
      state.role = role;
    },
    SET_NEWROUER:(state, newrouter) =>{
      state.newrouter = newrouter;
    },
  },
  actions: {
    Logins({ commit }, info){
      return new Promise((resolve, reject) => {
        let data={};
        //获取所有用户信息
        commit('SET_USERNAME',info.nickname);  //将username和role进行存储
        sessionStorage.setItem('USERNAME', info.nickname); //存入 session
        commit('SET_ROLE',info.permission.ownedMenus);
        sessionStorage.setItem('ROLE',JSON.stringify(info.permission.ownedMenus));
        return data= {username:info.nickname,introduce:info.permission.role_name};

      }).catch(error => {
        reject(error);
      });
    },
    Roles({ commit }, newrouter){
      return new Promise((resolve, reject) => {
        commit('SET_NEWROUER',newrouter); //存储最新路由
        resolve(newrouter);
      }).catch(error => {
        reject(error);
      });
    },
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_USERNAME','');
        commit('SET_ROLE','');
        commit('SET_NEWROUER',[]);
        sessionStorage.removeItem('USERNAME');
        sessionStorage.removeItem('ROLE');
        sessionStorage.removeItem('CSRF');
        resolve();
      }).catch(error => {
        reject(error);
      });
    }
  }
})
