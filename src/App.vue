<template>
  <div id="app">
    <nav-menu v-if="$store.state.showHeader"/>
    <router-view/>
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
    console.log(this.$route);
  }
}
</script>

<style scoped lang="less">
  .content{
    height: calc(100vh - 128px);
    overflow-y: auto;
    min-width: 1280px;
  }
  /deep/.oA_manager{
    display: none;
  }
</style>
