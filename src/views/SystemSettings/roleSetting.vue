<template>
  <div class="roleSetting" v-loading="loading">
    <div class="left_main">
      <div class="left_header">
        <el-button type="primary" @click="addRoleUser">新增角色</el-button>
        <el-input v-model="searchUserName" clearable placeholder="用户名名称搜索"></el-input>
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

        <Pagination
            ref="pagination"
            :pageData="paginationList"
            @jumpSize="jumpSize"
            @jumpPage="jumpPage">
        </Pagination>

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

        <el-form-item label="权限字段">
          <div class="role_box">
            <div class="role_list" v-for="item in roleList" :key="item.id">
              <div class="role_name">{{item.name}}</div>
              <div class="role_setting">
                <el-switch
                    @input="change($event)"
                    @change="roleSwitch(item)"
                    v-model="item.is_show"
                    active-color="#13ce66"
                    inactive-text="是否显示">
                </el-switch>

                <el-switch
                    @input="change($event)"
                    @change="roleSwitch(item)"
                    v-if="item.is_show"
                    v-model="item.is_read_in"
                    active-color="#13ce66"
                    inactive-text="可否写入">
                </el-switch>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button @click="submitBtn" v-loading="submitLoading">保存</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
  let roleArray = []
  export default {
    name: "roleSetting",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: true,
        roleLoading: true,
        treeLoading: true, // 详细信息加载
        searchUserName: '',  // 用户名搜索

        submitLoading: false, // 保存按钮加载

        userData: [],  // 角色列表

        roleList: [{
            is_read_in: false,
            is_show: false
          }], // 权限字段列表
        roleShow: false, // 是否显示
        roleRead: false, // 可否写入

        showAddForm: true,  // 新增菜单

        userName: '', // 角色名
        userDesc: '', // 角色说明
        userRoleId: '', // 角色权限Id

        userInfo: {  // 角色详细信息
          role_name: '',
          desc: '',
          permission_field: []
        },

        checkedRoleList: [], // 选中列表

        roleCheckedList: [], // 默认选中节点
        menuList: [],  // 列表
        // tree option
        defaultProps: {
          children: 'subMenu',
          label: 'menu_name'
        },

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      change(e){
        this.$forceUpdate()
      },
      /**
       * @Description: 获取角色列表
       * @author Wish
       * @date 2019/9/25
      */
      getDataList(){
        this.loading = true
        let data = {
          page: this.page || null,
          per_page: this.per_page
        }

        this.$axios.get('/api/authority/role/show/'+'1',{params:data})
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.userData = res.data.result.data
                this.paginationList = res.data.result
                this.getRoleData()
              }
            })
      },

      /**
       * @Description: 搜索数据
       * @author Wish
       * @date 2019/9/25
      */
      searchUser(){
          let data = {
            role_name: this.searchUserName
          }
          this.$axios.post('/api/authority/role/show/'+'1',data)
              .then(res =>{
                if(res.status === 200){
                  this.userData = res.data.result.data
                  this.paginationList = res.data.result
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
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
        this.userInfo.permission_field = []

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

                  /**
                   * @Description: 设置默认选中权限字段
                   * @author Wish
                   * @date 2019/10/12
                  */
                  this.roleList.map(roleRes =>{
                    delete roleRes.is_read_in
                    delete roleRes.is_show
                  })

                  val.permission_field.forEach(item =>{
                    this.roleList.forEach(cItem =>{
                      if(item.name === cItem.name){
                        cItem['is_read_in'] = item.is_read_in === 0
                        cItem['is_show'] = item.is_show === 0
                        if(cItem.is_read_in || cItem.is_show){
                          roleArray.push(cItem)
                          roleArray = [...new Set(roleArray)]
                        }
                      }
                    })
                  })
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }
      },

      /**
       * @Description: 开启or关闭权限字段
       * @author Wish
       * @date 2019/10/12
      */
      roleSwitch(val){
        console.log(val);
        if(!val.is_show){
          val.is_read_in = false
        }
        roleArray.push(val)
        roleArray = [...new Set(roleArray)]
        this.userInfo['permission_field'] = roleArray
      },

      getRoleData(){
        this.treeLoading = true
        this.$axios.post('/api/authority/role/getRoleField')
            .then(res =>{
              if(res.data.code === 0){
                this.treeLoading = false
                this.roleList = JSON.parse(JSON.stringify(res.data.result))
                this.userInfo['permission_field'] = []
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 保存按钮
       * @author Wish
       * @date 2019/9/25
      */
      submitBtn(){
        if(this.userInfo.role_name){
          let roleListData = JSON.parse(JSON.stringify(this.userInfo.permission_field))

          roleListData.map(res =>{
            res['field_id'] = res.id;
            res.is_read_in =  res.is_read_in ? 0 : 1
            res.is_show =  res.is_show ? 0 : 1
          })
          this.userInfo['permission_field'] = JSON.stringify(roleListData)
          if(this.showAddForm){
            this.submitLoading = true
            this.treeLoading = true
            this.userInfo['permissionList'] = String(this.checkedRoleList)
            this.$axios.post('/api/authority/role/add',this.userInfo)
                .then(res =>{
                  if(res.data.code === 0){
                    this.$refs.singleTable.setCurrentRow();
                    this.getDataList()
                    this.initialization()
                    this.$message.success('创建成功')
                    this.submitLoading = false
                    this.treeLoading = false
                  } else {
                    this.$message.warning(res.data.msg)
                    this.submitLoading = false
                    this.treeLoading = false
                    this.userInfo.permission_field = this.userInfo.permission_field?JSON.parse(this.userInfo.permission_field):this.userInfo.permission_field
                  }

                })
          } else {
            this.submitLoading = true
            this.treeLoading = true
            this.userInfo['condition'] = this.userInfo['role_id']
            this.userInfo['permissionList'] = String(this.checkedRoleList)
            this.userInfo['type'] = 1
            this.$axios.post('/api/authority/role/edit',this.userInfo)
                .then(res =>{
                  if(res.data.code === 0){
                    this.getDataList()
                    this.initialization()
                    this.$message.success('保存成功')
                    this.submitLoading = false
                    this.treeLoading = false
                  } else {
                    this.$message.warning(res.data.msg)
                    this.submitLoading = false
                    this.treeLoading = false
                    this.userInfo.permission_field = this.userInfo.permission_field?JSON.parse(this.userInfo.permission_field):this.userInfo.permission_field
                  }
                })
          }

        }else {
          this.submitLoading = false
          this.treeLoading = false
          this.$message.warning('请填写角色名称')
          this.userInfo.permission_field = this.userInfo.permission_field?JSON.parse(this.userInfo.permission_field):this.userInfo.permission_field
        }
      },

      /**
       * @Description: 分页器
       * @author Wish
       * @data 2019/10/16
      */
      jumpSize(val){
        this.per_page = val
        this.getData()
      },
      jumpPage(val){
        this.page = val
        this.getData()
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
        height: calc( 100% - 108px);
        overflow-y: auto;
        padding-right: 15px;
        /deep/.el-form-item{
          .el-form-item__content{
            line-height: unset;
            .role_box{
              display: flex;
              flex-direction: column;
              line-height: unset;
              padding-left: 15px;
              .role_list{
                line-height: unset;
                height: 26px;
                display: flex;
                align-items: center;
                padding-left: 5px;
                &:hover{
                  background: rgba(0,0,0,.03);
                }
                .role_name{
                  color: #606266;
                  width: 30%;
                }
                .role_setting{
                  display: flex;
                  align-items: center;
                  width: 70%;
                  justify-content: space-evenly;
                  /deep/.el-switch{
                    .el-switch__label{
                      &.is-active{
                        color: unset;
                      }
                    }
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
