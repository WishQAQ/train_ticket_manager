<template>
  <div class="statement">
    <div class="table_header">
      <el-input v-model="searchForm.orderId"></el-input>
      <el-button>搜索</el-button>
    </div>
    <div class="table_main" v-loading="loading">
      <el-table
          :data="tableData"
          border
          @current-change="handledTable"
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
            prop="bill_number"
            label="对账单号">
        </el-table-column>
        <el-table-column
            prop="name"
            label="账期"
        width="200">
          <template slot-scope="scope">
            {{$getTimeYear(scope.row.account_period[0].begin * 1000)+ ' 至 '+$getTimeYear(scope.row.account_period[0].end * 1000)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="address"
            label="客户">
          <template slot-scope="scope">
            {{$multiUserProcess(scope.row.customer)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="reconciliationAmount"
            label="对账金额">
        </el-table-column>
        <el-table-column
            prop="reconciliationActualReceipts"
            label="对账收款">
        </el-table-column>
        <el-table-column
            prop="reconciliationDebtRoute"
            label="对账债途">
        </el-table-column>
        <el-table-column
            prop="address"
            label="对账状态">
          <template slot-scope="scope">
            {{scope.row.status === 0? '未结算':'已结清'}}
          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>

<script>
  export default {
    name: "statement",
    data(){
      return {
        loading: true,
        searchForm: {}, // 搜索
        tableData: [], // 表格数据
      }
    },
    methods:{
      getDataList(){
        this.loading = true
        this.$axios.get('/api/finance/getStatementData')
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.tableData = res.data.result
              }
            })
            .catch(() =>{
              this.$message.warning('数据获取失败，请稍后重试')
            })
      },
      handledTable(val){
        this.$router.push({
          name: 'statementInfo',
          query:{
            condition: val.bill_number
          },
        })
      }
    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .statement{
    display: flex;
    flex-direction: column;
    padding: 80px 10%;
    .table_header{
      display: flex;
      align-items: center;
      margin-bottom: 40px;
    }
  }
</style>