<template>
  <div class="content" v-loading="loading">
    <div class="top">
      <div>
        <el-input style="width: 225px;" placeholder="请输入您要查询的订单号" v-model="searchForm.order_sn" clearable/>
      </div>
      <div>
        <el-select v-model="searchForm.order_status"  placeholder="任务进度" clearable>
          <el-option value="0" label="未处理"/>
          <el-option value="1" label="已处理"/>
        </el-select>
      </div>
      <div v-if="viewsType === 1">
        <el-select v-model="searchForm.loss_status"  placeholder="亏盈状态" clearable>
          <el-option value="0" label="亏损"/>
          <el-option value="1" label="保本"/>
          <el-option value="2" label="盈利"/>
        </el-select>
      </div>
      <div>
        <el-select v-model="searchForm.customer" placeholder="客户选择" clearable  @change="selectCustomer(searchForm.customer)">
          <el-option v-for="item in client" :key="item.id" :label="item.name" :value="item.identity"/>
        </el-select>
      </div>
      <div>
        <el-select v-model="searchForm.issuer" placeholder="发单人选择" clearable>
          <el-option v-for="item in issuerList" :key="item.id" :label="item.name" :value="item.id"/>
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
      <div style="display: flex">
        <el-button type="primary" @click="getData('search')">搜索</el-button>
        <el-button v-if="viewsType !== 1" :disabled="selectList.length < 1" type="primary" @click="jumpBatchStatement()">批量对账</el-button>
      </div>
    </div>
    <div class="center" v-if="showTable">
      <el-table
          ref="multipleTable"
          @select="tableSelect"
          @select-all="tableSelect"
          :data="tableData || []"
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
            align="center"
            width="45">
        </el-table-column>

        <el-table-column
            align="center"
            label="订单信息">
          <el-table-column
              align="center"
              width="150"
              label="单号">
            <template slot-scope="scope">
              <div class="table_order" @click="jumpDetails(scope.row.order_sn)">{{scope.row.order_sn}}</div>
            </template>
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
              min-width="170"
              label="客户">
            <template slot-scope="scope">
              <span v-if="scope.row.customer_name">{{scope.row.customer_name}}</span>
              <span style="margin-left: 5px" v-if="scope.row.issuer_name">{{scope.row.issuer_name}}</span>
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
            <template slot-scope="scope">
              <div class="table_row_edit" @blur="openEditInput($event,scope.row,'compensation_fee',scope.row.cost_item[0].compensation_fee)" contentEditable>
                {{scope.row.cost_item[0].compensation_fee}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="优惠总额">
            <template slot-scope="scope">
              <div class="table_row_edit" @blur="openEditInput($event,scope.row,'total_discount',scope.row.cost_item[0].total_discount)" contentEditable>
                {{scope.row.cost_item[0].total_discount}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="快递支出">
            <template slot-scope="scope">
              <div class="table_row_edit" @blur="openEditInput($event,scope.row,'express_fee',scope.row.cost_item[0].express_fee)" contentEditable>
                {{scope.row.cost_item[0].express_fee}}
              </div>
            </template>
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
            align="center"
            width="80"
            label="对账单号">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="!scope.row.bill_numbers || scope.row.bill_numbers.length < 1" @click="viewBillNumberBtn(scope.row.bill_numbers)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column
            v-if="viewsType === 1"
            prop="actual_payment"
            align="center"
            label="实付款">
          <template slot-scope="scope">
            <div class="table_row_edit" @blur="openEditInput($event,scope.row,'actual_payment',scope.row.actual_payment)" contentEditable>
              {{scope.row.actual_payment}}
            </div>
          </template>
        </el-table-column>

        <el-table-column
            prop="order_status"
            align="center"
            width="80px"
            label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.order_status === 0" style="font-weight:unset;color: red">未处理</span>
            <span v-if="scope.row.order_status === 1" style="font-weight:unset;color: green">已处理</span>
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
                <el-dropdown-item v-if="viewsType !== 1 && $numberSubtract(scope.row.receivables,scope.row.actual_receipts) > 0">
                  <div @click="openBatchDialog(scope.row)">对账</div>
                </el-dropdown-item>
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

      <!-- 对账单号列表 -->
      <el-dialog
          title="对账单号列表"
          width="30%"
          :visible.sync="viewBillNumberDialog">
        <div class="view_bill_number_dialog" v-if="billNumberList.length > 0">
          <p v-for="(item,index) in billNumberList" :key="index" @click="jumpOrderDetails(item)">{{item}}</p>
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
          width="75%"
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
              <PublicImage v-if="emittanceList.length > 0" :previewList="emittanceList" :url="detailsImages.remittance_voucher" :preview="true"/>
              <PublicImage v-if="collectionList.length > 0" :previewList="collectionList" :url="detailsImages.collection_voucher" :preview="true"/>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- 上传汇款凭证 -->
      <el-dialog
          :title="uploadType?'上传汇款凭证':'上传付款凭证'"
          width="30%"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :visible.sync="uploadDialog">
        <div class="upload_dialog">
          <UploadImage @uploadAddress="uploadImages" :defaultPhoto="uploadType?detailsImages.remittance_voucher:detailsImages.collection_voucher" :uploadType="'finance'" ref="uploadImage"/>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="uploadDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 单个对账 -->
      <el-dialog
          title="对账"
          width="30%"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :visible.sync="batchDialog">
        <div class="upload_dialog">
          <el-form>
            <el-form-item label="实收款">
              <el-input v-model="batchMessage"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="batchDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitBatch" :loading="submitLoading">确 定</el-button>
        </div>
      </el-dialog>


      <div class="pages">
        <Pagination
            v-if="paginationList"
            ref="pagination"
            :pageData="paginationList"
            @jumpSize="jumpSize"
            @jumpPage="jumpPage">
        </Pagination>
        <el-dropdown style="margin-left: auto" trigger="click">
          <el-button class="export">导出</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div @click="exportOrder('select')">导出所选项</div></el-dropdown-item>
            <el-dropdown-item><div @click="exportOrder('all')">导出全部</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
        showTable: false,
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

        selectDownList: [], // 下载列表

        groupDialog: false, // Q群需求信息弹窗
        groupMessage: '', // Q群需求信息

        showEditInput: false, // 单元格修改
        editTotalData: '', // 修改数据

        viewBillNumberDialog: false, // 对账单号弹窗
        billNumberList: [],  // 对账单号列表

        remarkDialog: false, // 备注弹窗
        remarkMessage: '', // 备注信息
        orderId: '', // 订单号ID

        client: [],  // 客户商列表
        issuerList: [], // 发单人列表

        OrderDetailsDialog: false,  // 详情弹窗
        OrderDetailsTable: [], // 详情弹窗表格
        /**
         * 详情弹窗操作日志分页
         * */
        DetailsPaginationList: {},
        DetailsPer_page: 10,
        DetailsPage: '',
        /**
         * 详情弹窗备注列表分页
         * */
        OrderRemarkTable: [],
        RemarkPaginationList: {},
        RemarkPer_page: 10,
        RemarkPage: '',

        detailsImages: {},  // 凭证图片

        emittanceList: [], // 汇款凭证列表
        collectionList: [], // 收款凭证列表

        uploadDialog: false, // 上传弹窗
        uploadType: true, // 上传类型
        upload_image: '',  // 图片路径

        batchDialog: false, // 单个对账
        batchMessage: '', // 单个对账内容
        batchId: '', // 对账ID
        submitLoading: true,

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
      getData(type){
        this.loading = true
        this.showTable = false
        let data
        if(type === 'search'){
          data = JSON.parse(JSON.stringify(this.searchForm))
          data.begin?data.begin = this.$dateToDate(data.begin): ''
          data.end?data.end = this.$dateToDate(data.end): ''
          data['page'] = this.page || null
        }else {
          data = {
            page: this.page || null
          }
        }

        this.$axios.post('/api/finance/getInfo/'+this.viewsType+'/'+this.per_page, data)
            .then(res =>{
              this.tableData = res.data.data;
              this.paginationList = res.data;
              this.showTable = true
              this.loading = false;
              this.getDataTotal()
              this.tableData.map(item =>{
                item.bill_numbers?item.bill_numbers =item.bill_numbers.split(','): ''
              })
            })
      },

      /**
       * @Description: 跳转订单详情页
       * @author Wish
       * @date 2019/11/9
      */
      jumpDetails(val){
        this.$router.push({
          name: 'orderDetails',
          query:{
            order_sn: val,
            type: 'details'
          }
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
        this.selectDownList = v.map(res =>{
          let dataForm = {}
          dataForm['order_sn'] = res.order_sn
          return dataForm
        });
      },

      //获取客户列表
      getClient(){
        this.$axios.get('/api/user/customer/showAll')
            .then(res =>{
              this.client = res.data.result;
            })
      },

      /**
       * @Description: 选中客户商
       * @author Wish
       * @date 2019/11/21
      */
      selectCustomer(val){
        this.searchForm.issuer = ''
        this.client.forEach(res =>{
          if(res.identity === val){
            this.issuerList = res.issuer
          }
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
       * @Description: 打开修改单元格
       * @author Wish
       * @date 2019/10/30
      */
      openEditInput(editData,data,dataName,oldData){
        // if(oldData){
        //   console.log(editData.target.innerText);
        // }
        let editText = editData.target.innerText || null
        let orderId = data.order_sn
        let orderName = data.cost_item[0].dataName
        console.log(editText);
        if(editText !== oldData){
          let data ={
            order_sn: orderId,
            field: dataName,
            value: editText
          }
          this.$axios.post('/api/finance/editCellContent',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('修改成功')
                  this.getData()
                }else {
                  this.$message.warning(res.data.msg)
                  this.getData()
                  editData.target.innerText =  orderName || null
                }
              })
        }

      },

      /**
       * @Description: 单元格文本框失去焦点提交数据
       * @author Wish
       * @date 2019/10/30
      */
      closedEditTotal(){

      },

      /**
       * @Description: 打开对账单号弹窗
       * @author Wish
       * @date 2019/11/21
      */
      viewBillNumberBtn(val){
        this.billNumberList = []
        this.billNumberList = val
        this.viewBillNumberDialog = true
      },

      /**
       * @Description: 点击单号跳转对账详情页
       * @author Wish
       * @date 2019/10/30
      */
      jumpOrderDetails(val){
        this.viewBillNumberDialog = false
        this.$router.push({
          path: 'statementInfo',
          query: {
            condition: val
          }
        })
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
                if(this.detailsImages.remittance_voucher){
                  this.emittanceList = []
                  this.emittanceList.push(this.detailsImages.remittance_voucher)
                }
                if(this.detailsImages.collection_voucher){
                  this.collectionList = []
                  this.collectionList.push(this.detailsImages.collection_voucher)
                }
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
        console.log(index, data);
        this.orderId = data.order_sn
        this.uploadDialog = true
        this.upload_image = ''
        if(index === 1){
          this.uploadType = true
        }else if(index === 2){
          this.uploadType = false
        }
        this.getBottomOrder()
      },

      /**
       * @Description: 上传图片返回值
       * @author Wish
       * @date 2019/10/28
      */
      uploadImages(val){
        this.upload_image = val
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
                this.$refs.uploadImage.closedImage()
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
        let orderSn = [];
        let customerList = [];
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

      /**
       * @Description: 打开单个对账弹窗
       * @author Wish
       * @date 2019/10/29
      */
      openBatchDialog(val){
        this.orderId = val.order_sn
        this.batchMessage = ''
        this.batchId = ''
        this.batchDialog = true
        this.submitLoading = true
        this.$message.success('正在获取对账单号，请勿刷新页面')

        let data ={
          customer: val.customer,
          order_num: 1
        }
        this.$axios.post('/api/finance/obtain',data)
            .then(res =>{
              if(res.data.code === 0){
                this.batchId = res.data.result
                this.$message.success('获取成功')
                this.submitLoading = false
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },
      /**
       * @Description: 单个对账提交
       * @author Wish
       * @date 2019/10/29
      */
      submitBatch(){
        let dataForm = {
          order_sn: this.orderId
        }
        let dataArr = []
        dataArr.push(dataForm)

        let fileForm = {
          order_sn: this.orderId,
          actual_receipts: this.batchMessage
        }
        let fileArr = []
        fileArr.push(fileForm)

        let data ={
          bill_number: this.batchId,
          orders: JSON.stringify(dataArr),
          bill_file: JSON.stringify(fileArr),
        }
        this.$axios.post('/api/finance/batchBill',data)
            .then(res =>{
              if(res.data.code === 0){
                this.batchDialog = false
                this.$message.success('保存成功')
                this.getData()
              }else {
                this.$message.warning(res.data.msg)
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
        this.dataTotal['TotalPrice'] = TotalPrice.toFixed(2)
        this.dataTotal['MealFee'] = MealFee.toFixed(2)
        this.dataTotal['Receivables'] = Receivables.toFixed(2)
        this.dataTotal['ActualPayment'] = ActualPayment.toFixed(2)
      },

      /**
       * @Description: 表格导出
       * @author Wish
       * @date 2019/10/28
      */
      exportOrder(type){
        if(type === 'all'){
          if(this.tableData.length >0){
            this.$message.success('正在整理导出文件，开始导出，请勿刷新页面')
            this.$axios.get('/api/excel/billInfo/'+this.viewsType+'/all',{responseType: 'blob'})
                .then(res =>{
                  window.location.href = window.URL.createObjectURL(res.data);
                })
          }else {
            this.$message.warning('暂无数据，无法导出')
          }

        }else {
          if(this.selectDownList.length > 0){
            this.$message.success('正在整理导出文件，开始导出，请勿刷新页面')
            let newArr = []
            this.selectDownList.forEach(downId =>{
              newArr.push(downId.order_sn)
            })
            this.$axios.get('/api/excel/billInfo/'+this.viewsType+'/'+String(newArr),{responseType: 'blob'})
                .then(res =>{
                  window.location.href = window.URL.createObjectURL(res.data);
                })
          }else {
            this.$message.warning('请选择需要下载的数据')
          }
        }
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
    getDataList: {
      '$route'(to, from) {
        this.viewsType =  this.$route.meta.name === '待结算订单'? 0:
            this.$route.meta.name === '已结算订单'? 1:
                this.$route.meta.name === '未出账订单'? 3:
                    this.$route.meta.name === '出账中订单'? 2: this.$route.meta.name
        this.getData();
        // this.getClient();
        this.showTable = false
        this.$nextTick(() => {
          this.showTable = true
        })
      },
    },
    created() {
      this.viewsType =  this.$route.meta.name === '待结算订单'? 0:
          this.$route.meta.name === '已结算订单'? 1:
              this.$route.meta.name === '未出账订单'? 3:
                  this.$route.meta.name === '出账中订单'? 2: this.$route.meta.name
      this.getData();
      this.getClient();
    }
  }
</script>

<style scoped lang="less">
  .content{
    display: flex;
    flex-direction: column;
    padding: 20px 2%;
    .top{
      display: flex;
      align-items: center;
      >div{
        margin-left: 10px;
      }
    }
    .center{
      /deep/.el-table{
        font-weight: bold;
        color: black;
      }
      .statement_number{
        display: block;
        cursor: pointer;
        &:not(:last-child){
          &::after{
            content: ','
          }
        }
        &:hover{
          color: #409EFF;
        }
      }
      .table_order{
        cursor: pointer;
        &:hover{
          color: #409EFF;
        }
      }

      .table_row_edit{
        width: 100%;
        min-height: 25px;
        cursor: pointer;
        position: relative;
        text-align: left;
        padding-left: 5px;
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: center;*/
        /*&:hover{*/
        /*  &::before{*/
        /*    content: '添加内容';*/
        /*    background-color: #606266;*/
        /*    color: #fff;*/
        /*    padding: 0 5px;*/
        /*    position: absolute;*/
        /*  }*/
        /*}*/
      }

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
        max-height: 80vh;
        overflow-y: auto;
        padding-right: 20px;
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
            >div{
              width: 200px;
              height: 200px;
              margin: 0 30px 0 0;
            }
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
  .group_message_dialog{
    white-space: pre-wrap;
  }
  .view_bill_number_dialog{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    min-height: 100px;
    >p{
      width: 50%;
      padding: 0 5px;
      text-align: center;
      cursor: pointer;
      transition: all .3s;
      &:hover{
        color: #409EFF;
      }
      &:nth-child(1n){
        margin-bottom: 12px;
      }
    }
  }
</style>
