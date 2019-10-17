<template>
  <div class="orderDetails" v-loading="loading">
    <el-button class="edit_order_btn" type="primary">编辑订单</el-button>
    <div class="order_header">
      <div class="header_title" @click="openHeaderDetailsBtn">
        <i v-if="!headerDetails" class="el-icon-circle-plus-outline"></i>
        <i v-else class="el-icon-remove-outline"></i>
        订单Q群原始信息
      </div>
      <el-button class="header_btn">**文档标题**</el-button>
    </div>

    <!-- Q群信息展开 -->
    <el-collapse-transition>
      <div class="header_header_details" v-show="headerDetails">{{orderInfo.group_origin_data || '暂无需求信息'}}</div>
    </el-collapse-transition>

    <!-- 用户初始信息 -->
    <div class="order_info">
      <div class="info_header">
        <p class="title">订单号</p>
        <div class="info_header_table">
          <div>{{orderInfo.order_sn}}</div>
          <div>发单人 {{orderInfo.dName}}</div>
          <div>客户 {{orderInfo.cname}}</div>
          <div>旧单号 {{orderInfo.old_order_sn}}</div>
        </div>
      </div>
      <div class="info_content">
        <p class="title">备注信息</p>
        <div class="info_content_table">
          <div class="info_remarks">{{orderInfo.remarks || '暂无备注信息'}}</div>
          <div class="info_upload_image">证件照片</div>
        </div>
      </div>
      <div class="info_upload">
          车票照片
      </div>
    </div>

    <!-- 广告 -->
    <div class="order_carousel">
      <div class="carousel_main">新闻轮播</div>
      <el-button>查看</el-button>
    </div>

    <!-- 订单表格 -->
    <div class="order_passenger">
      <!-- 单程表格 -->
      <div class="passenger_table" v-if="passengerInfoZero.length > 0">
        <div class="table_header_message"></div>
        <div class="table_header_message_two"></div>
      </div>

      <!-- 往返表格 -->
      <div class="passenger_table"
           v-for="(item,index) in passengerInfoTwo"
           :key="index"
           v-if="passengerInfoTwo.length > 0">
        <div
            v-for="(cItem,cIndex) in item.route_config"
            :key="cIndex"
            class="passenger_table_route">
          <TrainTimesHeader :trainHeaderData="cItem" :trainHeaderType="item.route_type"></TrainTimesHeader>
          <TrainTimesTable :tableData="cItem.passengers.data"></TrainTimesTable>
        </div>
      </div>
    </div>

    <div class="order_details_bottom">
      <!-- 订单备注表格 -->
      <div class="order_remarks_table">
        <div class="table_header"></div>
        <div class="table_main">
          <el-table
              :data="orderRemarks.info"
              border
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
                label="备注人"
                prop="">
            </el-table-column>
            <el-table-column
                laber="备注"
                prop="">
            </el-table-column>
            <el-table-column
                laber="时间"
                prop="">
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 订单操作日志表格 -->
      <div class="order_log_table">
        <div class="table_header"></div>
        <div class="table_main">
          <el-table
              :data="orderLog.info"
              border
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
                label="备注人"
                prop="">
            </el-table-column>
            <el-table-column
                laber="动作"
                prop="">
            </el-table-column>
            <el-table-column
                laber="字段"
                prop="">
            </el-table-column>
            <el-table-column
                laber="写入值"
                prop="">
            </el-table-column>
            <el-table-column
                laber="时间"
                prop="">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>



  </div>
</template>

