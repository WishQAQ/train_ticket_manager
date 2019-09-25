import Vue from "vue";


Vue.prototype.$unique = (arr) =>{
  return Array.from(new Set(arr))
}
