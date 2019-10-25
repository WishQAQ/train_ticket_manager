<!--已结算订单-->
<template>
  <div class="content" v-loading="loading">
    <div class="top">
      <div>
        <el-input style="width: 225px;" placeholder="请输入您要查询的订单号" v-model="searchForm.order_sn" clearable></el-input>
      </div>
      <div>
        <el-select v-model="searchForm.order_status"  placeholder="任务进度" clearable>
          <el-option value="0" label="未处理"></el-option>
          <el-option value="1" label="已处理"></el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="searchForm.loss_status"  placeholder="亏盈状态" clearable>
          <el-option value="0" label="亏损"></el-option>
          <el-option value="1" label="保本"></el-option>
          <el-option value="2" label="盈利"></el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="searchForm.customer" placeholder="客户选择" clearable>
          <el-option v-for="item in client" :key="item.id" :label="item.name" :value="item.identity"></el-option>
        </el-select>
      </div>
      <div class="block">
        <el-date-picker
            clearable
            v-model="searchForm.begin"
            type="date"
            placeholder="开始时间">
        </el-date-picker>
      </div>
      <div class="block">
        <el-date-picker
            clearable
            v-model="searchForm.end"
            type="date"
            placeholder="结束时间">
        </el-date-picker>
      </div>
      <div>
        <el-input clearable placeholder="发单人" v-model="searchForm.issuer" clearable></el-input>
      </div>
      <div>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="center">
      <el-table
          ref="multipleTable"
          :data="tableData"
          border
          style="width: 100%; margin-top: 20px">
        <el-table-column
            label="序号"
            align="center"
            width="50px">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>

        <el-table-column
            type="selection"
            width="55">
        </el-table-column>

        <el-table-column
            align="center"
            label="订单信息">
          <el-table-column
              prop="order_sn"
              align="center"
              width="150"
              label="单号">
          </el-table-column>
          <el-table-column
              align="center"
              width="80"
              label="Q群需求">
            <template slot-scope="scope">
              <el-button size="mini" @click="openQDialog(scope.row.group_origin_data)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
              prop="customer_name"
              align="center"
              min-width="120"
              label="客户">
            <template slot-scope="scope">
              {{scope.row.customer_name+'+'+scope.row.issuer_name}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
            prop="verification_item"
            align="center"
            label="核收项">
          <el-table-column
              align="center"
              label="总票价">
            <template slot-scope="scope">{{scope.row.verification_item.ticket_price}}</template>
          </el-table-column>
          <el-table-column
              align="center"
              label="总餐费">
            <template slot-scope="scope">{{scope.row.verification_item.missed_meals_money}}</template>
          </el-table-column>
          <el-table-column
              align="center"
              label="总退款">
            <template slot-scope="scope">{{scope.row.verification_item.refund_fee}}</template>
          </el-table-column>
          <el-table-column
              align="center"
              label="总快递费">
            <template slot-scope="scope">{{scope.row.verification_item.express_fee}}</template>
          </el-table-column>
          <el-table-column
              align="center"
              label="退改交通费">
            <template slot-scope="scope">{{scope.row.verification_item.refund_fare}}</template>
          </el-table-column>
        </el-table-column>

          <el-table-column
              v-if="viewsType === 0"
              prop="receivables"
              align="center"
              label="应收款">
          </el-table-column>
          <el-table-column
              v-if="viewsType === 0"
              prop="actual_receipts"
              align="center"
              label="实收款">
          </el-table-column>
          <el-table-column
              v-if="viewsType === 0"
              align="center"
              label="债途">
            <template slot-scope="scope">
              {{scope.row.receivables - scope.row.actual_receipts}}
            </template>
          </el-table-column>




        <el-table-column
            align="center"
            label="成本项">
          <el-table-column
              align="center"
              label="总出票费">
            <template slot-scope="scope">{{scope.row.verification_item.ticket_fare}}</template>
          </el-table-column>
          <el-table-column
              align="center"
              label="总赔付费">
            <template slot-scope="scope">{{scope.row.cost_item[0].compensation_fee}}</template>
          </el-table-column>
          <el-table-column
              align="center"
              label="优惠总额">
            <template slot-scope="scope">{{scope.row.cost_item[0].total_discount}}</template>
          </el-table-column>
          <el-table-column
              align="center"
              label="快递支出">
            <template slot-scope="scope">{{scope.row.cost_item[0].express_fee}}</template>
          </el-table-column>
        </el-table-column>

<!--        <el-table-column-->
<!--            prop="actual_receipts"-->
<!--            align="center"-->
<!--            label="实收款">-->
<!--        </el-table-column>-->

<!--        <el-table-column-->
<!--            prop="profit"-->
<!--            align="center"-->
<!--            label="利润">-->
<!--        </el-table-column>-->

        <el-table-column
            prop="bill_numbers"
            align="center"
            label="对账单号">
        </el-table-column>

<!--        <el-table-column-->
<!--            prop="amount2"-->
<!--            align="center"-->
<!--            label="实付款">-->
<!--        </el-table-column>-->

        <el-table-column
            prop="order_status"
            align="center"
            label="订单状态">
          <template slot-scope="scope">
            {{scope.row.order_status === 0?'未处理':'已处理'}}
          </template>
        </el-table-column>

        <el-table-column
            label="操作"
            fixed="right"
            width="80">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button size="mini">操作</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><div @click="openDetailsDialog(scope.row)">详情</div></el-dropdown-item>
                <el-dropdown-item><div @click="">备注</div></el-dropdown-item>
                <el-dropdown-item><div @click="">上传汇款凭证</div></el-dropdown-item>
                <el-dropdown-item><div @click="">上传收款凭证</div></el-dropdown-item>
                <el-dropdown-item><div @click="toggleSelection(scope.row)">移除多选</div></el-dropdown-item>
                <el-dropdown-item><div @click="">解除锁定</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- dialog -->
      <el-dialog title="已结算订单详情" :visible.sync="dialogTableVisible">
        <div>
          <table class="info-table">
            <tr>
              <td class="info-item">操作日志</td>
              <td>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%; margin-top: 20px">
                  <el-table-column
                      label="序号"
                      align="center"
                      width="50px">
                    <template slot-scope="scope">
                      {{scope.$index+1}}
                    </template>
                  </el-table-column>

                  <el-table-column
                      prop="id"
                      align="center"
                      label="操作人">
                  </el-table-column>

                  <el-table-column
                      prop="id"
                      align="center"
                      label="动作">
                  </el-table-column>

                  <el-table-column
                      prop="name"
                      align="center"
                      label="字段">
                  </el-table-column>

                  <el-table-column
                      prop="amount2"
                      align="center"
                      label="写入值">
                  </el-table-column>

                  <el-table-column
                      prop="amount2"
                      align="center"
                      label="时间">
                  </el-table-column>
                </el-table>
                <Pagination
                    ref="pagination"
                    :pageData="paginationList"
                    @jumpSize="jumpSize"
                    @jumpPage="jumpPage">
                </Pagination>
              </td>
            </tr>
            <tr>
              <td>备注</td>
              <td>备注</td>
            </tr>
            <tr>
              <td>收支汇款底单</td>
              <td>收支汇款底单</td>
            </tr>
          </table>
        </div>
      </el-dialog>

      <el-button  class="export" @click="" >导出</el-button>
      <div class="pages">
        <Pagination
            ref="pagination"
            :pageData="paginationList"
            @jumpSize="jumpSize"
            @jumpPage="jumpPage">
        </Pagination>
        <el-button  class="refresh" size="mini" @click="getData" >刷新</el-button>
      </div>
    </div>
    <div class="bottom">
      <div class="total">
        <p>本页合计</p>
        <div class="total-item">
          <div>总票价：32343242</div>
          <div>总餐费：423424234</div>
        </div>
        <div class="total-item">
          <div>应收款：4242342</div>
          <div>实收款：4243242424</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "settledOrder",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: false,  // 加载
        tableData: [],

        viewsType: '',  // 页面类型

        searchForm: {  // 搜索
          order_sn: '',  // 单号
          order_status: '',  // 旧单号
          customer: '',
          loss_status: '',
          issuer: '',
          begin: '',
          end: '',
        },

        client: [],  // 发单人列表
        dialogTableVisible: false,  // 详情弹窗

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      //移除多选
      toggleSelection(row) {
        this.$refs.multipleTable.toggleRowSelection(row,false);
      },

      //获取客户列表
      getClient(){
        this.$axios.get('/api/user/customer/showAll')
            .then(res =>{
              this.client = res.data.result;
            })
      },
      //获取列表
      getData(){
        this.loading = true;
        this.$axios.post('/api/finance/getInfo/'+this.viewsType+'/'+this.per_page,this.searchForm)
            .then(res =>{
              this.tableData = res.data.data;
              console.log(this.tableData);
              this.loading = false;
              this.paginationList = res.data;
            })
      },
      //搜索
      search(){
        this.page = '';
        this.getData()
      },

      /**
       * @Description: 查看Q群信息
       * @author Wish
       * @date 2019/10/25
      */
      openQDialog(val){
        console.log(val);
      },

      /**
       * @Description: 打开详情弹窗
       * @author Wish
       * @date 2019/10/25
      */
      openDetailsDialog(val){
        console.log(val);
        this.dialogTableVisible = true
      },



      //修改分页条数
      jumpSize(val){
        this.per_page = val
        this.getData()
      },
      //翻页
      jumpPage(val){
        this.page = val
        this.getData()
      },
    },
    watch: {
      '$route'(to, from) {
        this.viewsType =  this.$route.meta.name === '待结算订单'? 0:
            this.$route.meta.name === '已结算订单'? 1:
                this.$route.meta.name === '未出账订单'? 2:
                    this.$route.meta.name === '出账中订单'? 3: ''
        console.log(this.viewsType);
        this.getData();
        this.getClient();
      },
    },
    created() {
      this.viewsType =  this.$route.meta.name === '待结算订单'? 0:
          this.$route.meta.name === '已结算订单'? 1:
              this.$route.meta.name === '未出账订单'? 2:
                  this.$route.meta.name === '出账中订单'? 3: ''
      console.log(this.viewsType);
      this.getData();
      this.getClient();
    }
  }
</script>

<style scoped lang="less">
  .content{
    display: flex;
    flex-direction: column;
    padding: 80px 2%;
    .top{
      display: flex;
      align-items: center;
      >div{
        margin-left: 10px;
      }
    }
    .center{
      .export{
        margin-top: 20px;
        float: right;
      }
      .pages{
        display: flex;
        .refresh{
          height: 28px;
          margin-top: 32px;
        }
      }
      .info-table td{
        width: 15%;
        padding: 10px;
        border: 1px solid #EBEEF5;
      }
    }
    .bottom{
      .total{
        width: 25%;
        float: right;
        color: #2699FB;
        >p{
          text-align: center;
          margin: 10px 0;
        }
        >div{
          display: flex;
          >div{
            margin: 10px 0;
            width: 50%;
          }
        }
      }
    }
  }
</style>