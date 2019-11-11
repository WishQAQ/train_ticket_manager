<template>
  <div class="ticketStatistics" v-loading="loading">
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
    name: "ticketStatistics",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        routerType: this.$route.meta.name, // 路由类型
        urlType: '',
        loading: true,
        ticketData: [], // 车票数据

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      getDataList(){
        this.loading = true
        this.urlType = this.routerType === '网票统计'?'1':
            this.routerType === '纸票统计'? '2':
                this.routerType === '电子票统计'? '0':''
        let data = {
          page: this.page || null,
        }
        this.$axios.get('/api/system/ticketType/'+this.urlType+'/'+this.per_page,{params:data})
            .then(res =>{
              this.ticketData = res.data.result.data
              this.loading = false
              this.paginationList = res.data.result
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
    watch: {
      '$route'(to, from) {
        this.loading = true;
        this.routerType = this.$route.meta.name;
        this.getDataList();
      },
    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .ticketStatistics{
    display: flex;
    flex-direction: column;
    padding: 80px 2%;
  }
</style>
