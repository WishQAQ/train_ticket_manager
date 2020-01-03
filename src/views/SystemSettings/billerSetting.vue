<template>
  <div class="billerSetting" v-loading="loading">
    <div class="table_header">
      <el-input clearable v-model="searchForm.name" placeholder="发单人名称搜索"></el-input>
      <el-input clearable v-model="searchForm.qq" placeholder="QQ号搜索"></el-input>
      <el-input clearable v-model="searchForm.contact" placeholder="联系方式搜索"></el-input>
      <el-select clearable v-model="searchForm.target" placeholder="请选择客户商">
        <el-option
            v-for="item in dataList"
            :key="item.identity"
            :label="item.name"
            :value="item.identity">
        </el-option>
      </el-select>
      <el-button @click="searchBtn">搜索</el-button>
    </div>
    <div class="table_main">
      <div class="main_header">
        <div class="header_left">客户名字（旅行社）</div>
        <div class="header_right">
          <div class="header_right_top">下属发单人（旅行社员工）</div>
          <div class="header_right_list">
            <div>姓名</div>
            <div>电话</div>
            <div>QQ号</div>
            <div style="width: 70px;flex-shrink: 0">状态</div>
            <div>操作</div>
          </div>
        </div>
      </div>

      <div class="table_content">
        <div class="content_row" v-for="(item, index) in dataList" :key="index">
          <div class="row_left">{{item.name}} <el-button class="add_user_btn" size="mini" type="primary" @click="addUserBtn(item)">添加</el-button></div>
          <div class="row_right">
            <span class="unMessage" v-if="item.staff.length < 1">请添加下属发单人</span>
            <div class="right_col" v-for="(cItem, cIndex) in item.staff" :key="cIndex">
              <div>{{cItem.name}}</div>
              <div>{{cItem.contact}}</div>
              <div>{{cItem.qq}}</div>
              <div style="width: 70px;flex-shrink: 0">
                <el-tag type="success" v-if="cItem.status === 0">启用</el-tag>
                <el-tag type="danger" v-else>停用</el-tag>
              </div>
              <div>
                <el-dropdown trigger="click">
                  <el-button type="mini">操作</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><div @click="editBtn(cItem,item.identity)">编辑</div></el-dropdown-item>
                    <el-dropdown-item><div @click="editStatus(cItem)">{{cItem.status === 0?'停用':'启用'}}</div></el-dropdown-item>
                    <el-dropdown-item><div @click="removeBtn(cItem)">删除</div></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <Pagination
        ref="pagination"
        :pageData="paginationList"
        @jumpSize="jumpSize"
        @jumpPage="jumpPage">
    </Pagination>


    <el-dialog
        title="发单人"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        width="500px"
        custom-class="userInfo_dialog"
        :visible.sync="userInfoDialog">
      <div class="dialog_main">
        <el-form label-width="90px">
          <el-form-item label="发单人名称">
            <el-input v-model="userName"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input   maxlength="11"
                        show-word-limit
                        v-model="telPhone"></el-input>
          </el-form-item>
          <el-form-item label="QQ">
            <el-input v-model="qq"></el-input>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitDialog()">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "billerSetting",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: true,
        dataList: [],

        searchForm: { // 搜索
          name: '',
          target: '',
          contact: '',
          qq: '',
        },

        userInfoDialog: false,
        dialogType: true, // 新增状态
        userName: '',
        telPhone: '',
        qq: '',
        target: '',
        condition: '',

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      getDataList(){
        this.loading = true
        let data = {
          page: this.page || null,
        }
        this.$axios.get('/user/issuer/show/'+this.per_page || null,{params:data})
            .then(res =>{
              this.loading = false
              this.dataList = res.data.result.data
              this.paginationList = res.data.result
            })
      },

      /**
       * @Description: 搜索按钮
       * @author Wish
       * @date 2019/10/16
      */
      searchBtn(){
        this.$axios.post('/user/issuer/search',this.searchForm)
            .then(res =>{
              if(res.data.code === 0){
                this.dataList = res.data.result.data
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      closeInfo(){
        this.userName= ''
        this.telPhone= ''
        this.qq= ''
        this.target= ''
      },

      /**
       * @Description: 新增发单人
       * @author Wish
       * @date 2019/10/16
      */
      addUserBtn(val){
        this.dialogType = true
        this.closeInfo()
        this.target = val.identity
        this.userInfoDialog = true
      },
      /**
       * @Description: 关闭弹窗
       * @author Wish
       * @date 2019/10/16
      */
      closeDialog(){
        this.userInfoDialog = false
      },

      /**
       * @Description: 修改信息
       * @author Wish
       * @date 2019/10/16
      */
      editBtn(val,identity){
        this.dialogType = false
        this.closeInfo()
        this.userInfoDialog = true
        this.userName= JSON.parse(JSON.stringify(val.name))
        this.telPhone= JSON.parse(JSON.stringify(val.contact))
        this.target = identity
        this.condition = val.id
        this.qq= JSON.parse(JSON.stringify(val.qq))
      },

      /**
       * @Description: 删除按钮
       * @author Wish
       * @date 2019/10/16
      */
      removeBtn(val){
        let data ={
          type: 2,
          condition: val.id
        }
        let message = '删除成功'
        this.optionUserInfo(data,message)
      },

      /**
       * @Description: 修改状态按钮
       * @author Wish
       * @date 2019/10/16
      */
      editStatus(val){
        let data ={
          type: 1,
          status: val.status === 0?1:0,
          condition: val.id
        }
        let message = '修改成功'
        this.optionUserInfo(data,message)
      },

      /**
       * @Description: 修改发单人状态接口
       * @author Wish
       * @date 2019/10/16
      */
      optionUserInfo(data,message){
        this.$axios.post('/user/issuer/operation',data)
            .then(res =>{
              if(res.data.code === 0){
                this.getDataList()
                this.$message.success(message)
              }else {
                this.$message(res.data.msg)
              }
            })
      },

      /**
       * @Description: 提交按钮
       * @author Wish
       * @date 2019/10/16
      */
      submitDialog(){
        if(this.dialogType){
          let data ={
            name: this.userName,
            target: this.target,
            contact: this.telPhone,
            qq: this.qq
          }
          this.$axios.post('/user/issuer/add',data)
              .then(res => {
                if (res.data.code === 0) {
                  this.$message.success('添加成功')
                  this.getDataList()
                  this.closeDialog()
                } else {
                  this.$message.warning(res.data.msg)
                }
              })
        }else {
          let data ={
            type: 0,
            name: this.userName,
            target: this.target,
            contact: this.telPhone,
            qq: this.qq,
            condition: this.condition
          }
          let message = '修改成功'
          this.optionUserInfo(data,message)
          this.userInfoDialog = false
        }
      },

      /**
       * @Description: 分页器
       * @author Wish
       * @data 2019/10/16
      */
      jumpSize(val){
        this.per_page = val
        this.getDataList()
      },
      jumpPage(val){
        this.page = val
        this.getDataList()
      },

    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .billerSetting{
    display: flex;
    flex-direction: column;
    padding: 20px 5%;
    .table_header{
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      /deep/.el-input{
        margin-right: 15px;
      }
    }
    .table_main{
      width: 100%;
      .main_header{
        display: flex;
        align-items: center;
        border: 1px solid #ebeef5;
        color: #909399;
        font-weight: 500;
        .header_left{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35%;
        }
        .header_right{
          width: 65%;
          border-left: 1px solid #ebeef5;
          .header_right_top{
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #ebeef5;
          }
          .header_right_list{
            display: flex;
            align-items: center;
            height: 50px;
            >div{
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              &:last-child{
                width: 70px;
                flex-shrink: 0;
              }
              &:not(:last-child){
                border-right: 1px solid #ebeef5;
              }
            }
          }
        }
      }
      .table_content{
        font-size: 14px;
        color: #606266;
        .content_row{
          display: flex;
          .row_left{
            width: 35%;
            display: flex;
            align-items: center;
            padding-left: 2%;
            border: 1px solid #ebeef5;
            border-top: unset;
            min-height: 50px;
            .add_user_btn{
              margin-left: 5%;
            }
          }
          .row_right{
            width: 65%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            border-right: 1px solid #ebeef5;
            border-bottom: 1px solid #ebeef5;
            .unMessage{
              font-size: 10px;
              color: #525252;
            }
            .right_col{
              display: flex;
              align-items: center;
              width: 100%;
              &:not(:last-child){
                border-bottom: 1px solid #ebeef5;
              }
              >div{
                width: 100%;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                &:last-child{
                  width: 70px;
                  flex-shrink: 0;
                }
                &:not(:last-child){
                  border-right: 1px solid #ebeef5;
                }
              }
            }
          }
        }
      }
    }
  }
  /deep/.userInfo_dialog{
    margin: unset !important;
  }
  /deep/.el-dialog__wrapper{
    position: fixed !important;
  }
</style>
