<template>
  <div class="menu_setting">
    <div class="left_menu">
      <div class="menu_title">
        <el-button type="primary">新增</el-button>
        <el-button type="danger" :disabled="showDelete">删除</el-button>
        <el-button type="primary" @click="getData('refresh')">刷新</el-button>
      </div>

      <el-tree
          class="menu_tree"
          :data="menuList"
          show-checkbox
          node-key="id"
          ref="tree"
          @node-click="treeClick"
          :props="defaultProps">
      </el-tree>

    </div>
    <div class="right_form">
      <div class="title">修改菜单</div>
      <el-form class="form_main" label-width="80px">
        <el-form-item label="上级ID">
          <el-input :disabled="showInput" v-model="menuMessage.parent_id"></el-input>
        </el-form-item>

        <el-form-item label="名称">
          <el-input :disabled="showInput" v-model="menuMessage.menu_name"></el-input>
        </el-form-item>

        <el-form-item label="地址">
          <el-input :disabled="showInput" v-model="menuMessage.menu_english_name"></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-select @change="changeSelectType" :disabled="showInput" v-model="menuType" placeholder="请选择">
            <el-option label="菜单" value="菜单"></el-option>
            <el-option label="按钮" value="按钮"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图标">
          <el-input :disabled="showInput" v-model="menuMessage.icon"></el-input>
        </el-form-item>

        <el-form-item label="排序">
          <el-input :disabled="showInput" v-model="menuMessage.sort"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button :disabled="showInput" type="primary" @click="submitBtn">保存</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "menuSetting",
    data(){
      return {
        menuList: [],  // 列表

        menuMessage: '',  // 列表内容
        showInput: true, // 禁用form表单

        showDelete: true, // 禁用删除按钮

        menuType: '', // 下拉菜单

        // tree option
        defaultProps: {
          children: 'subMenu',
          label: 'menu_name'
        },

      }
    },
    methods:{
      /**
       * @Description: 获取列表数据
       * @author Wish
       * @date 2019/9/24
      */
      getData(val){
        this.$axios.get('/api/authority/menu/showAll')
            .then(res =>{
              if(res.data.code === 0){
                this.menuList = res.data.result
                if(val === 'refresh'){
                  this.$message.success('刷新成功')
                }
              }
            })
      },

      /**
       * @Description: 点击菜单列表
       * @author Wish
       * @date 2019/9/24
      */
      treeClick(data){
        this.menuMessage = JSON.parse(JSON.stringify(data))

        if(this.menuMessage.type === 0){
          this.menuType = '菜单'
        }else {
          this.menuType = '按钮'
        }
        this.showInput = false;
      },

      /**
       * @Description: 选中节点
       * @author Wish
       * @date 2019/9/24
      */


      /**
       * @Description: 下拉菜单选择
       * @author Wish
       * @date 2019/9/24
      */
      changeSelectType(){
        if(this.menuType === '菜单'){
          this.menuMessage.type = 0
        }else {
          this.menuMessage.type = 1
        }
      },

      submitBtn(){
        this.showInput = true
        if(!this.menuMessage.menu_name && !this.menuMessage.type){
          this.$message.warning('请填写完整信息')
        } else {
          if(this.menuMessage.subButton){
            delete this.menuMessage.subButton
          } else if(this.menuMessage.subMenu){
            delete this.menuMessage.subMenu
          }
          this.menuMessage['menuId'] = this.menuMessage.menu_id
          delete this.menuMessage.menu_id
          console.log(this.menuMessage);
          this.$axios.post('/api/authority/menu/edit',this.menuMessage)
              .then(res =>{
                if(res.data.code === 0){
                  this.showInput = false
                  this.$message.success('保存成功')
                  this.getData()
                } else {
                  this.$message.warning(res.data.msg)
                }
              })
        }

      },

    },
    created() {
      this.getData()
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
      margin-left: 90px;
      background-color: #fff;
      padding: 0 10px 30px;
      .title{
        display: flex;
        align-items: center;
        height: 68px;
        font-size:18px;
        color:rgba(51,148,250,1);
        border-bottom: 1px solid rgba(38,153,251,1);
        padding-left: 12px;
        margin-bottom: 40px;
      }
      .form_main{
        width: 80%;
      }
    }
  }
</style>