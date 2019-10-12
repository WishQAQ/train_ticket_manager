<template>
  <div class="ticketStatistics">
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
            prop="ticket_type"
            label="票类">
        </el-table-column>
        <el-table-column
            prop="ticket_price"
            label="票价">
        </el-table-column>
        <el-table-column
            prop="missed_meals_money"
            label="误餐费">
        </el-table-column>
        <el-table-column
            prop="refund_fee"
            label="退票款">
        </el-table-column>
        <el-table-column
            prop="ticket_fare"
            label="出票款">
        </el-table-column>
        <el-table-column
            prop="ticket_status"
            label="车票状态">
        </el-table-column>
        <el-table-column
            prop="ticketing_time"
            label="出票时间">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ticketStatistics",
    data(){
      return {
        routerType: this.$route.meta.name, // 路由类型

        ticketData: [], // 车票数据


      }
    },
    methods:{
      getDataList(){
        let urlType = this.routerType === '网票统计'?'1':''
        this.$axios.get('/api/system/ticketType/'+urlType)
            .then(res =>{
              this.ticketData = res.data.result.data
            })
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
    padding: 80px 5%;
  }
</style>