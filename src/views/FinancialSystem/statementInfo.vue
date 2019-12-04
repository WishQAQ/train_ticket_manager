<template>
  <div class="statementInfo">
    <el-form class="info_header" label-width="100px">
      <el-form-item label="对账单号">
        <div>{{$route.query.condition}}</div>
      </el-form-item>
<!--      <el-form-item label="账期对账时间">-->
<!--        <el-input v-model="searchTime"></el-input>-->
<!--      </el-form-item>-->
<!--      <div style="margin-left: 15px"><el-button @click="submitSearch">搜索</el-button></div>-->
    </el-form>


    <div class="info_main">
      <!-- 账期表格 -->
      <el-table
          class="account_period_table"
          :data="tableData"
          border
          style="width: 100%">
        <el-table-column
            label="操作人">
          <template slot-scope="scope">
            {{scope.row.nickname? scope.row.nickname : scope.row.user_name}}
          </template>
        </el-table-column>
        <el-table-column
            label="账期对账时间">
          <template slot-scope="scope">
            {{$getTimeYear(scope.row.begin * 1000)}}
          </template>
        </el-table-column>
        <el-table-column
            label="账期结束时间">
          <template slot-scope="scope">
            {{$getTimeYear(scope.row.end * 1000)}}
          </template>
        </el-table-column>
      </el-table>

      <!-- 实收款表格 -->
      <div class="receipt_table">
        <div class="table_header">
          <div style="width: 30%; flex-shrink: 0">订单号</div>
          <div>实收款</div>
          <div>收款时间</div>
          <div style="width: 80px;flex-shrink: 0">操作</div>
        </div>
        <div class="table_content" v-for="(item,index) in receiptData" :key="index">
          <div class="content_left">
            <div class="left_title">{{item.order_sn}}</div>
            <el-button type="text" size="mini" @click="openReceiptDialog(item)">添加一条</el-button>
          </div>
          <div class="content_right">
            <div class="content_right_box" v-for="(cItem,cIndex) in item.info" :key="cIndex">
              <div>{{cItem.actual_receipts}}</div>
              <div>{{$getTime(cItem.created_at * 1000)}}</div>
              <div style="width: 80px;flex-shrink: 0">
                <el-button size="mini" @click="deleteReceiptData(item,cItem)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="unData" v-if="receiptData.length < 1">暂无数据</div>
      </div>

      <!-- 上传凭证 -->
      <div class="receipt_upload">
        <div class="upload_list">
          <div class="title">收款凭证</div>
          <div class="image_list_box">
            <PublicImage v-for="(item,index) in receiptImage"
                         :previewList="receiptImage"
                         :preview="true"
                         :key="index"
                         :url="item"
                         :fit="'cover'"/>
            <UploadImage @uploadAddress="uploadReceiptImage"
                         ref="uploadReceiptImage"/>
          </div>
        </div>
        <div class="upload_list">
          <div class="title">付款凭证</div>
          <div class="image_list_box">
            <PublicImage
                v-for="(item,index) in paymentImage"
                :key="index" :url="item"
                :previewList="paymentImage"
                :preview="true"
                :fit="'cover'"/>
            <UploadImage @uploadAddress="uploadPaymentImage" ref="uploadPaymentImage"/>
          </div>
        </div>
      </div>

      <!-- 备注or操作日志表格 -->
      <div class="order_message">
        <div>
          <el-table
              border
              :data="orderRemarksData"
              style="width: 100%">
            <el-table-column
                label="序号"
                align="center"
                width="50px">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
                prop="operator"
                label="备注人">
            </el-table-column>
            <el-table-column
                prop="remarks"
                label="备注">
            </el-table-column>
            <el-table-column
                label="时间">
              <template slot-scope="scope">
                {{$getTime(scope.row.created_at * 1000)}}
              </template>
            </el-table-column>
          </el-table>
          <Pagination
              ref="pagination"
              :pageData="remarksPagination"
              @jumpSize="remarksJumpSize"
              @jumpPage="remarksJumpPage">
          </Pagination>
        </div>
        <div>
          <el-table
              border
              :data="orderLogData"
              style="width: 100%">
            <el-table-column
                label="序号"
                align="center"
                width="50px">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
                prop="operator"
                label="备注人">
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
                {{$getTime(scope.row.created_at * 1000)}}
              </template>
            </el-table-column>
          </el-table>
          <Pagination
              ref="pagination"
              :pageData="logPagination"
              @jumpSize="logJumpSize"
              @jumpPage="logJumpPage">
          </Pagination>
        </div>
      </div>

    </div>


    <!-- 添加实收款弹窗 -->
    <el-dialog
        title="添加实收款"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="addReceiptDialog">
      <div class="upload_dialog">
        <el-form>
          <el-form-item label="实收款">
            <el-input v-model="addReceiptMessage"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addReceiptDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddReceipt">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "statementInfo",
    components:{
      'Pagination': () => import('@/components/Pagination'),
      'PublicImage': () => import('@/components/public/public_image'),
      'UploadImage': () => import('@/components/UploadLeaflet')
    },
    data(){
      return {
        searchTime: '', // 账期搜索
        tableData: [], // 账期数据
        receiptData: [], // 实收款数据
        addReceiptDialog: false,  // 添加实收款
        addReceiptMessage: '', // 实收款
        receiptInfo: {},  // 订单数据

        receiptImage: '', // 收款凭证
        paymentImage: '', // 付款凭证

        orderRemarksData: [], // 备注表格
        remarksPagination: {}, // 备注翻页
        remarksPer_page: 10,
        remarksPage: '',

        orderLogData: [], // 操作日志表格
        logPagination: {}, // 操作日志翻页
        logPer_page: 10,
        logPage: '',
      }
    },
    methods:{

      /**
       * @Description: 获取账期数据
       * @author Wish
       * @date 2019/10/29
      */
      getDataList(){
        this.$axios.get('/api/finance/obtainAccountPeriod/'+this.$route.query.condition)
            .then(res =>{
              if(res.data.code === 0){
                this.tableData = res.data.result
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 搜索
       * @author Wish
       * @date 2019/11/28
      */
      submitSearch(){
        if(this.searchTime){
          this.tableData = this.tableData.filter(data => !this.searchTime || data.begin.toLowerCase().includes(this.searchTime.toLowerCase()))
        }else {
          this.getDataList()
        }

      },

      /**
       * @Description: 获取实收款数据
       * @author Wish
       * @date 2019/10/29
      */
      getReceiptList(){
        this.$axios.get('/api/finance/obtainRecord/'+this.$route.query.condition)
            .then(res =>{
              if(res.data.code === 0){
                this.receiptData = res.data.result
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },
      /**
       * @Description: 获取订单凭证图片
       * @author Wish
       * @date 2019/10/29
      */
      getOrderImage(){
        let data = {
          condition: this.$route.query.condition
        }
        this.$axios.post('/api/finance/getData/1',data)
            .then(res =>{
              if(res.data.code === 0){
                res.data.result.collection_voucher?this.receiptImage = res.data.result.collection_voucher.split(','): null
                res.data.result.remittance_voucher?this.paymentImage = res.data.result.remittance_voucher.split(','): null
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },
      /**
       * @Description: 获取账单备注列表
       * @author Wish
       * @date 2019/10/29
      */
      getOrderRemarks(){
        let data = {
          page: this.remarksPage || null,
        }
        this.$axios.get('/api/finance/obtainRemarks/'+this.$route.query.condition+'/'+this.remarksPer_page || null,{params:data})
            .then(res =>{
              this.orderRemarksData = res.data.data
              this.remarksPagination = res.data
            })
      },
      /**
       * @Description: 备注列表翻页
       * @author Wish
       * @date 2019/10/29
      */
      remarksJumpSize(val){
        this.remarksPer_page = val
        this.getOrderRemarks()
      },
      remarksJumpPage(val){
        this.remarksPage = val
        this.getOrderRemarks()
      },
      /**
       * @Description: 获取账单操作日志列表
       * @author Wish
       * @date 2019/10/29
      */
      getOrderLog(){
        let data = {
          page: this.remarksPage || null,
        }
        this.$axios.get('/api/finance/obtainActionLog/'+this.$route.query.condition+'/'+this.remarksPer_page || null,{params:data})
            .then(res =>{
              this.orderLogData = res.data.data
              this.logPagination = res.data
            })
      },
      /**
       * @Description: 操作日志列表翻页
       * @author Wish
       * @date 2019/10/29
       */
      logJumpSize(val){
        this.logPer_page = val
        this.getOrderRemarks()
      },
      logJumpPage(val){
        this.logPage = val
        this.getOrderRemarks()
      },

      /**
       * @Description: 打开添加实收款弹窗
       * @author Wish
       * @date 2019/10/29
      */
      openReceiptDialog(val){
        this.receiptInfo = ''
        this.addReceiptDialog = true
        this.addReceiptMessage = ''
        this.receiptInfo = val
      },
      /**
       * @Description: 添加实收款表格数据
       * @author Wish
       * @date 2019/10/29
      */
      submitAddReceipt(){
        if(this.addReceiptMessage){
          let newForm = {
            actual_receipts: this.addReceiptMessage
          }
          let data = {
            order_sn: this.receiptInfo.order_sn,
            bill_number: this.receiptInfo.bill_number,
            info: JSON.stringify(newForm)
          }
          this.$axios.post('/api/finance/operateOrder/0',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('添加成功')
                  this.addReceiptDialog = false
                  this.getReceiptList()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }else {
          this.$message.warning('请添加实收款金额')
        }
      },
      /**
       * @Description: 删除实收款数据
       * @author Wish
       * @date 2019/10/29
      */
      deleteReceiptData(val,cVal){
        this.$confirm('此操作将永久删除此条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let newForm = {
            id: cVal.id
          }
          let data = {
            order_sn: val.order_sn,
            bill_number: val.bill_number,
            info: JSON.stringify(newForm)
          }
          this.$axios.post('/api/finance/operateOrder/1',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('删除成功')
                  this.getReceiptList()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }).catch(() => {});
      },

      /**
       * @Description: 上传收款凭证
       * @author Wish
       * @date 2019/10/29
      */
      uploadReceiptImage(val){
        this.$refs.uploadReceiptImage.closedImage()
        if(val){
          let data ={
            info: val,
            bill_number: this.$route.query.condition
          }
          this.$axios.post('/api/finance/operateBill/2',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('上传成功')
                  this.getOrderImage()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }
      },
      /**
       * @Description: 删除收款凭证
       * @author Wish
       * @date 2019/12/4
      */
      deleteUserImage(val){
        console.log(val);
      },
      /**
       * @Description: 上传付款凭证
       * @author Wish
       * @date 2019/10/29
      */
      uploadPaymentImage(val){
        this.$refs.uploadPaymentImage.closedImage()
        if(val){
          let data ={
            info: val,
            bill_number: this.$route.query.condition
          }
          this.$axios.post('/api/finance/operateBill/1',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('上传成功')
                  this.getOrderImage()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }
      },



    },
    created() {
      this.getDataList()
      this.getReceiptList()
      this.getOrderImage()
      this.getOrderRemarks()
      this.getOrderLog()
    },
  }
</script>

<style scoped lang="less">
  .unData{
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 68px;
  }
  .statementInfo{
    display: flex;
    flex-direction: column;
    padding: 20px 5%;
    .info_header{
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      /deep/.el-form-item{
        margin-bottom: unset;
      }
    }
    .info_main{
      .account_period_table{

      }
      .receipt_table{
        display: flex;
        flex-direction: column;
        width: 100%;
        border: 1px solid #ebeef5;
        margin-top: 40px;
        .table_header{
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ebeef5;
          >div{
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            &:not(:last-child){
              border-right: 1px solid #ebeef5;
            }
          }
        }
        .table_content{
          display: flex;
          align-items: center;
          &:not(:last-child){
            border-bottom: 1px solid #ebeef5;
          }
          .content_left{
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 30%;
            flex-shrink: 0;
            padding: 10px 0 5px;
          }
          .content_right{
            width: 100%;
            display: flex;
            flex-direction: column;
            .content_right_box{
              display: flex;
              align-items: center;
              width: 100%;
              &:not(:last-child){
                border-bottom: 1px solid #ebeef5;
              }
              >div{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 64px;
                border-left: 1px solid #ebeef5;
              }
            }
          }
        }
      }

      .receipt_upload{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 40px;
        .upload_list{
          display: flex;
          align-items: center;
          border: 1px solid #ebeef5;
          min-height: 150px;
          width: 100%;
          padding: 20px 0;
          &:first-child{
            margin-right: 5%;
          }
          .title{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 0 15px;
            border-right: 1px solid #ebeef5;
            width: 120px;
          }
          .image_list_box{
            display: flex;
            align-items: center;
            padding: 0 10px;
            width: 100%;
            flex-wrap: wrap;
            /deep/.publicImage{
              height: 100px;
              width: 100px;
              margin-right: 10px;
              margin-bottom: 10px;
            }
            .UploadLeaflet{
              height: 100px;
              width: 120px;
              margin: 0 0 10px;
            }
            .public_image{
              height: 100px;
              width: 100px;
              margin: 0 10px 0 0;
            }
          }
        }
      }

      .order_message{
        margin-top: 40px;
        display: flex;
        align-items: flex-start;
        >div{
          width: 100%;
          &:first-child{
            margin-right: 40px;
          }
        }
      }

    }
  }
</style>
