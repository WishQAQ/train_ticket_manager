<template>
  <div class="orderDetails" v-loading="loading">
    <el-button class="edit_order_btn" type="primary" v-if="urlType === 'details'">编辑订单</el-button>
    <div class="order_header" v-if="urlType !== 'add'">
      <div class="header_title" @click="openHeaderDetailsBtn">
        <i v-if="!headerDetails" class="el-icon-circle-plus-outline"></i>
        <i v-else class="el-icon-remove-outline"></i>
        订单Q群原始信息
      </div>
      <el-button class="header_btn" v-if="urlType === 'details'">**文档标题**</el-button>
    </div>


    <div class="order_header_add" v-if="urlType === 'add'">
      <div class="add_title">订单Q群原始信息</div>
      <div class="add_input">
        <el-input
            placeholder="订单号:1215502465; 行程:9.19上海-北戴河G1214; 9.24北京-上海G11; 乘客/出票:杨国妹 310110196211056302; 杨玉珍 310110196905100443; 指定车票类型:网票"
            type="textarea"
            resize="none"
            :rows="6"
            :disabled="addBtnDisabled"
            v-model="AddGroupOriginData">
        </el-input>
      </div>
      <el-button v-if="!addBtnType" class="add_btn" @click="saveGroupBtn()">保存</el-button>
      <el-button v-if="addBtnType" class="add_btn" @click="addGroupBtn" :disabled="addBtnDisabled">识别</el-button>
    </div>

    <!-- Q群信息展开 -->
    <el-collapse-transition>
      <div class="header_header_details" v-show="headerDetails">
        <el-input
            placeholder="暂无需求信息"
            type="textarea"
            resize="none"
            :rows="6"
            v-model="orderInfo.group_origin_data"
            :disabled="inputDisabled">
        </el-input>
      </div>
    </el-collapse-transition>

    <!-- 用户初始信息 -->
    <div class="order_info">
      <div class="info_header">
        <p class="title">订单号</p>
        <div class="info_header_table">
          <div>{{orderInfo.order_sn}}</div>
          <div>
            <span>客户商</span>
            <el-select  @change="getBillerData(customerName)" v-model="customerName" :disabled="inputDisabled" placeholder="请选择">
              <el-option

                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.identity">
              </el-option>
            </el-select>
          </div>
          <div>
            <span>发单人</span>
            <el-select v-model="billerName" :disabled="inputDisabled" placeholder="请选择">
              <el-option
                  v-for="item in billerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div>
            <span>旧单号</span>
            <el-input
                placeholder="请输入旧单号"
                v-model="orderInfo.old_order_sn"
                :disabled="inputDisabled">
            </el-input>
          </div>
        </div>
      </div>
      <div class="info_content">
        <p class="title">备注信息</p>
        <div class="info_content_table">
          <div class="info_remarks">
            <el-input
                placeholder="暂无备注信息"
                type="textarea"
                :rows="3"
                maxlength="180"
                show-word-limit
                resize="none"
                v-model="orderInfo.remarks"
                :disabled="inputDisabled">
            </el-input>
          </div>
          <div class="info_upload_image">

          </div>
        </div>
      </div>
      <div class="add_upload" v-if="urlType === 'add'">
        <UploadLeaflet :messageText="'证件照片'"></UploadLeaflet>
        <UploadLeaflet :messageText="'源文件'"></UploadLeaflet>
      </div>
      <div class="info_upload" v-if="urlType !== 'add'">
          车票照片
      </div>
    </div>

    <!-- 新增表格 -->
    <div v-if="urlType === 'add'">
      <div class="add_table" v-for="(item, index) in addTrainTableArray" :key="index">
        <div class="addOrderTable">
          <div class="add_table_header">
            <el-button>隐藏</el-button>
            <el-button>增加表</el-button>
            <el-button>删除表</el-button>
            <el-button>内容清空</el-button>
            <el-button>批量删除</el-button>
            <el-button>保存</el-button>
          </div>

          <div class="table"
               v-for="(cItem, cIndex) in item.info"
               :key="cIndex">
            <!-- 单程表头 -->
            <div class="table_header">
              <div>路线{{item.type === 0? '一：单程':
                item.type === 1? '二：往返':
                item.type === 2? '三：中转':
                item.type === 3? '四：中转往返': ''}}</div>
              <div>行程时间：{{cItem.riding_time}}</div>
              <div class="table_header_train">
                <p>{{cItem.initial_station}}</p>
                <div>{{cItem.trips_number}}</div>
                <p>{{cItem.stop_station}}</p>
              </div>
            </div>

            <el-table
                border
                @select="tableSelect"
                @select-all="tableSelect"
                ref="multipleTable"
                tooltip-effect="dark"
                :data="cItem.passenger"
                style="width: 100%">
              <el-table-column
                  width="60"
                  align="center"
                  label="序号">
                <template slot-scope="scope"> {{scope.$index + 1}}</template>
              </el-table-column>
              <el-table-column
                  type="selection"
                  align="center"
                  width="50">
              </el-table-column>
              <el-table-column
                  label="姓名">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  label="身份证信息">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.IDCard"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  label="票种">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.ticket_type" placeholder="请选择">
                    <el-option label="成人票" value="成人票"></el-option>
                    <el-option label="儿童票" value="儿童票"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  label="车票类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.ticket_species" placeholder="请选择">
                    <el-option label="网票" value="网票"></el-option>
                    <el-option label="纸票" value="纸票"></el-option>
                    <el-option label="电子票" value="电子票"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  label="误餐费">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.missed_meals_money"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remarks"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  width="80px"
                  align="center"
                  label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="deleteList(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

        </div>
      </div>

      <el-button v-if="addTrainTableArray.length > 0" @click="allAddSubmit">全部保存</el-button>

    </div>

    <!-- 详情or编辑 表格 -->
    <div v-if="urlType !== 'add'">
      <!-- 广告 -->
      <div class="order_carousel">
        <div class="carousel_main">新闻轮播</div>
        <el-button>查看</el-button>
      </div>

      <div class="order_passenger_search">
        <div class="search_box">
          <el-input v-model="passengerSearch.info" clearable placeholder="请输入乘客信息/支付账号/流水账号/12306账号"></el-input>
          <el-input v-model="passengerSearch.train_number" clearable placeholder="请输入车次"></el-input>
          <el-input v-model="passengerSearch.departure_station" clearable placeholder="请输入发站地址"></el-input>
          <el-input v-model="passengerSearch.arrive_station" clearable placeholder="请输入到站地址"></el-input>
          <el-date-picker
              v-model="passengerSearch.trip_time"
              type="date"
              placeholder="请选择行程时间">
          </el-date-picker>
          <el-date-picker
              v-model="passengerSearch.draw_bill_time"
              type="date"
              placeholder="请选择出票时间">
          </el-date-picker>
          <el-input v-model="passengerSearch.ticket_type" clearable placeholder="请选择票类"></el-input>
          <el-input v-model="passengerSearch.ticket_status" clearable placeholder="请选择车票状态"></el-input>
          <el-button @click="passengerSearchBtn">搜索</el-button>
        </div>
        <div class="search_btn">
          <el-button @click="hiddenTable">隐藏</el-button>
          <el-button>导出菜单</el-button>
        </div>
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
             :key="index">
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
        <div class="order_bottom_table">
          <div class="table_header"></div>
          <div class="table_main">
            <el-table
                width="100%"
                :data="orderRemarks"
                border>
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
                  prop="nickname">
              </el-table-column>
              <el-table-column
                  label="备注"
                  prop="remarks">
              </el-table-column>
              <el-table-column
                  label="时间">
                <template slot-scope="scope">
                  {{$getTime(scope.row.updated_at * 1000)}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 订单操作日志表格 -->
        <div class="order_bottom_table">
          <div class="table_header"></div>
          <div class="table_main">
            <el-table
                width="100%"
                :data="orderLog"
                border>
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
                  prop="nickname">
              </el-table-column>
              <el-table-column
                  label="动作"
                  prop="action">
              </el-table-column>
              <el-table-column
                  label="字段"
                  prop="field">
              </el-table-column>
              <el-table-column
                  label="写入值"
                  prop="read_in">
              </el-table-column>
              <el-table-column
                  label="时间">
                <template slot-scope="scope">
                  {{$getTime(scope.row.updated_at * 1000)}}
                </template>
              </el-table-column>
            </el-table>
          </div>
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
      'TrainTimesTable': () => import('@/components/TrainTimesTable/index'),

      'UploadLeaflet': () => import('@/components/UploadLeaflet/index'),

    },
    data(){
      return {
        loading: true,
        orderSn: '', // 订单号

        urlType: '', // 页面类型
        inputDisabled: false, // 页面输入框禁用

        /***
         * 新增订单
         */
        AddGroupOriginData: '',  // 模糊查询Q群信息

        saveGroupMessage: '', // 初始信息保存
        addBtnType: false,  // 保存 or 识别按钮切换
        addBtnDisabled: false, // 识别按钮

        orderInfo: {
          cname: '',
          dName: ''
        }, // 订单详情列表

        customerName:  '', // 客户商
        customerList: [],
        billerName: '',  // 发单人
        billerList: [],

        headerDetails: false, // 原始Q群需求初始状态

        /***
         * 上传
         */
        fileList: [], // 上传文件列表

        passengerInfo: [], // 乘客信息列表 筛选表格状态 0:单程 1：往返 2：中转 3：中转往返
        passengerInfoZero: [], // 单程表格数据
        passengerInfoOne: [],  // 往返表格数据
        passengerInfoTwo: [], // 中转表格数据
        passengerInfoThree: [], // 中转往返表格数据

        passengerSearch: { // 乘客信息搜索
          info: '',
          train_number: '',
          departure_station: '',
          arrive_station: '',
          trip_time: '',
          draw_bill_time: '',
          ticket_type: '',
          ticket_status: '',
        },

        addDataList: [], // 新增获取车次信息
        addTrainTableArray: [], // 新增获取乘客表格信息
        addTrainType: '', // 新增乘客车票类型

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
                  console.log(res);
                  this.orderInfo = res
                })
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      urlTypeSelect(){
        if(this.$route.query.type === 'details'){  // 详情页面
          this.orderSn = this.$route.query.order_sn
          this.urlType = this.$route.query.type
          this.inputDisabled = true
        }else if(this.$route.query.type === 'edit'){  // 修改页面
          this.orderSn = this.$route.query.order_sn
          this.urlType = this.$route.query.type
          this.inputDisabled = false
        }else if(this.$route.query.type === 'add'){  // 新增页面
          this.urlType = this.$route.query.type
          this.inputDisabled = true
          this.loading = false
        }

        if(this.urlType !== 'add'){
          this.getDataList()  // 订单数据
          this.getPassengerList()  // 乘客数据
          this.getOrderRemarks()  // 订单备注数据
          this.getOrderLog()  // 订单操作日志数据
        }
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
       * @Description: 乘客信息搜索
       * @author Wish
       * @date 2019/10/17
      */
      passengerSearchBtn(){
        this.loading = true;
        this.passengerInfo = []
        this.passengerInfoZero = []
        this.passengerInfoOne = []
        this.passengerInfoTwo = []
        this.passengerInfoThree = []
        this.passengerSearch['trip_time'] = this.$dateToMs(this.passengerSearch.trip_time) / 1000
        this.passengerSearch['draw_bill_time'] = this.$dateToMs(this.passengerSearch.draw_bill_time) / 1000
        this.$axios.post('/api/order/detailsRoute/'+this.orderSn,this.passengerSearch)
            .then(res =>{
              console.log(res);
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
       * @Description: 隐藏乘车信息表格按钮
       * @author Wish
       * @date 2019/10/17
      */
      hiddenTable(){
        console.log('1');
      },

      /**
       * @Description: 获取订单跟踪备注列表
       * @author Wish
       * @date 2019/10/17
      */
      getOrderRemarks(){
        this.$axios.get('/api/order/trackingRemarks/'+this.orderSn)
            .then(res =>{
              if(res.data.code === 0){
                this.orderRemarks = res.data.result.data
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 获取订单操作日志列表
       * @author Wish
       * @date 2019/10/17
      */
      getOrderLog(){
        this.$axios.get('/api/order/actionLog/'+this.orderSn)
            .then(res =>{
              if(res.data.code === 0){
                this.orderLog = res.data.result.data
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      getCustomerData(){
        this.$axios.get('/api/user/customer/showAll')
          .then(res =>{
            if(res.data.code === 0){
              this.customerList = res.data.result
            }
          })
      },
      getBillerData(data){
        if(data){
          this.customerList.forEach(res => {
            if(res.identity === data){
              this.billerList = res.issuer
            }
          })
        }
      },

      /**
       * @Description: 新增Q群信息
       * @author Wish
       * @date 2019/10/18
      */
      saveGroupBtn(){
        this.addBtnType = true
        this.saveGroupMessage = JSON.parse(JSON.stringify(this.AddGroupOriginData))
      },
      addGroupBtn(){
        this.$message.success('数据识别中')
        this.addBtnDisabled = true
        if(this.AddGroupOriginData){
          let data ={
            group_origin_data: this.AddGroupOriginData
          }
          this.$axios.post('/api/order/recognize/show',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('识别完成')
                  this.inputDisabled = false
                  this.addBtnDisabled = true
                  this.addDataList = res.data.result
                  this.orderInfo.order_sn = this.addDataList.orderNumber.new
                  this.orderInfo.old_order_sn = this.addDataList.orderNumber.old
                  /**
                   * @Description: 重组新增数组
                   * @author Wish
                   * @date 2019/10/24
                   */
                  if(this.addDataList.trips.type === 0){
                    this.addDataList.trips.info.forEach(cItem =>{
                      cItem['initial_station'] = cItem.route[0]  // 发站
                      cItem['stop_station'] = cItem.route[1] // 到站
                      cItem['riding_time'] = cItem.ride_date  // 发车时间
                      cItem['trips_number'] = cItem.train_number  // 车次
                      delete cItem.route
                      delete cItem.ride_date
                      delete cItem.train_number
                      cItem.passenger.forEach(dItem =>{
                        dItem['IDCard'] = dItem.card  // 身份证
                        dItem['ticket_type'] = dItem.is_child    // 车票类型
                        dItem['ticket_type'] = dItem.is_child === 0 ? '成人票' :'儿童票'   // 车票类型
                        dItem['ticket_species'] = this.addDataList.ticketType
                        dItem['remarks'] = ''  // 备注
                        dItem['missed_meals_money'] = '5'  // 误餐费
                        delete dItem.card
                        delete dItem.is_child
                      })
                    })
                    this.addTrainTableArray.push(JSON.parse(JSON.stringify(this.addDataList.trips)))

                  }else {
                    this.addDataList.trips.forEach(item =>{
                      item.info.forEach(cItem =>{
                        cItem['initial_station'] = cItem.route[0]  // 发站
                        cItem['stop_station'] = cItem.route[1] // 到站
                        cItem['riding_time'] = cItem.ride_date  // 发车时间
                        cItem['trips_number'] = cItem.train_number  // 车次
                        delete cItem.route
                        delete cItem.ride_date
                        delete cItem.train_number
                        cItem.passenger.forEach(dItem =>{
                          dItem['IDCard'] = dItem.card  // 身份证
                          dItem['ticket_type'] = dItem.is_child    // 车票类型
                          dItem['ticket_type'] = dItem.is_child === 0 ? '成人票' :'儿童票'   // 车票类型
                          dItem['ticket_species'] = this.addDataList.ticketType
                          dItem['remarks'] = ''  // 备注
                          dItem['missed_meals_money'] = '5'  // 误餐费
                          delete dItem.card
                          delete dItem.is_child
                        })
                      })
                    })
                    this.addTrainTableArray = JSON.parse(JSON.stringify(this.addDataList.trips))

                  }

                  console.log(this.addTrainTableArray);
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }else {
          this.$message.warning('请输入订单原始信息')
        }
      },

      /**
       * @Description: 删除按钮
       * @author Wish
       * @date 2019/10/25
      */
      deleteList(data){
        console.log(data);
      },

      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/25
      */
      tableSelect(v){
        console.log(v);
      },

      /**
       * @Description: 新增全部保存
       * @author Wish
       * @date 2019/10/22
      */
      allAddSubmit(){
        let orderList = JSON.parse(JSON.stringify(this.addTrainTableArray))
        orderList.forEach(item =>{
          item.info.forEach(cItem =>{
            cItem.riding_time = this.$dateToDate(cItem.riding_time)  // 发车时间
            cItem.passenger.forEach(dItem =>{
              dItem.ticket_type = dItem.ticket_type === '成人票' ? 0 :1   // 车票类型
              dItem.ticket_species = dItem.ticket_species === '电子票' ? 0:
                  dItem.ticket_species === '网票' ? 1:
                      dItem.ticket_species === '纸票' ? 2: '' // 车票类型 0:电子票、1:网票、2:纸票
            })
          })
        })

        let data ={
          order_sn: this.orderInfo.order_sn, // 主订单号
          old_order_sn: this.orderInfo.old_order_sn,  // 旧订单号
          customer: this.customerName, // 客户商标识
          issuer: this.billerName, // 发单人标识
          origin_data: this.saveGroupMessage, // Q群原始信息
          route_type: 0,
          certificates: '',
          source_file: '',
          ticket_photos: '',
          remarks: '',
          route: JSON.stringify(orderList),
        }
        this.$axios.post('/api/order/add',data)
            .then(res =>{
              if(res.data.code === 0){
                this.$message.success('保存成功')
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

    },
    created() {
      this.urlTypeSelect()

      this.getCustomerData()  // 获取客户商列表
    },
    mounted() {

    }
  }
</script>

<style scoped lang="less">
  /deep/.el-input{
    &.is-disabled{
      .el-input__inner{
        background: transparent;
        border: unset;
        color: black;
        cursor: text;
      }
    }
  }
  /deep/.el-textarea{
    &.is-disabled{
      .el-textarea__inner{
        background: transparent;
        border: unset;
        color: black;
        cursor: text;
      }
    }
  }

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
        display: inline-flex;
        align-items: center;
        padding-left: 15px;
        cursor: pointer;
        color:rgba(38,153,251,1);
        >i{
          margin-right: 10px;
        }
      }
      .header_btn{
        margin-left: 55px;
      }
    }

    .order_header_add{
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      .add_title{
        width: 150px;
        flex-shrink: 0;
      }
      .add_input{
        width: 100%;
      }
      .add_btn{
        margin-left: 20px;
      }
    }


    .header_header_details{
      background:rgba(238,247,255,1);
      margin-bottom: 40px;
      padding: 15px;
      width: 100%;
    }

    // 新增
    .addOrderTable{
      margin-bottom: 60px;
      .add_table_header{
        margin-bottom: 20px;
      }
      .table{
        .table_header{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          font-size:16px;
          color:rgba(51,148,250,1);
          width: 100%;
          height:65px;
          background:rgba(238,247,255,1);
          .table_header_train{
            display: flex;
            align-items: center;
            >div{
              margin: 0 10px;
            }
          }
        }
      }
    }




    // 详情or编辑
    .order_info{
      width: 100%;
      margin-bottom: 45px;
      .title{
        width: 150px;
        flex-shrink: 0;
        text-align: right;
        padding-right: 15px;
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
            span{
              display: inline-flex;
              margin-right: 10px;
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
      .add_upload{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 150px;
        height: 120px;
      }
      .info_upload{
        margin-left: 150px;
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

    .order_passenger_search{
      margin-bottom: 40px;
      .search_box{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        /deep/.el-input{
          margin-right: 15px;
        }
      }
      .search_btn{
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    .order_details_bottom{
      display: flex;
      .order_bottom_table{
        width: 50%;

        &:last-child{
          margin-left: 40px;
        }
      }
    }
  }
</style>