<script>
  export default {
    name: "orderDetails",
    components:{
      'TrainTimesHeader': () => import('@/components/TrainTimesHeader/index'),
      'TrainTimesTable': () => import('@/components/TrainTimesTable/index')
    },
    data(){
      return {
        loading: true,
        orderSn: 'xy183210142019', // 订单号

        orderInfo: [], // 订单详情列表
        headerDetails: false, // 原始Q群需求初始状态

        passengerInfo: [], // 乘客信息列表 筛选表格状态 0:单程 1：往返 2：中转 3：中转往返
        passengerInfoZero: [], // 单程表格数据
        passengerInfoOne: [],  // 往返表格数据
        passengerInfoTwo: [], // 中转表格数据
        passengerInfoThree: [], // 中转往返表格数据

        selectPassengerList: [], // 乘客信息多选列表

        orderRemarks: [], // 订单备注列表

        orderLog: [], // 订单操作日志列表
      }
    },
    methods:{
      /**
       * @Description: 获取订单详情
       * @author Wish
       * @date 2019/10/17
      */
      getDataList(){
        this.loading = true
        let data = {
          order_sn: this.orderSn,
        }
        this.$axios.post('/api/order/details',data)
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                res.data.result.forEach(res =>{
                  this.orderInfo = res
                })
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },


      /**
       * @Description: 打开or关闭原始Q群需求
       * @author Wish
       * @date 2019/10/17
      */
      openHeaderDetailsBtn(){
        this.headerDetails = this.headerDetails === false
      },

      /**
       * @Description: 获取分路线乘客信息
       * @author Wish
       * @date 2019/10/17
      */
      getPassengerList(){
        this.loading = true;
        this.$axios.get('/api/order/detailsRoute/'+this.orderSn)
            .then(res =>{
              this.loading = false
              this.passengerInfo = res.data
              this.passengerInfo.forEach(item =>{
                if(item.route_type === 0){  // 单程
                  this.passengerInfoZero.push(item)
                }else if(item.route_type === 1){  // 往返
                  this.passengerInfoOne.push(item)
                }else if(item.route_type === 2){  // 中转
                  this.passengerInfoTwo.push(item)
                }else if(item.route_type === 3){  // 中转往返
                  this.passengerInfoThree.push(item)
                }
              })
            })
      },
      
      /**
       * @Description: 获取订单跟踪备注列表
       * @author Wish
       * @date 2019/10/17
      */
      getOrderRemarks(){
        this.$axios.get('/api/order/list/trackingRemarks/'+this.orderSn)
            .then(res =>{
              this.orderRemarks = res.data.data[0]
            })
      },

      /**
       * @Description: 获取订单操作日志列表
       * @author Wish
       * @date 2019/10/17
      */
      getOrderLog(){
        this.$axios.get('/api/order/list/actionLog/'+this.orderSn)
            .then(res =>{
              this.orderLog = res.data.data[0]
            })
      },


    },
    created() {
      this.getDataList()  // 订单数据
    },
    mounted() {
      this.getPassengerList()  // 乘客数据
      this.getOrderRemarks()  // 订单备注数据
      this.getOrderLog()  // 订单操作日志数据
    }
  }
</script>

<style scoped lang="less">
  .orderDetails{
    padding: 80px;
    .edit_order_btn{
      padding: 12px 50px;
      margin-bottom: 34px;
    }
    .order_header{
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .header_title{
        flex: 1;
        background:rgba(238,247,255,1);
        border-radius:7px;
        height: 40px;
        margin-right: 55px;
        display: inline-flex;
        align-items: center;
        padding-left: 15px;
        cursor: pointer;
        color:rgba(38,153,251,1);
        >i{
          margin-right: 10px;
        }
      }
    }


    .header_header_details{
      background:rgba(238,247,255,1);
      margin-bottom: 40px;
      padding: 15px;
      width: 100%;
    }


    .order_info{
      width: 100%;
      margin-bottom: 45px;
      .title{
        width: 70px;
        flex-shrink: 0;
      }
      .info_header{
        display: flex;
        align-items: center;
        .info_header_table{
          flex: 1;
          display: flex;
          align-items: center;
          border: 1px solid #ebeef5;
          >div{
            display: flex;
            align-items: center;
            width: 100%;
            height: 46px;
            padding-left: 15px;
            &:not(:last-child){
              border-right: 1px solid #ebeef5;
            }
          }
        }
      }
      .info_content{
        display: flex;
        align-items: center;
        .info_content_table{
          display: flex;
          align-items: center;
          width: 100%;
          height: 100px;
          border: 1px solid #ebeef5;
          border-top: unset;
          .info_remarks{
            flex: 1;
            height: 100%;
            border-right: 1px solid #ebeef5;
            padding: 15px;
          }
          .info_upload_image{
            width: 180px;
            flex-shrink: 0;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }
        }
      }
      .info_upload{
        margin-left: 70px;
        border: 1px solid #ebeef5;
        border-top: unset;
        height: 160px;
      }
    }


    .order_carousel{
      display: flex;
      align-items: center;
      margin-bottom: 90px;
      .carousel_main{
        margin-right: 30px;
        max-width: 450px;
        width: 100%;
      }
    }


    .order_passenger{
      .passenger_table{
        margin-bottom: 40px;
        .passenger_table_route{
          margin-bottom: 40px;
        }
      }
    }

    .order_remarks_table{

    }

  }
</style>