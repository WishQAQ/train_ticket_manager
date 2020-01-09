<template>
  <div class="accountSetting" v-loading="loading">
    <div class="table_header">
      <el-button type="primary" @click="openUploadBtn">批量上传</el-button>
      <el-button type="primary" @click="openAssignDialog" :disabled="selectList < 1">账号分配</el-button>
      <el-button type="primary" @click="removeAccount" :disabled="selectList < 1">批量删除</el-button>
    </div>
    <div class="table_main">
      <el-table
          @select="tableSelect"
          @select-all="tableSelect"
          :data="tableData"
          ref="accountTable"
          stripe
          border
          style="width: 100%">
        <el-table-column
            align="center"
            type="selection"
            width="40">
        </el-table-column>
        <el-table-column
            label="序号"
            align="center"
            width="50px">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
            prop="account"
            label="账号">
        </el-table-column>
        <el-table-column
            prop="password"
            label="密码">
        </el-table-column>
        <el-table-column
            prop="ticket_drawer"
            label="出票员">
        </el-table-column>
      </el-table>

      <Pagination
          ref="pagination"
          :pageData="paginationList"
          @jumpSize="jumpSize"
          @jumpPage="jumpPage">
      </Pagination>

    </div>

    <el-dialog
        title="批量上传"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        custom-class="upload_dialog"
        :visible.sync="uploadDialog">
      <div class="dialog_main">
        <el-input
            type="textarea"
            :rows="12"
            placeholder="请粘贴账号、密码，中间用“,”隔开，例：admin,password。注意：每次上传的账号密码不能超过100条，防止溢出"
            v-model="uploadContent">
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitDialog('upload')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="账号分配"
        width="400px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        custom-class="assign_dialog"
        :visible.sync="assignDialog">
      <div class="dialog_main">
        <el-form ref="form" label-width="60px">
          <el-form-item label="出票员">
            <el-select v-model="assignSelect" placeholder="请选择">
              <el-option
                  v-for="item in assignList"
                  :key="item.target"
                  :label="item.user_name"
                  :value="item.target">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitDialog('assign')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "accountSetting",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: true, // 加载
        tableData: [],  // 列表数据

        selectList: [],  // 多选列表

        uploadDialog: false, // 批量上传弹窗
        uploadContent: '', // 上传内容

        assignDialog: false, // 批量分配
        assignSelect: '',  // 分配选择
        assignList: [], // 分配人员列表

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods: {
      getDataList(){
        this.loading = true
        let data = {
          page: this.page || null,
        }
        this.$axios.get('/system/12306_account/show/'+this.per_page || null,{params:data})
            .then(res =>{
              this.loading = false;
              this.tableData = res.data.result.data
              this.paginationList = res.data.result
              this.selectList = []
            })
      },

      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/14
      */
      tableSelect(v,r){
        this.selectList = v.map(res =>{
          return res.id;
        });
      },

      /**
       * @Description: 删除按钮
       * @author Wish
       * @date 2019/10/14
      */
      removeAccount(){
        this.$confirm('此操作将永久所选账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            accountList: String(this.selectList)
          }
          this.$axios.post('/system/12306_account/del',data)
              .then(res =>{
                this.$message.success('删除成功')
                this.getDataList()
              })
        })
      },

      /**
       * @Description: 上传按钮
       * @author Wish
       * @date 2019/10/14
      */
      openUploadBtn(){
        this.uploadDialog = true
        this.uploadContent = ''
      },
      /**
       * @Description: 关闭弹窗
       * @author Wish
       * @date 2019/10/14
      */
      closeDialog(){
        this.uploadDialog = false
        this.uploadContent = ''
        this.assignSelect= ''
        this.assignDialog = false;
      },
      /**
       * @Description: 提交按钮
       * @author Wish
       * @date 2019/10/14
      */
      submitDialog(val){
        if(val === 'upload'){
          let data  = {
            accountList: this.uploadContent
          };
          this.$axios.post('/system/12306_account/add',data)
              .then(res =>{
                this.uploadDialog = false
                this.getDataList()
                this.closeDialog()
              })
        }else if(val === 'assign'){
          let data  = {
            accountList: String(this.selectList),
            user: this.assignSelect
          };
          this.$axios.post('/system/12306_account/distribute',data)
              .then(res =>{
                this.assignDialog = false
                this.getDataList()
                this.closeDialog()
              })
        }

      },

      /**
       * @Description: 分配弹窗按钮
       * @author Wish
       * @date 2019/10/14
      */
      openAssignDialog(){
        this.assignDialog = true;
        this.$axios.get('/system/showDrawer')
            .then(res =>{
              this.assignList = res.data.result
            })
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
  .accountSetting{
    display: flex;
    flex-direction: column;
    padding: 20px 5%;
    .table_header{
      display: flex;
      align-items: center;
      margin-bottom: 40px;
    }
  }
  .assign_dialog{
    .dialog_main{
      display: flex;
      align-content: center;
      justify-content: center;
    }
  }
</style>
