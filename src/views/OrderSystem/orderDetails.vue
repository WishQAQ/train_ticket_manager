<template>
  <div class="orderDetails" v-loading="loading">
    <el-button class="edit_order_btn" type="primary" v-if="urlType === 'details'" @click="openEditBtn">编辑订单</el-button>
    <div class="order_header" v-if="urlType !== 'add' || addHeaderShow">
      <div class="header_title" @click="openHeaderDetailsBtn">
        <i v-if="!headerDetails" class="el-icon-circle-plus-outline"></i>
        <i v-else class="el-icon-remove-outline"></i>
        订单Q群原始信息
      </div>
      <el-button class="header_btn" v-if="urlType === 'details' && this.orderInfo.source_file">原始文件下载</el-button>
    </div>

    <!-- Q群信息展开 -->
    <el-collapse-transition>
      <div class="header_header_details" v-show="headerDetails">
        <el-input
            placeholder="暂无需求信息"
            type="textarea"
            resize="none"
            :rows="6"
            v-model="orderInfo.group_origin_data || saveGroupMessage"
            disabled>
        </el-input>
      </div>
    </el-collapse-transition>

    <div class="order_header_add" v-if="urlType === 'add'">
      <div class="add_title">{{addHeaderShow?'智能识别信息':'订单Q群原始信息'}}</div>
      <div class="add_input">
        <el-input
            placeholder="陈晶 21:30:03
123456789
11/11深圳——无锡G2158
刘燕芬 440104195505163426
廖伟佳 440104195104073411
03月11日遂宁——南充G2902、03-13南充——遂宁G2905
戚薇310110196211056302
杨国妹310110196211056302儿童票
01\12厦门北—桂林G2158、11/11桂林——上海G2158、11.11日上海——桂林G2158、11.11日桂林——厦门北G2158
杨星310110196211056302
谭琦31011019621105630儿童票"
            type="textarea"
            resize="none"
            :rows="8"
            v-model="AddGroupOriginData">
        </el-input>
      </div>
      <el-button v-if="!addBtnType" class="add_btn" @click="saveGroupBtn()">保存</el-button>
      <el-button v-if="addBtnType" class="add_btn" @click="addGroupBtn" v-loading="addBtnDisabled">识别</el-button>
    </div>

    <!-- 用户初始信息 -->
    <div class="order_info">
      <div class="info_header">
        <p class="title">订单号</p>
        <div class="info_header_table">
<!--          <div>{{orderInfo.order_sn}}</div>-->
          <el-input clearable @input="change($event)" v-model="orderInfo.order_sn" :disabled="true"></el-input>
          <div>
            <span>客户商</span>
            <el-select filterable @change="getBillerData(orderInfo.cname)" v-model="orderInfo.cname" :disabled="inputDisabled" placeholder="请选择">
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
            <el-select filterable v-model="orderInfo.dName" :disabled="inputDisabled" placeholder="请选择">
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
          <div class="info_upload_image" v-if="orderInfo.certificates && urlType === 'edit'">
            <UploadLeaflet
                v-if="urlType === 'edit'"
                v-on:uploadAddress="uploadIdPhoto"
                :defaultPhoto="orderInfo.certificates"
                :messageText="'证件照片'"></UploadLeaflet>
            <PublicImage v-else :url="orderInfo.certificates"></PublicImage>

          </div>
        </div>
      </div>
      <div class="add_upload" v-if="urlType === 'add'">
        <UploadLeaflet :messageText="'证件照片'"></UploadLeaflet>
        <UploadLeaflet :messageText="'源文件'"></UploadLeaflet>
      </div>
      <div class="info_upload" v-if="urlType !== 'add' && ticketPhotoList.length > 0">
        <div class="upload_image_main">
          <div class="ticket_photo_box">
            <el-image v-for="(item,index) in ticketPhotoList" :key="index" :src="'http://oa.huimin.dev.cq1080.com/'+item"></el-image>
          </div>
          <UploadLeaflet
              v-if="urlType === 'edit'"
              ref="uploadImage"
              v-on:uploadAddress="uploadIdTicketPhoto"
              :messageText="'车票照片'"></UploadLeaflet>
          <PublicImage
              v-else
              v-for="(item,index) in orderInfo.ticket_photos || 5"
              :key="index"
              :url="isNaN(item)? item : ''">
          </PublicImage>
        </div>
        <div class="info_message_box">
          <p>车票照片</p>
          <el-button v-if="urlType === 'edit'" @click="openUploadBox" type="primary" size="mini">车票/快递单上传</el-button>
          <el-button v-else type="primary" size="mini" @click="downAllPhoto"><a>下载所有图片</a></el-button>
        </div>
      </div>
    </div>

    <!-- 新增表格 -->
    <div v-if="urlType === 'add'">
      <div class="add_table" v-for="(item, index) in addTrainTableArray" :key="index">
        <div class="addOrderTable">
<!--          <div class="add_table_header">-->
<!--            <el-button>隐藏</el-button>-->
<!--            <el-button>增加表</el-button>-->
<!--            <el-button>删除表</el-button>-->
<!--            <el-button>内容清空</el-button>-->
<!--            <el-button>批量删除</el-button>-->
<!--            <el-button>保存</el-button>-->
<!--          </div>-->

          <div class="table"
               v-for="(cItem, cIndex) in item.info"
               :key="cIndex">
            <!-- 单程表头 -->
            <div class="table_header">
              <div>行程类型：{{item.type === 0? '单程':
                item.type === 1? '往返':
                item.type === 2? '中转':
                item.type === 3? '中转往返': ''}}</div>
              <div style="display: flex;align-items: center">
                行程时间：
                <el-date-picker
                    :clearable="false"
                    v-model="cItem.riding_time"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
              </div>
              <div class="table_header_train">
                <p style="width: 120px"><el-input v-model="cItem.initial_station" placeholder="发站"></el-input></p>
                <div style="width: 100px"><el-input v-model="cItem.trips_number" placeholder="车次"></el-input></div>
                <p style="width: 120px"><el-input v-model="cItem.stop_station" placeholder="到站"></el-input></p>
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
                  <el-button size="mini" @click="deleteList(cItem.passenger,scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

        </div>
      </div>

      <div class="submitAllDataBtn" v-if="urlType !== 'details' && addTrainTableArray.length > 0">
        <el-button
            type="primary"
            v-loading="allAddSubmitLoading"
            @click="allAddSubmit">
          全部保存
        </el-button>
      </div>

    </div>

    <!-- 详情or编辑 表格 -->
    <div v-if="urlType !== 'add'">
      <!-- 广告 -->
      <div class="order_carousel" v-if="urlType === 'details'">
        <div class="carousel_main">
          <el-carousel class="carousel_main" height="40px" direction="vertical" loop autoplay arrow="none" indicator-position="none">
            <el-carousel-item v-for="(item ,index) in orderInfo.news" :key="index">
              <div class="medium" @click="openNewsCenter(item)">{{ item.title }}</div>
            </el-carousel-item>
            <div v-if="!orderInfo.news">暂无新闻</div>
          </el-carousel>
        </div>
      </div>

      <div class="order_passenger_search">
        <div class="search_box">
          <el-input v-model="passengerSearch.info" clearable placeholder="请输入乘客信息/支付账号/流水账号/12306账号"></el-input>
          <el-input v-model="passengerSearch.train_number" clearable placeholder="请输入车次"></el-input>
          <el-input v-model="passengerSearch.departure_station" clearable placeholder="请输入发站地址"></el-input>
          <el-input v-model="passengerSearch.arrive_station" clearable placeholder="请输入到站地址"></el-input>
          <el-date-picker
              v-model="passengerSearch.newTripTime"
              type="date"
              placeholder="请选择行程时间">
          </el-date-picker>
          <el-date-picker
              v-model="passengerSearch.newDrawBillTime"
              type="date"
              placeholder="请选择出票时间">
          </el-date-picker>
          <el-select v-model="passengerSearch.ticket_type" clearable placeholder="请选择票类">
            <el-option label="电子票" value="0"></el-option>
            <el-option label="网票" value="1"></el-option>
            <el-option label="纸票" value="2"></el-option>
          </el-select>
          <el-select v-model="passengerSearch.ticket_status" clearable placeholder="请选择车票状态">
            <el-option label="未出票" value="0"></el-option>
            <el-option label="已出票" value="1"></el-option>
            <el-option label="已取消票" value="2"></el-option>
            <el-option label="已改签" value="3"></el-option>
            <el-option label="已退票" value="4"></el-option>
          </el-select>
          <el-button @click="passengerSearchBtn">搜索</el-button>
        </div>
        <div class="search_btn">
          <div>
            <el-button @click="hiddenTable">{{showTableType?'隐藏':'显示'}}</el-button>
            <el-button type="primary" v-if="urlType === 'details'" @click="selectJumpPay">批量购票</el-button>
            <el-button type="primary"
                       @click="openBatchEdit"
                       :loading="batchEditLoading"
                       v-if="urlType === 'edit'">
              批量修改</el-button>
            <el-button type="primary"
                       @click="deleteOrderList"
                       v-if="urlType === 'edit'">
              批量删除</el-button>
            <el-button type="primary" v-if="urlType === 'edit'" @click="addStrokeBtn">添加行程</el-button>
          </div>
