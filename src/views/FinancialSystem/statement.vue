<template>
  <div class="statement" v-loading="loading">
    <div class="table_header">
      <div>
        <el-input clearable v-model="searchOrder" plcaeholder="请输入对账单号"/></div>
      <el-button @click="searchBtn">搜索</el-button>
    </div>
    <div class="table_main">
      <el-table
          :data="tableData"
          border
          @row-dblclick="handledTable"
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
            width="150"
            show-overflow-tooltip
            label="客户">
          <template slot-scope="scope">
            {{$multiUserProcess(scope.row.customer)}}
          </template>
        </el-table-column>
        <el-table-column
            width="100"
            show-overflow-tooltip
            prop="reconciliationAmount"
            label="对账金额">
        </el-table-column>
        <el-table-column
            width="100"
            show-overflow-tooltip
            prop="reconciliationActualReceipts"
            label="对账收款">
        </el-table-column>
        <el-table-column
            width="100"
            show-overflow-tooltip
            prop="reconciliationDebtRoute"
            label="对账债途">
        </el-table-column>
        <el-table-column
            prop="address"
            width="80"
            show-overflow-tooltip
            label="对账状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color: red">清账中</span>
            <span v-if="scope.row.status === 1" style="color: green">已清账</span>
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
        searchOrder: '', // 对账单号搜索
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

      /**
       * @Description: 对账单号搜索
       * @author Wish
       * @date 2019/11/11
      */
      searchBtn(){
        if(this.searchOrder){
          this.tableData = this.tableData.filter(data => !this.searchOrder || data.bill_number.toLowerCase().includes(this.searchOrder.toLowerCase()))
        }else {
          this.getDataList()
        }
      },
      handledTable(val){
        if(val.bill_number){
          console.log(val.bill_number);
          this.$router.push({
            path: 'statementInfo',
            query:{
              condition: String(val.bill_number)
            },
          })
        }
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
    padding: 20px 5%;
    .table_header{
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      >div{
        margin-right: 15px;
      }
    }
  }
</style>
