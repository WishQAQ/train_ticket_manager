<template>
  <div class="tab_menu">
    <div :class="[{active: editableTabsValue === '0'},'tab_index']" @click="checkIndex">
      <img class="tab_icon" src="../../assets/images/index.png" alt="">
      首页
    </div>
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="jumpTabPage">
      <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :name="item.name"
      >
        <span class="tab_link" slot="label"><i :class="['iconfont',item.icon]"></i> {{item.menuName}}</span>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import bus from '../../utlis/bus';

  export default {
    name: "index",
    data() {
      return {
        editableTabsValue: '0',
        editableTabs: [],
        tabIndex: 0
      }
    },
    methods: {
      // 选中首页
      checkIndex(){
        this.editableTabsValue = '0';  // 关闭其余标签选中状态
        this.$router.push({
          name: 'home'
        })
      },

      getNavStatus(){
        //监听'getNavStatus'事件
        bus.$on('getNavStatus',res => {
          this.editableTabs.push(res)
          this.editableTabs = [...new Set(this.editableTabs)]
          // sessionStorage.setItem('navTab',JSON.stringify(this.editableTabs))
          this.editableTabsValue = res.name
        })
      },

      /**
       * @Description: 跳转页面
       * @author Wish
       * @date 2019/10/29
      */
      jumpTabPage(val,data){
        this.$router.push({
          name: val.name
        })
        bus.$emit('tabName',val.name)
      },

      /**
       * @Description: 新增tab标签
       * @author Wish
       * @data 2019/11/20
      */
      addTab(type,data) {
        let newTabName = ++this.tabIndex + '';
        if(type === 'add'){
          this.editableTabs.push({
            path: '/orderDetails?type=add',
            name: 'orderDetails',
            menuName: '新增订单',
            icon: 'icon-dingdan1'
          });
        }else if(type === 'details'){
          this.editableTabs.push({
            path: '/orderDetails?type=details&order_sn='+data.order_sn,
            name: 'orderDetails',
            menuName: '订单详情',
            icon: 'icon-dingdan1'
          });
        }

        this.editableTabsValue = newTabName;
      },

      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        if(this.editableTabs.length > 0){
          const last = this.editableTabs[this.editableTabs.length - 1];
          this.$router.push({
            name: last.name
          })
        }else if(this.editableTabs.length < 1){
          this.$router.push({
            name: 'home'
          })
        }
      }
    },
    mounted(){
      this.getNavStatus();
      if(this.editableTabs.length < 1){
        this.$router.push({
          name: 'home'
        })
      }
      let _that = this
      bus.$on('newTab', (type,data) => {
        // _that.addTab(type,data)
      })
    },
    watch:{
      '$route'(to,form){
        this.editableTabsValue = this.$route.name === 'home'? '0': this.$route.name
      }
    },
    beforeDestroy(){
      //取消监听'getNavStatus'事件
      bus.$off('getNavStatus');
    }
  }
</script>

<style scoped lang="less">
  .tab_menu{
    height: 48px;
    display: flex;
    align-items: center;
    background:rgba(238,247,255,1);
    .tab_index{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100%;
      font-size:16px;
      color:rgba(38,153,251,.5);
      cursor: pointer;
      &.active{
        color:rgba(38,153,251,1);
        background: #fff;
      }
    }
    .tab_icon{
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }


    /*样式清理*/
    /deep/.el-tabs{
      height: 100%;
      .el-tabs__header{
        margin: unset;
        border: unset;
        height: 100%;
        .el-tabs__nav-wrap{
          margin: unset;
          height: 100%;
          .el-tabs__nav-scroll{
            height: 100%;
            .el-tabs__nav{
              border: unset;
              height: 100%;
              border-radius: unset;
              .el-tabs__item{
                line-height: 48px;
                border: unset;
                height: 100%;
                .tab_link{
                  font-size:16px;
                  color:rgba(38,153,251,.5);
                }
                &.is-active{
                  opacity:1;
                  background: #fff;
                  .tab_link{
                    font-size:16px;
                    color:rgba(38,153,251,1);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