<!--          <el-button v-if="urlType === 'edit'">导出菜单</el-button>-->
        </div>
      </div>

      <!-- 订单表格 -->
      <div class="order_passenger">
        <div class="passenger_table"
             v-for="(item,index) in passengerInfo"
             :key="index">
          <div class="train_message">
            <div class="train_route">
              行程类型：
              {{item.route_type === 0 ?'单程' :
              item.route_type === 1 ?'往返' :
              item.route_type === 2 ?'中转' :
              item.route_type === 3 ?'中转往返' :''}}
            </div>

            <div>合计票款：{{item.ticketPrice || '0.00'}} 元</div>
            <div>快递费：{{item.express_fee || '0.00'}} 元</div>
            <div>退票交通费：{{item.refund_fare || '0.00'}} 元</div>
            <div>合计：{{item.ticketNumber || '0'}} 张</div>

            <el-button
                class="addUserListBtn"
                @click="addTableUserBtn(item)"
                type="primary"
                size="mini"
                v-if="urlType === 'edit'">
              添加乘客
            </el-button>
          </div>
          <div
              v-for="(cItem,cIndex) in item.route_config"
              :key="cIndex"
              class="passenger_table_route">
            <div class="train_route_message">
              <div style="margin-right: 15px"
                   v-if="urlType === 'edit'">
                <el-checkbox @change="checkedOrderData(item,cItem)" v-model="checkedOrderBtn"></el-checkbox>
              </div>
              <div>行程时间：<span>{{$getTimeYear(cItem.riding_time * 1000)}}</span></div>
                <div>
                  乘车区间：
                  <el-tooltip class="item" :disabled="urlType !== 'edit'" effect="dark" content="点击修改路线信息" placement="top">
                    <div :class="['ticket_message',{'edit_message':urlType === 'edit'}]" @click="openEditTicketBrn(item,cItem)">
                      <span>{{cItem.departure_station}}</span>
                      <p>{{cItem.trips_number}}</p>
                      <span>{{cItem.arrival_station}}</span>
                    </div>
                  </el-tooltip>

                </div>
              <div>检票口：{{cItem.ticket_check}}</div>
            </div>
            <TrainTimesTable
                v-on:tableRowsData="editTableRows"
                v-on:checkTableData="checkTableList"
                v-on:jumpPayTicket="jumpPayTicket"
                v-on:jumpEditTicket="jumpEditTicket"
                :tableModify="urlType"
                :index="index"
                :cIndex="cIndex"
                :showTableRows="showTableType"
                :orderInfo="item"
                :tableData="cItem.passengers.data">
            </TrainTimesTable>
          </div>
        </div>
      </div>

      <div class="order_add_remarks" v-if="urlType === 'edit'">
        <el-input placeholde="请填写需要新添加的备注信息" v-model="addRemarksMessage"></el-input>
        <el-button @click="submitNewRemarsk" type="primary">提交备注</el-button>
      </div>

      <div class="order_details_bottom">
        <!-- 订单备注表格 -->
        <div class="order_bottom_table">
          <div class="table_header">备注信息</div>
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
          <Pagination
              ref="pagination"
              :pageData="paginationRemarksList"
              @jumpSize="jumpRemarksSize"
              @jumpPage="jumpRemarksPage">
          </Pagination>

        </div>

        <!-- 订单操作日志表格 -->
        <div class="order_bottom_table">
          <div class="table_header">操作日志</div>
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
          <Pagination
              ref="pagination"
              :pageData="paginationLogList"
              @jumpSize="jumpLogSize"
              @jumpPage="jumpLogPage">
          </Pagination>

        </div>
      </div>

      <div class="submitAllDataBtn" v-if="urlType !== 'details'">
        <el-button
            v-if="urlType === 'edit'"
            type="primary"
            @click="allEditSubmit">
          全部保存
        </el-button>
      </div>


    </div>

    <!-- 添加乘客弹窗 -->
    <el-dialog
        title="添加乘客"
        width="60%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        custom-class="add_user_dialog"
        :visible.sync="addUserDialog">
      <div class="dialog_main">
        <div class="order_table_header" v-for="(item,index) in userListHeader.info" :key="index">
          <div>
            行程类型：
            {{userListHeader.route_type === 0 ?'单程' :
            userListHeader.route_type === 1 ?'往返' :
            userListHeader.route_type === 2 ?'中转' :
            userListHeader.route_type === 3 ?'中转往返' :''}}
          </div>
          <div>行程时间：<span>{{$getTimeYear(item.riding_time * 1000)}}</span></div>
          <div>
            乘车区间：
            <span>{{item.departure_station}}</span>
            <p>{{item.trips_number}}</p>
            <span>{{item.arrival_station}}</span>
          </div>
          <div>车次：{{item.trips_number}}</div>
        </div>

        <el-input
            type="textarea"
            class="order_user_message"
            :rows="5"
            resize="none"
            placeholder="请输入乘客信息。格式：姓名+身份证+（默认为成人票，如是儿童请加上儿童票）"
            v-model="addUserInfo">
        </el-input>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddUserDialog()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 批量修改 -->
    <el-dialog
        v-dialogDrag
        title="批量修改"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        custom-class="batch_edit_dialog"
        :visible.sync="batchEditDialog">
      <div class="dialog_main"
           v-for="(item,index) in batchEditInfo"
           :key="index">
        <div class="main_box">
          <div class="main_box_title">原路线信息</div>
          <div class="main_box_content" :style="{ opacity: '.5'}">
            <div class="content_route" v-for="(cItem,cIndex) in item.route" :key="cIndex">
              <div>{{$getTimeYear(cItem.riding_time * 1000)}}</div>
              <div class="route_message">
                <span>{{cItem.departure_station}}</span>
                <p>{{cItem.trips_number}}</p>
                <span>{{cItem.arrival_station}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="main_box">
          <div class="main_box_title">车票状态</div>
          <div class="main_box_content">
            <el-select v-model="item.ticket_status" placeholder="请选择">
              <el-option label="已出票" value="1"></el-option>
              <el-option label="已取消票" value="2"></el-option>
              <el-option label="已改签" value="3"></el-option>
              <el-option label="已退票" value="4"></el-option>
            </el-select>
          </div>
        </div>

        <!--出票 or 改签-->
        <div class="ticket_box" v-if="item.ticket_status === '1' || item.ticket_status === '3'">
          <div class="main_box">
            <div class="main_box_content">
              <div class="content_route" v-for="(cItem,cIndex) in item.route" :key="cIndex">
                <div class="content_edit_time">
                  <el-date-picker
                      @input="change($event)"
                      v-model="item.riding_time"
                      type="date"
                      :placeholder="$getTimeYear(cItem.riding_time * 1000)">
                  </el-date-picker>
                </div>
                <div class="route_message edit_route_message" style="margin-left: 5px">
                  <div style="width: 105px"><el-input clearable @input="change($event)" v-model="item.departure_station" :placeholder="cItem.departure_station"></el-input></div>
                  <div style="width: 60px">
                    <el-select clearable @input="change($event)" v-model="item.directionOne" placeholder="">
                      <el-option label="东" value="东"></el-option>
                      <el-option label="南" value="南"></el-option>
                      <el-option label="西" value="西"></el-option>
                      <el-option label="北" value="北"></el-option>
                    </el-select>
                  </div>
                  <p style="margin: 0 5px"><el-input clearable @input="change($event)" v-model="item.trips_number" :placeholder="cItem.trips_number"></el-input></p>
                  <div style="width: 105px"><el-input clearable @input="change($event)" v-model="item.arrival_station" :placeholder="cItem.arrival_station"></el-input></div>
                  <div style="width: 60px">
                    <el-select clearable @input="change($event)" v-model="item.directionTwo" placeholder="">
                      <el-option label="东" value="东"></el-option>
                      <el-option label="南" value="南"></el-option>
                      <el-option label="西" value="西"></el-option>
                      <el-option label="北" value="北"></el-option>
                    </el-select>
                  </div>
              </div>
            </div>
            </div>
          </div>
          <div class="main_box">
            <div class="main_box_title">票类</div>
            <div class="main_box_content">
              <el-select clearable @input="change($event)" v-model="item.ticket_type" placeholder="请选择">
                <el-option label="电子票" value="0"></el-option>
                <el-option label="网票" value="1"></el-option>
                <el-option label="纸票" value="2"></el-option>
              </el-select>
            </div>
          </div>
          <div class="main_box">
            <div class="main_box_title">席别</div>
            <div class="main_box_content">
              <el-select clearable @input="change($event)" v-model="item.fwId" placeholder="请选择">
                <el-option
                    v-for="(o,i) in agentCategory"
                    :key="i"
                    :label="o.name"
                    :value="o.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="main_box">
            <div class="main_box_title">票价</div>
            <div class="main_box_content">
              <el-input clearable @input="change($event)" v-model="item.ticket_price" placeholder="请输入票价"></el-input>
            </div>
          </div>
          <div class="main_box">
            <div class="main_box_title">儿童票价</div>
            <div class="main_box_content">
              <el-input clearable @input="change($event)" v-model="item.child_ticket_price" placeholder="请输入儿童票价"></el-input>
            </div>
          </div>
          <div class="main_box">
            <div class="main_box_title">误餐费</div>
            <div class="main_box_content">
              <el-input clearable @input="change($event)" v-model="item.missed_meals_money" placeholder="请输入误餐费"></el-input>
            </div>
          </div>
          <div class="main_box">
            <div class="main_box_title">出票费</div>
            <div class="main_box_content">
              <el-input clearable @input="change($event)" v-model="item.ticket_fare" placeholder="请输入出票费"></el-input>
            </div>
          </div>
        </div>

        <div class="ticket_box" v-if="item.ticket_status === '4'">

          <div class="main_box">
            <div class="main_box_title">退票款</div>
            <div class="main_box_content">
              <el-input clearable @input="change($event)" v-model="item.refund_fee" placeholder="请输入退票款"></el-input>
            </div>
          </div>
        </div>

        <el-button style="margin-top: 20px" type="primary" @click="saveEditBtn(item.ticket_status,item,item.route)">保存</el-button>

      </div>
      <div slot="footer" class="dialog-footer" style="justify-content: flex-end">
        <el-button @click="closedEditDialog">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 新闻详情弹窗 -->
    <el-dialog
        :title="'新闻详情 --- ' + newsDetailInfo.title"
        modal-append-to-body
        append-to-body
        :visible.sync="newsDetailDialog"
        custom-class="news_detail_dialog">
      <div class="detail_main">
        <div class="title">{{newsDetailInfo.title || '暂无文档标题' }}</div>
        <div class="content">{{newsDetailInfo.content || '暂无文档内容'}}</div>
        <div class="person_box">
          查看人： <span v-for="(item, index) in newsDetailInfo.person" :key="index">{{item.account}}</span>
        </div>
      </div>
    </el-dialog>

    <!-- 批量修改路线变更提示框 -->
    <el-dialog
        title="提示"
        modal-append-to-body
        append-to-body
        width="450px"
        :visible.sync="editRouteDialog"
        custom-class="edit_route_dialog">
      <div class="detail_main">
        <div>
          由于系统检测到原路线
          <div class="edit_route_info" style="display: inline-flex; font-weight: bold; font-size: 12px;margin-bottom: 15px">
            {{$getTimeYear(editRouteInfo[0].riding_time * 1000)}}
            {{editRouteInfo[0].departure_station}}
            <span style="margin: 0 8px;color: #409EFF;position: relative;top: -3px">{{editRouteInfo[0].trips_number}}</span>
            {{editRouteInfo[0].arrival_station}}
          </div>
        </div>
        <div>存在其他车票状态，且新路线关键词被修改，是否保存相关信息将所选乘客移动到新路线？</div>
      </div>
      <div slot="footer" class="dialog-footer" style="justify-content: flex-end">
        <el-button @click="closedEditRoute">取消</el-button>
        <el-button type="primary" @click="submitEditRoute(editRouteInfo[0])">移动</el-button>
      </div>
    </el-dialog>

    <!-- 新增行程 -->
    <el-dialog
        title="新增行程"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        modal-append-to-body
        append-to-body
        width="650px"
        :visible.sync="addStrokeDialog"
        custom-class="add_stroke_dialog">
      <div class="detail_main">
        <el-radio-group size="mini" v-model="strokeTableType" @change="changeStrokeType">
          <el-radio-button label="单程"></el-radio-button>
          <el-radio-button label="往返"></el-radio-button>
          <el-radio-button label="中转"></el-radio-button>
          <el-radio-button label="中转往返"></el-radio-button>
        </el-radio-group>

        <div class="add_stroke_table">
          <div class="table_header">
            <div class="header_box" v-for="(item ,index) in addStrokeArr" :key="index">
              <div>
                <el-date-picker
                  v-model="item.riding_time"
                  style="width: 140px"
                  type="date"
                  placeholder="行程日期">
                </el-date-picker>
              </div>
              <div class="header_ticket">
                <el-input clearable v-model="item.initial_station" placeholder="输入发站"></el-input>
                <el-input class="ticket_number" clearable v-model="item.trips_number" placeholder="输入车次"></el-input>
                <el-input clearable v-model="item.stop_station" placeholder="输入到站"></el-input>
              </div>
            </div>
          </div>

          <div class="table_content">
            <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入乘客信息"
                v-model="addStrokePassengers">
            </el-input>
          </div>
        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStrokeDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAddStroke" v-loading="addStrokeLoading">保存</el-button>
      </div>
    </el-dialog>

    <!-- 修改乘车区间弹窗 -->
    <el-dialog
        title="修改乘车区间"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        modal-append-to-body
        append-to-body
        width="400px"
        :visible.sync="editTicketMessage"
        custom-class="edit_ticket_message_dialog">
      <div class="detail_main">
        <el-form label-width="50px">
          <el-form-item label="发站" class="edit_ticket_message_form">
            <el-input :disabled="editTicketInfo.is_ticket_issue" class="edit_ticket_message_input" clearable :placeholder="editTicketInfo.departure_station" v-model="new_departure_station"></el-input>
            <el-select clearable style="width: 80px" v-model="departure_path" placeholder="方向">
              <el-option label="东" value="东"></el-option>
              <el-option label="南" value="南"></el-option>
              <el-option label="西" value="西"></el-option>
              <el-option label="北" value="北"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="车次">-->
<!--            <el-input v-model="form.name"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="到站" class="edit_ticket_message_form">
            <el-input :disabled="editTicketInfo.is_ticket_issue" class="edit_ticket_message_input" clearable :placeholder="editTicketInfo.arrival_station" v-model="new_arrival_station"></el-input>
            <el-select clearable style="width: 80px" v-model="arrival_path" placeholder="方向">
              <el-option label="东" value="东"></el-option>
              <el-option label="南" value="南"></el-option>
              <el-option label="西" value="西"></el-option>
              <el-option label="北" value="北"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTicketMessage = false">取消</el-button>
        <el-button type="primary" v-loading="editTicketMessageLoading" @click="submitEditTicketMessage">保存</el-button>
      </div>
    </el-dialog>

    <!-- 选择12306账号弹窗 -->
    <el-dialog
        title="12306账号"
        :close-on-click-modal="false"
        modal-append-to-body
        append-to-body
        width="500px"
        :visible.sync="selectTicketMessage"
        custom-class="select_ticket_dialog">
      <div class="detail_main">
        <el-table
            ref="singleTable"
            :data="userTicketData"
            highlight-current-row
            @current-change="handleCurrentChange"
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
              label="12306账号"
              prop="account">
          </el-table-column>
          <el-table-column
              label="账号备注"
              prop="remarks">
          </el-table-column>
        </el-table>
        <Pagination
            ref="pagination"
            :pageData="userPaginationList"
            @jumpSize="userJumpSize"
            @jumpPage="userJumpPage">
        </Pagination>
      </div>
    </el-dialog>

<!--    &lt;!&ndash; 选择行程弹窗 &ndash;&gt;-->
<!--    <el-dialog-->
<!--        title="确定发站信息"-->
<!--        :close-on-click-modal="false"-->
<!--        :close-on-press-escape="false"-->
<!--        :show-close="false"-->
<!--        modal-append-to-body-->
<!--        append-to-body-->
<!--        width="500px"-->
<!--        :visible.sync="starTicketSite"-->
<!--        custom-class="select_ticket_site">-->
<!--      <div class="detail_main">-->
<!--        <el-select @input="change($event)" v-model="starSite" placeholder="请选择">-->
<!--          <el-option-->
<!--              v-for="(item,index) in GetTicketData"-->
<!--              :key="index"-->
<!--              :label="item.name"-->
<!--              :value="item.code">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </div>-->
<!--    </el-dialog>-->

<!--    &lt;!&ndash; 选择行程弹窗 &ndash;&gt;-->
<!--    <el-dialog-->
<!--        title="确定到站信息"-->
<!--        :close-on-click-modal="false"-->
<!--        :close-on-press-escape="false"-->
<!--        :show-close="false"-->
<!--        modal-append-to-body-->
<!--        append-to-body-->
<!--        width="500px"-->
<!--        :visible.sync="endTicketSite"-->
<!--        custom-class="select_ticket_site">-->
<!--      <div class="detail_main">-->
<!--        <el-select @input="change($event)" v-model="endSite" placeholder="请选择">-->
<!--          <el-option-->
<!--              v-for="(item,index) in GetTicketData"-->
<!--              :key="index"-->
<!--              :label="item.name"-->
<!--              :value="item.code">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </div>-->
<!--    </el-dialog>-->

    <!-- 填写chrome扩展ID -->
    <el-dialog
        title="填写chrome扩展ID"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        modal-append-to-body
        append-to-body
        width="500px"
        :visible.sync="extensionsDialog"
        custom-class="extensions_id_dialog">
      <div class="detail_main">
        <el-input placeholder="请填写已安装成功的chrome扩展ID" v-model="extensionsId"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveExtensionsId">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import TrainTimesTable from '@/components/TrainTimesTable/index'

  import GetTicketData from '../../api/FeHelper-20191122183718'

  export default {
    name: "orderDetails",
    components:{
      TrainTimesTable,
      // 'TrainTimesTable': () => import('@/components/TrainTimesTable/index'),
      'PublicImage':() => import('@/components/public/public_image'),
      'UploadLeaflet': () => import('@/components/UploadLeaflet/index'),
      'UploadMultiplePictures': () => import('@/components/UploadMultiplePictures/index'),
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        GetTicketData: GetTicketData,  // 12306行程代码

        extensionsId: sessionStorage.getItem('extensions_id') || '', // 扩展代码
        extensionsDialog: false,

        loading: true,
        orderSn: '', // 订单号

        urlType: '', // 页面类型
        inputDisabled: false, // 页面输入框禁用

        newsDetailDialog: false, // 新闻详情
        newsDetailInfo: {},

        showTableType: false, // 显示隐藏单元格

        /***
         * 新增订单
         */
        AddGroupOriginData: '',  // 模糊查询Q群信息

        customerMessage: {}, // 识别客户商与发单人

        saveGroupMessage: '', // 初始信息保存
        addBtnType: false,  // 保存 or 识别按钮切换
        addBtnDisabled: false, // 识别按钮

        orderInfo: {
          cname: '',
          dName: ''
        }, // 订单详情列表

        cname:  '', // 客户商
        customerList: [],  // 客户商列表
        dName: '',  // 发单人
        billerList: [], // 发单人列表

        addHeaderShow: false, // 新增订单显示原始信息

        headerDetails: false, // 原始Q群需求初始状态

        /***
         * 上传
         */
        userCardImage: '', // 证件照片
        fileList: [], // 上传文件列表

        ticketPhotoList: [], // 车票图片列表

        passengerInfo: [], // 乘客信息列表 筛选表格状态 0:单程 1：往返 2：中转 3：中转往返

        passengerSearch: { // 乘客信息搜索
          info: '',
          train_number: '',
          departure_station: '',
          arrive_station: '',
          newTripTime: '',
          newDrawBillTime: '',
          ticket_type: '',
          ticket_status: '',
        },

        addDataList: [], // 新增获取车次信息
        addTrainTableArray: [], // 新增获取乘客表格信息
        addTrainType: '', // 新增乘客车票类型

        allAddSubmitLoading: false,  // 新增订单加载

        selectPassengerList: [], // 乘客信息多选列表

        orderRemarks: [], // 订单备注列表

        orderLog: [], // 订单操作日志列表

        checkedOrderBtn: false, // 路线多选按钮
        checkedOrderList: '', // 多选列表

        /***
         * 编辑
         */
        orderId: '', // 订单id
        orderToken: '', // 订单token

        addRemarksMessage: '', // 新增备注信息

        addUserDialog: false, // 添加乘客弹窗
        userListHeader: '', // 新增弹窗表头信息
        addUserInfo: '', // 新增乘客输入框

        checkedTableList: {}, // 表格乘客多选列表
        checkedRouteList: {}, // 表格路线多选列表
        editOrderToken: {},
        orderRouteId: '', // 父数组下标
        orderTableId: '', // 子数组下标
        selectOrderId: 0, // 选择器自增下标
        deleteUserList: [],  // 多选删除乘客列表
        batchEditLoading: false, // 批量修改加载

        batchEditDialog: false, // 批量修改弹窗
        batchEditList: [], // 批量修改列表
        batchEditData: {  // 基本信息
          info: {
            information: [],
          }
        },
        batchEditInfo: [],  // 批量修改数据
        selectTicketStatus: '', // 选择车票状态

        routeStatus: '', // 修改行程状态

        editRouteData: [], // 批量修改输入框数据

        editRouteDialog: false, // 批量修改路线变更提示弹窗
        agentCategory: [], // 获取席别列表

        editRouteInfo: [{
          riding_time: '',
          departure_station: '',
          trips_number: '',
          arrival_station: '',
        }], // 原始路线信息

        addStrokeDialog: false, // 新增行程弹窗
        strokeTableType: '单程', // 新增行程类型选择
        addStrokeArr:[{
          riding_time: '',  // 行程时间
          initial_station: '',  // 发站
          stop_station: '', // 到站
          trips_number: '',  // 车次
        }],
        addStrokePassengers: '', // 乘客信息
        addStrokeLoading: false, // 新增行程提交按钮加载


        editTicketMessage: false, // 修改乘车区间弹窗
        editTicketOrderInfo: {},  // 乘车区间订单信息
        editTicketInfo: {},  // 乘车区间路线信息
        new_departure_station: '', // 新发站
        new_arrival_station: '', // 新到站
        departure_path: '', // 发站方向
        arrival_path: '', // 到站方向
        editTicketMessageLoading: false,  // 修改乘车区间提交按钮加载


        userPaginationList: {},  // 12306账号 分页
        userPer_page: 10,  // 13206账号 数据量
        userPage: '',  // 12306账号 页码
        userTicketData: [],  // 12306账号数据
        userOrderInfo: {},  // 当前买票时间路线人员信息
        selectTicketMessage: false, // 12306账号选择弹窗
        //
        // starTicketSite: false, // 选择发站弹窗
        // endTicketSite: false, // 选择到站弹窗
        // starSite: '', // 发站
        // endSite: '', // 到站

        paginationRemarksList: {},
        remarksPer_page: 10,
        remarksPage: '',

        paginationLogList: {},
        logPer_page: 10,
        logPage: ''
      }
    },
    watch: {
      '$route'(to, from) {
        // this.urlTypeSelect()
        // this.getCustomerData()  // 获取客户商列表
      },
    },
    methods:{
      change(e){
        this.$forceUpdate()
      },

      /**
       * @Description: 下载所有图片
       * @author Wish
       * @date 2019/11/18
      */
      downAllPhoto(){
        this.$axios.get('/api/order/downloadImage/'+this.orderSn,{responseType: 'blob'})
            .then(res =>{
              let link = document.createElement('a');
              link.style.display = 'none';

              link.href = URL.createObjectURL(res.data); //创建一个指向该参数对象的URL
              link.download = this.orderSn+ '车票照片包.zip';
              link.click(); // 触发下载
              URL.revokeObjectURL(link.href);
            })
      },

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
                  if(this.orderInfo.ticket_photos){
                    this.orderInfo.ticket_photos = this.orderInfo.ticket_photos.split(',')
                  }
                })
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },


      /**
       * @Description: 获取新闻详情
       * @author Wish
       * @date 2019/11/4
      */
      openNewsCenter(val){
        this.$message.success('正在获取新闻内容，请稍后')
        this.$axios.get('/api/notice/showOne/1/'+val.id)
            .then(res =>{
              if(res.data.code === 0){
                this.newsDetailInfo = res.data.result[0]
                this.newsDetailDialog = true
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 页面类型
       * @author Wish
       * @date 2019/10/30
      */
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
              let ticketNumber = 0
              let ticketPrice = 0
              this.passengerInfo.forEach((item,index) =>{
               item.route_config.forEach((cItem,cIndex) =>{
                 if(cIndex < item.route_config.length){
                   ticketNumber += cItem.numberSheet
                   if(cItem.totalPrice !== 0){
                     ticketPrice += cItem.totalPrice
                   }
                   this.passengerInfo[index]['ticketNumber'] = ticketNumber
                   this.passengerInfo[index]['ticketPrice'] =  Math.floor(ticketPrice * 100) / 100
                 }
               })
                ticketNumber = 0
                ticketPrice = 0
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
        this.passengerSearch['trip_time'] = JSON.parse(JSON.stringify(this.$dateToMs(this.passengerSearch.newTripTime) / 1000))
        this.passengerSearch['draw_bill_time'] = JSON.parse(JSON.stringify(this.$dateToMs(this.passengerSearch.newDrawBillTime) / 1000))
        this.$axios.post('/api/order/detailsRoute/'+this.orderSn,this.passengerSearch)
            .then(res =>{
              console.log(res);
              this.loading = false
              this.passengerInfo = res.data
            })
      },

      /**
       * @Description: 隐藏乘车信息表格按钮
       * @author Wish
       * @date 2019/10/17
      */
      hiddenTable(){
        this.showTableType = this.showTableType !== true
      },

      /**
       * @Description: 批量购票
       * @author Wish
       * @date 2019/11/19
      */
      selectJumpPay(){
        let ticketNumber = 0

        this.batchEditList = []
        // let newTokenArr = []
        for(let key in this.checkedTableList){
          ticketNumber += this.checkedTableList[key].length
          this.batchEditList.push({
            token: String(this.editOrderToken[key]),
            route_id: String(this.checkedRouteList[key]),
            passengers: String(this.checkedTableList[key])
          })
          // newTokenArr.push(this.editOrderToken[key])
        }
        if(ticketNumber > 5){
          this.$message.warning('批量购票最多仅支持5人')
        }else {
          this.userOrderInfo = {
            order_sn: this.orderId,
            info: JSON.stringify(this.batchEditList)
          }
          this.getUserAccountList()
        }

      },

      /**
       * @Description: 跳转12306购票页面
       * @author Wish
       * @date 2019/11/18
      */
      jumpPayTicket(userInfo,orderInfo){
        if(this.extensionsId){
          let info = []
          info.push({
            "token": orderInfo.parent_id, //行程标识
            "route_id": userInfo.route, //路线标识
            "passengers": userInfo.id, //乘客ID
          })
          this.userOrderInfo = {
            "order_sn": orderInfo.order_sn, //订单号
            info: JSON.stringify(info)
          }
          console.log(this.userOrderInfo);
          this.$message.success('正在整理您的12306账号列表，请勿刷新页面')
          this.getUserAccountList()
        }else {
          this.extensionsDialog = true
        }

      },

      /**
       * @Description: 跳转12306 退票or改签
       * @author Wish
       * @date 2019/11/21
       */
      jumpEditTicket(userInfo,orderInfo,type){
        console.log(userInfo, orderInfo,type);
        // let info = {
        //   account: userInfo.account,
        //   password: userInfo.password
        // }
        if(this.extensionsId){
          userInfo['type'] = type
          chrome.runtime.sendMessage(this.extensionsId, {data:{action:type,order:userInfo}},
              function(response) {});
          window.open("https://kyfw.12306.cn/otn/resources/login.html",'_blank')
        }else {
          this.extensionsDialog = true
        }
      },

      /**
       * @Description: 获取12306账号
       * @author Wish
       * @date 2019/11/18
      */
      getUserAccountList(){
        let data ={
          page: this.userPage || null,
        }
        this.$axios.get('/api/system/12306_account/showMe/'+this.userPer_page,{params:data})
            .then(res =>{
              if(res.data.code === 0){
                this.userTicketData = res.data.result.data
                this.userPaginationList = res.data.result
                this.selectTicketMessage = true
              }else {
                this.$message.warning(res.data.msg)
                this.selectTicketMessage = false
              }
            })
      },

      /**
       * @Description: 12306账号选择分页器
       * @author Wish
       * @date 2019/11/18
      */
      userJumpSize(val){
        this.userPer_page = val
        this.getUserAccountList()
      },
      userJumpPage(val){
        this.userPage = val
        this.getUserAccountList()
      },
      /**
       * @Description: 12306账号单选
       * @author Wish
       * @date 2019/11/18
      */
      handleCurrentChange(val) {
        this.$axios.post('/api/plug/getData',this.userOrderInfo)
            .then(res =>{
              if(res.data.code === 0){
                console.log(res.data.result);
                res.data.result.forEach((item,index) =>{
                  item['toSiteCode'] = ''
                  item['formSiteCode'] = ''
                  GetTicketData.forEach(citem =>{
                        if(citem.name === item.departure_station){
                          item['toSiteCode'] = citem.code
                        }
                        if(citem.name === item.arrival_station){
                          item['formSiteCode'] = citem.code
                        }
                      })
                })
                let userAccount = {}
                userAccount['account'] = val.account
                userAccount['password'] = val.password
                userAccount['info'] = res.data.result
                let _that = this
                chrome.runtime.sendMessage(this.extensionsId, {data:{action:"buy",order:userAccount}},
                    function(response) {
                    });
                window.open("https://kyfw.12306.cn/otn/resources/login.html",'_blank')
                _that.selectTicketMessage = false
              }else {
                this.$message.warning(res.data.msg)
              }
            })

      },


      /**
       * @Description: 储存chrome扩展Id
       * @author Wish
       * @date 2019/11/23
      */
      saveExtensionsId(){
        if(this.extensionsId){
          sessionStorage.setItem('extensions_id',this.extensionsId)
        }
        this.extensionsDialog = false
      },

      /**
       * @Description: 获取订单跟踪备注列表
       * @author Wish
       * @date 2019/10/17
      */
      getOrderRemarks(){
        let data ={
          page: this.remarksPage || null
        }
        this.$axios.post('/api/order/trackingRemarks/'+this.orderSn+'/'+this.remarksPer_page,data)
            .then(res =>{
              if(res.data.code === 0){
                this.orderRemarks = res.data.result.data
                this.paginationRemarksList = res.data.result
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },
      /**
       * @Description: 分页器
       * @author Wish
       * @data 2019/10/17
       */
      jumpRemarksSize(val){
        this.remarksPer_page = val
        this.getOrderRemarks()
      },
      jumpRemarksPage(val){
        this.remarksPage = val
        this.getOrderRemarks()
      },

      /**
       * @Description: 获取订单操作日志列表
       * @author Wish
       * @date 2019/10/17
      */
      getOrderLog(){
        let data = {
          page: this.logPage || null
        }
        this.$axios.post('/api/order/actionLog/'+this.orderSn+'/'+this.logPer_page,data)
            .then(res =>{
              if(res.data.code === 0){
                this.orderLog = res.data.result.data
                this.paginationLogList = res.data.result
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },
      /**
       * @Description: 分页器
       * @author Wish
       * @data 2019/10/17
       */
      jumpLogSize(val){
        this.logPer_page = val
        this.getOrderLog()
      },
      jumpLogPage(val){
        this.logPage = val
        this.getOrderLog()
      },

      /**
       * @Description: 获取客户商列表
       * @author Wish
       * @date 2019/10/30
      */
      getCustomerData(){
        this.$axios.get('/api/user/customer/showAll')
          .then(res =>{
            if(res.data.code === 0){
              this.customerList = res.data.result
            }
          })
      },
      /**
       * @Description: 获取发单人列表
       * @author Wish
       * @date 2019/10/30
      */
      getBillerData(data,id){
        if(data){
          this.customerList.forEach(res => {
            if(res.identity === data){
              this.billerList = res.issuer
              this.orderInfo['dName'] = ''
              // if(this.orderInfo.order_sn === ''){
              // let newOrderIdTime
              // let date = new Date();
              // this.year = date.getFullYear();
              // this.month = date.getMonth() + 1;
              // this.date = date.getDate();
              // this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
              // this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
              // this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
              // newOrderIdTime = String(this.year).slice(2)  + String(this.month)  + String(this.date)  + String(this.hour) + String(this.minute)  + String(this.second);
              // this.orderInfo.order_sn = String(res.order_prefix) + newOrderIdTime
              // }
            }
          })
        }
      },

      /**
       * @Description: 打开车票图片上传
       * @author Wish
       * @data 2019/11/7
      */
      openUploadBox(){
        this.$refs.uploadImage.$el.children[0].children[0].children[0].children[1].click()
      },

      /**
       * @Description: 上传证件照片
       * @author Wish
       * @date 2019/11/1
      */
      uploadIdPhoto(val){
        this.userCardImage = val
      },

      /**
       * @Description: 上传车票图片
       * @author Wish
       * @date 2019/11/1
      */
      uploadIdTicketPhoto(val){
        if(this.ticketPhotoList.length < 5){
          this.ticketPhotoList.push(val)
        }else {
          this.$message.warning('最多上传五张图片')
        }
        this.$refs.uploadImage.closedImage()

      },

      /**
       * @Description: 路线多选
       * @author Wish
       * @date 2019/10/30
      */
      checkedOrderData(val,cVal){
        // console.log(val, cVal);
        if(this.checkedOrderBtn){
          this.checkedOrderList = val
        }
      },
      /**
       * @Description: 编辑按钮
       * @author Wish
       * @date 2019/10/30
      */
      openEditBtn(){
        this.$routerTab.open({
          path: '/editOrder',
          title: '订单编辑',
          refresh: true,
          query:{
            order_sn: this.$route.query.order_sn,
            type: 'edit'
          }
        })
        // this.closedSelectList()
        // this.inputDisabled = false
        // this.urlType = 'edit'
        this.getBillerData(this.orderInfo.cname)  // 获取发单人列表
      },

      /**
       * @Description: 路线乘车区间修改
       * @author Wish
       * @date 2019/11/14
      */
      openEditTicketBrn(val,cVal){
        console.log(val, cVal);
        this.editTicketMessage = this.urlType === 'edit'
        this.editTicketOrderInfo = val  // 乘车区间订单信息
        this.editTicketInfo = cVal  // 乘车区间路线信息
        this.departure_path = ''
        this.arrival_path = ''
        this.new_departure_station = ''
        this.new_arrival_station = ''
      },

      /**
       * @Description: 提交乘车区间修改
       * @author Wish
       * @date 2019/11/14
      */
      submitEditTicketMessage(){
        this.editTicketMessageLoading = true
        let editTicketType = 1
        if(this.editTicketInfo.departure_station !== this.new_departure_station && this.new_departure_station !== '' || this.editTicketInfo.arrival_station !== this.new_arrival_station  && this.new_arrival_station !== ''){
          editTicketType = 0
        }
        let newForm = {}
        newForm['departure_station'] = this.new_departure_station? this.new_departure_station + this.departure_path: this.editTicketInfo.departure_station + this.departure_path
        newForm['arrival_station'] = this.new_arrival_station? this.new_arrival_station + this.arrival_path: this.editTicketInfo.arrival_station + this.arrival_path
        newForm['riding_time'] = this.editTicketInfo.riding_time
        let data = {
          order_sn: this.editTicketOrderInfo.order_sn,
          token: this.editTicketOrderInfo.parent_id,
          route: this.editTicketInfo.id,
          info: JSON.stringify(newForm)
        }
        this.$axios.post('/api/order/editRouteInfo/'+ editTicketType,data)
            .then(res =>{
              if(res.data.code === 0){
                this.editTicketMessageLoading = false
                this.$message.success('保存成功')
                this.editTicketMessage = false
                this.getPassengerList()
              }else {
                this.$message.warning(res.data.msg)
                this.editTicketMessageLoading = false
              }
            })
      },

      /**
       * @Description: 单元格修改
       * @author Wish
       * @data 2019/11/7
      */
      editTableRows(orderInfo, data, rowName, row ){
        /**
         * @Description: 遍历数组对比相同乘客路线，输出当前路线id
         * @author Wish
         * @data 2019/11/7
        */
        let routeId
        orderInfo.route_config.forEach(item =>{
          item.passengers.data.forEach(cItem =>{
            if(cItem.id === data.id){
              console.log(item);
              routeId = item.id
            }
          })
        })
        let infoData = {}
        infoData['passenger_id'] = data.id
        infoData['field'] = rowName
        infoData['value'] = row
        let param ={
          order_sn: orderInfo.order_sn,
          token: orderInfo.parent_id,
          route_id: routeId,
          info: JSON.stringify(infoData),
        }
        console.log(param);
        this.$axios.post('/api/order/editCellValue/0',param)
          .then(res =>{
            if(res.data.code === 0){
              this.$message.success('修改成功')
              this.getPassengerList()
            }else {
              this.$message.warning(res.data.msg)
              this.getPassengerList()
            }
          })

      },

      /**
       * @Description: 新增备注信息
       * @author Wish
       * @date 2019/10/30
      */
      submitNewRemarsk(){
        if(this.addRemarksMessage){
          let data ={
            order_sn: this.orderInfo.order_sn,
            remarks: this.addRemarksMessage,
            is_important: 0
          }
          this.$axios.post('/api/order/operateRemarks',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('添加成功')
                  this.getOrderRemarks()
                  this.addRemarksMessage = ''
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }else {
          this.$message.warning('请填写备注信息')
        }
      },

      /**
       * @Description: 新增乘客
       * @author Wish
       * @date 2019/10/30
      */
      addTableUserBtn(val){
        this.addUserDialog = true
        this.addUserInfo = ''
        let type = 0
        let data ={
          order_sn: val.order_sn,
          token: val.parent_id
        }
        this.$axios.post('/api/order/routeInfo/'+type,data)
            .then(res =>{
              if(res.data.code === 0){
                res.data.result.forEach(item =>{
                  this.userListHeader = item
                })
              }else {
                this.$message.warning(res.data.msg+'，将于两秒后关闭弹窗')
                this.addUserDialog = false
              }
            })
      },

      /**
       * @Description: 确认添加乘客按钮
       * @author Wish
       * @date 2019/10/30
      */
      submitAddUserDialog(){
        if(this.addUserInfo){
          let data ={
            order_sn: this.userListHeader.order_sn,
            token: this.userListHeader.parent_id,
            passengers: this.addUserInfo,
          }
          this.$axios.post('/api/order/routeInfo/addPassengers',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('添加成功')
                  this.addUserDialog = false
                  this.getPassengerList()
                }
              })
        }else {
          this.$message.warning('请填写乘客信息')
        }
      },

      /**
       * @Description: 表格多选
       * @author Wish
       * @date 2019/10/30
      */
      checkTableList(userId,userRoute, routeIndex, tableIndex,orderId, token){
        this.checkedTableList[String(routeIndex)+String(tableIndex)] = userId
        this.checkedRouteList[String(routeIndex)+String(tableIndex)] = userRoute
        this.editOrderToken[String(routeIndex)+String(tableIndex)] = token

        if(this.checkedTableList[String(routeIndex)+String(tableIndex)].length < 1){
          delete this.checkedTableList[String(routeIndex)+String(tableIndex)]
        }
        if(this.checkedRouteList[String(routeIndex)+String(tableIndex)].length < 1){
          delete this.checkedRouteList[String(routeIndex)+String(tableIndex)]
        }
        if(this.editOrderToken[String(routeIndex)+String(tableIndex)].length < 1){
          delete this.editOrderToken[String(routeIndex)+String(tableIndex)]
        }

        this.orderId = orderId
      },
      /**
       * @Description: 清空表格多选
       * @author Wish
       * @data 2019/11/15
      */
      closedSelectList(){
        this.checkedTableList = {}
        this.checkedRouteList = {}
        this.editOrderToken = {}
        this.orderId = ''
        this.orderToken = ''
        this.deleteUserList = []
        this.batchEditList = []
      },
      /**
       * @Description: 删除乘客列表
       * @author Wish
       * @date 2019/10/30
      */
      deleteOrderList(){
        this.deleteUserList = []
        for(let key in this.checkedTableList){
          this.deleteUserList.push({
            token: String(this.editOrderToken[key]),
            route_id: String(this.checkedRouteList[key]),
            passengers: String(this.checkedTableList[key])
          })
        }
        if(this.deleteUserList.length > 0){
          this.$confirm('此操作将永久所选乘客, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              order_sn: this.orderId,
              info: JSON.stringify(this.deleteUserList)
            }
            // console.log(data);
            this.$axios.post('/api/order/operate/delPassengers',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('删除成功')
                  this.getPassengerList()
                  this.closedSelectList()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
          }).catch(() => {});
        }else {
          this.$message.warning('请选择需要删除的数据')
        }


      },

      /**
       * @Description: 关闭批量修改弹窗
       * @author Wish
       * @date 2019/11/11
      */
      closedEditDialog(){
        this.batchEditDialog = false
        this.getPassengerList()
        this.closedSelectList()
      },

      /**
       * @Description: 打开批量修改弹窗
       * @author Wish
       * @date 2019/11/1
      */
      openBatchEdit(){
        this.batchEditList = []
        let newTokenArr = []
        for(let key in this.checkedTableList){
          this.batchEditList.push({
            route_id: String(this.checkedRouteList[key]),
            passengers: String(this.checkedTableList[key])
          })
          newTokenArr.push(this.editOrderToken[key])
        }
        newTokenArr = Array.from([...new Set(newTokenArr)])
        if(this.batchEditList.length > 0){
          if(newTokenArr.length <= 1){
            this.batchEditLoading = true
            this.$message.success('正在整理所选路线乘客信息，请勿刷新页面')
            let newArr = {}
            newArr['token'] = newTokenArr[0]
            newArr['information'] = this.batchEditList

            let data ={
              order_sn: this.orderId,
              info: JSON.stringify(newArr)
            }
            this.$axios.post('/api/order/routeInfo/1',data)
                .then(res =>{
                  if(res.data.code === 0){
                    this.batchEditDialog = true
                    this.batchEditLoading = false
                    this.batchEditData = res.data.result
                    this.batchEditInfo = JSON.parse(JSON.stringify(this.batchEditData.info.information))

                    this.batchEditInfo.forEach(item =>{
                      item['riding_time']= '' // 行车日期
                      item['departure_station']= '' // 发站
                      item['arrival_station']= '' // 到站
                      item['trips_number']= '' // 车次
                      item['ticket_type']= ''  // 票类
                      item['fwId']= ''  // 席别席位
                      item['ticket_price']= ''  // 票价
                      item['child_ticket_price']= ''  // 儿童票价
                      item['missed_meals_money']= ''  // 误餐费
                      item['ticket_fare']= ''  // 出票费
                      item['refund_fee']= '' // 退票费
                      item.ticket_status = item.ticket_status === 0 ? '未出票':
                          item.ticket_status === 1 ? '已出票':
                              item.ticket_status === 2 ? '已取消票':
                                  item.ticket_status === 3 ? '已改签':
                                      item.ticket_status === 4 ? '已退票': item.ticket_status
                    })
                  }else {
                    this.batchEditLoading = false
                    this.$message.warning(res.data.msg)
                  }
                })

            this.$axios.get('/api/system/fareWell/showAll/1')
                .then(res =>{
                  if(res.data.code === 0){
                    this.agentCategory = res.data.result
                  }else {
                    this.$message.warning(res.data.msg + ' 请重新打开批量修改弹窗以获取数据')
                  }
                })
          }else {
            this.$message.warning('只可选择一个行程类型下的乘客')
          }
        }else {
          this.$message.warning('请选择需要修改的数据')
        }

      },
      /**
       * @Description: 关闭路线变更提示框
       * @author Wish
       * @date 2019/11/12
      */
      closedEditRoute(){
        this.editRouteData.riding_time = ''
        this.editRouteData.departure_station = ''
        this.editRouteData.arrival_station = ''
        this.editRouteData.trips_number = ''
        this.editRouteDialog = false
      },
      /**
       * @Description: 路线变更确认按钮
       * @author Wish
       * @date 2019/11/12
      */
      submitEditRoute(val){
        this.editRouteDialog = false
        let newForm = {}  // 路线信息
        newForm['type'] = 0
        newForm['route_id'] = this.editRouteData.route_id
        newForm['passengers'] = this.editRouteData.passengers
        newForm['riding_time'] =  this.$dateToDate(this.editRouteData.riding_time)  || val.riding_time

        if(this.editRouteData.departure_station){
          newForm['departure'] = this.editRouteData.directionOne? this.editRouteData.departure_station +this.editRouteData.directionOne:this.editRouteData.departure_station
        }else {
          newForm['departure'] = this.editRouteData.directionOne? val.departure_station +this.editRouteData.directionOne:val.departure_station
        }
        if(this.editRouteData.arrival_station){
          newForm['arrive'] = this.editRouteData.directionTwo? this.editRouteData.arrival_station +this.editRouteData.directionTwo:this.editRouteData.arrival_station
        }else {
          newForm['arrive'] = this.editRouteData.directionTwo? val.arrival_station +this.editRouteData.directionTwo:val.arrival_station
        }

        let newEditForm = {}  // 修改输入框信息
        newEditForm['ticket_type'] = this.editRouteData.ticket_type
        newEditForm['fwId'] = this.editRouteData.fwId
        newEditForm['ticket_price'] = this.editRouteData.ticket_price
        newEditForm['child_ticket_price'] = this.editRouteData.child_ticket_price
        newEditForm['missed_meals_money'] = this.editRouteData.missed_meals_money
        newEditForm['ticket_fare'] = this.editRouteData.ticket_fare
        newEditForm['refund_fee'] = this.editRouteData.refund_fee

        let info = {}
        info['condition'] = []
        info['params'] = newEditForm
        info.condition.push(newForm)
        let newToken = ''
        for(let key in this.checkedTableList){
          newToken = String(this.editOrderToken[key])
        }
        let data = {
          order_sn: this.orderId,
          token: newToken,
          ticket_status: this.routeStatus,
          info: JSON.stringify(info)
        }
        // console.log(data);
        this.$axios.post('/api/order/routeInfo/editBatch',data)
            .then(res =>{
              if(res.data.code === 0){
                this.$message.success('保存成功')
              }else {
                this.$message.warning(res.data.code)
              }
            })
      },

      /**
       * @Description: 批量修改提交
       * @author Wish
       * @date 2019/11/1
      */
      saveEditBtn(status,editData,route){
        this.routeStatus = status
        this.editRouteInfo = route  // 获取原路线信息
        this.editRouteData = editData  // 获取当前输入框数据
        console.log(this.editRouteData.directionOne);
        let editInfo = {}
        editInfo['route_id'] = this.editRouteData.route_id
        editInfo['passengers'] = this.editRouteData.passengers
        if(status === '1' || status === '3'){  // 出票or改签
          if(this.editRouteData.riding_time || this.editRouteData.departure_station || this.editRouteData.arrival_station || this.editRouteData.trips_number){
            this.editRouteDialog = true
          }else{
            let newForm = {}  // 路线信息
            newForm['type'] = 1
            newForm['route_id'] = this.editRouteData.route_id
            newForm['passengers'] = this.editRouteData.passengers
            newForm['riding_time'] =  this.editRouteData.route[0].riding_time
            newForm['departure'] = this.editRouteData.directionOne?this.editRouteData.route[0].departure_station + this.editRouteData.directionOne:this.editRouteData.route[0].departure_station
            newForm['arrive'] = this.editRouteData.directionTwo?this.editRouteData.route[0].arrival_station + this.editRouteData.directionTwo:this.editRouteData.route[0].arrival_station
            newForm['trips_number'] = this.editRouteData.route[0].trips_number

            let newEditForm = {}  // 修改输入框信息
            newEditForm['ticket_type'] = this.editRouteData.ticket_type
            newEditForm['fwId'] = this.editRouteData.fwId
            newEditForm['ticket_price'] = this.editRouteData.ticket_price
            newEditForm['child_ticket_price'] = this.editRouteData.child_ticket_price
            newEditForm['missed_meals_money'] = this.editRouteData.missed_meals_money
            newEditForm['ticket_fare'] = this.editRouteData.ticket_fare
            newEditForm['refund_fee'] = this.editRouteData.refund_fee

            let info = {}
            info['condition'] = []
            info['params'] = newEditForm
            info.condition.push(newForm)

            let newToken = ''
            for(let key in this.checkedTableList){
              newToken = String(this.editOrderToken[key])
            }

            let data = {
              order_sn: this.orderId,
              token: newToken,
              ticket_status: status,
              info: JSON.stringify(info)
            }
            this.$axios.post('/api/order/routeInfo/editBatch',data)
                .then(res =>{
                  if(res.data.code === 0){
                    this.$message.success('保存成功')
                  }else {
                    this.$message.warning(res.data.code)
                  }
                })

          }

        }else if(status === '2'){  // 取消票
          let newEditArr = []
          newEditArr.push(editInfo)
          let newToken = ''
          for(let key in this.checkedTableList){
            console.log(key);
            newToken = String(this.editOrderToken[key])
          }
          let data = {
            order_sn: this.orderId,
            token: newToken,
            ticket_status: status,
            info: JSON.stringify(newEditArr)
          }
          this.$axios.post('/api/order/routeInfo/editBatch',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('保存成功')
                }else {
                  this.$message.warning(res.data.code)
                }
              })

        }else if(status === '4'){  // 退票
          editInfo['refund_fee'] = this.editRouteData.refund_fee
          let newEditArr = []
          newEditArr.push(editInfo)
          let newToken = ''
          for(let key in this.checkedTableList){
            newToken = String(this.editOrderToken[key])
          }
          let data = {
            order_sn: this.orderId,
            token: newToken,
            ticket_status: status,
            info: JSON.stringify(newEditArr)
          }
          this.$axios.post('/api/order/routeInfo/editBatch',data)
            .then(res =>{
              if(res.data.code === 0){
                this.$message.success('保存成功')
              }else {
                this.$message.warning(res.data.code)
              }
            })
      }
      },


      /**
       * @Description: 新增行程
       * @author Wish
       * @date 2019/11/14
      */
      addStrokeBtn(){
        this.addStrokeDialog = true
        this.strokeTableType = '单程'
        this.addStrokeArr = [{
          riding_time: '',  // 行程时间
          initial_station: '',  // 发站
          stop_station: '', // 到站
          trips_number: '',  // 车次
        }]
        this.addStrokePassengers = ''
      },
      /**
       * @Description: 切换新增行程显示状态
       * @author Wish
       * @date 2019/11/14
      */
      changeStrokeType(val){
        this.addStrokePassengers = ''
        if(this.strokeTableType === '单程'){
          this.addStrokeArr = [{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          }]
        }else if(this.strokeTableType === '往返'){
          this.addStrokeArr = [{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          },{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          }]
        }else if(this.strokeTableType === '中转'){
          this.addStrokeArr = [{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          },{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          },{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          }]
        }else if(this.strokeTableType === '中转往返'){
          this.addStrokeArr = [{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          },{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          },{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          },{
            riding_time: '',  // 行程时间
            initial_station: '',  // 发站
            stop_station: '', // 到站
            trips_number: '',  // 车次
          }]
        }

      },

      /**
       * @Description: 提交新增行程
       * @author Wish
       * @date 2019/11/14
      */
      submitAddStroke(){
        let newArr = []
        let submitType = false
        newArr = JSON.parse(JSON.stringify(this.addStrokeArr))
        newArr.forEach(item =>{
          if(!item.riding_time || !item.initial_station || !item.stop_station || !item.trips_number){
            this.$message.warning('请填写完整数据！')
            submitType = false
          }else {
            item.riding_time = this.$dateToDate(item.riding_time)
            submitType = true
          }
        })

        let data ={
          order_sn: this.$route.query.order_sn,
          type: this.strokeTableType === '单程' ? 0 :
              this.strokeTableType === '往返' ? 1 :
                  this.strokeTableType === '中转' ? 2 :
                      this.strokeTableType === '中转往返' ? 3 : '',
          passenger: this.addStrokePassengers,
          info: JSON.stringify(newArr)
        }
        if(submitType){
          this.addStrokeLoading = true
          this.$axios.post('/api/order/addTrips',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.addStrokeDialog = false
                  this.$message.success('保存成功')
                  this.addStrokeLoading = false
                  this.getPassengerList()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }
      },


      /**
       * @Description: 提交全部编辑信息
       * @author Wish
       * @date 2019/10/30
      */
      allEditSubmit(){
        let cname
        let dname
        this.customerList.forEach(item =>{
          if(item.name === this.orderInfo.cname){
            cname = item.identity
            item.issuer.forEach(cItem =>{
              if(cItem.name === this.orderInfo.dName){
                dname = cItem.id
              }
            })
          }
        })
        let data ={
          order_sn: this.orderInfo.order_sn,
          customer: cname,
          issuer: dname,
          remarks: this.orderInfo.remarks,
          certificates: this.userCardImage,
          ticket_photos: String(this.ticketPhotoList),
        }
        this.$axios.post('/api/order/edit',data)
          .then(res =>{
            if(res.data.code === 0){
              this.$message.success('保存成功')
              this.urlTypeSelect()
              this.getCustomerData()
            }else {
              this.$message.warning(res.data.msg)
              this.urlTypeSelect()
              this.getCustomerData()
            }
          })
      },


      /**
       * @Description: 新增Q群信息
       * @author Wish
       * @date 2019/10/18
      */
      saveGroupBtn(){
        this.addBtnType = true
        this.addHeaderShow = true
        this.saveGroupMessage = JSON.parse(JSON.stringify(this.AddGroupOriginData))
      },
      addGroupBtn(){
        this.addTrainTableArray = []
        this.$message.success('数据识别中')
        this.addBtnDisabled = true
        if(this.AddGroupOriginData){
          let data ={
            group_origin_data: this.AddGroupOriginData
          }
          this.$axios.post('/api/order/recognize/new',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('识别完成')
                  this.inputDisabled = false
                  this.addBtnDisabled = false
                  this.addDataList = res.data.result
                  // this.customerMessage =  res.data.result.customer
                  this.orderInfo.order_sn = this.addDataList.orderNumber.new || this.addDataList.customer.custom_order_sn
                  // this.orderInfo.order_sn = ''
                  this.orderInfo.old_order_sn = this.addDataList.orderNumber.old || ''
                  // this.orderInfo.old_order_sn = ''

                  // this.customerList.forEach(customer =>{
                  //   if(customer.identity === this.customerMessage.customer){
                  //     this.orderInfo.cname = customer.name
                  //   }
                  //   console.log(customer);
                  //   customer.issuer.forEach(issuing =>{
                  //     if(issuing.id ===  this.customerMessage.issuing_clerk){
                  //       this.orderInfo.dName = issuing.name
                  //     }
                  //   })
                  // })


                  console.log(this.customerList);

                  console.log(this.customerMessage);
                  /**
                   * @Description: 重组新增数组
                   * @author Wish
                   * @date 2019/10/24
                   */

                  console.log(this.addDataList.trips.length > 0);
                  if(this.addDataList.trips.length > 0){
                      this.addDataList.trips.forEach(item =>{
                        console.log(item);
                        item.info.forEach(cItem =>{
                          console.log(cItem);
                          cItem['initial_station'] = cItem.route[0]  // 发站
                          cItem['stop_station'] = cItem.route[1] // 到站
                          cItem['riding_time'] = cItem.ride_date  // 发车时间
                          cItem['trips_number'] = cItem.train_number  // 车次
                          delete cItem.route
                          delete cItem.ride_date
                          delete cItem.train_number
                          cItem.passenger.forEach(dItem =>{
                            console.log(dItem);
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
                    }else {
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
                    }
                }else {
                  this.addBtnDisabled = false
                  this.$message.warning(res.data.msg)
                }
              })
              .catch(() =>{
                this.$message.error('识别失败，请检查格式后重新识别')
                this.addBtnDisabled = false
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
      deleteList(list,data){
        return list.splice(list.findIndex(item => item.IDCard === data.IDCard), 1)
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
        this.allAddSubmitLoading = true
        let orderList = []
        orderList = JSON.parse(JSON.stringify(this.addTrainTableArray))
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
          customer: this.orderInfo.cname, // 客户商标识
          issuer: this.orderInfo.dName, // 发单人标识
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
                this.allAddSubmitLoading = false
                setTimeout(() =>{
                  this.$router.push({
                    name: 'orderDetails',
                    query:{
                      order_sn: this.orderInfo.order_sn,
                      type: 'details'
                    }
                  })

                },500)
              }else {
                this.$message.warning(res.data.msg)
                this.allAddSubmitLoading = false
              }
            })
      },

    },
    created() {
      this.urlTypeSelect()

      this.getCustomerData()  // 获取客户商列表
    },
    mounted() {
      if(this.$route.query.type === 'edit'){
        this.deleteUserList = []
      }
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
      .el-input__suffix{
        display: none;
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

  .el-dialog__wrapper {
    display: block;
    align-items: unset;
    justify-content: unset;
    position: fixed !important;
    .el-dialog {
      margin: unset !important;
      top: 20%;
      left: 30%;
    }
  }

  // 新闻详情弹窗
  .news_detail_dialog{
    .detail_main{
      .title{
        font-size:24px;
        color:rgba(51,148,250,1);
        text-align: center;
        margin-bottom: 35px;
      }
      .info{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        .time{
          margin-left: 15px;
          font-size:16px;
          color:rgba(38,153,251,1);
        }
      }
      .content{
        font-size:18px;
        color:rgba(38,153,251,1);
        max-height: 600px;
        height: 100%;
        overflow-y: auto;
        margin-bottom: 30px;
        white-space: pre-wrap;
      }
      .person_box{
        >span{
          &:not(:last-child){
            &:after{
              content: '，'
            }
          }
        }
      }
    }
  }

  // 新增行程弹窗
  .add_stroke_dialog{
    .add_stroke_table{
      margin-top: 10px;
      .table_header{
        margin-bottom: 10px;
        .header_box{
          height: 64px;
          display: flex;
          align-items: center;
          background: #eef7ff;
          padding: 0 10px;
          justify-content: space-between;
          &:not(:last-child){
            border-bottom: 2px solid #fff;
          }
          .header_ticket{
            display: flex;
            align-items: flex-start;
            /deep/.el-input{
              width: 120px;
            }
            .ticket_number{
              width: 110px;
              height: 30px;
              margin: 0 5px;
              position: relative;
              &::after{
                content: '';
                position: absolute;
                width: 90%;
                left: 0;
                bottom: -10px;
                height: 1px;
                background:  rgba(38,153,251,1);
              }
              &::before{
                content: '';
                position: absolute;
                right: 0;
                bottom: -15px;
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-left: 6px solid rgba(38,153,251,1);
              }
              /deep/.el-input__inner{
                height: 100%;
                line-height: 30px;
              }
            }
          }
        }
      }
      .table_content{
        /deep/.el-textarea__inner{
          max-height: 200px;
        }
      }
    }
  }

  /*修改乘车区间弹窗*/
  .edit_ticket_message_dialog{
    .edit_ticket_message_form{
      /deep/.el-form-item__content{
        display: flex;
        align-items: center;
        .edit_ticket_message_input{
          .el-input__inner{
            &::placeholder{
              color: #000;
            }
          }
        }
      }
    }
  }

  /*选择12306账号弹窗*/
  .select_ticket_dialog{

  }

  .orderDetails{
    padding: 20px 80px 120px;
    position: relative;
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
      margin-bottom: 20px;
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
          min-height: 100px;
          border: 1px solid #ebeef5;
          border-top: unset;
          .info_remarks{
            flex: 1;
            height: 100%;
            border-right: 1px solid #ebeef5;
            padding: 15px;
          }
          .info_upload_image{
            width: 240px;
            flex-shrink: 0;
            /*height: 100px;*/
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
        min-height: 160px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px;
        .upload_image_main{
          display: flex;
          align-items: center;
          .public_image{
            margin-right: 40px;
            width: 140px;
            height: 100px;
          }
        }
        .ticket_photo_box{
          display: flex;
          align-items: center;
          /deep/.el-image{
            width: 100px;
            height: 100px;
            margin-right: 20px;
          }
        }
        .UploadLeaflet{
          width: 120px;
        }
        .public_image{
          &:not(:last-child){
            margin-right: 5%;
          }
        }
        .info_message_box{
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: column;
          margin-left: 50px;
          width: 120px;
          height: 100%;
          flex-shrink: 0;
          >p{
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .order_carousel{
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-left: 150px;
      .carousel_main{
        width: 500px;
        /deep/.el-carousel__item{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .medium{
            margin-right: 30px;
            width: 450px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            cursor: pointer;
          }
        }

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
        .train_route_message{
          height:65px;
          width: 100%;
          display: flex;
          align-items: center;
          background:rgba(238,247,255,1);
          padding: 0 16px;
          .ticket_message{
            padding: 0 10px;
            display: flex;
            align-items: center;
            height: 50px;
            >p{
              width: 90px;
              display: inline-flex;
              justify-content: center;
              height: 25px;
              margin: 0 18px;
              position: relative;
              &::after{
                content: '';
                position: absolute;
                width: 90%;
                left: 0;
                bottom: 0;
                height: 1px;
                background:  rgba(38,153,251,1);
              }
              &::before{
                content: '';
                position: absolute;
                right: 0;
                bottom: -5px;
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-left: 6px solid rgba(38,153,251,1);
              }
            }
            &.edit_message{
              border-bottom: 1px solid transparent;
              transition: all .3s;
              cursor: pointer;

              &:hover{
                border-bottom: 1px solid rgba(38,153,251,1);
              }
            }
          }
          >div{
            display: inline-flex;
            align-items: center;
            &:not(:last-child){
              margin-right: 10%;
            }
          }
        }

        .train_message{
          height: 50px;
          display: flex;
          align-items: center;
          border: 1px solid #eef7ff;
          padding: 0 16px;
          >div{
            &:not(:last-child){
              margin-right: 10%;
            }
          }
          .addUserListBtn{
            margin-left: auto;
          }
        }
      }
    }

    .order_details_bottom{
      display: flex;
      .order_bottom_table{
        width: 50%;
        .table_header{
          margin-bottom: 10px;
        }

        &:last-child{
          margin-left: 40px;
        }
      }
    }

    /*编辑 提交备注信息*/
    .order_add_remarks{
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      /deep/.el-button{
        margin-left: 15px;
      }
    }
    /*提交按钮*/
    .submitAllDataBtn{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      width: 100%;
      min-width: 1450px;
      position: fixed;
      bottom: 0;
      left: 0;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      z-index: 1;
      /deep/.el-button{
        padding: 12px 60px;
      }

    }

    /*新增乘客弹窗*/
    .add_user_dialog{
      .dialog_main{
        width: 100%;
        height: 100%;
        padding: 20px 30px;
        .order_table_header{
          height:65px;
          width: 100%;
          display: flex;
          align-items: center;
          background:rgba(238,247,255,1);
          padding: 0 16px;
          >div{
            display: inline-flex;
            align-items: center;
            &:not(:last-child){
              margin-right: 10%;
            }
            >p{
              width: 90px;
              display: inline-flex;
              justify-content: center;
              height: 25px;
              margin: 0 18px;
              position: relative;
              &::after{
                content: '';
                position: absolute;
                width: 90%;
                left: 0;
                bottom: 0;
                height: 1px;
                background:  rgba(38,153,251,1);
              }
              &::before{
                content: '';
                position: absolute;
                right: 0;
                bottom: -5px;
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-left: 6px solid rgba(38,153,251,1);
              }
            }
          }
        }
        .order_user_message{
          /deep/.el-textarea__inner{
            border-radius: unset;
          }
        }
      }
    }

    /*批量编辑*/
    /deep/.batch_edit_dialog{
      .el-dialog__body{
        display: flex;
        align-items: flex-start;
        padding: 30px 0 0;
        overflow: auto;
        max-height: 700px;
      }
      .dialog_main{
        width: 100%;
        flex-shrink: 0;
        padding-right: 3%;
        &:first-child{
          padding-left: 3%;
        }

        .main_box{
          display: flex;
          align-items: center;
          border: 1px solid #ebeef5;
          min-height: 57px;
          &:not(:last-child){
            border-bottom: unset;
          }
          .main_box_title{
            padding-left: 15px;
            width: 140px;
            min-height: 57px;
            border-right: 1px solid #ebeef5;
            height: 100%;
            display: flex;
            align-items: center;
          }
          .main_box_content{
            width: 100%;
            height: 100%;
            padding-left: 15px;
            .content_route{
              display: flex;
              align-items: center;
              .content_edit_time{
                width: 140px;
                /deep/.el-input{
                  width: 100%;
                }
              }
              .route_message{
                display: flex;
                align-items: center;
                margin-left: 10px;
                &.edit_route_message{
                  >span{
                    width: 120px;
                  }
                }

                >p{
                  width: 90px;
                  display: inline-flex;
                  justify-content: center;
                  margin: 0 18px;
                  position: relative;
                  /deep/.el-input{
                    .el-input__inner{
                      height: 25px;
                      line-height: 25px;
                    }
                    .el-input__suffix{
                      line-height: 25px;
                      height: 25px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                  }
                  &::after{
                    content: '';
                    position: absolute;
                    width: 90%;
                    left: 0;
                    bottom: -10px;
                    height: 1px;
                    background:  rgba(38,153,251,1);
                  }
                  &::before{
                    content: '';
                    position: absolute;
                    right: 0;
                    bottom: -15px;
                    width: 0;
                    height: 0;
                    border-top: 6px solid transparent;
                    border-bottom: 6px solid transparent;
                    border-left: 6px solid rgba(38,153,251,1);
                  }
                }
              }
            }
          }
        }
      }
    }

    /*批量编辑变更路线弹窗*/
    /deep/.edit_route_dialog{
      .detail_main{
        .edit_route_info{
          display: inline-flex;
          font-weight: bold;
          span{
            width: 90px;
            display: inline-flex;
            justify-content: center;
            margin: 0 18px;
            position: relative;
            &::after{
              content: '';
              position: absolute;
              width: 90%;
              left: 0;
              bottom: -10px;
              height: 1px;
              background:  rgba(38,153,251,1);
            }
            &::before{
              content: '';
              position: absolute;
              right: 0;
              bottom: -15px;
              width: 0;
              height: 0;
              border-top: 6px solid transparent;
              border-bottom: 6px solid transparent;
              border-left: 6px solid rgba(38,153,251,1);
            }
          }
        }
      }
    }

  }
</style>
