<template>
  <div class="home">
    <nav-menu></nav-menu>
    <tab-menu></tab-menu>
    <router-view class="content"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'home',
    components:{
      'NavMenu': () => import('@/components/NavMenu'),
      'TabMenu':() => import('@/components/TabMenu')
    },
    data(){
      return {
        newrouter: '' // this.$store.state.newrouter, // vuex的newrouter第一种展现形式
      }
    },
  }
</script>

<style scoped lang="less">
  .content{
    height: calc(100vh - 128px);
    overflow-y: auto;
  }
</style>
