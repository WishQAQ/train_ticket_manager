<template>
  <div class="tickets" v-loading="loading">
    <div class="ticket_header">
      <el-input v-model="searchForm.info" placeholder="请输入乘客信息/支付账号/流水账号/12306账号"></el-input>
      <el-select v-model="searchForm.order_status" placeholder="请选择订单状态">
        <el-option label="已处理订单" value="1"></el-option>
        <el-option label="未处理订单" value="2"></el-option>
      </el-select>
      <el-input v-model="searchForm.departure" placeholder="发站"></el-input>
      <el-input v-model="searchForm.arrive" placeholder="到站"></el-input>
      <el-date-picker
          v-model="searchForm.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
      <el-button @click="submitSearchBtn">搜索</el-button>
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
            {{$getTimeYear(scope.row.riding_time * 1000)}}
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
            <el-dropdown-item><div @click="exportAllTable(0)">导出全部</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

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

        searchForm: {  // 搜索

        },

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
       * @Description: 搜索
       * @author Wish
       * @date 2019/10/25
      */
      submitSearchBtn(){
      },

      /**
       * @Description: 导出
       * @author Wish
       * @date 2019/10/18
      */
      exportAllTable(data){
        this.$axios({
          url: '/api/system/exportTicket/'+data,
          method: 'get',
          responseType: 'blob'
        }).then(res =>{
          if (res.data.type === "application/json") {
            this.$message({
              type: "error",
              message: "下载失败，文件不存在或权限不足"
            });
          } else {
            let blob = new Blob([res.data]);
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob);
            } else {
              let link = document.createElement("a");
              let evt = document.createEvent("HTMLEvents");
              evt.initEvent("click", false, false);
              link.href = URL.createObjectURL(blob);
              link.download = '';
              link.style.display = "none";
              document.body.appendChild(link);
              link.click();
              window.URL.revokeObjectURL(link.href);
            }
          }
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
        this.getData();
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
    .ticket_header{
      display: flex;
      align-items: center;
      margin-bottom: 40px;
    }
    .table_bottom{
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
  }
</style>