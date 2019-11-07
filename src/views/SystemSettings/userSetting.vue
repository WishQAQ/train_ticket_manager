<template>
  <div class="userSetting" v-loading="loading">
    <div class="left_main">
      <div class="left_header">
        <el-button @click="addUserInfo">新增用户</el-button>
        <el-input v-model="searchInput" placeholder="用户名名称/账号"></el-input>
        <el-button>搜索</el-button>
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
              prop="nickname"
              label="用户名">
          </el-table-column>
          <el-table-column
              prop="user_name"
              label="账号">
          </el-table-column>
          <el-table-column
              prop="role_name"
              label="角色名称">
          </el-table-column>
          <el-table-column
              width="80px"
              align="center"
              label="用户类型">
            <template slot-scope="scope">
              <el-tag effect="plain" size="small" type="" v-if="scope.row.type === 0">内部</el-tag>
              <el-tag effect="plain" size="small" type="warning" v-if="scope.row.type === 1">客户</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              sortable
              prop="updated_at"
              label="创建时间">
          </el-table-column>
          <el-table-column
              width="80px"
              align="center"
              label="用户状态">
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
                  <el-dropdown-item><div @click="userOperating(scope.row)">{{scope.row.status === 0?'停用':'启用'}}</div></el-dropdown-item>
                  <el-dropdown-item><div @click="deleteUser(scope.row)">删除</div></el-dropdown-item>
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

    <div class="right_main" v-loading="formLoading">
      <div class="right_header">{{addUserInfoStatic?'新增用户':'编辑用户'}}</div>
      <el-form class="user_form" ref="form" label-width="120px">
        <el-form-item label="用户类型">
          <el-select v-model="userInfo.type" @change="selectUserType" placeholder="请选择账户类型">
            <el-option label="内部账号" value="0"></el-option>
            <el-option label="客户商账号" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
              maxlength="10"
              show-word-limit
              v-model="userInfo.nickname">
          </el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
              maxlength="10"
              show-word-limit
              v-model="userInfo.user_name">
          </el-input>
        </el-form-item>
        <el-form-item label="账号密码">
          <el-input
              show-password
              maxlength="6"
              show-word-limit
              v-model="userInfo.password">
          </el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input
              v-model="userInfo.contact">
          </el-input>
        </el-form-item>

        <el-form-item label="选择角色">
          <el-select clearable v-model="roleCheckList" multiple placeholder="请选择">
            <el-option
                v-for="item in roleList"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属旅行社" v-if="userInfo.type === '1'">
          <el-select v-model="travelAgencyType" placeholder="请选择所属旅行社">
            <el-option label="旅行社1" value="0"></el-option>
            <el-option label="旅行社2" value="1"></el-option>
            <el-option label="旅行社3" value="2"></el-option>
            <el-option label="旅行社4" value="3"></el-option>
            <el-option label="旅行社5" value="4"></el-option>
            <el-option label="旅行社6" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属组">
          <el-cascader-panel
              @change="cascaderClick"
              v-model="groupCheckList"
              :options="groupList"
              :show-all-levels="false"
              :props="{
                multiple: true,
                checkStrictly: true,
                label:'group_name',
                children:'subGroup',
                value:'id',
                emitPath: false,}">
          </el-cascader-panel>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitBtn">保存</el-button>
        </el-form-item>

      </el-form>


    </div>
  </div>
</template>

