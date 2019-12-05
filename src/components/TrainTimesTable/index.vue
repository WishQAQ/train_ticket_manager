<template>
  <div class="">
    <el-table
        class="ticketPublicTable"
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
          show-overflow-tooltip
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
          show-overflow-tooltip
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
          show-overflow-tooltip
          width="160"
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
          show-overflow-tooltip
          width="80"
          prop="ticket_price"
          label="票价">
      </el-table-column>
      <el-table-column
          show-overflow-tooltip
          width="80"
          prop="missed_meals_money"
          label="误餐费">
      </el-table-column>
      <el-table-column
          v-if="tableRoleStatus['refund_fee']['show']"
          show-overflow-tooltip
          width="80"
          label="退票款">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="newDataForm[scope.row.tableIndex]['refund_fee']"
              v-if="tableModify === 'edit' && tableRoleStatus['refund_fee']['read']"
              :placeholder="scope.row['refund_fee']"
              @blur="loseFcous(tableData, scope.row, 'refund_fee', scope.row['refund_fee'],newDataForm[scope.row.tableIndex]['refund_fee'])">
          </el-input>
          <span style="margin-left: 10px" v-else>{{scope.row['refund_fee']}}</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="tableRoleStatus['ticket_fare']['show']"
          show-overflow-tooltip
          width="80"
          label="出票费">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="newDataForm[scope.row.tableIndex].ticket_fare"
              v-if="tableModify === 'edit' && tableRoleStatus['ticket_fare']['read']"
              :placeholder="scope.row.ticket_fare"
              @blur="loseFcous(tableData, scope.row, 'ticket_fare', scope.row.ticket_fare,newDataForm[scope.row.tableIndex].ticket_fare)">
          </el-input>
          <span style="margin-left: 10px" v-else>{{scope.row.ticket_fare}}</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="tableRoleStatus['ticket_status']['show']"
          show-overflow-tooltip
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
          v-if="tableRoleStatus['db_auftragsnummer']['show']"
          show-overflow-tooltip
          width="130"
          label="取票号">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="newDataForm[scope.row.tableIndex].db_auftragsnummer"
              v-if="tableModify === 'edit' && tableRoleStatus['db_auftragsnummer']['read']"
              :placeholder="scope.row.db_auftragsnummer"
              @blur="loseFcous(tableData, scope.row, 'db_auftragsnummer', scope.row.db_auftragsnummer,newDataForm[scope.row.tableIndex].db_auftragsnummer)">
          </el-input>
          <span v-else>{{$aliPayOrTelPhone(scope.row.db_auftragsnummer)}}</span>
        </template>
      </el-table-column>
      <el-table-column
          show-overflow-tooltip
          min-width="100"
          v-if="showTableRows"
          label="出票时间">
        <template slot-scope="scope">
          <div v-if="tableModify === 'edit'">
            <el-date-picker
                size="mini"
                class="editTimeInput"
                v-model="newDataForm[scope.row.tableIndex].ticketing_time"
                type="date"
                value-format="timestamp"
                :placeholder="$getTimeYear(scope.row.ticketing_time * 1000) !== 0? String($getTimeYear(scope.row.ticketing_time * 1000)): '' || '选择日期'"
                @blur="loseFcous(tableData, scope.row, 'ticketing_time', scope.row.ticketing_time,newDataForm[scope.row.tableIndex].ticketing_time / 1000)">
            </el-date-picker>
          </div>

          <span v-else>{{$getTimeYear(scope.row.ticketing_time * 1000) || ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
          show-overflow-tooltip
          v-if="tableRoleStatus['payment_account']['show']"
          v-show="showTableRows"
          label="支付账号">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="newDataForm[scope.row.tableIndex].payment_account"
              v-if="tableModify === 'edit' && tableRoleStatus['payment_account']['read']"
              :placeholder="scope.row.payment_account"
              @blur="loseFcous(tableData, scope.row, 'payment_account', scope.row.payment_account,newDataForm[scope.row.tableIndex].payment_account)">
          </el-input>
          <span v-else>{{$aliPayOrTelPhone(scope.row.payment_account)}}</span>
        </template>
      </el-table-column>
      <el-table-column
          show-overflow-tooltip
          v-if="tableRoleStatus['payment_flow_number']['show']"
          v-show="showTableRows"
          label="支付流水号">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="newDataForm[scope.row.tableIndex].payment_flow_number"
              :placeholder="scope.row.payment_flow_number"
              v-if="tableModify === 'edit' && tableRoleStatus['payment_flow_number']['read']"
              @blur="loseFcous(tableData, scope.row, 'payment_flow_number', scope.row.payment_flow_number,newDataForm[scope.row.tableIndex].payment_flow_number)">
          </el-input>
          <span v-else>{{scope.row.payment_flow_number}}</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="tableRoleStatus['12306_account']['show']"
          show-overflow-tooltip
          v-show="showTableRows"
          label="12306账号">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="newDataForm[scope.row.tableIndex].account"
              v-if="tableModify === 'edit' && tableRoleStatus['12306_account']['read']"
              :placeholder="scope.row.account"
              @blur="loseFcous(tableData, scope.row, 'account', scope.row.account,newDataForm[scope.row.tableIndex].account)">
          </el-input>
          <span v-else>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column
          show-overflow-tooltip
          v-if="tableRoleStatus['12306_account']['show']"
          v-show="showTableRows"
          label="12306密码">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="newDataForm[scope.row.tableIndex].password"
              v-if="tableModify === 'edit' && tableRoleStatus['12306_account']['read']"
              :placeholder="scope.row.password"
              @blur="loseFcous(tableData, scope.row, 'password', scope.row.password,newDataForm[scope.row.tableIndex].password)">
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
    props:{
      'tableData':{
        type: Array,
        default: () => []
      },
      'orderInfo':{
        type: Object,
        default: () => []
      },
      'showTableRows':{
        type: Boolean,
        default: () => false
      },
      'tableModify':{
        type: String,
        default: () => '',
      },
      'index': {
        type: Number,
        default: () => 0,
      },
      'cIndex': {
        type: Number,
        default: () => 0,
      },
      'tableRoleStatus': {
        type: Object,
        default: () => {}
      },
    },
    data(){
      return {
        completeData: [],
        userIdList: [],

        multipleSelection: [],

        newDataForm: [],// 单元格修改新数据
      }
    },
    // watch:{
    //   tableData(val, oVal){
    //     this.completeData = oVal
    //   },
    // },
    beforeMount() {
      this.dataReorganization()
      console.log(this.tableData);
    },
    methods: {
      /**
       * @Description: 数据处理
       * @author Wish
       * @date 2019/12/4
      */
      dataReorganization(){
        // this.completeData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData.forEach((item,index) =>{
          this.tableData[index]['tableIndex'] = index
          this.newDataForm.push({
            refund_fee: '',  // 退票款
            ticket_fare: '', // 出票费
            db_auftragsnummer: '', // 取票号
            ticketing_time: '', // 出票时间
            payment_account: '', // 支付账号
            payment_flow_number: '', // 支付流水号
            account: '', // 12306账号
            password: '', // 12306密码
          })
        })
      },
      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/17
       */
      tableSelect(v,r){
        let userId = [];
        userId = v.map(res =>{
          return res.id;
        });
        let userRoute = [];
        userRoute = v.map(res =>{
          return res.route;
        });
        userRoute = Array.from([...new Set(userRoute)]);

        this.$emit('checkTableData', userId, userRoute, this.index, this.cIndex, this.orderInfo.order_sn, this.orderInfo.parent_id);
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
      loseFcous(orderData, data, rowName, row, newRow) {
        console.log(rowName,newRow);
        if(rowName === 'ticketing_time'){
          newRow = String(newRow) === '0'? '': newRow
        }
        if(row !== newRow && newRow !== ''){
          console.log(newRow);
          this.$emit('tableRowsData', this.orderInfo, data, rowName, newRow )
        }
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

<style scoped lang="less">
  /deep/.ticketPublicTable{
    .editTimeInput{
      width: 100px;
      .el-input__inner{
        padding-right: unset;
        padding-left: 28px !important;
      }
    }
    .el-input{
      .el-input__inner{
        padding-left: 5px;
        padding-right: unset;
        &::placeholder{
          color: #000;
        }
      }
    }
  }
</style>
