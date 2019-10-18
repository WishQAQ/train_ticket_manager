<template>
  <div class="tickets" v-loading="loading">
    <div class="ticket_header">

    </div>
    <div class="ticket_main">
      <el-table
          :data="ticketData"
          border>
        <el-table-column
            label="序号"
            align="center"
            width="50px">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
            prop="order_sn"
            label="订单号">
        </el-table-column>
        <el-table-column
            label="乘客信息">
          <template slot-scope="scope">
            {{scope.row.name + ' ' + scope.row.IDCard}}
          </template>
        </el-table-column>
        <el-table-column
            prop="departure_station"
            label="发站">
        </el-table-column>
        <el-table-column
            prop="arrival_station"
            label="到站">
        </el-table-column>
        <el-table-column
            sortable
            label="乘车日期">
          <template slot-scope="scope">
            {{$getTime(scope.row.riding_time)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="fwName"
            label="席别名称">
        </el-table-column>
        <el-table-column
            label="票类">
          <template slot-scope="scope">
            {{scope.row.ticket_type === 0?'电子票':
            scope.row.ticket_type === 1?'网票':
            scope.row.ticket_type === 2?'纸票':''}}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            prop="ticket_price"
            label="票价">
        </el-table-column>
        <el-table-column
            sortable
            prop="missed_meals_money"
            label="误餐费">
        </el-table-column>
        <el-table-column
            sortable
            prop="refund_fee"
            label="退票款">
        </el-table-column>
        <el-table-column
            sortable
            prop="ticket_fare"
            label="出票款">
        </el-table-column>
        <el-table-column
            label="车票状态">
          <template slot-scope="scope">
            {{scope.row.ticket_status === 0?'未出票':
            scope.row.ticket_status === 1?'已出票':
            scope.row.ticket_status === 2?'已取消票':
            scope.row.ticket_status === 3?'已改签':
            scope.row.ticket_status === 4?'已退票':'数据异常 '}}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            prop="ticketing_time"
            label="出票时间">
        </el-table-column>
      </el-table>
      <div class="table_bottom">
        <Pagination
            ref="pagination"
            :pageData="paginationList"
            @jumpSize="jumpSize"
            @jumpPage="jumpPage">
        </Pagination>
        <el-dropdown trigger="click">
          <el-button>导出</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导出当前页面</el-dropdown-item>
            <el-dropdown-item><div @click="exportAllTable()">导出全部</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <a href="http://oa.huimin.dev.cq1080.com/system/exportTicket/0">123123123</a>

    </div>
  </div>
</template>

<script>
  export default {
    name: "allTickets",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: true,
        routerType: this.$route.meta.name,
        ticketData: [],

        rulType: '',  // 页面类型

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      getData(){
        this.loading = true
        this.rulType =  this.$route.meta.name === '全部车票'?'0':
            this.$route.meta.name === '未出票订单' ?'1':''
        let data = {
          page: this.page || null,
        }
        this.$axios.get('/api/system/passengerTicket/' + this.rulType + '/'+this.per_page || null,{params:data})
            .then(res =>{
              this.ticketData = res.data.result.data
              this.paginationList = res.data.result
              this.loading = false
            })
      },

      /**
       * @Description: 导出
       * @author Wish
       * @date 2019/10/18
      */
      exportAllTable(data){
        this.$axios.get('/api/system/exportTicket/'+this.rulType)
            .then(res =>{
              console.log(res);
            })
      },

      /**
       * @Description: 分页器
       * @author Wish
       * @date 2019/10/18
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
    watch: {
      '$route'(to, from) {
        this.loading = true;
        this.routerType = this.$route.meta.name;
        this.getDataList();
      },
    },
    created() {
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .tickets{
    display: flex;
    flex-direction: column;
    padding: 80px 2%;
    .table_bottom{
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
  }
</style>