<template>
  <div class="statistics">
    <div class="search_header">
      <div>
        <el-cascader
            clearable
            @change="totalSelectData(totalSelect)"
            placeholder="请选择搜索条件"
            :options="totalOptions"
            v-model="totalSelect">
        </el-cascader>
      </div>

<!--   客户商   -->
      <div v-if="totalSelect[0] === 0">
        <el-cascader
            clearable
            placeholder="请选择搜索条件"
            @change="getSelectData(orderCustomer)"
            :options="customerOptions"
            v-model="orderCustomer">
<!--          <el-option-->
<!--              v-for="item in customerOptions"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--          </el-option>-->
        </el-cascader>
      </div>

<!--   发单人   -->
      <div v-if="totalSelect[0] === 1">
        <el-select
            clearable
            placeholder="请选择搜索条件"
            v-model="singleSelect">
          <el-option
              v-for="item in singleOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>

<!-- 创建人 -->
      <div v-if="totalSelect[0] === 2">
        <el-select
            clearable
            placeholder="请选择搜索条件"
            v-model="creatorSelect">
          <el-option
              v-for="item in creatorOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>

<!-- 出票员 -->
      <div v-if="totalSelect[0] === 3">
        <el-select
            clearable
            placeholder="请选择搜索条件"
            v-model="issuerSelect">
          <el-option
              v-for="item in issuerOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>

<!-- 车票 -->
      <div v-if="totalSelect[0] === 4">
        <el-select
            clearable
            placeholder="请选择搜索条件"
            v-model="ticketSelect">
          <el-option
              v-for="item in ticketOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>

