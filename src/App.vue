<template>
  <div id="app">
    <nav-menu v-if="$store.state.showHeader"></nav-menu>
    <tab-menu v-if="$store.state.showHeader"></tab-menu>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
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
    min-width: 1280px;
  }
</style>
