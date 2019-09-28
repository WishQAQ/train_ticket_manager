<template>
  <div class="userSetting" v-loading="loading">
    <div class="left_main">
      <div class="left_header">
        <el-button>新增用户</el-button>
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
      </div>

    </div>

    <div class="right_main" v-loading="formLoading">
      <div class="right_header">新增用户</div>
      <el-form class="user_form" ref="form" label-width="120px">
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


      </el-form>


    </div>
  </div>
</template>

<script>
  export default {
    name: "userSetting",
    data(){
      return {
        loading: true, // 全屏页面加载
        searchInput: '',  // 搜索框

        userData: [],  // 用户列表

        userInfo: {},  // 用户详细信息
        formLoading: false, // 用户详细信息加载

      }
    },
    methods:{
      getData(){
        this.loading = true
        this.$axios.get('/api/user/showAccount')
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.userData = res.data.result.data
              }
            })
      },
      /**
       * @Description: table行选中
       * @author Wish
       * @date 2019/9/28
      */
      handleCurrentChange(val){
        this.formLoading = true
        let data = {
          condition: val.target
        }
        this.$axios.post('/api/user/getOneAccount',data)
            .then(res =>{
              if(res.data.code === 0){
                this.formLoading = false
                this.userInfo = res.data.result[0]
              }
              console.log(this.userInfo);
            })
      },

      /**
       * @Description: 修改用户状态
       * @author Wish
       * @date 2019/9/28
      */
      userOperating(val){
        console.log(val);
      },

      /**
       * @Description: 删除用户
       * @author Wish
       * @date 2019/9/28
      */
      deleteUser(val){
        console.log(val);
      },

    },
    created() {
      this.getData()
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
      background: #fff;
      .right_header{
        display: flex;
        align-items: center;
        height: 68px;
        padding-left: 37px;
        border-bottom:1px solid rgba(38,153,251,.5);
        font-size:18px;
        color:rgba(51,148,250,1);
      }
    }
  }
</style>