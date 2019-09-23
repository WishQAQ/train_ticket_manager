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
  }
</script>

<style scoped lang="less">
  .content{
    height: calc(100vh - 128px);
    overflow-y: auto;
  }
</style>
