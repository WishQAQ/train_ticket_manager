<template>
  <div class="tab_menu">
    <div :class="[{active: editableTabsValue < 0},'tab_index']" @click="checkIndex">
      <img class="tab_icon" src="../../assets/images/index.png" alt="">
      首页
    </div>
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
      <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="item.title"
          :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>



  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        editableTabsValue: '-1',
        editableTabs: [],
        tabIndex: 2
      }
    },
    methods: {
      // 选中首页
      checkIndex(){
        this.editableTabsValue = '-1';  // 关闭其余标签选中状态
      },

      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
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
      }
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
      object-fit: contain;
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
                font-size:16px;
                color:rgba(38,153,251,.5);
                &.is-active{
                  color:rgba(38,153,251,1);
                  opacity:1;
                  background: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
</style>