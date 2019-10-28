<template>
  <div class="statementInfo">
    <el-form class="info_header" label-width="100px">
      <el-form-item label="对账单号">
        <el-input v-model="searchForm.orderId"></el-input>
      </el-form-item>
      <el-form-item label="账期">
        <el-input v-model="searchForm.orderTime"></el-input>
      </el-form-item>
      <el-button>搜索</el-button>
    </el-form>

    <div class=""></div>
  </div>
</template>

<script>
  export default {
    name: "statementInfo",
    data(){
      return {
        searchForm: {}, // 搜索
        tableData: [], // 表格数据
      }
    },
    methods:{
      getDataList(){
        this.$axios.get('/api/finance/obtainAccountPeriod/'+this.$route.query.condition)
            .then(res =>{
              this.tableData = res.data
            })
      },
    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .statementInfo{
    display: flex;
    flex-direction: column;
    padding: 80px 10%;
    .info_header{
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      /deep/.el-form-item{
        margin-bottom: unset;
      }
    }
  }
</style>