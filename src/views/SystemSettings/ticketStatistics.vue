<template>
  <div class="ticketStatistics" v-loading="loading">
    <div class="ticket_header">
      <div><el-input clearable placeholder="姓名/身份证" v-model="searchForm.info"></el-input></div>
      <div><el-select clearable v-model="searchForm.order_status" placeholder="请选择车票状态">
        <el-option label="未出票" value="0"></el-option>
        <el-option label="已出票" value="1"></el-option>
        <el-option label="已取消票" value="2"></el-option>
        <el-option label="已改签" value="3"></el-option>
        <el-option label="已退票" value="4"></el-option>
      </el-select></div>
      <div>
        <el-select v-model="searchForm.customer_identity" placeholder="客户选择" clearable>
          <el-option v-for="item in client" :key="item.id" :label="item.name" :value="item.identity"></el-option>
        </el-select>
      </div>
      <div><el-input clearable placeholder="发站" v-model="searchForm.departure"></el-input></div>
      <div><el-input clearable placeholder="到站" v-model="searchForm.arrive"></el-input></div>
      <div>
        <el-select v-model="searchForm.drawer" placeholder="出票员查询" clearable>
          <el-option v-for="item in companyAccount" :key="item.id" :label="item.nickname" :value="item.target"></el-option>
        </el-select>
      </div>
      <el-date-picker
          v-model="searchForm.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
      <div><el-button @click="getDataList('search')">搜索</el-button></div>
    </div>
    <div class="ticket_main">
      <el-table
          @select="tableSelect"
          @select-all="tableSelect"
          :data="ticketData"
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
            {{$getTimeYear(scope.row.riding_time * 1000) || ''}}
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
            label="出票时间">
          <template slot-scope="scope">
            {{$getTimeYear(scope.row.ticketing_time * 1000) || ''}}
          </template>
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
            <el-dropdown-item><div @click="downAllExcel">全部导出</div></el-dropdown-item>
            <el-dropdown-item><div @click="downSelectExcel">导出所选项</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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

        searchForm: {
          time: '',
          info: '',
          order_status: '',
          customer_identity: '',
          departure: '',
          arrive: '',
          drawer: ''
        },

        client: [], // 客户商列表
        companyAccount: [], // 内部账号列表

        selectUserId: [],

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      getDataList(type){
        this.loading = true
        this.urlType = this.routerType === '网票统计'?'1':
            this.routerType === '纸票统计'? '2':
                this.routerType === '电子票统计'? '0':''
        let data
        if(type === 'search'){
          data = JSON.parse(JSON.stringify(this.searchForm))
          data['page'] = this.page || null
          data['begin']= ''
          data['end']= ''
          data.time?data['begin'] = this.$dateToDate(data.time[0]):''
          data.time?data['end'] = this.$dateToDate(data.time[1]):''
          delete data.time
        }else {
          data = {
            page: this.page || null,
          }
        }

        this.$axios.post('/api/system/ticketType/'+this.urlType+'/'+this.per_page,data)
            .then(res =>{
              this.ticketData = res.data.result.data
              this.loading = false
              this.paginationList = res.data.result
              this.getClient()
              this.getCompanyAccount()
            })
      },

      /**
       * @Description: 获取客户商
       * @author Wish
       * @date 2019/11/27
       */
      getClient(){
        this.$axios.get('/api/user/customer/showAll')
            .then(res =>{
              this.client = res.data.result;
            })
      },

      /**
       * @Description: 获取公司内部账号
       * @author Wish
       * @date 2019/11/27
       */
      getCompanyAccount(){
        this.$axios.get('/api/user/showCompanyAccount/1')
            .then(res =>{
              if(res.data.code === 0){
                this.companyAccount = res.data.result
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },


      /**
       * @Description: 全部导出
       * @author Wish
       * @date 2019/11/15
      */
      downAllExcel(){
        this.$axios.get('/api/excel/ticketType/'+this.urlType + '/all',{responseType: 'blob'})
            .then(res =>{
              window.location.href = window.URL.createObjectURL(res.data);
            })
      },

      /**
       * @Description: 多选
       * @author Wish
       * @date 2019/11/15
      */

      tableSelect(v,r) {
        this.selectUserId = v.map(res =>{
          let list = {}
          list['order_sn'] = res.order_sn
          list['passenger_id'] = res.export_id
          return list
        })
        console.log(this.selectUserId);
      },

      /**
       * @Description: 导出所选项
       * @author Wish
       * @date 2019/11/15
      */
      downSelectExcel(){
        if(this.selectUserId.length > 0){
          let data = {
            info: JSON.stringify(this.selectUserId)
          }
          this.$axios.post('/api/excel/ticketType/'+this.urlType,data,{responseType: 'blob'})
              .then(res =>{
                window.location.href = window.URL.createObjectURL(res.data);
              })
        }else {
          this.$message.warning('请至少选择一条数据')
        }
      },

      /**
       * @Description: 获取客户商
       * @author Wish
       * @date 2019/11/15
      */

      /**
       * @Description: 获取发单人
       * @author Wish
       * @date 2019/11/15
      */

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
    // watch: {
    //   '$route'(to, from) {
    //     this.loading = true;
    //     this.routerType = this.$route.meta.name;
    //     this.getDataList();
    //   },
    // },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .ticketStatistics{
    display: flex;
    flex-direction: column;
    padding: 20px 2%;
    .ticket_header{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      >div{
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    .table_bottom{
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
  }
</style>
