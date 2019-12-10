import Vue from 'vue'
import Vuex from 'vuex'
import { loginByUserInfo }from '@/api/login'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: sessionStorage.getItem('USERNAME'),
    role: JSON.parse(sessionStorage.getItem('ROLE')),
    newrouter: [],
    showHeader: true,
    type: sessionStorage.getItem('TYPE'),
    csrf: '',
    fieldInfo: [],
    fieldInfoAll: [],
  },
  getters: {
    username: state => state.nickname,
    role: state => state.role,
    newrouter: state => state.newrouter,
    usertype: state => state.type,
    fieldInfo: state => state.fieldInfo,
    fieldInfoAll: state => state.fieldInfoAll,
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
    SET_USERTYPE:(state, usertype) =>{
      state.usertype = usertype;
    },
    SET_FIELDINFO:(state, fieldInfo) =>{
      state.fieldInfo = fieldInfo;
    },
    SET_FIELDINFOALL:(state, fieldInfoAll) =>{
      state.fieldInfoAll = fieldInfoAll;
    },
  },
  actions: {
    Logins({ commit }, info){
      return new Promise((resolve, reject) => {
        let data={};
        //获取所有用户信息
        commit('SET_USERNAME',info.nickname);  //将username和role进行存储
        commit('SET_USERTYPE',info.type);  //将username和role进行存储
        commit('SET_ROLE',info.permission.ownedMenus);
        commit('SET_FIELDINFO',info.fieldInfo);
        commit('SET_FIELDINFOALL',info.fieldAllInfo);
        sessionStorage.setItem('USERNAME', info.nickname); //存入 session
        sessionStorage.setItem('TYPE', info.type); //存入 session
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
        commit('SET_USERTYPE','');
        commit('SET_FIELDINFO',[]);
        commit('SET_FIELDINFOALL',[]);
        sessionStorage.clear()
        resolve();
      }).catch(error => {
        reject(error);
      });
    }
  }
})
