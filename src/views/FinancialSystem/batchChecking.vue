<!--批量对账-->
<template>
  <div class="content" v-loading="loading">
    <table class="my-table">
      <tr>
        <td class="table-title">设置对账单号</td>
        <td class="table-content">
        </td>
      </tr>
      <tr>
        <td>设置账期</td>
        <td>
            <el-date-picker
                    v-model="date_value"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
        </td>
      </tr>
      <tr>
        <td>上传收款凭证</td>
        <td></td>
      </tr>
      <tr>
        <td>上传付款凭证</td>
        <td></td>
      </tr>
      <tr>
        <td>导入账单文件</td>
        <td>
          <el-button type="primary" @click="dialogFormVisible = true">导入</el-button>
        </td>
      </tr>
      <tr>
        <td>备注</td>
        <td></td>
      </tr>
    </table>

    <el-dialog title="导入账单文件" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: "batchChecking",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: false,
          date_value: '',
          dialogFormVisible: false,
          ruleForm: {
              desc: ''
          },
      }
    },
    methods:{

      getData(){
        this.loading = true;
        this.$axios.get('/api/system/passengerTicket/')
            .then(res =>{
                this.tableData = res.data.result.data;
                this.loading = false;
                this.paginationList = res.data.result;
            })
      },
    },
    created() {
      // this.getData()
    }
  }
</script>

<style scoped lang="less">
  .content{
    display: flex;
    flex-direction: column;
    padding: 80px 5%;
  }
  .my-table{
    width: 100%;
    .table-title{
      width: 20%;
    }
    .table-content{
      width: 80%;
    }
  }
  td{
    border: 1px solid #ebeef5;
    padding: 20px;
  }
</style>