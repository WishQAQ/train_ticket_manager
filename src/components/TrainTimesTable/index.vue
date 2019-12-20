<template>
  <div class="">
    <el-table
        stripe
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
          label="序"
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
          min-width="287"
          align="center"
          label="乘客信息+票种">
        <template slot-scope="scope">
          <div class="user_message">
            <div>
              <el-input
                  style="width: 70px"
                  size="mini"
                  v-model="dbTableData[scope.row.tableIndex].name"
                  v-if="tableModify === 'edit'"
                  :placeholder="scope.row.name"
                  @blur="loseUserFcous(tableData, scope.row, 'name', scope.row.name,dbTableData[scope.row.tableIndex].name,scope.row.tableIndex)">
              </el-input>
              <span v-else>{{scope.row.name}}</span>
            </div>
            <div>
              <el-input
                  style="width: 135px"
                  size="mini"
                  v-model="dbTableData[scope.row.tableIndex].IDCard"
                  v-if="tableModify === 'edit'"
                  :placeholder="scope.row.IDCard"
                  @blur="loseUserFcous(tableData, scope.row, 'IDCard', scope.row.IDCard,dbTableData[scope.row.tableIndex].IDCard,scope.row.tableIndex)">
              </el-input>
              <span style="margin: 0 10px" v-else>{{scope.row.IDCard}}</span>
            </div>
            <div>
              <el-select size="mini"
                         @input="change($event)"
                         @change="loseUserFcous(tableData, scope.row, 'ticket_species', scope.row.ticket_species,dbTableData[scope.row.tableIndex].ticket_species,scope.row.tableIndex)"
                         style="width: 68px"
                         v-model="dbTableData[scope.row.tableIndex].ticket_species"
                         :placeholder="scope.row.ticket_species"
                         v-if="tableModify === 'edit'">
                <el-option label="成人票" value="成人票"/>
                <el-option label="儿童票" value="儿童票"/>
              </el-select>
              <span v-else>{{scope.row.ticket_species}}</span>
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
          v-if="tableRoleStatus.refund_fee.show"
          show-overflow-tooltip
          width="80"
          label="退票款">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="dbTableData[scope.row.tableIndex].refund_fee"
              v-if="tableModify === 'edit' && tableRoleStatus.refund_fee.read"
              :placeholder="scope.row.refund_fee"
              @blur="loseFcous(tableData, scope.row, 'refund_fee', scope.row.refund_fee,dbTableData[scope.row.tableIndex].refund_fee,scope.row.tableIndex)">
          </el-input>
          <span style="margin-left: 10px" v-else>{{scope.row.refund_fee}}</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="tableRoleStatus.ticket_fare.show"
          show-overflow-tooltip
          width="80"
          label="出票费">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="dbTableData[scope.row.tableIndex].ticket_fare"
              v-if="tableModify === 'edit' && tableRoleStatus.ticket_fare.read"
              :placeholder="scope.row.ticket_fare"
              @blur="loseFcous(tableData, scope.row, 'ticket_fare', scope.row.ticket_fare,dbTableData[scope.row.tableIndex].ticket_fare,scope.row.tableIndex)">
          </el-input>
          <span style="margin-left: 10px" v-else>{{scope.row.ticket_fare}}</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="tableRoleStatus.ticket_status.show"
          show-overflow-tooltip
          width="70"
          label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.ticket_status === 0" style="color: red">未出票</span>
          <span v-if="scope.row.ticket_status === 1" style="color: green">已出票</span>
          <span v-if="scope.row.ticket_status === 2" style="color: gray">已取消票</span>
          <span v-if="scope.row.ticket_status === 3" style="color: blue">已改签</span>
          <span v-if="scope.row.ticket_status === 4" style="color: #000">已退票</span>
        </template>
      </el-table-column>
      <el-table-column
          v-if="tableRoleStatus.db_auftragsnummer.show"
          show-overflow-tooltip
          width="130"
          label="取票号">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="dbTableData[scope.row.tableIndex].db_auftragsnummer"
              v-if="tableModify === 'edit' && tableRoleStatus.db_auftragsnummer.read"
              :placeholder="scope.row.db_auftragsnummer"
              @blur="loseFcous(tableData, scope.row, 'db_auftragsnummer', scope.row.db_auftragsnummer,dbTableData[scope.row.tableIndex].db_auftragsnummer,scope.row.tableIndex)">
          </el-input>
          <span v-else>{{$aliPayOrTelPhone(scope.row.db_auftragsnummer)}}</span>
        </template>
      </el-table-column>
      <el-table-column
          show-overflow-tooltip
          width="122"
          v-if="showTableRows"
          label="出票时间">
        <template slot-scope="scope">
          <!--          <div v-if="tableModify === 'edit'">-->
          <!--            <el-date-picker-->
          <!--                size="mini"-->
          <!--                class="editTimeInput"-->
          <!--                v-model="dbTableData[scope.row.tableIndex].ticketing_time"-->
          <!--                type="date"-->
          <!--                value-format="timestamp"-->
          <!--                :placeholder="$getTimeYear(scope.row.ticketing_time * 1000) !== 0? String($getTimeYear(scope.row.ticketing_time * 1000)): '' || '选择日期'"-->
          <!--                @blur="loseFcous(tableData, scope.row, 'ticketing_time', scope.row.ticketing_time,dbTableData[scope.row.tableIndex].ticketing_time / 1000,scope.row.tableIndex)">-->
          <!--            </el-date-picker>-->
          <!--          </div>-->

          <span>{{$getTimeYear(scope.row.ticketing_time * 1000) || ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="130"
          show-overflow-tooltip
          v-if="tableRoleStatus.payment_account.show && showTableRows"
          label="支付账号">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="dbTableData[scope.row.tableIndex].payment_account"
              v-if="tableModify === 'edit' && tableRoleStatus.payment_account.read"
              :placeholder="scope.row.payment_account"
              @blur="loseFcous(tableData, scope.row, 'payment_account', scope.row.payment_account,dbTableData[scope.row.tableIndex].payment_account,scope.row.tableIndex)">
          </el-input>
          <span v-else>{{$aliPayOrTelPhone(scope.row.payment_account)}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="130"
          show-overflow-tooltip
          v-if="tableRoleStatus.payment_flow_number.show && showTableRows"
          label="支付流水">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="dbTableData[scope.row.tableIndex].payment_flow_number"
              :placeholder="scope.row.payment_flow_number"
              v-if="tableModify === 'edit' && tableRoleStatus.payment_flow_number.read"
              @blur="loseFcous(tableData, scope.row, 'payment_flow_number', scope.row.payment_flow_number,dbTableData[scope.row.tableIndex].payment_flow_number,scope.row.tableIndex)">
          </el-input>
          <span v-else>{{scope.row.payment_flow_number}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="130"
          v-if="tableRoleStatus['12306_account'].show && showTableRows"
          show-overflow-tooltip
          label="1230账号">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="dbTableData[scope.row.tableIndex].account"
              v-if="tableModify === 'edit' && tableRoleStatus['12306_account'].read"
              :placeholder="scope.row.account"
              @blur="loseFcous(tableData, scope.row, 'account', scope.row.account,dbTableData[scope.row.tableIndex].account,scope.row.tableIndex)">
          </el-input>
          <span v-else>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="130"
          show-overflow-tooltip
          v-if="tableRoleStatus['12306_account'].show && showTableRows"
          label="1230密码">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="dbTableData[scope.row.tableIndex].password"
              v-if="tableModify === 'edit' && tableRoleStatus['12306_account'].read"
              :placeholder="scope.row.password"
              @blur="loseFcous(tableData, scope.row, 'password', scope.row.password,dbTableData[scope.row.tableIndex].password,scope.row.tableIndex)">
          </el-input>
          <span v-else>{{scope.row.password}}</span>
        </template>
      </el-table-column>
      <el-table-column
          show-overflow-tooltip
          width="80"
          label="乘客备注">
        <template slot-scope="scope">
          <el-input
              size="mini"
              v-model="dbTableData[scope.row.tableIndex].remarks"
              v-if="tableModify === 'edit'"
              :placeholder="scope.row.remarks"
              @blur="loseFcous(tableData, scope.row, 'remarks', scope.row.remarks,dbTableData[scope.row.tableIndex].remarks,scope.row.tableIndex)">
          </el-input>
          <span v-else>{{scope.row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="80"
          fixed="right"
          v-if="tableModify !== 'add' && roleType === 0"
          label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini">操作</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button size="mini" type="text" @click="jumpPayTicket(scope.row,scope.$index)" v-if="scope.row.ticket_status === 0 || scope.row.ticket_status === 3 || scope.row.ticket_status === 4">购票</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" @click="jumpEditTicket(scope.row,'refund')" v-if="scope.row.ticket_status === 1 || scope.row.ticket_status === 3">退票</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" @click="jumpEditTicket(scope.row,'change')" v-if="scope.row.ticket_status === 1 || scope.row.ticket_status === 4">改签</el-button></el-dropdown-item>
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
      'dbTableData': {
        type: Array,
        default: () => []
      }
    },
    data(){
      return {
        roleType: parseInt(sessionStorage.getItem('TYPE')),

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
    mounted() {
      this.dataReorganization()
      // console.log(this.tableData);
      // console.log(this.tableRoleStatus);
    },
    methods: {
      change(e){
        this.$forceUpdate()
      },

      /**
       * @Description: 数据处理
       * @author Wish
       * @date 2019/12/4
       */
      dataReorganization(){
        // this.completeData = JSON.parse(JSON.stringify(this.tableData))
        // console.log(this.dbTableData);
        // console.log(this.tableData);
        this.tableData.forEach((item,index) =>{
          item.ticket_species = item.ticket_species === 0 ? '成人票': item.ticket_species === 1 ? '儿童票' : item.ticket_species
          this.tableData[index]['tableIndex'] = index
          this.newDataForm.push({
            name: '',
            IDCard: '',
            refund_fee: '',  // 退票款
            ticket_fare: '', // 出票费
            db_auftragsnummer: '', // 取票号
            ticketing_time: '', // 出票时间
            payment_account: '', // 支付账号
            payment_flow_number: '', // 支付流水号
            account: '', // 12306账号
            password: '', // 12306密码
            ticket_species: '', // 票类
          })
        })
        this.dbTableData.forEach(item =>{
          item.ticket_species = item.ticket_species === 0 ? '成人票': item.ticket_species === 1 ? '儿童票' : item.ticket_species
        })
      },
      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/17
       */
      tableSelect(v,r){
        // console.log(v);
        let userId = [];
        userId = v.map(res =>{
          return res.id;
        });
        let userRoute = [];
        userRoute = v.map(res =>{
          return res.route;
        });
        let userTicketPrice
        userTicketPrice = v.map(res =>{
          return res.ticket_price
        })
        userRoute = Array.from([...new Set(userRoute)]);

        this.$emit('checkTableData', userId, userRoute, this.index, this.cIndex, this.orderInfo.order_sn, this.orderInfo.parent_id,userTicketPrice);
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
      loseFcous(orderData, data, rowName, row, newRow, rowIndex) {
        if(rowName === 'ticketing_time'){
          newRow = String(newRow) === '0'? '': parseInt(newRow)
        }
        console.log(row,newRow);

        if(row !== newRow && newRow !== ''){
          if(row){
            this.$confirm('系统检测到当前输入框已有默认值为：'+ row +' , 是否将其修改为：'+ newRow, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(rowName === 'ticket_species'){
                row = row === '成人票'? 0: 1
                newRow = newRow === '成人票'? 0: 1
              }
              this.$emit('tableRowsData', this.orderInfo, data, rowName, newRow )
            }).catch(() => {
              if(rowName === 'ticket_species'){
                row = row === '成人票'? 0: 1
                newRow = newRow === '成人票'? 0: 1
              }
              this.dbTableData[rowIndex][rowName] = row
            });
          } else {
            this.$emit('tableRowsData', this.orderInfo, data, rowName, newRow )
          }
        }
      },

      loseUserFcous(orderData, data, rowName, row, newRow, rowIndex){
        console.log(row, newRow);
        if(rowName === 'ticketing_time'){
          newRow = String(newRow) === '0'? '': newRow
        }else if(rowName === 'ticket_species'){
          row = String(row)
        }
        console.log(row,newRow);

        if(row !== newRow && newRow !== ''){
          if(row){
            this.$confirm('系统检测到当前输入框已有默认值为：'+ row +' , 是否将其修改为：'+ newRow, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(rowName === 'ticket_species'){
                row = row === '儿童票'? 1 :  row === '成人票'? 0 : row
                newRow = newRow === '儿童票'? 1 :  newRow === '成人票'? 0 : newRow
              }
              this.$emit('tableRowsUserData', this.orderInfo, data, rowName, newRow )
            }).catch(() => {
              this.dbTableData[rowIndex][rowName] = row
            });
          } else {
            if(rowName === 'ticket_species'){
              row = row === '儿童票'? 1 :  row === '成人票'? 0 : row
              newRow = newRow === '儿童票'? 1 :  newRow === '成人票'? 0 : newRow
            }
            this.$emit('tableRowsUserData', this.orderInfo, data, rowName, newRow )
          }
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
    /*.el-input{*/
    /*  .el-input__inner{*/
    /*    border: unset;*/
    /*  }*/
    /*}*/
    font-size: 12px;
    th{
      padding: 5px 0;
    }
    td{
      padding: 2px 0;
      color: black;
      >.cell{
        padding: unset;
      }
    }
    .user_message{
      display: flex;
      align-items: center;
    }
    .editTimeInput{
      width: 120px;
      .el-input__inner{
        padding-right: unset;
        padding-left: 28px !important;
      }
    }
    .el-input{
      .el-input__inner{
        padding-left: 5px;
        padding-right: unset;
        color: #000;
        &::placeholder{
          /*color: #000;*/
        }
      }
    }
  }
</style>
