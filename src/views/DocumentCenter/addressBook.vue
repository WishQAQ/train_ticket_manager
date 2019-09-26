<template>
  <div class="addressBook">
    <el-menu
        v-loading="loading"
        class="left_main"
        @open="handleOpen"
        @close="handleOpen">
      <el-submenu :index="String(item.id)" v-for="(item,index) in addressList" :key="index">
        <template slot="title">{{item.group_name}}</template>
        <el-menu-item-group v-for="(cItem,cIndex) in item.subGroup" :key="cIndex">
          <el-menu-item :index="String(cItem.id)" @click="handleOpen(cItem.id)">{{cItem.group_name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <div class="right_main" v-loading="tableLoading">
      <div class="right_header">
        <el-select v-model="searchSelect" placeholder="请选择">
          <el-option label="全部部门" value="全部部门"></el-option>
          <el-option label="团队" value="团队"></el-option>
        </el-select>
        <el-input class="search_input" v-model="searchInput" placeholder="姓名/电话/旅行社"></el-input>
        <el-button type="primary">筛选</el-button>
        <el-button type="primary" :disabled="addMailBtn" @click="addMail">添加</el-button>
      </div>
      <el-table
          :data="mailListData"
          border
          style="width: 100%">
        <el-table-column
            prop="nickname"
            label="昵称">
        </el-table-column>
        <el-table-column
            prop="group_name"
            label="旅行社/组">
        </el-table-column>
        <el-table-column
            prop="contact"
            label="联系方式">
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
        title="添加联系人"
        modal-append-to-body
        append-to-body
        :visible.sync="addDialog"
        custom-class="add_dialog">
      <el-form class="dialog_main" ref="form" label-width="50px">
        <el-form-item label="姓名">
          <el-input v-model="addMailForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addMailForm.contact"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddMail">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "addressBook",
    data(){
      return {
        loading: true,
        tableLoading: false,
        addressList: '',  // 群组信息
        mailListData: [],  // 联系方式

        searchSelect: '', // 筛选选择器
        searchInput: '', // 搜索框

        addMailBtn: true, // 添加按钮
        addDialog: false, // 添加弹窗
        groupId: '', // 分组ID
        addMailForm: {}, // 添加信息
      }
    },
    methods: {
      /**
       * @Description: 获取分组列表
       * @author Wish
       * @date 2019/9/26
      */
      getDataList(){
        this.loading = true
        this.$axios.get('/api/user/group/obtain')
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.addressList = res.data.result
              }
            })
      },

      /**
       * @Description: 获取分组下人员信息
       * @author Wish
       * @date 2019/9/26
      */
      handleOpen(key, keyPath) {
        if(key){
          this.groupId = key
          this.addMailBtn = false
          this.tableLoading = true
          this.$axios.get('/api/user/mailList/obtain/'+key)
              .then(res =>{
                if(res.data.code === 0){
                  this.tableLoading = false
                  this.mailListData = res.data.result
                }
              })
        }
      },

      /**
       * @Description: 添加联系人弹窗
       * @author Wish
       * @date 2019/9/26
      */
      addMail(){
        this.addDialog = true
        this.addMailForm['group_id'] = this.groupId
      },
      /**
       * @Description: 确认添加联系人
       * @author Wish
       * @date 2019/9/26
      */
      submitAddMail(){
        this.addMailForm.contact = this.$telPhone(this.addMailForm.contact)
        if(this.addMailForm.name && this.addMailForm.contact){
          this.$axios.post('/api/user/mailList/addOutside',this.addMailForm)
              .then(res =>{
                if(res.data.code === 0){
                  this.addDialog = false
                  this.$message.success('添加成功')
                  this.handleOpen(this.groupId)
                  this.addMailForm = {}
                }
                console.log(res);
              })
        }
      },

    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .addressBook{
    display: flex;
    justify-content: center;
    padding: 45px 0 ;
    .left_main{
      max-width: 300px;
      width: 100%;
      flex-shrink: 0;
      margin-right: 40px;
      border: solid 1px #e6e6e6;
      /deep/.el-submenu{
        .el-submenu__title{
          border-bottom: solid 1px #e6e6e6;
        }
        .el-menu{
          .el-menu-item-group{
            .el-menu-item-group__title{
              padding: 0;
            }
            .el-menu-item{
              border-bottom: solid 1px #e6e6e6;
            }
          }
        }

      }
    }
    .right_main{
      flex: 1;
      max-width: 700px;
      width: 100%;
      .right_header{
        display: flex;
        align-items: center;
        margin-bottom: 35px;
        .search_input{
          margin: 0 10px;
        }
      }
    }
  }
  /deep/.add_dialog{
    max-width: 600px;
    width: 100%;
    .dialog_main{
      width: 80%;
    }
  }
</style>