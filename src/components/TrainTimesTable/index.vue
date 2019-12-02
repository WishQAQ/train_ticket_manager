<template>
  <div class="">
    <el-table
        @select="tableSelect"
        @select-all="tableSelect"
        :data="tableData"
        ref="multipleTable"
        border
        style="width: 100%">
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
<!--      <el-table-column-->
<!--          width="50"-->
<!--          label="合并">-->
<!--        <template slot-scope="scope">-->
<!--          {{scope.row.is_merge === 0 ? '是' : '否'}}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
          min-width="280"
          align="center"
          label="乘客信息+票种">
        <template slot-scope="scope">
          <div>
            <div>
              <span>{{scope.row.name}}</span>
              <span style="margin: 0 10px">{{scope.row.IDCard}}</span>
              <span v-if="scope.row.ticket_species !== 0">{{scope.row.ticket_species === 0 ? '成人票': '儿童票'}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          width="65"
          label="票类">
        <template slot-scope="scope">
          {{scope.row.ticket_type === 0?'电子票':
          scope.row.ticket_type === 1?'网票':
          scope.row.ticket_type === 2?'纸票':scope.row.ticket_type}}
<!--          <el-select-->
<!--              v-model="scope.row.ticket_type === 0?'电子票':-->
<!--                       scope.row.ticket_type === 1?'网票':-->
<!--                       scope.row.ticket_type === 2?'纸票':scope.row.ticket_type"-->
<!--              placeholder="请选择">-->
<!--            <el-option label="电子票" value="0"></el-option>-->
<!--            <el-option label="网票" value="1"></el-option>-->
<!--            <el-option label="纸票" value="2"></el-option>-->
<!--          </el-select>-->
        </template>
      </el-table-column>
      <el-table-column
          width="100"
          label="席别/席位号">
        <template slot-scope="scope">
          <div>
            {{scope.row.fwName}}
            {{scope.row.seat_number?' / ':''}}
            {{scope.row.seat_number || ''}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
          width="80"
          prop="ticket_price"
          label="票价">
      </el-table-column>
      <el-table-column
          width="80"
          prop="missed_meals_money"
          label="误餐费">
      </el-table-column>
      <el-table-column
          width="80"
          label="退票款">
        <template slot-scope="scope">
          <el-input
              v-model="scope.row.refund_fee"
              v-if="tableModify === 'edit'"
              @blur="loseFcous(tableData, scope.row, 'refund_fee', scope.row.refund_fee)">
          </el-input>
          <span style="margin-left: 10px" v-else>{{scope.row.refund_fee}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="80"
          label="出票费">
        <template slot-scope="scope">
          <el-input
              v-model="scope.row.ticket_fare"
              v-if="tableModify === 'edit'"
              @blur="loseFcous(tableData, scope.row, 'ticket_fare', scope.row.ticket_fare)">
          </el-input>
          <span style="margin-left: 10px" v-else>{{scope.row.ticket_fare}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="80"
          label="车票状态">
        <template slot-scope="scope">
          <span v-if="scope.row.ticket_status === 0" style="color: red">未出票</span>
          <span v-if="scope.row.ticket_status === 1" style="color: green">已出票</span>
          <span v-if="scope.row.ticket_status === 2" style="color: gray">已取消票</span>
          <span v-if="scope.row.ticket_status === 3" style="color: blue">已改签</span>
          <span v-if="scope.row.ticket_status === 4" style="color: #000">已退票</span>
        </template>
      </el-table-column>
      <el-table-column
          width="100"
          prop="db_auftragsnummer"
          label="取票号">
      </el-table-column>
      <el-table-column
          min-width="150"
          v-if="showTableRows"
          label="出票时间">
        <template slot-scope="scope">
          <div v-if="tableModify === 'edit'">
            <el-date-picker
                style="width: 140px"
                v-model="scope.row.ticketing_time * 1000"
                type="date"
                value-format="timestamp"
                @blur="loseFcous(tableData, scope.row, 'ticketing_time', scope.row.ticketing_time)"
                placeholder="选择日期">
            </el-date-picker>
          </div>

          <span v-else>{{$getTimeYear(scope.row.ticketing_time * 1000) || ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="showTableRows"
          label="支付账号">
        <template slot-scope="scope">
          <el-input
              v-model="scope.row.payment_account"
              v-if="tableModify === 'edit'"
              @blur="loseFcous(tableData, scope.row, 'payment_account', scope.row.payment_account)">
          </el-input>
          <span v-else>{{$aliPayOrTelPhone(scope.row.payment_account)}}</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="showTableRows"
          label="支付流水号">
        <template slot-scope="scope">
          <el-input
              v-model="scope.row.payment_flow_number"
              v-if="tableModify === 'edit'"
              @blur="loseFcous(tableData, scope.row, 'payment_flow_number', scope.row.payment_flow_number)">
          </el-input>
          <span v-else>{{scope.row.payment_flow_number}}</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="showTableRows"
          label="12306账号">
        <template slot-scope="scope">
          <el-input
              v-model="scope.row.account"
              v-if="tableModify === 'edit'"
              @blur="loseFcous(tableData, scope.row, 'account', scope.row.account)">
          </el-input>
          <span v-else>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="showTableRows"
          label="12306密码">
        <template slot-scope="scope">
          <el-input
              v-model="scope.row.password"
              v-if="tableModify === 'edit'"
              @blur="loseFcous(tableData, scope.row, 'password', scope.row.password)">
          </el-input>
          <span v-else>{{scope.row.password}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="80"
          fixed="right"
          v-if="tableModify === 'details'"
          label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini" :disabled="scope.row.ticket_status === 2 || scope.row.ticket_status === 4">操作</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button size="mini" type="text" @click="jumpPayTicket(scope.row,scope.$index)" v-if="scope.row.ticket_status === 0">购票</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" @click="jumpEditTicket(scope.row,'refund')" v-if="scope.row.ticket_status === 1 || scope.row.ticket_status === 3">退票</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" @click="jumpEditTicket(scope.row,'change')" v-if="scope.row.ticket_status === 1">改签</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['tableData','orderInfo','showTableRows','tableModify','index','cIndex'],
    data(){
      return {
        userIdList: [],

        multipleSelection: [],
      }
    },
    methods: {
      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/17
       */
      tableSelect(v,r){
        let userId = []
        userId = v.map(res =>{
          return res.id;
        });
        let userRoute = []
        userRoute = v.map(res =>{
          return res.route;
        });
        userRoute = Array.from([...new Set(userRoute)])

        this.$emit('checkTableData', userId, userRoute, this.index, this.cIndex, this.orderInfo.order_sn, this.orderInfo.parent_id)
      },

      /**
       * @Description: 清除选择框
       * @author Wish
       * @date 2019/11/18
      */
      toggleSelection(){
        if(this.closedSelect){
          this.$refs.multipleTable.clearSelection();
        }
      },

      /**
       * @Description: 单元格修改
       * @author Wish
       * @date 2019/11/18
      */
      loseFcous(orderData, data, rowName, row) {
        // if(data[rowName] !== row){
          this.$emit('tableRowsData', this.orderInfo, data, rowName, row )
        // }
      },

      /**
       * @Description: 跳转12306购票网站
       * @author Wish
       * @date 2019/11/18
      */
      jumpPayTicket(val){
        this.$emit('jumpPayTicket',val,this.orderInfo)
      },

      /**
       * @Description: 跳转12306退票or改签
       * @author Wish
       * @date 2019/11/21
      */
      jumpEditTicket(val,type){
        this.$emit('jumpEditTicket',val,this.orderInfo,type)
      },
    },
  }
</script>

<style scoped>

</style>
