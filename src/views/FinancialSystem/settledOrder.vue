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
        <el-button v-if="viewsType !== 1" type="primary" @click="jumpBatchStatement()">批量对账</el-button>
      </div>
    </div>
    <div class="center">
      <el-table
          ref="multipleTable"
          @select="tableSelect"
          @select-all="tableSelect"
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
              v-if="viewsType === 0 || viewsType === 3 || viewsType === 2"
              prop="receivables"
              align="center"
              label="应收款">
          </el-table-column>
          <el-table-column
              v-if="viewsType === 0 || viewsType === 3 || viewsType === 2"
              prop="actual_receipts"
              align="center"
              label="实收款">
          </el-table-column>
          <el-table-column
              v-if="viewsType === 0 || viewsType === 3 || viewsType === 2"
              align="center"
              label="债途">
            <template slot-scope="scope">
              {{$numberSubtract(scope.row.receivables,scope.row.actual_receipts)}}
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

        <el-table-column
            v-if="viewsType === 1"
            prop="actual_receipts"
            align="center"
            label="实收款">
        </el-table-column>


        <el-table-column
            v-if="viewsType === 1"
            prop="profit"
            align="center"
            label="利润">
        </el-table-column>

        <el-table-column
            prop="bill_numbers"
            align="center"
            label="对账单号">
        </el-table-column>

        <el-table-column
            v-if="viewsType === 1"
            prop="amount2"
            align="center"
            label="实付款">
        </el-table-column>

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
                <el-dropdown-item><div @click="openRemarkDialog(scope.row)">备注</div></el-dropdown-item>
                <el-dropdown-item><div @click="openUploadDialog(1,scope.row)">上传汇款凭证</div></el-dropdown-item>
                <el-dropdown-item><div @click="openUploadDialog(2,scope.row)">上传收款凭证</div></el-dropdown-item>
                <el-dropdown-item><div @click="toggleSelection(scope.row)">移除多选</div></el-dropdown-item>
                <el-dropdown-item><div @click="changeOrderType(scope.row)">{{scope.row.is_lock === 1? '解除锁定': '锁定'}}</div></el-dropdown-item>
                <el-dropdown-item v-if="viewsType !== 1"><div @click="jumpBatchStatement(scope.row)">对账</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- Q群需求查看 -->
      <el-dialog
          title="Q群需求信息"
          width="30%"
          :visible.sync="groupDialog">
        <div class="group_message_dialog">
          {{groupMessage}}
        </div>
      </el-dialog>

      <!-- 添加备注信息 -->
      <el-dialog
          title="备注"
          width="30%"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :visible.sync="remarkDialog">
        <div class="remark_dialog">
          <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入备注信息"
              v-model="remarkMessage">
          </el-input>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="remarkDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitRemark">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 详情 -->
      <el-dialog
          title="订单详情"
          :visible.sync="OrderDetailsDialog">
        <div class="order_details_main">
          <div class="order_table">
            <div class="order_title">操作日志</div>
            <div class="order_table_content">
              <el-table
                  :data="OrderDetailsTable"
                  border
                  style="width: 100%">
                <el-table-column
                    label="序号"
                    width="50">
                  <template slot-scope="scope">
                    {{scope.$index+1}}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="操作人">
                </el-table-column>
                <el-table-column
                    prop="action"
                    label="动作">
                </el-table-column>
                <el-table-column
                    prop="field"
                    label="字段">
                </el-table-column>
                <el-table-column
                    prop="read_in"
                    label="写入值">
                </el-table-column>
                <el-table-column
                    label="时间">
                  <template slot-scope="scope">
                    {{$getTime(scope.row.updated_at * 1000)}}
                  </template>
                </el-table-column>
              </el-table>
              <Pagination
                  ref="pagination"
                  :pageData="DetailsPaginationList"
                  @jumpSize="jumpDetailsSize"
                  @jumpPage="jumpDetailsPage">
              </Pagination>
            </div>
          </div>
          <div class="order_table">
            <div class="order_title">备注</div>
            <div class="order_table_content">
              <el-table
                  :data="OrderRemarkTable"
                  border
                  style="width: 100%">
                <el-table-column
                    label="序号"
                    width="50">
                  <template slot-scope="scope">
                    {{scope.$index+1}}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="操作人">
                </el-table-column>
                <el-table-column
                    prop="remarks"
                    label="备注信息">
                </el-table-column>
                <el-table-column
                    label="时间">
                  <template slot-scope="scope">
                    {{$getTime(scope.row.updated_at * 1000)}}
                  </template>
                </el-table-column>
              </el-table>
              <Pagination
                  ref="pagination"
                  :pageData="RemarkPaginationList"
                  @jumpSize="jumpRemarkSize"
                  @jumpPage="jumpRemarkPage">
              </Pagination>
            </div>
          </div>

          <div class="order_table">
            <div class="order_title">收支汇款底单</div>
            <div class="order_table_images">
              <PublicImage :url="detailsImages.remittance_voucher"></PublicImage>
              <PublicImage :url="detailsImages.collection_voucher"></PublicImage>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- 上传汇款凭证 -->
      <!-- 添加备注信息 -->
      <el-dialog
          :title="uploadType?'上传汇款凭证':'上传付款凭证'"
          width="30%"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :visible.sync="uploadDialog">
        <div class="upload_dialog">
          <UploadImage @uploadAddress="uploadImages" ref="uploadImage"></UploadImage>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="uploadDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </div>
      </el-dialog>

      <el-dropdown trigger="click">
        <el-button class="export">导出</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><div @click="exportOrder">导出当前页面</div></el-dropdown-item>
          <el-dropdown-item><div @click="exportAllTable(0)">导出全部</div></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
          <div>总票价：{{dataTotal.TotalPrice}}</div>
          <div>总餐费：{{dataTotal.MealFee}}</div>
        </div>
        <div class="total-item">
          <div>应收款：{{dataTotal.Receivables}}</div>
          <div>实收款：{{dataTotal.ActualPayment}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "settledOrder",
    components:{
      'Pagination': () => import('@/components/Pagination'),
      'PublicImage': () => import('@/components/public/public_image'),
      'UploadImage': () => import('@/components/UploadLeaflet')
    },
    data(){
      return {
        loading: false,  // 加载
        tableData: [],

        selectList: [], // 多选列表

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

        groupDialog: false, // Q群需求信息弹窗
        groupMessage: '', // Q群需求信息

        remarkDialog: false, // 备注弹窗
        remarkMessage: '12312', // 备注信息
        orderId: '', // 订单号ID

        client: [],  // 发单人列表
        OrderDetailsDialog: false,  // 详情弹窗
        OrderDetailsTable: [], // 详情弹窗表格
        /**
         * 详情弹窗操作日志分页
         * */
        DetailsPaginationList: {},
        DetailsPer_page: 3,
        DetailsPage: '',
        /**
         * 详情弹窗备注列表分页
         * */
        OrderRemarkTable: [],
        RemarkPaginationList: {},
        RemarkPer_page: 3,
        RemarkPage: '',

        detailsImages: {},  // 凭证图片

        uploadDialog: false, // 上传弹窗
        uploadType: true, // 上传类型
        upload_image: '',  // 图片路径

        dataTotal: {}, // 页面总价合计

        /**
         * 分页
         * */
        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      //获取列表
      getData(){
        this.loading = true;
        this.$axios.post('/api/finance/getInfo/'+this.viewsType+'/'+this.per_page,this.searchForm)
            .then(res =>{
              this.tableData = res.data.data;
              this.loading = false;
              this.paginationList = res.data;
              this.getDataTotal()
            })
      },

      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/14
       */
      tableSelect(v,r){
        this.selectList = v.map(res =>{
          let dataForm = {}
          dataForm['order_sn'] = res.order_sn
          dataForm['customer'] = res.customer
          return dataForm
        });
      },

      //搜索
      search(){
        this.page = '';
        this.getData()
      },

      //获取客户列表
      getClient(){
        this.$axios.get('/api/user/customer/showAll')
            .then(res =>{
              this.client = res.data.result;
            })
      },

      /**
       * @Description: 查看Q群信息
       * @author Wish
       * @date 2019/10/25
      */
      openQDialog(val){
        this.groupDialog = true
        this.groupMessage = ''
        this.groupMessage = val
      },

      /**
       * @Description: 打开详情弹窗
       * @author Wish
       * @date 2019/10/25
      */
      openDetailsDialog(val){
        this.OrderDetailsTable = []
        this.OrderRemarkTable = []
        this.OrderDetailsDialog = true
        this.orderId = val.order_sn
        this.getDetailsData()
        this.getRemarkData()
        this.getBottomOrder()
      },
      /**
       * @Description: 详情获取日志列表
       * @author Wish
       * @date 2019/10/28
      */
      getDetailsData(){
        let data = {
          page: this.DetailsPage || null,
        }
        this.$axios.get('/api/order/actionLog/'+this.orderId+ '/'+this.DetailsPer_page || null,{params:data})
            .then(res =>{
              if(res.data.code === 0){
                this.OrderDetailsTable = res.data.result.data
                this.DetailsPaginationList = res.data.result
              }
            })
      },
      /**
       * @Description: 详情分页
       * @author Wish
       * @date 2019/10/28
      */
      jumpDetailsSize(val){
        this.DetailsPer_page = val
        this.getDetailsData()
      },
      jumpDetailsPage(val){
        this.DetailsPage = val
        this.getDetailsData()
      },
      /**
       * @Description: 详情获取备注列表
       * @author Wish
       * @date 2019/10/28
      */
      getRemarkData(){
        let data = {
          page: this.RemarkPage || null,
        }
        this.$axios.get('/api/order/trackingRemarks/'+this.orderId+ '/'+this.RemarkPer_page || null,{params:data})
            .then(res =>{
              if(res.data.code === 0){
                this.OrderRemarkTable = res.data.result.data
                this.RemarkPaginationList = res.data.result
              }
            })
      },
      /**
       * @Description: 备注分页
       * @author Wish
       * @date 2019/10/28
       */
      jumpRemarkSize(val){
        this.RemarkPer_page = val
        this.getRemarkData()
      },
      jumpRemarkPage(val){
        this.RemarkPage = val
        this.getRemarkData()
      },
      /**
       * @Description: 获取收支汇款底单
       * @author Wish
       * @date 2019/10/28
      */
      getBottomOrder(){
        let data ={
          condition: this.orderId
        }
        this.$axios.post('/api/finance/getData/'+0,data)
            .then(res =>{
              if(res.data.code === 0){
                this.detailsImages = res.data.result
              }
            })
      },

      /**
       * @Description: 打开备注弹窗
       * @author Wish
       * @date 2019/10/28
      */
      openRemarkDialog(val){
        this.remarkDialog = true
        this.remarkMessage = '';
        this.orderId = val.order_sn
      },
      /**
       * @Description: 提交备注
       * @author Wish
       * @date 2019/10/28
      */
      submitRemark(){
        let data ={
          order_sn: this.orderId,
          is_important: 0,
          remarks: this.remarkMessage
        }
        this.$axios.post('/api/order/operateRemarks',data)
            .then(res =>{
              if(res.data.code === 0){
                this.remarkDialog = false
                this.$message.success('保存成功')
              }else {
                this.$message.warning(res.data.msg)
                this.remarkDialog = false
              }
            })
      },

      /**
       * @Description: 打开上传弹窗
       * @author Wish
       * @date 2019/10/28
      */
      openUploadDialog(index,data){
        this.orderId = data.order_sn
        this.uploadDialog = true
        this.upload_image = ''
        this.$refs.uploadImage.closedImage()
        if(index === 1){
          this.uploadType = true
        }else if(index === 2){
          this.uploadType = false
        }
      },

      /**
       * @Description: 上传图片返回值
       * @author Wish
       * @date 2019/10/28
      */
      uploadImages(val){
        if(val){
          this.upload_image = val
        }
      },

      /**
       * @Description: 确认上传
       * @author Wish
       * @date 2019/10/28
      */
      submitUpload(){
        let index = this.uploadType?1:2
        let data = {
          info: this.upload_image,
          order_sn: this.orderId
        }
        this.$axios.post('/api/finance/operateColumn/'+index,data) // 1：上传汇款凭证 2：上传付款凭证
            .then(res =>{
              if(res.data.code === 0){
                this.$message.success('上传成功')
                this.uploadDialog = false
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 锁定or解除锁定订单
       * @author Wish
       * @date 2019/10/28
      */
      changeOrderType(val){
        this.orderId = val.order_sn
        let data ={
          condition: this.orderId,
          is_lock: val.is_lock === 0 ? 1: 0
        }
        this.$axios.post('/api/finance/editLock',data)
            .then(res =>{
              if(res.data.code === 0){
                this.$message.success('修改成功')
                this.getData()
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 跳转批量对账页面
       * @author Wish
       * @date 2019/10/28
      */
      jumpBatchStatement(){
        let orderSn = new Array();
        let customerList = new Array();
        this.selectList.forEach(res =>{
          orderSn.push(res.order_sn)
          customerList.push(res.customer)
        })
        orderSn = Array.from(new Set(orderSn))
        customerList = Array.from(new Set(customerList))
        this.$router.push({
          name: 'batchStatement',
          params:{
            orderId: String(orderSn),
            customer: String(customerList),
            order_num : String(this.selectList.length),
          }
        })
      },

      //移除多选
      toggleSelection(row) {
        this.tableData.splice(this.tableData.findIndex(item => item.order_sn === row.order_sn), 1)
        this.getDataTotal()
      },

      /**
       * @Description: 页面总价合计
       * @author Wish
       * @date 2019/10/28
      */
      getDataTotal(){
        let TotalPrice = 0 // 总票价
        let MealFee = 0  // 总餐费
        let Receivables = 0  // 应收款
        let ActualPayment = 0 // 实收款
        this.tableData.forEach(res =>{
          TotalPrice += parseFloat(res.verification_item.ticket_price)
          MealFee += parseFloat(res.verification_item.missed_meals_money)
          Receivables += parseFloat(res.receivables)
          ActualPayment += parseFloat(res.actual_receipts)
        })
        this.dataTotal['TotalPrice'] = TotalPrice
        this.dataTotal['MealFee'] = MealFee
        this.dataTotal['Receivables'] = Receivables
        this.dataTotal['ActualPayment'] = ActualPayment
      },

      /**
       * @Description: 表格导出
       * @author Wish
       * @date 2019/10/28
      */
      exportAllTable(){

      },
      exportOrder(){
        console.log(this.selectList);
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
      console.log(this.$route.meta.name);
      this.viewsType =  this.$route.meta.name === '待结算订单'? 0:
          this.$route.meta.name === '已结算订单'? 1:
              this.$route.meta.name === '未出账订单'? 2:
                  this.$route.meta.name === '出账中订单'? 3: ''
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

      .order_details_main{
        display: flex;
        flex-direction: column;
        .order_table{
          display: flex;
          align-items: center;
          min-height: 50px;
          &:not(:last-child){
            margin-bottom: 30px;
          }
          .order_title{
            width: 100px;
            height: 100%;
            flex-shrink: 0;
          }
          .order_table_content{
            width: 100%;
          }
          .order_table_images{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
        }
      }

      .upload_dialog{
        max-width: 400px;
        max-height: 400px;
        margin: 0 auto;
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