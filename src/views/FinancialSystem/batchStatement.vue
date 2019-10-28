<template>
  <div class="batchStatement">
    <div class="batchStatement_table">
      <div class="table_row">
        <div class="table_title">设置对账单号</div>
        <div class="table_content">{{orderId}}</div>
      </div>
      <div class="table_row">
        <div class="table_title">设置账期</div>
        <div class="table_content">
          <el-date-picker
              v-model="orderTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div class="table_row" style="height: 170px;">
        <div class="table_title">上传收款凭证</div>
        <div class="table_content">
          <UploadImage style="width: 300px;height: 150px;" @uploadAddress="uploadPayment" ref="uploadImage"></UploadImage>
        </div>
      </div>
      <div class="table_row" style="height: 170px;">
        <div class="table_title">上传付款凭证</div>
        <div class="table_content">
          <UploadImage style="width: 300px;height: 150px;"  @uploadAddress="uploadReceipt" ref="uploadImage"></UploadImage>
        </div>
      </div>
      <div class="table_row">
        <div class="table_title">导入账单文件</div>
        <div class="table_content">
          <el-button type="primary" @click="openOrderDialog">导入</el-button>
        </div>
      </div>
      <div class="table_row">
        <div class="table_title">备注</div>
        <div class="table_content">
          <el-input
              type="textarea"
              resize="none"
              :rows="2"
              v-model="orderMarker">
          </el-input>
        </div>
      </div>
    </div>

    <el-button class="submit" @click="submitOrderInfo">提交</el-button>


    <el-dialog
        title="导入账单文件"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="uploadOrderFile"
        width="30%">
      <el-input
          type="textarea"
          resize="none"
          :rows="15"
          v-model="orderFile">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadOrderFile = false">取 消</el-button>
        <el-button type="primary" @click="submitOrderFile">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "batchStatement",
    components:{
      'UploadImage': () => import('@/components/UploadLeaflet')
    },
    data(){
      return {
        orderInfo: {}, // 跳转获取值
        orderId: '',  // 单号
        orderTime: '', // 账期

        upload_payment: '', // 付款凭证
        upload_receipt: '', // 收款凭证

        uploadOrderFile: false,  // 导入账单文件弹窗
        orderFile: '', // 订单文件
        orderMarker: '', // 备注
      }
    },
    methods:{
      /**
       * @Description: 获取单号
       * @author Wish
       * @date 2019/10/28
      */
      getOrderId(){
        this.orderInfo = this.$route.params
        let data ={
          customer: this.orderInfo.customer,
          order_num: this.orderInfo.order_num
        }
        this.$axios.post('/api/finance/obtain',data)
            .then(res =>{
              if(res.data.code === 0){
                this.orderId = res.data.result
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 上传凭证
       * @author Wish
       * @date 2019/10/28
      */
      uploadPayment(val){
        if(val){
          this.upload_payment = val
        }
      },
      uploadReceipt(val){
        if(val){
          this.upload_receipt = val
        }
      },

      /**
       * @Description: 打开上传订单文件弹窗
       * @author Wish
       * @date 2019/10/28
      */
      openOrderDialog(){
        this.uploadOrderFile = true
        this.orderFile = ''
      },
      /**
       * @Description: 提交订单文件
       * @author Wish
       * @date 2019/10/28
      */
      submitOrderFile(){
        if(this.orderFile){
          let data ={
            import_data: this.orderFile,
            available_data: this.orderInfo.orderId
          }
          this.$axios.post('/api/finance/contrast',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.uploadOrderFile = false
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }else {
          this.$message.warning('请填写订单文件信息')
        }

      },

      /**
       * @Description: 提交对账信息
       * @author Wish
       * @date 2019/10/28
      */
      submitOrderInfo(){
        let data ={
          bill_number: '',
          orders: '',
          receivables: '',
          payment: '',
          remark: '',
          begin: this.$dateToMs(this.orderTime[0]) / 1000,
          end: this.$dateToMs(this.orderTime[1]) / 1000
        }
        console.log(data);
        // this.$axios.post('/api/finance/batchBill',data)
        //     .then(res =>{
        //       if(res.data.code === 0){
        //
        //       }else {
        //         this.$message.warning(res.data.msg)
        //       }
        //     })
      },
    },
    created() {
      this.getOrderId()
    }
  }
</script>

<style scoped lang="less">
  .batchStatement{
    display: flex;
    flex-direction: column;
    padding: 80px 10%;
    .batchStatement_table{
      border:1px solid #ebebeb;
      width: 100%;
      .table_row{
        height: 75px;
        display: flex;
        &:not(:last-child){
          .table_title,.table_content{
            border-bottom: 1px solid #ebebeb;
          }
        }
        .table_title{
          width: 135px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-right: 1px solid #ebebeb;
        }
        .table_content{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 10px 15px;
        }
      }
    }
    .submit{
      width: 135px;
      margin-top: 40px;
      margin-left: auto;
    }
  }
</style>