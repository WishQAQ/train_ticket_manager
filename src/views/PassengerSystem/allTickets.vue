<template>
  <div class="tickets" v-loading="loading">
    <div class="ticket_header">
      <div><el-input clearable v-model="searchForm.name" placeholder="请输入乘客姓名"></el-input></div>
      <div><el-input clearable v-model="searchForm.pay_account" placeholder="请输入支付账号"></el-input></div>
      <div><el-input clearable v-model="searchForm.running_account" placeholder="请输入流水账号"></el-input></div>
      <div><el-input clearable v-model="searchForm.train_account" placeholder="请输入12306账号"></el-input></div>
      <div><el-input clearable v-model="searchForm.order" placeholder="请输入订单号"></el-input></div>
      <div><el-select clearable v-model="searchForm.order_status" placeholder="请选择订单状态">
        <el-option label="已处理订单" value="1"></el-option>
        <el-option label="处理中订单" value="2"></el-option>
      </el-select></div>
      <div><el-input clearable v-model="searchForm.departure" placeholder="发站"></el-input></div>
      <div><el-input clearable v-model="searchForm.arrive" placeholder="到站"></el-input></div>
      <div><el-date-picker
          v-model="searchForm.ridingTime"
          type="daterange"
          range-separator="至"
          start-placeholder="乘车开始日期"
          end-placeholder="乘车结束日期">
      </el-date-picker></div>
      <div><el-date-picker
          v-model="searchForm.beginTime"
          type="daterange"
          range-separator="至"
          start-placeholder="出票开始日期"
          end-placeholder="出票结束日期">
      </el-date-picker></div>
      <div><el-button @click="submitSearchBtn">搜索</el-button></div>
    </div>
    <div class="ticket_main">
      <el-table
          :data="ticketData"
          @select="tableSelect"
          @select-all="tableSelect"
          border>
        <el-table-column
            align="center"
            type="selection"
            width="40">
        </el-table-column>
        <el-table-column
            label="序号"
            align="center"
            width="50px">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
            width="150"
            label="订单号">
          <template slot-scope="scope">
            <div @click="jumpOrderInfo(scope.row.order_sn)" class="ticket_order_id">{{scope.row.order_sn}}</div>
          </template>
        </el-table-column>
        <el-table-column
            min-width="230"
            label="乘客信息">
          <template slot-scope="scope">
            {{scope.row.name + ' ' + scope.row.IDCard}}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            width="110"
            label="行程时间">
          <template slot-scope="scope">
            {{$getTimeYear(scope.row.riding_time * 1000)}}
          </template>
        </el-table-column>
        <el-table-column
            width="120"
            prop="departure_station"
            label="发站">
        </el-table-column>
        <el-table-column
            width="120"
            prop="arrival_station"
            label="到站">
        </el-table-column>
        <el-table-column
            width="80"
            prop="trips_number"
            label="车次">
        </el-table-column>
        <el-table-column
            prop="fwName"
            width="80"
            label="席别名称">
          <template slot-scope="scope">
            {{scope.row.fwName}}
            <span v-if="scope.row.seat_number">/</span>
            {{scope.row.seat_number}}
          </template>
        </el-table-column>
        <el-table-column
            width="80"
            v-if="rulType === '0'"
            label="票类">
          <template slot-scope="scope">
            {{scope.row.ticket_type === 0?'电子票':
            scope.row.ticket_type === 1?'网票':
            scope.row.ticket_type === 2?'纸票':''}}
          </template>
        </el-table-column>
        <el-table-column
            width="90"
            v-if="rulType === '0'"
            sortable
            prop="ticket_price"
            label="票价">
        </el-table-column>
        <el-table-column
            width="90"
            v-if="rulType === '0'"
            sortable
            prop="missed_meals_money"
            label="误餐费">
        </el-table-column>
        <el-table-column
            width="90"
            v-if="rulType === '0'"
            sortable
            prop="refund_fee"
            label="退票款">
        </el-table-column>
        <el-table-column
            width="90"
            v-if="rulType === '0'"
            sortable
            prop="ticket_fare"
            label="出票款">
        </el-table-column>
        <el-table-column
            width="120"
            v-if="rulType === '0'"
            sortable
            label="出票时间">
          <template slot-scope="scope">
            {{$getTimeYear(scope.row.ticketing_time * 1000) || ''}}
          </template>
        </el-table-column>
        <el-table-column
            width="80"
            label="车票状态">
          <template slot-scope="scope">
            <span v-if="scope.row.ticket_status === 0" style="font-weight:unset;color: red">未出票</span>
            <span v-if="scope.row.ticket_status === 1" style="font-weight:unset;color: green">已出票</span>
            <span v-if="scope.row.ticket_status === 2" style="font-weight:unset;color: gray">已取消票</span>
            <span v-if="scope.row.ticket_status === 3" style="font-weight:unset;color: blue">已改签</span>
            <span v-if="scope.row.ticket_status === 4" style="font-weight:unset;color: black">已退票</span>
          </template>
        </el-table-column>
        <el-table-column
            v-if="rulType === '1'"
            prop="remarks"
            label="备注">
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
            <el-dropdown-item><div @click="exportAllTable(1)">导出所选项</div></el-dropdown-item>
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
          name: '',
          pay_account: '',
          running_account: '',
          train_account: '',
          order: '',
          order_status: '',
          departure: '',
          arrive: '',
          ridingTime: [],
          beginTime: [],
        },

        rulType: '',  // 页面类型

        selectUserId: [], // 多选

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
        let data ={
          page: this.page || null,
        }

        this.$axios.get('/api/system/passengerTicket/' + this.rulType + '/'+this.per_page || null,{params: data})
            .then(res =>{
              this.ticketData = res.data.result.data
              this.paginationList = res.data.result
              this.loading = false
            })
      },

      /**
       * @Description: 跳转订单详情页
       * @author Wish
       * @date 2019/11/9
      */
      jumpOrderInfo(val){
        this.$router.push({
          name: 'orderDetails',
          query:{
            order_sn: val,
            type: 'details'
          }
        })
      },

      /**
       * @Description: 搜索
       * @author Wish
       * @date 2019/10/25
      */
      submitSearchBtn(){
        let data ={
          name: this.searchForm.name,
          pay_account: this.searchForm.pay_account,
          running_account: this.searchForm.running_account,
          '12306_account': this.searchForm.train_account,
          order: this.searchForm.order,
          order_status: this.searchForm.order_status,
          departure: this.searchForm.departure,
          arrive: this.searchForm.arrive,
        }
        if(this.searchForm.ridingTime){
          this.searchForm.ridingTime?data['ridingBegin'] = this.$dateToMs(this.searchForm.ridingTime[0] / 1000): ''
          this.searchForm.ridingTime?data['ridingEnd'] = this.$dateToMs(this.searchForm.ridingTime[1] / 1000): ''
          this.searchForm.beginTime?data['begin'] = this.$dateToMs(this.searchForm.beginTime[0] / 1000): ''
          this.searchForm.beginTime?data['end'] = this.$dateToMs(this.searchForm.beginTime[1] / 1000): ''
        }
        this.$axios.post('/api/system/passengerTicket/' + this.rulType + '/'+this.per_page,data)
            .then(res =>{
              this.ticketData = res.data.result.data
              this.paginationList = res.data.result
              this.loading = false
            })
      },

      /**
       * @Description: 表格勾选
       * @author Wish
       * @date 2019/11/25
      */
      tableSelect(v,r) {
        console.log(v);
        this.selectUserId = v.map(res =>{
          let list = {}
          list['order_sn'] = res.order_sn
          list['passenger_id'] = res.export_id
          return list
        })
        console.log(this.selectUserId);
      },

      /**
       * @Description: 导出
       * @author Wish
       * @date 2019/10/18
      */
      exportAllTable(data){
        this.$message.success('正在整理导出数据，导出中，请勿刷新页面')
        if(data === 0){
          this.$axios.get('/api/excel/passengerSystem/'+this.rulType+'/all',{responseType: 'blob'})
              .then(res =>{
                window.location.href = window.URL.createObjectURL(res.data);
              })
        }else {
          if(this.selectUserId.length > 0){
            let data = {
              info: JSON.stringify(this.selectUserId)
            }
            this.$axios.post('/api/excel/passengerSystem/'+this.urlType,data,{responseType: 'blob'})
                .then(res =>{
                  window.location.href = window.URL.createObjectURL(res.data);
                })
          }else {
            this.$message.warning('请至少选择一条数据')
          }
        }
        // this.$axios({
        //   url: '/api/system/exportTicket/'+data,
        //   method: 'get',
        //   responseType: 'blob'
        // }).then(res =>{
        //   if (res.data.type === "application/json") {
        //     this.$message({
        //       type: "error",
        //       message: "下载失败，文件不存在或权限不足"
        //     });
        //   } else {
        //     let blob = new Blob([res.data]);
        //     if (window.navigator.msSaveOrOpenBlob) {
        //       navigator.msSaveBlob(blob);
        //     } else {
        //       let link = document.createElement("a");
        //       let evt = document.createEvent("HTMLEvents");
        //       evt.initEvent("click", false, false);
        //       link.href = URL.createObjectURL(blob);
        //       link.download = '';
        //       link.style.display = "none";
        //       document.body.appendChild(link);
        //       link.click();
        //       window.URL.revokeObjectURL(link.href);
        //     }
        //   }
        // })
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
    // watch: {
    //   '$route'(to, from) {
    //     this.loading = true;
    //     this.routerType = this.$route.meta.name;
    //     this.searchForm = {}
    //     this.getData();
    //   },
    // },
    created() {
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .tickets{
    display: flex;
    flex-direction: column;
    padding: 30px 2%;
    .ticket_header{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 25px;
      >div{
        margin-right: 15px;
        margin-bottom: 15px;
      }
    }
    .ticket_main{
      font-weight: bold;
      /deep/.el-table{
        font-size: 14px;
        color: #000;
      }
      .ticket_order_id{
        cursor: pointer;
        &:hover{
          color: #409EFF;
        }
      }
    }
    .table_bottom{
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
  }
</style>
