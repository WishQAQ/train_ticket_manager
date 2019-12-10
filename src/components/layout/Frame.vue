<template>
 <div>
   <router-tab>
     <template v-slot="{ tab: { id, title, icon, closable }, tabs, index}">
       <i v-if="icon" class="tab-icon" :class="['iconfont',icon]" />
       <span class="tab-title">{{ $routerTab.i18nText(title) || '未命名页签' }}</span>
       <i v-if="closable !== false && tabs.length > 1 && $routerTab.i18nText(title) !== '首页'"
           class="tab-close"
           @click.prevent="$routerTab.closeTab(id)"
       />
     </template>
   </router-tab>
 </div>
</template>

<script>
  export default {
    name: "Frame",
    components:{
      'NavMenu': () => import('@/components/NavMenu'),
      'TabMenu':() => import('@/components/TabMenu')
    }
  }
</script>

<style scoped lang="less">
  /deep/.router-tab{
    .router-tab-header{
      height: 30px;
      background: #eef7ff;
      .router-tab-scroll{
        .router-tab-nav{
          .router-tab-item{
            line-height: 30px;
            padding: 0 20px;
            font-size: 14px;
            margin: unset;
            border: unset;
            background: #eef7ff;
            color: rgba(38,153,251,.5);
            &.actived{
              background: #fff;
              color: #2699fb;
            }
            .tab-close{
              top: 2px;
            }
          }
        }
      }
    }
  }
</style>