<!-- 用户 -->
      <div v-if="totalSelect[0] === 5">
        <el-select
            clearable
            placeholder="请选择搜索条件"
            v-model="userSelect">
          <el-option
              v-for="item in userOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>


      <div v-if="showDate">
        <el-date-picker
            v-model="date"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
        </el-date-picker>
      </div>
      <div v-if="showMonth">
        <el-date-picker
            v-model="month"
            type="month"
            format="yyyy 年 MM 月"
            value-format="yyyy-MM"
            placeholder="选择月份">
        </el-date-picker>
      </div>

      <div>
        <el-select
            clearable
            placeholder="请选择统计图形"
            v-model="chartsType">
          <el-option label="饼图" value="0"/>
          <el-option label="折线图" value="1"/>
          <el-option label="柱状图" value="2"/>
        </el-select>
      </div>


      <div>
        <el-button @click="beginStatistics" :loading="loading" :disabled="loading">统计</el-button>
      </div>

    </div>

    <div class="data_content">
      <div class="data_charts">
        <Ve-pie :settings="chartSettings" :height="'800px'" v-if="chartsType === '0' && chartData.rows.length > 0"
        :data-empty="dataEmpty" :data="chartData"/>
        <ve-line :settings="chartSettings" :height="'800px'" v-if="chartsType === '1' && chartData.rows.length > 0"
                 :data-empty="dataEmpty" :data="chartData"/>
        <Ve-histogram :settings="chartSettings" :height="'800px'" v-if="chartsType === '2' && chartData.rows.length > 0"
                      :data-empty="dataEmpty" :data="chartData"/>
      </div>
      <transition name="el-fade-in-linear">
        <div class="data_table" v-if="tableData.length > 0">
          <el-table
              :data="tableData"
              border
              stripe
              style="width: 100%">
            <el-table-column
                label="序号"
                align="center"
                width="50px">
              <template slot-scope="scope">
                {{scope.row.object !== '总和' ?scope.$index+1: ''}}
              </template>
            </el-table-column>
            <el-table-column label="项目">
              <template slot-scope="scope">
                {{scope.row.object}}
              </template>
            </el-table-column>
            <el-table-column label="数值">
              <template slot-scope="scope">
                {{scope.row.value}}
              </template>
            </el-table-column>
            <el-table-column label="比例">
              <template slot-scope="scope">
                {{scope.row.percentage}}
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
    name: "statistics",
    components:{
      'VeLine': () => import('v-charts/lib/line.common'),
      'VePie': () => import('v-charts/lib/pie.common'),
      'VeHistogram': () => import('v-charts/lib/histogram.common')
    },
    watch:{
      totalSelect:function(val,oVal){
        this.showDate = val[1] === 1
        this.showMonth = val[1] === 2
        if(String(val) !== String(oVal)){
          this.date = ''
          this.month = ''
          this.orderCustomer = ''
          this.singleSelect = ''
          this.creatorSelect = ''
          this.issuerSelect = ''
          this.ticketSelect = ''
          this.userSelect = ''
        }
      }
    },
    data(){
      return {
        chartSettings: {  // v-charts配置
          aria: {
            show: true
          },
          radius: 200,
          offsetY: 400,
          toolbox: {
            show: false
          },
        },

        loading: false,  // 加载

        tableData: [], // 表格数据

        sun: 0, // 总和

        date: '', // 天
        showDate: false, //
        month: '', // 月
        showMonth: false,

        chartsType: '', // v-charts类型
        chartData: {
          columns: ['object','value'],
          rows: []
        }, // v-charts 数据
        dataEmpty: false,

        totalSelect: '', // 总搜索条件
        totalOptions: [{
          value: 0,
          label: '客户商',
        },{
          value: 1,
          label: '发单人',
          children: [{
            value: 0,
            label: '全部时间'
          },{
            value: 1,
            label: '按天'
          },{
            value: 2,
            label: '按月'
          }],
        },{
          value: 2,
          label: '创建人',
          children: [{
            value: 0,
            label: '全部时间'
          },{
            value: 1,
            label: '按天'
          },{
            value: 2,
            label: '按月'
          }],
        },{
          value: 3,
          label: '出票员',
          children: [{
            value: 0,
            label: '全部时间'
          },{
            value: 1,
            label: '按天'
          },{
            value: 2,
            label: '按月'
          }],
        },{
          value: 4,
          label: '车票'
        },{
          value: 5,
          label: '用户',
          children: [{
            value: 0,
            label: '全部时间'
          },{
            value: 1,
            label: '按天'
          },{
            value: 2,
            label: '按月'
          }],
        }],

        orderCustomer: '', //  客户商
        customerOptions: [{
          value: 1,
          label: '总张数',
          children: [{
            value: 0,
            label: '全部时间'
          },{
            value: 1,
            label: '按天'
          },{
            value: 2,
            label: '按月'
          }],
        },{
          value: 2,
          label: '总餐费',
          children: [{
            value: 0,
            label: '全部时间'
          },{
            value: 1,
            label: '按天'
          },{
            value: 2,
            label: '按月'
          }],
        },{
          value: 3,
          label: '利润',
        },{
          value: 4,
          label: '债途',
        },{
          value: 5,
          label: '总退票',
        },{
          value: 6,
          label: '总优惠',
        }],

        singleSelect: '',  // 发单人
        singleOption: [{
          value: 1,
          label: '总张数'
        },{
          value: 2,
          label: '总餐费'
        },{
          value: 3,
          label: '利润',
        },{
          value: 4,
          label: '债途',
        },{
          value: 5,
          label: '总退票',
        },{
          value: 6,
          label: '总优惠',
        }],

        creatorSelect: '', // 创建人
        creatorOption: [{
          value: 1,
          label: '总张数',
        },{
          value: 2,
          label: '订单总条数',
        }],

        issuerSelect: '', // 出票员
        issuerOption: [{
          value: 1,
          label: '车票张数',
        },{
          value: 2,
          label: '票价',
        },{
          value: 3,
          label: '误餐费',
        },{
          value: 4,
          label: '退票款',
        },{
          value: 5,
          label: '出票费',
        }],

        ticketSelect: '', // 所有车票
        ticketOption: [{
          value: 1,
          label: '发站'
        },{
          value: 2,
          label: '到站'
        },{
          value: 3,
          label: '乘车日期'
        },{
          value: 4,
          label: '票种'
        },{
          value: 5,
          label: '出票时间'
        }],

        userSelect: '', // 用户
        userOption: [{
          value: 1,
          label: '登录次数'
        },{
          value: 2,
          label: '登录时长(小时)'
        }],


      }
    },
    methods:{
      /**
       * @Description: 总选择器
       * @author Wish
       * @date 2020/1/14
      */
      totalSelectData(val){
        // console.log(val);
      },
      /**
       * @Description: 计算总和
       * @author Wish
       * @date 2020/1/14
      */
      sum(data){
        this.sun = 0
        data.map(item =>{
          this.sun += parseFloat(item.count)
        })
      },

      /**
       * @Description: 客户商联级选择器
       * @author Wish
       * @date 2020/1/14
      */
      getSelectData(val){
        this.date = ''
        this.month = ''
        this.showDate = val[1] === 1
        this.showMonth = val[1] === 2
      },

      /**
       * @Description: 统计按钮
       * @author Wish
       * @date 2020/1/14
      */
      beginStatistics(){
        this.loading = this.totalSelect[0]

        this.chartData.rows = []
        let data
        if(this.totalSelect[0] === 0){  // 客户商统计
          data ={
            type: this.orderCustomer.length > 1? this.orderCustomer[0] : this.orderCustomer.toString(),
            time_type: this.showDate? 1: this.showMonth? 2: 0,
            time_string: this.date || this.month || '',
          }
          this.getCustomer(data)
        }else if(this.totalSelect[0] === 1){  // 发单人统计
          data = {
            type: this.singleSelect.toString(),
            time_type: this.showDate? 1: this.showMonth? 2: 0,
            time_string: this.date || this.month || ''
          }
          this.getSingle(data)
        }else if(this.totalSelect[0] === 2){  // 创建人
          data = {
            type: this.creatorSelect.toString(),
            time_type: this.showDate? 1: this.showMonth? 2: 0,
            time_string: this.date || this.month || ''
          }
          this.getCreator(data)
        }else if(this.totalSelect[0] === 3){  // 出票员
          data = {
            type: this.issuerSelect.toString(),
            time_type: this.showDate? 1: this.showMonth? 2: 0,
            time_string: this.date || this.month || ''
          }
          this.getTicketIssuer(data)
        }else if(this.totalSelect[0] === 4){  // 车票
          data = {
            type: this.ticketSelect.toString(),
            time_type: this.showDate? 1: this.showMonth? 2: 0,
            time_string: this.date || this.month || ''
          }
          this.getTicket(data)
        }
        else if(this.totalSelect[0] === 5){  // 车票
          data = {
            type: this.userSelect.toString(),
            time_type: this.showDate? 1: this.showMonth? 2: 0,
            time_string: this.date || this.month || ''
          }
          this.getUser(data)
        }
      },

      /**
       * @Description: 出票员统计
       * @author Wish
       * @date 2020/1/14
       */
      getTicketIssuer(data){
        this.$axios.post('/census/selectTicket',data)
            .then(res =>{
              if(res.status === 200){
                this.loading = false
                let data = res.data
                this.sum(data)
                data.forEach(item =>{
                  this.chartData.rows.push({
                    value: item.count,
                    object: item.name,
                    percentage: this.$percentage(item.count,this.sun)
                  })
                })
                this.tableData = JSON.parse(JSON.stringify(this.chartData.rows))
                this.tableData.push({
                  value: this.sun,
                  object: '总和',
                  percentage: ''
                })
              }
            })
      },

      /**
       * @Description: 用户统计
       * @author Wish
       * @date 2020/1/14
       */
      getUser(data){
        this.$axios.post('/census/selectUser',data)
            .then(res =>{
              if(res.status === 200){
                this.loading = false
                let data = res.data
                this.sum(data)
                data.forEach(item =>{
                  this.chartData.rows.push({
                    value: item.count,
                    object: item.name,
                    percentage: this.$percentage(item.count,this.sun)
                  })
                })
                this.tableData = JSON.parse(JSON.stringify(this.chartData.rows))
                this.tableData.push({
                  value: this.sun,
                  object: '总和',
                  percentage: ''
                })
              }
            })
      },

      /**
       * @Description: 车票统计
       * @author Wish
       * @date 2020/1/14
       */
      getTicket(data){
        this.$axios.post('/census/selectAllTicket',data)
            .then(res =>{
              if(res.status === 200){
                this.loading = false
                let data = res.data
                this.sum(data)
                data.forEach(item =>{
                  this.chartData.rows.push({
                    value: item.count,
                    object: item.name,
                    percentage: this.$percentage(item.count,this.sun)
                  })
                })
                this.tableData = JSON.parse(JSON.stringify(this.chartData.rows))
                this.tableData.push({
                  value: this.sun,
                  object: '总和',
                  percentage: ''
                })
              }
            })
      },

      /**
       * @Description: 客户商统计
       * @author Wish
       * @date 2020/1/14
       */
      getCustomer(data){
        this.$axios.post('/census/selectCustomer',data)
            .then(res =>{
              if(res.status === 200){
                this.loading = false
                let data = res.data
                this.sum(data)
                data.forEach(item =>{
                  this.chartData.rows.push({
                    value: item.count,
                    object: item.name,
                    percentage: this.$percentage(item.count,this.sun)
                  })
                })
                this.tableData = JSON.parse(JSON.stringify(this.chartData.rows))
                this.tableData.push({
                  value: this.sun,
                  object: '总和',
                  percentage: ''
                })
              }
            })
      },

      /**
       * @Description: 发单人统计
       * @author Wish
       * @date 2020/1/14
       */
      getSingle(data){
        this.$axios.post('/census/selectSingle',data)
            .then(res =>{
              if(res.status === 200){
                this.loading = false
                let data = res.data
                this.sum(data)
                data.forEach(item =>{
                  this.chartData.rows.push({
                    value: item.count,
                    object: item.name,
                    percentage: this.$percentage(item.count,this.sun)
                  })
                })
                this.tableData = JSON.parse(JSON.stringify(this.chartData.rows))
                this.tableData.push({
                  value: this.sun,
                  object: '总和',
                  percentage: ''
                })
              }
            })
      },

      /**
       * @Description: 创建人统计
       * @author Wish
       * @date 2020/1/14
       */
      getCreator(data){
        this.$axios.post('/census/selectCreator',data)
            .then(res =>{
              if(res.status === 200){
                this.loading = false
                let data = res.data
                this.sum(data)
                data.forEach(item =>{
                  this.chartData.rows.push({
                    value: item.count,
                    object: item.name,
                    percentage: this.$percentage(item.count,this.sun)
                  })
                })
                this.tableData = JSON.parse(JSON.stringify(this.chartData.rows))
                this.tableData.push({
                  value: this.sun,
                  object: '总和',
                  percentage: ''
                })
              }
            })
      },


    },
    created() {

    }
  }
</script>

<style scoped lang="less">
  .statistics{
    padding: 20px 5%;
    .search_header{
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      >div:not(:last-child){
        margin-right: 10px;
      }
    }
    .data_content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      .data_charts {
        width: 65%;
        height: 600px;
      }
      .data_table{
        width: 35%;
        flex-shrink: 0;
      }
    }
  }
</style>
