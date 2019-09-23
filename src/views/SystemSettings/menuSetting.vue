<template>
  <div class="menu_setting">
    <div class="left_menu">
      <div class="menu_title">
        <el-button type="primary">新增</el-button>
        <el-button type="danger">删除</el-button>
        <el-button type="primary">刷新</el-button>
      </div>

      <el-tree
          class="menu_tree"
          :data="data"
          show-checkbox
          node-key="id"
          :props="defaultProps">
      </el-tree>

    </div>
    <div class="right_form"></div>
  </div>
</template>

<script>
  export default {
    name: "menuSetting",
    data(){
      return {
        data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods:{
      getData(){
        this.$axios.get('/api/authority/menu/showAll')
            .then(res =>{
              console.log(res);
            })
      },
    },
    created() {
      // this.getData()
    }
  }
</script>

<style scoped lang="less">
  .menu_setting{
    background:rgba(238,247,255,.5);
    margin-top: 5px;
    padding: 15px 26px 0 37px;
    display: flex;
    .left_menu{
      flex: 1;
      .menu_title{
        margin-bottom: 30px;
      }
      .menu_tree{
        background: transparent;
      }
    }
    .right_form{
      flex: 1;
    }
  }
</style>