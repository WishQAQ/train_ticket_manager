<template>
  <div class="tickets" v-loading="loading">
    <div class="ticket_header">
      <div>
        <el-input clearable v-model="searchForm.name" placeholder="请输入乘客姓名"/></div>
      <div v-if="tableRoleStatus.payment_account.show">
        <el-input clearable v-model="searchForm.pay_account" placeholder="请输入支付账号"/></div>
      <div v-if="tableRoleStatus.payment_flow_number.show">
        <el-input clearable v-model="searchForm.running_account" placeholder="请输入流水号"/></div>
      <div v-if="tableRoleStatus['12306_account'].show">
        <el-input clearable v-model="searchForm.train_account" placeholder="请输入12306账号"/></div>
      <div>
        <el-input clearable v-model="searchForm.order" placeholder="请输入订单号"/></div>
      <div v-if="tableRoleStatus.ticket_status.show"><el-select style="width: 120px" clearable v-model="searchForm.ticket_status" placeholder="车票状态">
        <el-option label="未出票" value="5"/>
        <el-option label="已出票" value="1"/>
        <el-option label="已取消票" value="2"/>
        <el-option label="已改签" value="3"/>
        <el-option label="已退票" value="4"/>
      </el-select></div>
      <div>
        <el-input clearable style="width: 120px" v-model="searchForm.departure" placeholder="发站"/></div>
      <div>
        <el-input clearable style="width: 120px" v-model="searchForm.arrive" placeholder="到站"/></div>
      <div>
        <el-select clearable v-model="searchForm.customer_identity" placeholder="客户商" @change="selectCustomer(searchForm.customer_identity)">
          <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.identity"/>
        </el-select>
      </div>
      <div>
        <el-select v-model="searchForm.issuer_identity" placeholder="发单人选择" clearable>
          <el-option v-for="item in issuerList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>
      <div><el-date-picker
          style="width: 260px"
          v-model="searchForm.ridingTime"
          type="daterange"
          range-separator="至"
          start-placeholder="乘车开始日期"
          end-placeholder="乘车结束日期">
      </el-date-picker></div>
      <div><el-date-picker
          style="width: 260px"
          v-model="searchForm.beginTime"
          type="daterange"
          range-separator="至"
          start-placeholder="出票开始日期"
          end-placeholder="出票结束日期">
      </el-date-picker></div>
      <div><el-button @click="getData">搜索</el-button></div>
    </div>
    <div class="ticket_main">
      <el-table
          stripe
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
            label="序"
            align="center"
            width="55px">
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
            show-overflow-tooltip
            min-width="220"
            label="乘客信息">
          <template slot-scope="scope">
            {{scope.row.name + ' ' + scope.row.IDCard + ' '}}
            {{scope.row.ticket_species === 1?'儿童票': ''}}
          </template>
        </el-table-column>
        <el-table-column
            width="110"
            sortable
            prop="riding_time"
            label="行程时间">
          <template slot-scope="scope">
            {{$getTimeYear(scope.row.riding_time * 1000)}}
          </template>
        </el-table-column>
        <el-table-column
            width="120"
            show-overflow-tooltip
            prop="departure_station"
            label="发站">
        </el-table-column>
        <el-table-column
            width="120"
            show-overflow-tooltip
            prop="arrival_station"
            label="到站">
        </el-table-column>
        <el-table-column
            width="110"
            show-overflow-tooltip
            prop="trips_number"
            label="车次">
        </el-table-column>
        <el-table-column
            prop="fwName"
            width="120"
            show-overflow-tooltip
            label="席别名称">
          <template slot-scope="scope">
            {{scope.row.fwName}}
            <span v-if="scope.row.seat_number">/</span>
            {{scope.row.seat_number}}
          </template>
        </el-table-column>
        <el-table-column
            width="80"
            show-overflow-tooltip
            v-if="rulType === '0'"
            label="票类">
          <template slot-scope="scope">
            {{scope.row.ticket_type === 0?'电子票':
            scope.row.ticket_type === 1?'网票':
            scope.row.ticket_type === 2?'纸票':''}}
          </template>
        </el-table-column>
        <el-table-column
            show-overflow-tooltip
            width="90"
            v-if="rulType === '0'"
            sortable
            prop="ticket_price"
            label="票价">
        </el-table-column>
        <el-table-column
            show-overflow-tooltip
            width="90"
            v-if="rulType === '0'"
            sortable
            prop="missed_meals_money"
            label="误餐费">
        </el-table-column>
        <el-table-column
            show-overflow-tooltip
            width="90"
            v-if="rulType === '0' && tableRoleStatus.refund_fee.show"
            sortable
            prop="refund_fee"
            label="退票款">
        </el-table-column>
        <el-table-column
            show-overflow-tooltip
            width="90"
            v-if="rulType === '0' && tableRoleStatus.ticket_fare.show"
            sortable
            prop="ticket_fare"
            label="出票费">
        </el-table-column>
        <el-table-column
            show-overflow-tooltip
            width="120"
            v-if="rulType === '0'"
            label="出票时间">
          <template slot-scope="scope">
            {{$getTimeYear(scope.row.ticketing_time * 1000) || ''}}
          </template>
        </el-table-column>
        <el-table-column
            show-overflow-tooltip
            width="80"
            v-if="tableRoleStatus.ticket_status.show"
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
            show-overflow-tooltip
            v-if="rulType === '1'"
            prop="remarks"
            label="乘客备注">
        </el-table-column>
        <el-table-column
            show-overflow-tooltip
            v-if="rulType === '1'"
            prop="order_remarks"
            label="订单备注">
        </el-table-column>
      </el-table>
      <div class="table_bottom">
        <div class="customize_pagination">
          <el-input style="width: 95px;margin-right: 5px;" size="mini" placeholder="自定义条数" v-model="customizeSize"/>
          <el-button style="margin-right: 10px" size="mini" type="text" @click="customizeSizeBtn(customizeSize)">确定</el-button>
          <Pagination
              ref="pagination"
              :customizeSize="customizeNum"
              :pageSize="pageSize"
              :pageData="paginationList"
              @jumpSize="jumpSize"
              @jumpPage="jumpPage">
          </Pagination>
        </div>

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
          ticket_status: '',
          customer_identity: '',
          issuer_identity: '',
          departure: '',
          arrive: '',
          ridingTime: [],
          beginTime: [],
        },

        customerList: [],
        issuerList: [], // 发单人列表


        rulType: '',  // 页面类型

        selectUserId: [], // 多选

        paginationList: {},
        per_page: 30,
        page: '',
        pageSize: [this.customizeNum || 30],
        customizeSize: 30,
        customizeNum: null,
        tableRoleStatus: {},

        token: '',
      }
    },
    methods:{
      getData(){
        this.loading = true
        this.rulType =  this.$route.meta.name === '全部车票'?'0':
            this.$route.meta.name === '未出票订单' ?'1':''
        let data ={
          page: this.page || null,
          name: this.searchForm.name || null,
          pay_account: this.searchForm.pay_account || null,
          running_account: this.searchForm.running_account || null,
          customer_identity: this.searchForm.customer_identity || null,
          issuer_identity: this.searchForm.issuer_identity || null,
          '12306_account': this.searchForm.train_account || null,
          order: this.searchForm.order || null,
          ticket_status: this.searchForm.ticket_status || null,
          departure: this.searchForm.departure || null,
          arrive: this.searchForm.arrive || null,
        }
        if(this.searchForm.ridingTime){
          this.searchForm.ridingTime?data['ridingBegin'] = this.$dateToMs(this.searchForm.ridingTime[0] / 1000): ''
          this.searchForm.ridingTime?data['ridingEnd'] = this.$dateToMs(this.searchForm.ridingTime[1] / 1000): ''
          this.searchForm.beginTime?data['begin'] = this.$dateToMs(this.searchForm.beginTime[0] / 1000): ''
          this.searchForm.beginTime?data['end'] = this.$dateToMs(this.searchForm.beginTime[1] / 1000): ''
        }
        this.$axios.post('/system/passengerTicket/' + this.rulType + '/'+this.per_page || null,data)
            .then(res =>{
              this.ticketData = res.data.result.data
              this.paginationList = res.data.result
              this.loading = false
            })
      },

      customizeSizeBtn(val){
        this.per_page = val>0?parseInt(val):30
        this.customizeNum =  val>0?parseInt(val):30
        this.page = 1
        this.getData()
      },

      /**
       * @Description: 获取客户商列表
       * @author Wish
       * @date 2020/1/8
      */
      getCustomerData(){
        this.$axios.get('/user/customer/showAll/1')
            .then(res =>{
              if(res.data.code === 0){
                this.customerList = res.data.result
              }
            })
      },

      /**
       * @Description: 选中客户商
       * @author Wish
       * @date 2019/11/21
       */
      selectCustomer(val){
        console.log(val);
        this.searchForm.issuerList = ''
        this.searchForm.issuer_identity = ''
        this.customerList.forEach(res =>{
          if(res.identity === val){
            this.issuerList = res.issuer
          }
        })
        console.log(this.issuerList);
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
        if(data === 0){
          this.$message.success('正在整理导出数据，导出中，请勿刷新页面')
          window.location.href = 'https://tohcp.cn/excel/passengerSystem/'+this.rulType  + '/' + this.token + '/all'
          // this.$axios.get('/excel/passengerSystem/'+this.rulType+'/all',{responseType: 'blob'})
          //     .then(res =>{
          //       window.location.href = window.URL.createObjectURL(res.data);
          //     })
        }else {
          if(this.selectUserId.length > 0){
            this.$message.success('正在整理导出数据，导出中，请勿刷新页面')
            let newId = []
            this.selectUserId.forEach(item =>{
              newId.push(item.passenger_id)
            })
            window.location.href = 'https://tohcp.cn/excel/passengerSystem/'+this.rulType + '/' + this.token +'/' + String(newId)
            // let data = {
            //   info: JSON.stringify(this.selectUserId)
            // }
            // this.$axios.post('/excel/passengerSystem/'+this.urlType,data,{responseType: 'blob'})
            //     .then(res =>{
            //       window.location.href = window.URL.createObjectURL(res.data);
            //     })
          }else {
            this.$message.warning('请至少选择一条数据')
          }
        }
        // this.$axios({
        //   url: '/system/exportTicket/'+data,
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
    mounted() {
      this.getCustomerData()
    },
    created() {
      const FieldInfoAll  = JSON.parse(sessionStorage.getItem('FieldInfoAll'))
      const FieldInfo = JSON.parse(sessionStorage.getItem('FieldInfo'))
      FieldInfoAll.forEach(item =>{
        this.tableRoleStatus[item.field] = {
          show: false,
          read: false
        }
        FieldInfo.forEach(cItem =>{
          if(item.field === cItem.field){
            if(item.type === 0){
              this.tableRoleStatus[item.field] = {
                show: true,
                read: true
              }
            }
          }
        })
      })
      this.token = sessionStorage.getItem('CSRF')
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
      >div{
        margin-right: 15px;
        margin-bottom: 15px;
      }
    }
    .ticket_main{
      /deep/.el-table{
        font-size: 14px;
        color: #000;
        th{
          padding: unset;
        }
        .el-table__body-wrapper{
          td{
            padding: 4px 0;
          }
        }
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
      .customize_pagination{
        display: flex;
        align-items: flex-end;
        /deep/.el-pagination__sizes{
          display: none;
        }
      }
    }
  }
</style>
