<template>
  <div class="userSetting" v-loading="loading">
    <div class="left_main">
      <div class="left_header">
        <el-button class="addUserBtn" type="primary" @click="addUserInfo">新增用户</el-button>
        <div>
          <el-input clearable v-model="searchForm.name" placeholder="用户名/账号"/></div>
        <el-select clearable v-model="searchForm.role_id" placeholder="请选择角色">
          <el-option
              v-for="item in roleList"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id">
          </el-option>
        </el-select>
        <div><el-select clearable v-model="searchForm.status" placeholder="请选择用户状态">
          <el-option label="有效" value="2"/>
          <el-option label="停用" value="1"/>
          </el-select></div>
        <div><el-date-picker
            v-model="searchForm.time"
            type="date"
            placeholder="请选择创建日期">
        </el-date-picker></div>
        <el-button @click="searchBtn">搜索</el-button>
      </div>

      <div class="user_table">
        <el-table
            :data="userData"
            stripe
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
              width="110"
              label="创建时间">
            <template slot-scope="scope">
              {{$getTimeYear(scope.row.updated_at * 1000)}}
            </template>
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
                  <el-dropdown-item><div @click="userOperating(scope.row,scope.row.status)">{{scope.row.status === 0?'停用':'启用'}}</div></el-dropdown-item>
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
            <el-option label="内部账号" value="0"/>
            <el-option label="客户商账号" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
              maxlength="10"
              show-word-limit
              v-model="userInfo.nickname">
          </el-input>
        </el-form-item>
        <el-form-item label="账号">
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
              maxlength="11"
              show-word-limit
              v-model="userInfo.contact">
          </el-input>
        </el-form-item>

        <el-form-item label="选择角色">
          <el-select @input="change($event)" clearable v-model="roleCheckList" placeholder="请选择">
            <el-option
                v-for="item in roleList"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属旅行社" v-if="userInfo.type === '1'">
          <el-select @input="change($event)" v-model="userInfo.pertTravel" placeholder="请选择所属旅行社">
            <el-option v-for="(item,index) in customerList" :key="index" :label="item.name" :value="item.identity"/>
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
        searchForm: {
          name: '',
          status: '',
          role_id: '',
          time: '',
        },  // 搜索框

        userData: [],  // 用户列表
        userId: '',

        userInfo: {},  // 用户详细信息
        formLoading: false, // 用户详细信息加载

        roleCheckList: '', // 角色选中列表
        roleList: [], // 角色列表

        groupCheckList: [], // 组选中列表
        groupList: [], // 组列表

        customerList: [], // 客户商列表

        travelAgencyType: '', // 所属旅行社
        showTravelAgency: false, // 显示旅行社选项

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
        this.$axios.get('/user/showAccount/'+this.per_page || null,{params:data})
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false;
                this.userData = res.data.result.data
                this.paginationList = res.data.result
                this.getRoleData();
                this.getGroupData()
                this.getCustomer()
              }
            })
      },

      /**
       * @Description: 获取客户商列表
       * @author Wish
       * @date 2019/12/5
      */
      getCustomer(){
        this.$axios.get('/user/customer/showAll/1')
        .then(res =>{
          if(res.data.code === 0){
            this.customerList = res.data.result
          }else {
            this.$message.warning(res.data.msg)
          }
        })
      },

      /**
       * @Description: 搜索
       * @author Wish
       * @date 2019/11/11
      */
      searchBtn(){
        this.loading = true;
        let data = {
          name: this.searchForm.name,
          status: this.searchForm.status,
          role_id: this.searchForm.role_id,
          time: this.$dateToMs(this.searchForm.time / 1000) || '',
          page: this.page || null,
        }
        this.$axios.post('/user/showAccount/'+this.per_page || null,data)
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
        this.roleCheckList = ''
        this.groupCheckList = []
      },

      /**
       * @Description: 清空输入框值
       * @author Wish
       * @date 2019/9/29
      */
      closeData(){
        this.userInfo = {}
        this.roleCheckList = ''
        this.groupCheckList = []
        this.userId = ''
      },

      /**
       * @Description: table行选中
       * @author Wish
       * @date 2019/9/28
      */
      handleCurrentChange(val){
        if(val){
          this.formLoading = true;
          this.addUserInfoStatic = false;
          this.userId = val.target
          let data = {
            condition: this.userId
          };
          this.$axios.post('/user/getOneAccount',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.closeData()

                  this.formLoading = false;
                  this.userInfo = res.data.result[0]
                  this.userInfo.type = String(this.userInfo.type)
                  this.userInfo['pertTravel'] = this.userInfo.customer_mark?this.userInfo.customer_mark:''
                  console.log(this.userInfo.groups);
                  if(this.userInfo.groups){
                    this.userInfo.groups.map(item =>{
                      this.groupCheckList.push(item.id)
                    })
                  }
                  this.roleCheckList = this.userInfo.role_id?this.userInfo.role_id: ''

                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }

      },

      /**
       * @Description: 修改用户状态
       * @author Wish
       * @date 2019/9/28
      */
      userOperating(val,type){
        let data = {
          type: 1,
          condition: val.target,
          status: type === 0?1:0,
        }
        this.editUserType(data)
      },

      /**
       * @Description: 删除用户
       * @author Wish
       * @date 2019/9/28
      */
      deleteUser(val){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            type: 0,
            condition: val.target,
          }
          this.editUserType(data)
        })
      },

      editUserType(data){
        this.$axios.post('/user/operateAccount',data)
            .then(res =>{
              if(res.data.code === 0){
                this.$message.success('操作成功')
                this.getData()
                this.$refs.singleTable.setCurrentRow();

              }else {
                this.$message.warning(res.data.msg)
              }
            })
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
      cascaderClick(val){
        console.log(val);

      },

      /**
       * @Description: 获取角色列表
       * @author Wish
       * @date 2019/9/29
      */
      getRoleData(){
        this.formLoading = true;
        this.$axios.get('/authority/role/show/0')
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
        this.$axios.get('/user/group/obtain')
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
        console.log(this.userInfo);
        this.userInfo['pertGroups'] = String(this.groupCheckList)
        this.userInfo['role_id'] = String(this.roleCheckList)
        if(this.addUserInfoStatic){  // 新增
          this.$axios.post('/user/addAccount',this.userInfo)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('保存成功')
                  this.getData()
                  this.closeData()
                  this.formLoading = false
                }else {
                  this.$message.warning(res.data.msg)
                  this.formLoading = false
                }
              })
        }else {  // 编辑
          this.userInfo['condition'] = this.userInfo.target
          delete this.userInfo['target']
          this.userInfo.type = JSON.parse(JSON.stringify(this.userInfo.type))
          this.$axios.post('/user/modifyAccount',this.userInfo)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('保存成功')
                  this.formLoading = false
                  this.getData()
                  this.closeData()
                  this.$refs.singleTable.setCurrentRow();
                }else {
                  this.$message.warning(res.data.msg)
                  this.formLoading = false
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
      width: 60%;
      margin-right: 16px;
      padding: 60px 34px 30px;
      .left_header{
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        .addUserBtn{
          margin-right: 15px;
        }
        >div{
          margin-right: 5px;
        }
      }
    }
    .right_main{
      width: 40%;
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