<script>
  export default {
    name: "userSetting",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: true, // 全屏页面加载
        addUserInfoStatic: true, // 新增用户
        searchInput: '',  // 搜索框

        userData: [],  // 用户列表
        userId: '',

        userInfo: {},  // 用户详细信息
        formLoading: false, // 用户详细信息加载

        roleCheckList: [], // 角色选中列表
        roleList: [], // 角色列表

        groupCheckList: [], // 组选中列表
        groupList: [], // 组列表

        travelAgencyType: '', // 所属旅行社
        showTravelAgency: false, // 显示旅行社选项

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      /**
       * @Description: 获取用户列表
       * @author Wish
       * @date 2019/9/29
      */
      getData(){
        this.closeData()
        this.loading = true;
        let data = {
          page: this.page || null,
        }
        this.$axios.get('/api/user/showAccount/'+this.per_page || null,{params:data})
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false;
                this.userData = res.data.result.data
                this.paginationList = res.data.result
              }
            })
      },

      /**
       * @Description: 新增用户按钮
       * @author Wish
       * @date 2019/9/29
      */
      addUserInfo(){
        this.addUserInfoStatic = true
        this.$refs.singleTable.setCurrentRow();
        this.userInfo = {}
      },

      /**
       * @Description: 清空输入框值
       * @author Wish
       * @date 2019/9/29
      */
      closeData(){
        this.userInfo = {}
        this.roleCheckList = []
        this.groupCheckList = []
        this.userId = ''
      },

      /**
       * @Description: table行选中
       * @author Wish
       * @date 2019/9/28
      */
      handleCurrentChange(val){
        this.formLoading = true;
        this.addUserInfoStatic = false;

        this.userId = val.target
        let data = {
          condition: val.target
        };
        this.$axios.post('/api/user/getOneAccount',data)
            .then(res =>{
              if(res.data.code === 0){
                this.closeData()

                this.formLoading = false;
                this.userInfo = res.data.result[0]
                this.userInfo.type = this.userInfo.type === 0?'内部账号':'客户商账号'
                if(this.userInfo.groups){
                  this.userInfo.groups.map(item =>{
                    this.groupCheckList.push(item.id)
                  })
                }
                if(this.userInfo.role_id){
                  this.roleCheckList.push(this.userInfo.role_id)
                }

              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 修改用户状态
       * @author Wish
       * @date 2019/9/28
      */
      userOperating(val){
      },

      /**
       * @Description: 删除用户
       * @author Wish
       * @date 2019/9/28
      */
      deleteUser(val){
      },

      /**
       * @Description: 账号类型选择
       * @author Wish
       * @date 2019/9/29
      */
      selectUserType(){
        this.showTravelAgency = this.userInfo.type === 1;
      },

      /**
       * @Description: 用户组选择
       * @author Wish
       * @date 2019/9/29
      */
      cascaderClick(){
      },

      /**
       * @Description: 获取角色列表
       * @author Wish
       * @date 2019/9/29
      */
      getRoleData(){
        this.formLoading = true;
        this.$axios.get('/api/authority/role/show/0')
            .then(res =>{
              if(res.data.code === 0){
                this.formLoading = false;
                this.roleList = res.data.result.data
              }
            })
      },
      /**
       * @Description: 获取组列表
       * @author Wish
       * @date 2019/9/29
      */
      getGroupData(){
        this.formLoading = true;
        this.$axios.get('/api/user/group/obtain')
            .then(res =>{
              if(res.data.code === 0){
                this.formLoading = false;
                this.groupList = res.data.result
              }
            })
      },

      /**
       * @Description: 提交数据
       * @author Wish
       * @date 2019/9/29
      */
      submitBtn(){
        this.userInfo['pertGroups'] = String(this.groupCheckList)
        this.userInfo['role_id'] = String(this.roleCheckList)
        if(this.addUserInfoStatic){  // 新增
          if(this.addUserInfoStatic){
          }else {
          }
          this.$axios.post('/api/user/addAccount',this.userInfo)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('保存成功')
                  this.getData()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }else {  // 编辑
          this.userInfo['condition'] = this.userInfo.target
          delete this.userInfo['target']
          this.userInfo.type = JSON.parse(JSON.stringify(this.userInfo.type === '内部账号'?'0':'1'))
          this.$axios.post('/api/user/addAccount',this.userInfo)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('保存成功')
                  this.getData()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
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
      this.getData();
      this.getRoleData();
      this.getGroupData()
    }
  }
</script>

<style scoped lang="less">
  .userSetting{
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
    .right_main{
      flex: 1;
      flex-shrink: 0;
      background: #fff;
      .right_header{
        display: flex;
        align-items: center;
        height: 68px;
        padding-left: 37px;
        border-bottom:1px solid rgba(38,153,251,.5);
        font-size:18px;
        color:rgba(51,148,250,1);
        margin-bottom: 30px;
      }
      .user_form{
        width: 80%;
      }
    }
  }
</style>
