<template>
  <div class="orderManagement" v-loading="loading">
    <div class="table_header">
      <div v-if="viewsType === 0"><el-button type="primary" @click="jumpDetailsBtn('add')">新增订单</el-button></div>
<!--      <div v-if="viewsType === 2"><el-button>批量还原</el-button></div>-->
      <div><el-input clearable v-model="orderSearch.order" placeholder="订单号查询"></el-input></div>
      <div>
        <el-select v-model="orderSearch.order_status" placeholder="订单状态查询" clearable  @change="selectCustomer(orderSearch.customer)">
          <el-option label="已处理" value="1"></el-option>
          <el-option label="处理中" value="2"></el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="orderSearch.customer" placeholder="客户选择" clearable  @change="selectCustomer(orderSearch.customer)">
          <el-option v-for="item in client" :key="item.id" :label="item.name" :value="item.identity"></el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="orderSearch.issuer" placeholder="发单人选择" clearable>
          <el-option v-for="item in issuerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div><el-input clearable v-model="orderSearch.departure" placeholder="发站查询"></el-input></div>
      <div><el-input clearable v-model="orderSearch.arrival" placeholder="到站查询"></el-input></div>
      <div>
        <el-select v-model="orderSearch.submitter" placeholder="提交人查询" clearable>
          <el-option v-for="item in companyAccount" :key="item.id" :label="item.nickname" :value="item.target"></el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="orderSearch.ticket_teller" placeholder="出票员查询" clearable>
          <el-option v-for="item in companyAccount" :key="item.id" :label="item.nickname" :value="item.target"></el-option>
        </el-select>
      </div>
       <div><el-date-picker
          v-model="orderSearch.ridingTime"
          type="daterange"
          range-separator="至"
          start-placeholder="乘车开始日期"
          end-placeholder="乘车结束日期">
       </el-date-picker></div>
      <div><el-date-picker
          v-model="orderSearch.submitTime"
          type="daterange"
          range-separator="至"
          start-placeholder="提交开始日期"
          end-placeholder="提交结束日期">
      </el-date-picker></div>
      <div><el-date-picker
          v-model="orderSearch.remarkTime"
          type="daterange"
          range-separator="至"
          start-placeholder="备注开始日期"
          end-placeholder="备注结束日期">
      </el-date-picker></div>
      <div><el-button @click="getDataList('search')">搜索</el-button></div>
    </div>
    <div class="table_main">
      <div class="table_content">
        <div class="content_header">
          <div style="width: 60px;flex-shrink: 0;">序号</div>
          <div style="width: 60px;flex-shrink: 0;">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
          </div>
          <div style="width: 220px;flex-shrink: 0;">订单号</div>
          <div style="width: 150px; flex-shrink: 0">行程时间</div>
          <div>发站</div>
          <div>到站</div>
          <div>任务进度</div>
          <div>客户</div>
          <div>发单人</div>
          <div>订单状态</div>
          <div>财务状态</div>
          <div>备注信息</div>
          <div style="width: 80px;flex-shrink: 0;">操作</div>
        </div>
        <div class="content_main">
          <div :class="['main_list',{'is_top': item.is_top === 1}]" v-for="(item, index) in tableData" :key="index" @dblclick="doubleClickDetails(item)">
            <div class="list_num">
              <div style="width: 60px">{{index+1}}</div>
              <div style="width: 60px">
                <el-checkbox @change="handleCheckChange(item)"></el-checkbox>
              </div>
              <div style="width: 220px">{{item.order_sn}}</div>
            </div>
            <div class="list_main">
              <div class="list_box" v-for="(cItem, CIndex) in item.info" :key="CIndex">
                <div style="width: 150px; flex-shrink: 0">{{$getTimeYear(cItem.riding_time * 1000) || ''}}</div>
                <div>{{cItem.departure_station}}</div>
                <div>{{cItem.arrival_station}}</div>
                <div>{{item.incompleteTask +'/'+item.finishTask}}</div>
                <div>{{item.Cname}}</div>
                <div>{{item.fdName}}</div>
                <div>{{item.order_status === 0 ? '处理中':'已处理'}}</div>
                <div>{{item.finance_status}}</div>
                <div>
                  <p v-if="item.desc.is_important === 1">
                    <span class="important_remarks">{{item.desc.remarks}}</span>
                  </p>
                  <p v-if="viewsType === 4">{{item.desc.remarks}}</p>
                  <!--<span style="font-size: 10px; color: #bebebe">暂无重要备注</span>-->
                </div>
              </div>
            </div>
            <div class="option_box">
              <el-dropdown trigger="click" v-if="viewsType !== 2">
                <el-button size="mini">操作</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><div @click="jumpDetailsBtn('details',item)">详情</div></el-dropdown-item>
                  <el-dropdown-item><div @click="addRemarksBtn(item)">备注</div></el-dropdown-item>
                  <el-dropdown-item v-if="viewsType === 1"><div @click="editOrderType(item,0)">取消不明订单</div></el-dropdown-item>
                  <el-dropdown-item v-else><div @click="editOrderType(item,1)">设为不明订单</div></el-dropdown-item>
                  <el-dropdown-item><div @click="editOrderTop(item)">{{item.is_top === 0 ? '标红置顶': '取消标红置顶'}}</div></el-dropdown-item>
                  <el-dropdown-item v-if="viewsType === 0"><div @click="openMergerOrderDialog(item)">合并订单</div></el-dropdown-item>
                  <el-dropdown-item><div @click="jumpDetailsBtn('edit',item)">编辑</div></el-dropdown-item>
                  <el-dropdown-item><div @click="editOrderType(item,2)">删除</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button v-else size="mini" @click="reductionOrder(item)">还原</el-button>
            </div>
          </div>

          <p v-if="tableData.length < 1">暂无数据</p>
        </div>
      </div>


      <div class="table_bottom">
        <Pagination
            ref="pagination"
            :pageData="paginationList"
            @jumpSize="jumpSize"
            @jumpPage="jumpPage">
        </Pagination>

        <el-dropdown trigger="click">
          <el-button>导出</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div @click="downAllExcel">全部导出</div></el-dropdown-item>
            <el-dropdown-item><div @click="downSelectExcel">导出所选项</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>



    </div>

    <el-dialog
        title="添加备注"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        custom-class="add_remarks_dialog"
        :visible.sync="addRemarksDialog">
      <div class="dialog_main">
        <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入备注内容"
            v-model="remarksInput">
        </el-input>
        <el-checkbox style="margin-top: 30px" v-model="importantRemarks">设置为重要备注</el-checkbox>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeRemarksDialog">取 消</el-button>
        <el-button type="primary" @click="submitRemarksDialog()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="合并订单"
        width="400px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        custom-class="add_remarks_dialog"
        :visible.sync="mergerOrderDialog">
      <div class="dialog_main">
        <el-select v-model="mergerOrder" placeholder="请选择">
          <el-option
              v-for="item in mergerOrderList"
              :key="item.id"
              :label="item.order_sn"
              :value="item.order_sn">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mergerOrderDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitMergerOrderDialog()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Bus from '../../utlis/bus'
  export default {
    name: "orderManagement",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: true,
        tableData: [],
        viewsType: 0, // 网页类型

        orderSearch: {
          order: '',
          order_status: '',
          customer: '',
          issuer: '',
          departure: '',
          arrival: '',
          submitter: '',
          ticket_teller: '',
          ridingTime: '',
          submitTime: '',
          remarkTime: '',
        }, // 订单搜索
        client: [], // 客户商列表
        issuerList: [], // 发单人列表

        companyAccount: [], // 公司内部账号列表

        orderId: '', // 订单Id

        checkAll: false,
        selectList: [],  // 多选列表

        addRemarksDialog: false, // 添加备注弹窗
        remarksInput: '', // 备注信息
        importantRemarks: false, // 是否设置为重要备注

        mergerOrderDialog: false, // 合并订单弹窗
        mergerOrderList: [], // 有效订单列表
        mergerOrder: '', // 选中订单

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      downAllExcel(){
        this.$message.success('正在整理导出文件，开始导出，请勿刷新页面')
        this.$axios.get('/api/excel/info/'+this.viewsType+'/all',{responseType: 'blob'})
            .then(res =>{
              window.location.href = window.URL.createObjectURL(res.data);
            })
      },
      downSelectExcel(){},

      /**
       * @Description: 获取客户商
       * @author Wish
       * @date 2019/11/27
      */
      getClient(){
        this.$axios.get('/api/user/customer/showAll')
            .then(res =>{
              this.client = res.data.result;
            })
      },

      /**
       * @Description: 选中客户商 获取发单人
       * @author Wish
       * @date 2019/11/21
       */
      selectCustomer(val){
        this.orderSearch.issuer = ''
        this.client.forEach(res =>{
          if(res.identity === val){
            this.issuerList = res.issuer
          }
        })
      },

      /**
       * @Description: 获取公司内部账号
       * @author Wish
       * @date 2019/11/27
      */
      getCompanyAccount(){
        this.$axios.get('/api/user/showCompanyAccount/1')
            .then(res =>{
              if(res.data.code === 0){
                this.companyAccount = res.data.result
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 获取数据
       * @author Wish
       * @date 2019/11/27
      */
      getDataList(type){
        this.loading = true
        this.viewsType =  this.$route.meta.name === '订单管理'? 0:
            this.$route.meta.name === '不明订单'? 1:
                this.$route.meta.name === '回收订单'? 2:
                    this.$route.meta.name === '历史订单查询'? 3:
                        this.$route.meta.name === '新备注订单列表'? 4: ''
        let data
        if(type === 'search'){
          data = JSON.parse(JSON.stringify(this.orderSearch))
          console.log(data.ridingTime);
          data.ridingTime?data['ridingBegin'] = this.$dateToDate(data.ridingTime[0]) || '':''
          data.ridingTime?data['ridingEnd'] = this.$dateToDate(data.ridingTime[1]) || '': ''
          data.submitTime?data['submitBegin'] = this.$dateToDate(data.submitTime[0]) || '': ''
          data.submitTime?data['submitEnd'] = this.$dateToDate(data.submitTime[1]) || '': ''
          data.remarkTime?data['remarkBegin'] = this.$dateToDate(data.remarkTime[0]) || '': ''
          data.remarkTime?data['remarkEnd'] = this.$dateToDate(data.remarkTime[1]) || '': ''
          data['page'] = this.page || null

        }else {
          data = {
            page: this.page || null
          }
        }

        this.$axios.post('/api/order/list/'+this.viewsType + '/'+ this.per_page,data)
            .then(res =>{
              this.loading = false;
              this.tableData = res.data.data
              this.paginationList = res.data
              this.selectList = []
              this.getClient()
              this.getCompanyAccount()
            })
            .catch(() =>{
              this.$message.warning('数据请求失败，请稍后重试')
            })
      },

      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/17
       */
      handleCheckAllChange(val) {  // 全选
        console.log(val);
      },
      handleCheckChange(val){
        console.log(val);
      },

      /**
       * @Description: 跳转详情
       * @author Wish
       * @date 2019/10/18
      */
      jumpDetailsBtn(type,val){
        if(type === 'details'){
          this.$routerTab.open({
            path: '/orderDetails', // 通过路由路径关闭页签，可 location 对象方式传入。如果未配置 id 和 path 则关闭当前页签
            title: '订单详情',
            match: false, // path 方式关闭时，是否匹配 path 完整路径，默认 true
            force: false, // 是否强制关闭，默认 true
            refresh: true, // 是否全新打开跳转地址 默认 false
            query:{
              order_sn: val.order_sn,
              type: 'details'
            }
          })
        }else if(type === 'edit'){
          this.$routerTab.open({
            path: '/editOrder', // 通过路由路径关闭页签，可 location 对象方式传入。如果未配置 id 和 path 则关闭当前页签
            title: '订单编辑',
            refresh: true, // 是否全新打开跳转地址 默认 false
            query:{
              order_sn: val.order_sn,
              type: 'edit'
            }
          })
        }else if(type === 'add'){
          this.$routerTab.open({
            path: '/addOrder', // 通过路由路径关闭页签，可 location 对象方式传入。如果未配置 id 和 path 则关闭当前页签
            title: '新增订单',
            match: false, // path 方式关闭时，是否匹配 path 完整路径，默认 true
            force: false, // 是否强制关闭，默认 true
            refresh: true, // 是否全新打开跳转地址 默认 false
            query:{
              type: 'add'
            }
          })

        }
      },

      /**
       * @Description: 双击跳转详情
       * @author Wish
       * @date 2019/10/23
      */
      doubleClickDetails(val){
        this.$routerTab.open({
          path: '/orderDetails', // 通过路由路径关闭页签，可 location 对象方式传入。如果未配置 id 和 path 则关闭当前页签
          title: '订单详情',
          match: false, // path 方式关闭时，是否匹配 path 完整路径，默认 true
          force: false, // 是否强制关闭，默认 true
          refresh: true, // 是否全新打开跳转地址 默认 false
          query:{
            order_sn: val.order_sn,
            type: 'details'
          }
        })
      },

      /**
       * @Description: 添加备注
       * @author Wish
       * @date 2019/10/17
      */
      addRemarksBtn(val){
        this.addRemarksDialog = true
        this.remarksInput = ''
        this.orderId = val.order_sn
      },

      /**
       * @Description: 标红置顶
       * @author Wish
       * @date 2019/10/17
      */
      editOrderTop(val){
        let data ={
          order_sn: val.order_sn,
          is_top: val.is_top === 0 ? 1: 0
        }
        this.$axios.post('/api/order/operateOrderTop',data)
            .then(res =>{
              if(res.data.code === 0){
                this.$message.success('设置成功')
                this.getDataList()
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 设为不明订单 or 删除订单
       * @author Wish
       * @date 2019/10/17
      */
      editOrderType(val,type){
        this.$confirm(
            type === 1?'此操作会把所选订单修改为不明订单, 是否继续?':
                type === 2?'此操作删除所选订单, 是否继续?':
                    type === 0?'此操作会把所选订单还原为正常订单, 是否继续?':'',
            '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          let data = {
            order_sn: val.order_sn,
            type: type
          }
          this.$axios.post('/api/order/operateOrderType',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success(
                      type === 1?'设为不明订单成功':
                          type === 2?'删除订单成功':
                              type === 0?'还原不明订单成功':'')
                  this.getDataList()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }).catch(() => {});

      },

      /**
       * @Description: 合并订单按钮
       * @author Wish
       * @date 2019/11/4
      */
      openMergerOrderDialog(val){
        this.mergerOrder = ''
        this.$message.success('正在获取所有订单列表，请稍等')
        this.orderId = val.order_sn
        this.$axios.get('/api/order/obtainList/0')
            .then(res =>{
              if(res.data.code === 0){
                this.mergerOrderDialog = true
                this.mergerOrderList = res.data.result
              }else {
                this.$message.warning(res.data.msg)
              }
            })
      },

      /**
       * @Description: 提交合并订单
       * @author Wish
       * @date 2019/11/4
      */
      submitMergerOrderDialog(){
        if(this.mergerOrder){
          let data ={
            sourceOrder: this.orderId,
            targetOrder: this.mergerOrder
          }
          this.$axios.post('/api/order/operateOrderMerge',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('合并成功')
                  this.mergerOrderDialog = false
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }else {
          this.$message.warning('请选择需要合并的订单号')
        }
      },

      /**
       * @Description: 编辑按钮
       * @author Wish
       * @date 2019/10/17
      */
      editBtn(val){
        console.log(val);
      },

      /**
       * @Description: 关闭备注弹窗
       * @author Wish
       * @date 2019/10/17
      */
      closeRemarksDialog(){
        this.addRemarksDialog = false
        this.remarksInput = ''
        this.importantRemarks = false
      },

      /**
       * @Description: 提交备注信息
       * @author Wish
       * @date 2019/10/17
      */
      submitRemarksDialog(){
        let data ={
          order_sn: this.orderId,
          is_important: this.importantRemarks? 1:0,
          remarks: this.remarksInput
        }
        this.$axios.post('/api/order/operateRemarks',data)
            .then(res =>{
              if(res.data.code === 0){
                this.$message.success('添加成功')
                this.getDataList()
                this.closeRemarksDialog()
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
      jumpSize(val){
        this.per_page = val
        this.getDataList()
      },
      jumpPage(val){
        this.page = val
        this.getDataList()
      },

      /**
       * @Description: 回收订单操作
       * @author Wish
       * @date 2019/10/29
      */
      /**
       * @Description: 还原订单
       * @author Wish
       * @date 2019/10/29
      */
      reductionOrder(val){
        this.$confirm('此操作将还原所选订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data ={
            orderList: val.order_sn,
          }
         this.$axios.post('/api/order/restoreOrder',data)
             .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('还原成功')
                  this.getDataList()
                }else {
                  this.$message.warning(res.data.msg)
                }
             })
        }).catch(() => {});
      },
    },
    created() {
      this.getDataList()
    },

    // watch: {
    //   '$route'(to, from) {
    //     this.viewsType =  this.$route.meta.name === '订单管理'? 0:
    //         this.$route.meta.name === '不明订单'? 1:
    //             this.$route.meta.name === '回收订单'? 2:
    //                 this.$route.meta.name === '历史订单查询'? 3:
    //                     this.$route.meta.name === '新备注订单列表'? 4: ''
    //     this.getDataList();
    //   },
    // },

  }
</script>

<style scoped lang="less">
  .orderManagement{
    padding: 20px 80px;
    .table_header{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 40px;
      >div{
        margin-right: 15px;
        margin-bottom: 10px;
      }
    }
    .table_main{
      .table_content{
        width: 100%;
        .content_header{
          display: flex;
          align-items: center;
          border: 1px solid #ebeef5;
          >div{
            width: 100%;
            height: 50px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #909399;
            font-weight: 500;
            &:not(:last-child){
              border-right: 1px solid #ebeef5;
            }
          }
        }
        .content_main{
          font-size: 14px;
          color: #606266;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          min-height: 50px;
          .main_list{
            flex: 1;
            display: flex;
            align-items: center;
            border: 1px solid #ebeef5;
            border-top: unset;
            width: 100%;
            transition: all .3s;
            &.is_top{
              position: relative;
              &::before{
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                width: 0;
                height: 0;
                border-top: 30px solid #ebeef5;
                border-right: 30px solid transparent;
              }
            }
            &:hover{
              background: #f9f9f9;
            }
            .list_num{
              display: flex;
              height: 100%;
              flex-shrink: 0;
              >div{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                min-height: 50px;
              }
            }
            .list_main{
              width: 100%;
              .list_box{
                width: 100%;
                display: flex;
                align-items: center;
                &:not(:last-child){
                  border-bottom: 1px solid #ebeef5;
                }
                .important_remarks{
                  display: flex;
                  align-items: center;
                  &::before{
                    content: '';
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: red;
                    margin-right: 5px;
                  }
                }
                >div{
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 50px;
                  border-left: 1px solid #ebeef5;
                  padding: 0 5px;
                  &:last-child{
                    border-right: 1px solid #ebeef5;
                  }
                }
              }
            }
            .option_box{
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              width: 80px;
            }
          }
        }
      }
      .table_bottom{
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }
    }
  }
</style>
