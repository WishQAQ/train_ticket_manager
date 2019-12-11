<template>
  <div class="account" v-loading="loading">
    <el-table
        stripe
        :data="tableData"
        border
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
          prop="account"
          label="账号">
      </el-table-column>
      <el-table-column
          prop="password"
          label="密码">
      </el-table-column>
      <el-table-column
          label="备注">
        <template slot-scope="scope">
          <div
              class="addRemarks"
              @click="addRemarksBtn(scope.row)"
              :style="!scope.row.remarks?{color:'rgba(0,0,0,.5)',fontSize:'12px'}:''">
            {{scope.row.remarks || '点击添加备注'}}
          </div>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
        ref="pagination"
        :pageData="paginationList"
        @jumpSize="jumpSize"
        @jumpPage="jumpPage">
    </Pagination>

    <el-dialog
        title="添加备注"
        width="400px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        custom-class="remarks_dialog"
        :visible.sync="remarksDialog">
      <div class="dialog_main">
        <el-form ref="form" label-width="80px">
          <el-form-item label="备注信息">
            <el-input placeholder="请输入备注信息" v-model="accountRemarks"></el-input>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remarksDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitDialog()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "account",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: true,
        tableData: [],

        accountInfo: {}, // 账号信息

        remarksDialog: false, // 备注弹窗
        accountRemarks: '', // 备注

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
        this.$axios.get('/api/system/12306_account/showMe/'+this.per_page || null,{params:data})
            .then(res =>{
              this.loading = false
              this.tableData = res.data.result.data
              this.paginationList = res.data.result
            })
      },

      /**
       * @Description: 打开备注弹窗
       * @author Wish
       * @date 2019/10/14
      */
      addRemarksBtn(val){
        this.remarksDialog = true
        this.accountInfo = val
        this.accountRemarks = JSON.parse(JSON.stringify(val.remarks)) || ''
      },

      /**
       * @Description: 提交备注修改
       * @author Wish
       * @date 2019/10/14
      */
      submitDialog(){
        let data ={
          id: this.accountInfo.id,
          account_id: this.accountInfo.account_id,
          remarks: this.accountRemarks,
        };
        this.$axios.post('/api/system/12306_account/addRemark',data)
            .then(res =>{
              this.remarksDialog = false
              this.accountInfo = {}
              this.accountRemarks = ''
              this.getDataList()
              this.$message.success('提交成功')

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
  .account{
    padding: 80px 15%;
    .addRemarks{
      cursor: pointer;
    }
  }
</style>
