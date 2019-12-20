<template>
  <div class="dataAnalysis">
    <div class="search_header">
      <div>
        <el-cascader
            clearable
            placeholder="请选择搜索条件"
            v-model="module"
            :options="options"
            @change="handleChange">
        </el-cascader>
      </div>

      <!-- 根据客户筛选 -->
      <div v-if="showClient"><el-select
            v-model="searchForm.client"
            placeholder="请选择客户">
<!--          <el-option label="所有客户" value="0"></el-option>-->
          <el-option
              v-for="item in clientList"
              :key="item.identity"
              :label="item.name"
              :value="item.identity">
          </el-option>
        </el-select></div>
      <div v-if="showClient"><el-select
          v-model="searchForm.statisticType"
          placeholder="请选择统计类型">
        <el-option label="车票张数" value="totalTicket"/>
        <el-option label="误餐费合计" value="totalMissMeals"/>
        <el-option label="退票合计" value="totalRefundTicket"/>
        <el-option label="优惠合计" value="totalDiscount"/>
        <el-option label="利润合计" value="totalProfit"/>
        <el-option label="应收款合计" value="totalReceivables"/>
      </el-select></div>

      <!-- 根据售票员筛选 -->
      <div v-if="showConductor"><el-select
          v-model="searchForm.conductor"
          placeholder="请选择售票员">
<!--        <el-option label="所有售票员" value="all"></el-option>-->
        <el-option
            v-for="item in conductorList"
            :key="item.target"
            :label="item.nickname"
            :value="item.target">
        </el-option>
      </el-select></div>
      <div v-if="showConductor"><el-select
          v-model="searchForm.statisticType"
          placeholder="请选择统计类型">
        <el-option label="出票张数" value="totalOutTicket"/>
        <el-option label="票价各计" value="totalTicketPrice"/>
        <el-option label="误餐费合计" value="totalMissMeals"/>
        <el-option label="支付宝合计" value="totalAlipay"/>
      </el-select></div>

      <!-- 根据订单提交时间 or 乘车时间 or 出票时间筛选 -->
      <div v-if="showDate"><el-date-picker
          v-model="searchForm.date"
          type="date"
          placeholder="选择日期">
      </el-date-picker></div>
      <div v-if="showMonth"><el-date-picker
          v-model="searchForm.month"
          type="month"
          placeholder="选择月份">
      </el-date-picker></div>
      <div v-if="showTimeType !== 1 && showDate || showMonth"><el-select
          v-model="searchForm.statisticType"
          placeholder="请选择统计类型">
        <el-option label="车票张数" value="totalTicket"/>
        <el-option label="误餐费合计" value="totalMissMeals"/>
        <el-option label="退票合计" value="totalRefundTicket"/>
        <el-option label="优惠合计" value="totalDiscount"/>
        <el-option label="利润合计" value="totalProfit"/>
        <el-option label="应收款合计" value="totalReceivables"/>
      </el-select></div>
      <!-- 根据订单提交时间 -->
      <div v-if="showTimeType === 1"><el-select
          v-model="searchForm.statisticType"
          placeholder="请选择统计类型">
        <el-option label="出票合计" value="totalTicketIssue"/>
        <el-option label="误餐费合计" value="totalMissMeals"/>
        <el-option label="利润合计" value="totalProfit"/>
      </el-select></div>

      <!-- 根据发单人筛选 -->
      <div v-if="showBiller"><el-select
          v-model="searchForm.biller"
          placeholder="请选择发单人">
<!--        <el-option label="所有发单人" value="0"></el-option>-->
        <el-option
            v-for="item in billerList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select></div>
      <div v-if="showBiller"><el-select
          v-model="searchForm.statisticType"
          placeholder="请选择统计类型">
        <el-option label="出票张数" value="totalTicketIssue"/>
        <el-option label="误餐费合计" value="totalMissMeals"/>
        <el-option label="退票合计" value="totalRefundTicket"/>
        <el-option label="优惠合计" value="totalDiscount"/>
        <el-option label="利润合计" value="totalProfit"/>
        <el-option label="应收款合计" value="totalReceivables"/>
      </el-select></div>
      <!-- 根据创建人or出票员 -->
      <div v-if="showTicket"><el-select
          v-model="searchForm.ticket"
          :placeholder="showTicketType? '请选择创建人': '请选择出票员'">
