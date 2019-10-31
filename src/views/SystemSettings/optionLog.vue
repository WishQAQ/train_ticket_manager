<template>
  <div class="optionLog">
    <div class="table_header">
      <el-input v-model="searchForm.user_name" placeholder="操作人搜索"></el-input>
      <el-input v-model="searchForm.remark" placeholder="备注搜索"></el-input>
      <el-button @click="searchBtn">搜索</el-button>
    </div>
    <div class="table_main">
      <el-table
          v-loading="loading"
          :data="tableData"
          ref="accountTable"
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
            prop="type"
            label="类型">
          <template slot-scope="scope">
            {{scope.row.type === 0 ? '后台登录':
            scope.row.type === 1 ? '其他类型':
            scope.row.type === 2 ? '退出系统': ''}}
          </template>
        </el-table-column>
        <el-table-column
            prop="operator"
            label="操作人">
        </el-table-column>
        <el-table-column
            prop="desc"
            label="备注">
        </el-table-column>
        <el-table-column
            prop="created_at"
            label="操作时间">
        </el-table-column>
        <el-table-column
            prop="ip"
            label="IP">
        </el-table-column>
        <el-table-column
            prop="id"
            label="ID">
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
</template>

<script>
  export default {
    name: "optionLog",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: true,
        tableData: [],
        searchForm: {
          user_name: '',
          remark: '',
        },
        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      getData(){
        this.loading = true
        let data = {
          page: this.page || null,
        }
        this.$axios.get('/api/system/log/show/'+this.per_page || null,{params:data})
            .then(res =>{
              this.loading = false
              this.tableData = res.data.result.data
              this.paginationList = res.data.result
            })
      },

      /**
       * @Description: 搜索
       * @author Wish
       * @date 2019/10/16
      */
      searchBtn(){
        this.loading = true
        this.$axios.post('/api/system/log/show',this.searchForm)
            .then(res =>{
              this.loading = false
              this.tableData = res.data.result.data
            })
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
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .optionLog{
    padding: 80px 5%;
    .table_header{
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      /deep/.el-input{
        margin-right: 15px;
      }
    }
  }
</style>
