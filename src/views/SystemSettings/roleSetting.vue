<template>
  <div class="roleSetting" v-loading="loading">
    <div class="left_main">
      <div class="left_header">
        <el-button type="primary" @click="addRoleUser">新增角色</el-button>
        <el-input v-model="searchUserName" placeholder="用户名名称搜索"></el-input>
        <el-button type="primary" @click="searchUser">搜索</el-button>
      </div>
      <div class="user_table">
        <el-table
            :data="userData"
            border
            ref="singleTable"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%">
          <el-table-column
              label="序号"
              align="center"
              width="50px">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
              prop="role_name"
              label="角色名称">
          </el-table-column>
          <el-table-column
              sortable
              prop="created_at"
              label="创建时间">
          </el-table-column>
          <el-table-column
              prop="desc"
              max-width="300px"
              show-overflow-tooltip
              label="角色说明">
          </el-table-column>
          <el-table-column
              width="80px"
              label="角色状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status === 0">启用</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 1">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              width="80px"
              label="操作">
            <template slot-scope="scope">
              <el-dropdown trigger="click">
                <el-button size="mini">操作</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><div @click="roleUserOperating(scope.row)">{{scope.row.status === 0?'停用':'启用'}}</div></el-dropdown-item>
                  <el-dropdown-item><div @click="deleteRole(scope.row)">删除</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="right_tree" v-loading="treeLoading">
      <div class="title">{{showAddForm?'新增角色':'编辑角色'}}</div>
      <el-form class="tree_form" ref="form" label-width="120px">
        <el-form-item label="角色名称">
          <el-input
              maxlength="10"
              show-word-limit
              :disabled="userInfo.role_name === '超级管理员'"
              v-model="userInfo.role_name">
          </el-input>
        </el-form-item>
        <el-form-item label="角色说明">
          <el-input
              maxlength="50"
              show-word-limit
              v-model="userInfo.desc">
          </el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
              v-loading="roleLoading"
              class="menu_tree"
              :data="menuList"
              check-strictly
              :render-after-expand="false"
              show-checkbox
              node-key="menu_id"
              :default-checked-keys="roleCheckedList"
              ref="tree"
              @check-change="handleNodeClick"
              :props="defaultProps">
          </el-tree>
        </el-form-item>

        <el-form-item>
          <el-button @click="submitBtn">保存</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
  export default {
    name: "roleSetting",
    data(){
      return {
        loading: true,
        roleLoading: true,
        treeLoading: false, // 详细信息加载
        searchUserName: '',  // 用户名搜索
        userData: [],  // 角色列表

        showAddForm: true,  // 新增菜单

        userName: '', // 角色名
        userDesc: '', // 角色说明
        userRoleId: '', // 角色权限Id

        userInfo: {  // 角色详细信息
          role_name: '',
          desc: ''
        },

        checkedRoleList: [], // 选中列表

        roleCheckedList: [], // 默认选中节点
        menuList: [],  // 列表
        // tree option
        defaultProps: {
          children: 'subMenu',
          label: 'menu_name'
        },
      }
    },
    methods:{
      /**
       * @Description: 获取角色列表
       * @author Wish
       * @date 2019/9/25
      */
      getDataList(){
        this.$axios.get('/api/authority/role/show/'+'1')
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.userData = res.data.result.data
              }
            })
      },

      /**
       * @Description: 搜索数据
       * @author Wish
       * @date 2019/9/25
      */
      searchUser(){
        this.loading = true
        if(this.searchUserName){
          let data = {
            role_name: this.searchUserName
          }
          this.$axios.post('/api/authority/role/search/'+'1',data)
              .then(res =>{
                if(res.status === 200){
                  this.loading = false
                  this.userData = res.data.data
                }
              })
        }
      },

      /**
       * @Description: 初始化
       * @author Wish
       * @date 2019/9/25
      */
      initialization(){
        this.showAddForm = true
        this.userInfo.role_name = ''
        this.userInfo.desc = ''
        this.userInfo.ownedPermissions = ''
        this.userInfo.role_id = ''
        this.roleCheckedList = []
        this.$refs.tree.setCheckedKeys([]);
        this.treeLoading = false
      },

      /**
       * @Description: 新增角色按钮
       * @author Wish
       * @date 2019/9/25
      */
      addRoleUser(){
        this.$refs.singleTable.setCurrentRow();
        this.initialization()
      },

      /**
       * @Description: 删除角色
       * @author Wish
       * @date 2019/9/25
      */
      deleteRole(val){
        this.$confirm('是否删除此角色，当此角色被删除后，对应角色账号将无法正常使用后台系统！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data ={
            condition: val.role_id
          }
          this.$axios.post('/api/authority/role/del',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('删除成功')
                  this.getDataList()
                  this.userInfo.role_name = ''
                  this.userInfo.desc = ''
                  this.roleCheckedList = []
                  this.$refs.tree.setCheckedKeys([]);
                  this.showAddForm = true
                  this.treeLoading = false
                }
              })
        }).catch(() =>{
          this.$message.error('删除失败，请稍后重试')
        })
      },

      /**
       * @Description: 修改角色状态
       * @author Wish
       * @date 2019/9/25
      */
      roleUserOperating(val){
        let roleStatus = val.status === 0 ? 1: 0
        let data ={
          type: 0,
          status: roleStatus,
          condition: val.role_id
        }
        this.$axios.post('/api/authority/role/edit',data)
            .then(res =>{
              if(res.data.code === 0){
                this.getDataList()
                this.initialization()
                this.$message.success('修改成功')
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 获取权限列表
       * @author Wish
       * @date 2019/9/25
      */
      getData(){
        this.$axios.get('/api/authority/menu/showAll')
            .then(res =>{
              if(res.data.code === 0){
                this.roleLoading = false
                this.menuList = res.data.result
              }
            })
      },
      /**
       * @Description: 选中节点
       * @author Wish
       * @date 2019/9/25
       */
      handleNodeClick(data, checked, indeterminate){
        if(checked){
          this.checkedRoleList.push(data.menu_id)
        }else if(!checked){
          this.checkedRoleList.splice(this.checkedRoleList.findIndex(item => item === data.menu_id), 1)
        }
      },

      /**
       * @Description: 获取角色详情
       * @author Wish
       * @date 2019/9/25
      */
      handleCurrentChange(val) {
        this.initialization()
        this.showAddForm = false
        this.treeLoading = true
        if(val){
          this.userRoleId = val.role_id
          this.$axios.get('/api/authority/role/showOne/'+this.userRoleId)
              .then(res =>{
                if(res.data.code === 0){
                  this.treeLoading = false
                  this.userInfo = JSON.parse(JSON.stringify(res.data.result[0]))
                  /**
                   * @Description: 设置默认选中节点
                   * @author Wish
                   * @date 2019/9/25
                   */
                  if(this.userInfo.ownedPermissions.length >=1){
                    this.roleCheckedList = this.userInfo.ownedPermissions.split(',')
                  }
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }
      },

      /**
       * @Description: 保存按钮
       * @author Wish
       * @date 2019/9/25
      */
      submitBtn(){
        if(this.userInfo.role_name){
          if(this.showAddForm){
            this.userInfo['permissionList'] = String(this.checkedRoleList)
            this.$axios.post('/api/authority/role/add',this.userInfo)
                .then(res =>{
                  if(res.data.code === 0){
                    this.$refs.singleTable.setCurrentRow();
                    this.getDataList()
                    this.initialization()
                    this.$message.success('创建成功')
                  } else {
                    this.$message.warning(res.data.msg)
                  }

                })
          } else {
            this.userInfo['condition'] = this.userInfo['role_id']
            this.userInfo['permissionList'] = String(this.checkedRoleList)
            this.userInfo['type'] = 1
            this.$axios.post('/api/authority/role/edit',this.userInfo)
                .then(res =>{
                  if(res.data.code === 0){
                    this.getDataList()
                    this.initialization()
                    this.$message.success('保存成功')
                  } else {
                    this.$message.warning(res.data.msg)
                  }

                })
          }

        }else {
          this.$message.warning('请填写角色名称')
        }
      },
    },
    created() {
      this.getDataList()
    },
    mounted() {
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .roleSetting{
    display: flex;
    padding: 15px 35px;
    background:rgba(238,247,255,.5);
    .left_main{
      background-color: #fff;
      flex: 1;
      margin-right: 16px;
      padding: 60px 34px 30px;
      .left_header{
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        /deep/.el-input{
          margin: 0 20px;
        }
      }
    }
    .right_tree{
      flex: 1;
      background-color: #fff;
      padding: 0 10px 30px;
      .title{
        display: flex;
        align-items: center;
        height: 68px;
        border-bottom: 1px solid rgba(38,153,251,1);
        font-size:18px;
        color:rgba(51,148,250,1);
        padding-left: 12px;
        margin-bottom: 40px;
      }
      .tree_form{
        max-width: 800px;
      }
    }
  }
</style>