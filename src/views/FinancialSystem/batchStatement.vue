<template>
  <div class="batchStatement">
    <div class="batchStatement_table">
      <div class="table_row">
        <div class="table_title">设置对账单号</div>
        <div class="table_content">{{orderId}}</div>
        <div class="table_title" style="border-left: 1px solid #ebebeb">自定义对账单号</div>
        <div class="table_content"><el-input clearable placeholder="请输入自定义对账的单号" v-model="edit_order_id" /></div>
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
      <div class="table_row">
        <div class="table_title">上传收款凭证</div>
        <div class="table_content">
          <UploadImage style="width: 300px;height: 150px;" @uploadAddress="uploadPayment" ref="uploadImage"/>
        </div>
      </div>
      <div class="table_row">
        <div class="table_title">上传付款凭证</div>
        <div class="table_content">
          <UploadImage style="width: 300px;height: 150px;" @uploadAddress="uploadReceipt" ref="uploadImage"/>
        </div>
      </div>
      <div class="table_row">
        <div class="table_title">导入账单文件</div>
        <div class="table_content">
          <el-button type="primary" @click="openOrderDialog">导入</el-button>

        </div>
      </div>
      <div class="table_row" style="border-bottom: 1px solid #ebebeb;">
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
      <el-button class="submit" @click="submitOrderInfo">提交</el-button>

    </div>

    <el-table
        border
        v-if="orderFileData.length > 0"
        class="batchTable"
        :data="orderFileData">
      <el-table-column
          prop="order_sn"
          label="订单号"/>
      <el-table-column
          prop="actual_receipts"
          label="对账金额"/>
    </el-table>



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
          placeholder="
请遵循以下格式:
订单号1,实收款
订单号2,实收款
订单号3,实收款"
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
        edit_order_id: '', // 自定义对账单号

        upload_payment: '', // 付款凭证
        upload_receipt: '', // 收款凭证

        uploadOrderFile: false,  // 导入账单文件弹窗
        orderFile: '', // 订单文件
        orderFileData: [],  // 后台返回的订单文件列表

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
        // let data ={
        //   customer: this.orderInfo.customer,
        //   order_num: this.orderInfo.order_num
        // }
        this.$axios.get('/finance/obtain')
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
          this.$axios.post('/finance/contrast',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.uploadOrderFile = false
                  this.orderFileData = res.data.result
                  this.$message.success('提交成功')
                  // this.$route.push({
                  //   name: 'statementInfo',
                  //   query: {
                  //     condition: this.orderId
                  //   }
                  // })
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
        // let dataId = this.orderInfo.orderId.split(',')
        // let dataArr = []
        // for(let i=0;i< dataId.length; i++){
        //   dataArr.push({
        //     order_sn:  dataId[i]
        //   })
        // }
        let data ={
          bill_number: this.orderId,
          custom_bill_number: this.edit_order_id,
          // orders: JSON.stringify(dataArr),
          bill_file: JSON.stringify(this.orderFileData),
          receivables: this.upload_receipt,
          payment: this.upload_payment,
          remark: this.orderMarker,
          begin: this.$dateToMs(this.orderTime[0]) / 1000 || null,
          end: this.$dateToMs(this.orderTime[1]) / 1000 || null
        }

        if(this.orderFile){
          this.$axios.post('/finance/batchBill',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('保存成功')
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }else {
          this.$message.warning('您还未导入账单文件')
        }

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
    align-items: flex-start;
    /*flex-direction: column;*/
    padding: 20px 3%;
    .batchStatement_table{
      flex: 1;
      .table_row{
        display: flex;
        align-items: center;
        border:1px solid #ebebeb;
        &:not(:last-child){
          border-bottom: unset;
        }
        .table_title{
          width: 135px;
          height: 100%;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .table_content{
          width: 100%;
          height: 100%;
          min-height: 60px;
          display: flex;
          align-items: center;
          border-left: 1px solid #ebebeb;
          padding: 10px 15px;
          /deep/.upload_main{
            max-width: 150px;
            max-height: 150px;
          }
          /deep/.batchTable{
            width: 500px;
          }
        }
      }
    }
    .submit{
      display: block;
      width: 135px;
      margin-top: 40px;
      margin-left: auto;
    }
    /deep/.batchTable{
      max-width: 350px;
      flex: 1;
      margin-left: 15px;
    }
  }
</style>