<!--        <el-option :label="showTicketType? '所有创建人': '所有出票员'" value="all"></el-option>-->
        <el-option
            v-for="item in conductorList"
            :key="item.target"
            :label="item.nickname"
            :value="item.target">
        </el-option>
      </el-select></div>
      <div v-if="showTicket"><el-select
          v-model="searchForm.statisticType"
          placeholder="请选择统计类型">
        <el-option v-if="showTicketType" label="创建张数" value="totalTicket"/>
        <el-option v-else label="出票张数" value="totalOutTicket"/>
        <el-option label="票价合计" value="totalTicketPrice"/>
        <el-option label="误餐费合计" value="totalMissMeals"/>
        <el-option label="退票款合计" value="totalRefundTicket"/>
        <el-option label="快递费合计" value="totalExpressFee"/>
        <el-option label="出票费合计" value="totalTicketCharge"/>
      </el-select></div>

      <!-- 根据发站or到站 -->
      <div v-if="showSite">
        <el-input placeholder="请输入地址" v-model="searchForm.site"/>
      </div>
      <div v-if="showSite"><el-select
          v-model="searchForm.statisticType"
          placeholder="请选择统计类型">
        <el-option label="车票张数" value="totalTicket"/>
        <el-option label="误餐费合计" value="totalMissMeals"/>
        <el-option label="退票合计" value="totalRefundTicket"/>
        <el-option label="优惠合计" value="totalDiscount"/>
        <el-option label="利润合计" value="totalProfit"/>
        <el-option label="应收款合计" value="totalReceivables"/>
      </el-select></div>

      <!-- 根据票种 -->
      <div v-if="showTicketTypeInput"><el-select
          v-model="searchForm.ticketType"
          placeholder="请选择票种">
        <el-option label="成人票" value="0"/>
        <el-option label="儿童票" value="1"/>
      </el-select></div>

      <!-- 根据用户登录 -->
      <div v-if="showLogin"><el-select
          v-model="searchForm.selectUser"
          placeholder="请选择用户">
<!--        <el-option label="全部用户" value="all"></el-option>-->
        <el-option
            v-for="item in conductorList"
            :key="item.target"
            :label="item.nickname"
            :value="item.target">
        </el-option>
      </el-select></div>
      <div v-if="showLogin"><el-select
          v-model="searchForm.statisticType"
          placeholder="请选择统计类型">
        <el-option label="登录次数" value="totalLoginCount"/>
        <el-option label="登录时长" value="totalLoginTime"/>
      </el-select></div>
      <div style="width: 100px"><el-select
          v-model="searchForm.chartsType"
          placeholder="请选择图表类型">
        <el-option label="饼图" value="饼图"/>
        <el-option label="折线图" value="折线图"/>
        <el-option label="柱状图" value="柱状图"/>
      </el-select></div>

      <div><el-button @click="submitSearch" v-loading="loading">统计</el-button></div>
    </div>

    <div class="data_content">
      <div class="data_charts">
        <ve-line :height="'600px'" v-if="searchForm.chartsType === '折线图' && chartData.rows.length > 0"
                 :data-empty="dataEmpty" :data="chartData"/>
        <Ve-pie :settings="chartSettings" :height="'600px'"
                v-if="searchForm.chartsType === '饼图' && chartData.rows.length > 0" :data-empty="dataEmpty"
                :data="chartData"/>
        <Ve-histogram :height="'600px'" v-if="searchForm.chartsType === '柱状图' && chartData.rows.length > 0"
                      :data-empty="dataEmpty" :data="chartData"/>
      </div>
      <transition name="el-fade-in-linear">
        <div class="data_table" v-if="chartData.rows.length > 0">
        <el-table
            :data="tableData.rows"
            border
            stripe
            style="width: 100%">
          <el-table-column
              label="序号"
              align="center"
              width="50px">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column label="用户名">
            <template slot-scope="scope">
              {{scope.row.object}}
            </template>
          </el-table-column>
          <el-table-column label="数值">
            <template slot-scope="scope">
              {{scope.row.value}}
            </template>
          </el-table-column>

        </el-table>
      </div>
      </transition>
    </div>

  </div>
</template>

