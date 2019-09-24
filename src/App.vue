<template>
  <div id="app">
    <nav-menu></nav-menu>
    <tab-menu></tab-menu>
    <router-view class="content" ref="views"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components:{
    'NavMenu': () => import('@/components/NavMenu'),
    'TabMenu':() => import('@/components/TabMenu')
  },
  mounted() {

  }
}
</script>

<style scoped lang="less">
  .content{
    height: calc(100vh - 128px);
    overflow-y: auto;
  }
</style>
