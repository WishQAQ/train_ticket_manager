<template>
  <div class="menu_setting" v-loading="loading">
    <div class="left_menu">
      <div class="menu_title">
        <el-button type="primary" @click="addTreeList">新增</el-button>
        <el-button type="danger" :disabled="showDelete" @click="deleteBtn">删除</el-button>
        <el-button type="primary" @click="getData('refresh')">刷新</el-button>
      </div>

      <el-tree
          class="menu_tree"
          :data="menuList"
          show-checkbox
          node-key="id"
          ref="tree"
          :render-after-expand="false"
          @check-change="handleNodeClick"
          @node-click="treeClick"
          :props="defaultProps">
      </el-tree>

    </div>
    <div class="right_form">
      <div class="title">{{addTree?'新增菜单':'修改菜单'}}</div>
      <el-form class="form_main" label-width="80px">
        <el-form-item label="上级ID">
          <el-input :disabled="true" v-model="menuMessage.parent_id"></el-input>
        </el-form-item>

        <el-form-item label="名称">
          <el-input
              maxlength="10"
              show-word-limit
              :disabled="showInput"
              v-model="menuMessage.menu_name">
          </el-input>
        </el-form-item>

        <el-form-item label="地址">
          <el-input
              :disabled="showInput"
              v-model="menuMessage.menu_english_name"></el-input>
        </el-form-item>

        <el-form-item label="类型" v-show="false">
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

    <el-dialog
        title="提示"
        :visible.sync="messageDialog"
        width="400px">
      <div class="message_info">
        <p>客户后台下<span class="info"><b>所有子地址将跳转外部网页</b></span></p>
        <p>请新建或编辑时保存的地址为<span class="info"><b>完整地址</b></span></p>
        <p>例：baidu.com 或 www.baidu.com</p>
        <p class="info">请勿添加 http:// 或 https://</p>
        <p>由于该菜单的特殊性，请勿修改或删除 <span class="info"><b>客户后台</b></span> 菜单</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closedMessageDialog">已 读</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "menuSetting",
    data(){
      return {
        loading: true, // 加载

        menuList: [],  // 列表

        addTree: false,  // 新建菜单
        parentId: '', // 上级ID
        menuId: '', // 菜单ID

        menuMessage: '',  // 列表内容
        showInput: true, // 禁用form表单

        showDelete: true, // 禁用删除按钮
        deleteId: [],

        menuType: '', // 下拉菜单

        // tree option
        defaultProps: {
          children: 'subMenu',
          label: 'menu_name'
        },

        readType: false,  // 提示弹窗状态
        messageDialog: false, // 提示弹窗

      }
    },
    methods:{
      /**
       * @Description: 获取列表数据
       * @author Wish
       * @date 2019/9/24
      */
      getData(val){
        this.loading = true
        this.$axios.get('/api/authority/menu/showAll')
            .then(res =>{
              if(res.data.code === 0){
                this.menuList = res.data.result
                this.loading = false
                if(val === 'refresh'){
                  this.$message.success('刷新成功')
                  this.menuMessage = {}
                  this.parentId = ''
                  this.menuId = ''
                  this.menuType = '';
                } else if(val === 'delete'){
                  this.$message.success('删除成功')
                }
              }
            })
      },

      /**
       * @Description: 新增菜单
       * @author Wish
       * @date 2019/9/25
      */
      addTreeList(){
        this.addTree = true; // 打开新建选项
        this.showInput = false;  // 打开input框
        this.menuType = '';
        this.menuMessage={
          parent_id: this.menuId,
          menu_name: '',
          menu_english_name: '',
          icon: '',
          sort: '',
          type: '',
        }; // 清空input框值
      },

      /**
       * @Description: 点击菜单列表
       * @author Wish
       * @date 2019/9/24
      */
      treeClick(data){
        this.messageDialog = !this.readType?data.menu_name === '客户后台' || data.menu_english_name === 'clientBackEnd':false
        this.addTree = false
        this.menuMessage = JSON.parse(JSON.stringify(data))
        this.parentId = this.menuMessage.parent_id
        this.menuId = this.menuMessage.menu_id
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
      handleNodeClick(data, checked, indeterminate){
        this.showDelete = !checked
      },

      /**
       * @Description: 删除指定节点
       * @author Wish
       * @date 2019/9/25
      */
      deleteBtn(){
        this.$confirm('当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let menuId = this.$refs.tree.getCheckedNodes()
          menuId.map(res =>{
            this.deleteId.push(res.menu_id)
          })
          let data = {
            menuId: String(this.deleteId)
          }
          this.$axios.post('/api/authority/menu/del',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.menuList= []
                  this.showDelete = true
                  this.deleteId= []
                  this.getData('delete')
                }else {
                  this.$message.error(res.data.msg)
                }
              })
        }).catch(() =>{

        })
      },

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

      /**
       * @Description: 提交按钮
       * @author Wish
       * @date 2019/9/25
      */
      submitBtn(){
        if(this.menuMessage.menu_name ==='' || this.menuMessage.menu_english_name ===''){
          this.$message.warning('请填写完整信息')
          this.showInput = false;
        } else {
          this.showInput = true
          if(this.menuMessage.subButton){
            delete this.menuMessage.subButton
          } else if(this.menuMessage.subMenu){
            delete this.menuMessage.subMenu
          }
          this.menuMessage['menuId'] = this.menuMessage.menu_id
          delete this.menuMessage.menu_id
          if(this.addTree){  // 新增
            this.$axios.post('/api/authority/menu/add',this.menuMessage)
                .then(res =>{
                  if(res.data.code === 0){
                    this.showInput = true
                    this.$message.success('新建成功')
                    this.menuMessage = '';
                    this.menuType = '';
                    this.getData()
                  } else {
                    this.$message.warning(res.data.msg)
                  }
                })
          }else {  // 修改
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
        }
      },

      /**
       * @Description: 关闭提示弹窗
       * @author Wish
       * @date 2019/12/9
      */
      closedMessageDialog(){
        this.readType = true
        this.messageDialog = false
      }
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
  .message_info{
    line-height: 30px;
    text-align: center;
    .info{
      font-size: 12px;
      color: #8c939d;
      font-style: italic;
      >b{
        color: #000;
        font-weight: bold;
      }
    }
  }
</style>