<script>
  export default {
    name: "dataAnalysis",
    components:{
      'VeLine': () => import('v-charts/lib/line.common'),
      'VePie': () => import('v-charts/lib/pie.common'),
      'VeHistogram': () => import('v-charts/lib/histogram.common')
    },
    data(){
      this.chartSettings = {
        radius: 200,
        offsetY: 350
      }

      return {
        loading: false,

        module: [], // 一级模块
        searchForm: {
          client: '',  // 客户筛选
          statisticType: '', // 统计类型
          conductor: '', // 售票员筛选

          date: '', // 日期
          month: '', // 月份

          biller: '', // 发单人

          ticket: '', // 创建人or出票员

          site: '', // 发站or到站

          ticketType: '', // 票种

          selectUser: '', // 用户列表

          chartsType: '饼图', // 图表类型

        },
        options: [{  // 一级模块搜索条件
          value: '订单',
          label: '订单',
          children: [{
            value: '客户',
            label: '客户',
          },{
            value: '售票员',
            label: '售票员',
          }]
        },{
          value: '订单提交时间',
          label: '订单提交时间',
          children: [{
            value: '每日',
            label: '每日'
          },{
            value: '每月',
            label: '每月'
          }]
        },{
          value: '发单人',
          label: '发单人',
        },{
          value: '车票',
          label: '车票',
          children: [{
            value: '创建人',
            label: '创建人',
          },{
            value: '出票员',
            label: '出票员',
          },{
            value: '发站',
            label: '发站',
          },{
            value: '到站',
            label: '到站',
          },{
            value: '乘车日期',
            label: '乘车日期',
            children: [{
              value: '每日',
              label: '每日'
            },{
              value: '每月',
              label: '每月'
            }]
          },{
            value: '票种',
            label: '票种',
          },{
            value: '出票时间',
            label: '出票时间',
            children: [{
              value: '每日',
              label: '每日'
            },{
              value: '每月',
              label: '每月'
            }]
          }]
        },{
          value: '用户',
          label: '用户',
        }],
        clientList: [], // 客户列表
        showClient: false, // 显示客户列表搜索框

        conductorList: [], // 售票员列表
        showConductor: false, // 显示售票员列表搜索框

        showDate: false, // 显示日期选择器
        showMonth: false, // 显示月份选择器
        showTimeType: 0, // true车票时间 false订单提交时间

        billerList: [],
        showBiller: false, // 显示发单人选择器

        showTicket: false, // 显示车票选择器
        showTicketType: false,  // true创建人 false出票员

        showSite: false, // 显示发站or到站输入框

        showTicketTypeInput: false, // 显示票种选择器

        showLogin: false, // 显示用户登录选择器

        tableData: [], // 图表数据

        // 图表数据组装
        chartData: {
          columns: [],
          rows: []
        },
        dataEmpty: false,
      }
    },
    watch:{
      module:{
        handler(val, oldVal){
          this.searchForm.client= ''  // 客户筛选
          this.searchForm.statisticType= '' // 统计类型
          this.searchForm.conductor= '' // 售票员筛选
          this.searchForm.date= '' // 日期
          this.searchForm.month= '' // 月份
          this.searchForm.biller= '' // 发单人
          this.searchForm.ticket= '' // 创建人or出票员
          this.searchForm.site= '' // 发站or到站
          this.searchForm.ticketType= '' // 票种
          this.searchForm.selectUser= '' // 用户列表
        },
        deep:true
      }
    },
    methods:{
      handleChange(val){
        if(val.length < 1){
          this.showClient = false // 显示客户列表搜索框
          this.showConductor = false // 显示售票员列表搜索框
          this.showDate = false // 显示日期选择器
          this.showMonth = false // 显示月份选择器
          this.showBiller = false // 显示发单人选择器
          this.showTicket = false // 显示车票选择器
          this.showTicketType = false  // true创建人 false出票员
          this.showSite = false // 显示发站or到站输入框
          this.showTicketTypeInput = false // 显示票种选择器
          this.showLogin = false // 显示用户登录选择器
          this.showTimeType = 0 // true车票时间 false订单提交时间

        }
        val.forEach((item, index) =>{
          if(index === 0){
            this.showTimeType = item === '车票' ? 0 :
                item === '订单提交时间' ? 1 : 3
          }
          this.showClient = item === '客户'
          this.showConductor = item === '售票员'
          this.showDate = item === '每日'
          this.showMonth = item === '每月'
          this.showBiller = item === '发单人'
          this.showTicket = item === '创建人' || item === '出票员'
          this.showTicketType = item === '创建人'? true : item === '出票员' ? false: false
          this.showSite = item === '发站' || item === '到站'
          this.showTicketTypeInput = item === '票种'
          this.showLogin = item === '用户'
        })

        /**
         * @Description: 获取客户列表
         * @author Wish
         * @date 2019/11/13
        */
        if(this.showClient){
          this.getClientList()
        }
        if(this.showConductor || this.showTicketType === false || this.showLogin){
          this.getConductorList()
        }
        if(this.showBiller){
          this.getBillerList()
        }
      },

      /**
       * @Description: 获取客户列表
       * @author Wish
       * @date 2019/11/13
      */
      getClientList(){
        this.$axios.get('/user/customer/showAll')
            .then(res =>{
              if(res.data.code === 0){
                this.clientList = res.data.result
              }else {
                this.$message.warning(res.data.msg + ' ，数据获取失败，请刷新重试')
              }
            })
      },

      /**
       * @Description: 获取售票员列表
       * @author Wish
       * @date 2019/11/13
      */
      getConductorList(){
        this.$axios.get('/user/showCompanyAccount/1')
            .then(res =>{
              if(res.data.code === 0){
                this.conductorList = res.data.result
              }else {
                this.$message.warning(res.data.msg + ' ，数据获取失败，请刷新重试')
              }
            })
      },

      /**
       * @Description: 获取发单人列表
       * @author Wish
       * @date 2019/11/13
      */
      getBillerList(){
        this.$axios.get('/user/issuer/showAll/1')
            .then(res =>{
              if(res.data.code === 0){
                this.billerList = res.data.result
                console.log(this.billerList);
              }else {
                this.$message.warning(res.data.msg + ' ，数据获取失败，请刷新重试')
              }
            })
      },

      /**
       * @Description: 提交搜索信息
       * @author Wish
       * @date 2019/11/13
      */
      submitSearch(){
        let mainCondition // 模块菜单类型
        let LevelType  // 子菜单类型
        let searchForm = {}  // 搜索内容
        this.module.forEach((item, index) =>{
          if(index === 0){
            // 获取模块搜索类型
            mainCondition = item === '订单' ? '0' :
                item === '订单提交时间' ? '1' :
                    item === '发单人' ? '2' :
                        item === '车票' ? '3' :
                            item === '用户' ? '4' : ''
          }else if(index === 1){
            // 获取一级搜索类型
            LevelType = item === '客户' ? 0 :
                item === '售票员' ? 1:
                    item === '每日' ? 0 :
                        item === '每月' ? 0 :
                            item === '创建人' ? 0 :
                                item === '出票员' ? 0 :
                                    item === '发站' ? 2 :
                                        item === '到站' ? 3 :
                                            item === '乘车日期' ? 4 :
                                                item === '票种' ? 5 :
                                                    item === '出票时间' ? 6 : ''
          }
          // 获取二级搜索类别
          if(item === '客户'){
            searchForm['sign'] = this.searchForm.client || '0'
          }else if(item === '售票员'){
            searchForm['sign'] = this.searchForm.conductor || '0'
          }else if(item === '每日'){
            searchForm['sign'] = this.$dateToMs(this.searchForm.date) / 1000 + ',d'
          }else if(item === '每月'){
            searchForm['sign'] = this.$dateToMs(this.searchForm.month) / 1000 + ',m'
          }else if(item === '发单人'){
            searchForm['sign'] = this.searchForm.biller || '0'
          }else if(item === '创建人' || item === '出票员'){
            searchForm['sign'] = this.searchForm.ticket || '0'
          }else if(item === '票种'){
            searchForm['sign'] = this.searchForm.ticketType
          }else if(item === '用户'){
            searchForm['sign'] = this.searchForm.selectUser
          }else if(item === '发站'){
            searchForm['sign'] = this.searchForm.site
          }else if(item === '到站'){
            searchForm['sign'] = this.searchForm.site
          }

          if(item === '发站' || item === '到站'|| item === '票种' || this.showTimeType === 0){
            searchForm['totalItem'] = 'totalTicket'
          }else {
            searchForm['totalItem'] = this.searchForm.statisticType || 'all'
          }
        })

        let data = {
          oneLevel: LevelType,
          info: JSON.stringify(searchForm)
        }
        console.log(this.module);
        if(this.module.length > 0){
          if(this.searchForm.statisticType){
            this.getChartsData(mainCondition,data)
          }else {
            this.$message.warning('请选择类型')
          }
        }else {
          this.$message.warning('请选择搜索条件')
        }



      },

      /**
       * @Description: 获取图表数据
       * @author Wish
       * @date 2019/11/13
      */
      getChartsData(type,data){
        console.log(this.searchForm.statisticType);
        this.loading = true
        this.$axios.post('/census/getData/'+type,data)
            .then(res =>{
              if(res.data.code === 0){
                console.log(res);

                this.$message.success('获取成功')
                this.tableData = res.data.result

                this.chartData = this.tableData
                this.chartData.rows.length?this.dataEmpty = !this.chartData.rows.length:''
                this.loading = false
              }else {
                this.$message.warning(res.data.msg)
                this.loading = false
              }
            }).catch(() =>{
          this.loading = false
        })
      },

    },
  }
</script>

<style scoped lang="less">
  .dataAnalysis{
    display: flex;
    flex-direction: column;
    padding: 20px 5%;
    .search_header{
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      >div{
        &:not(:last-child){
          margin-right: 10px;
        }
      }
    }
    .data_content{
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      .data_charts{
        width: 70%;
        height: 600px;
      }
      .data_table{
        width: 30%;
      }
    }
  }
</style>
