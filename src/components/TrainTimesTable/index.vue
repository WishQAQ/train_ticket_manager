<template>
  <div class="">
    <el-table
        @select="tableSelect"
        @select-all="tableSelect"
        :data="tableData"
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
      <el-table-column
          width="65px"
          label="合并">
        <template slot-scope="scope">
          {{scope.row.is_merge === 0 ? '已合并' : '未合并'}}
        </template>
      </el-table-column>
      <el-table-column
          width="240px"
          align="center"
          label="乘客信息+票种">
        <template slot-scope="scope">
          <div><span style="margin-right: 10px">{{scope.row.name}}</span><span>{{scope.row.IDCard}}</span></div>
          <div>{{scope.row.ticket_species === 0 ? '成人票': '儿童票'}}</div>
        </template>
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
          prop="fwName"
          label="席别/席位号">
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
          label="出票费">
      </el-table-column>
      <el-table-column
          label="车票状态">
        <template slot-scope="scope">
          {{scope.row.ticket_status === 0?'未出票':
          scope.row.ticket_status === 1?'已出票':
          scope.row.ticket_status === 2?'已取消票':
          scope.row.ticket_status === 3?'已改签':
          scope.row.ticket_status === 4?'已退票':''}}
        </template>
      </el-table-column>
      <el-table-column
          prop="ticket_drawer"
          label="取票号">
      </el-table-column>
      <el-table-column
          prop="db_auftragsnummer"
          label="出票时间">
      </el-table-column>
      <el-table-column
          label="支付账号">
        <template slot-scope="scope">
          {{$aliPayOrTelPhone(scope.row.payment_account)}}
        </template>
      </el-table-column>
      <el-table-column
          prop="payment_flow_number"
          label="支付流水号">
      </el-table-column>
      <el-table-column
          prop="12306_account"
          label="12306账号">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['tableData'],
    methods: {
      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/17
       */
      tableSelect(v,r){
        // this.selectPassengerList = v.map(res =>{
        //   return res.id;
        // });
        this.$emit('checkTableData',v)
      },
    }
  }
</script>

<style scoped>

</style>