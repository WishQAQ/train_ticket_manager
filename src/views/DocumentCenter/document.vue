<template>
  <div class="helpDocument" v-loading="loading">
    <div class="help_main">
      <div class="table_header">
        <el-input v-model="searchInput" placeholder="输入关键字搜索"></el-input>
        <el-button type="primary" @click="searchBtn">搜索</el-button>
        <el-button type="primary" @click="addDialogBtn">新增</el-button>
      </div>
      <div class="table_main">
        <el-table
            :data="helpTableData"
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
              prop="title"
              show-overflow-tooltip
              label="标题">
          </el-table-column>
          <el-table-column
              prop="content"
              label="内容"
              show-overflow-tooltip
              width="300">
          </el-table-column>
          <el-table-column
              prop="source"
              label="来源">
          </el-table-column>
          <el-table-column
              show-overflow-tooltip
              label="发送给">
            <template slot-scope="scope">
              {{scope.row.objects || '全部人员'}}
            </template>
          </el-table-column>
          <el-table-column
              prop="created_at"
              label="日期">
          </el-table-column>
          <el-table-column
              label="状态"
              width="80">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status === 0">启用</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 1">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="80">
            <template slot-scope="scope">
              <el-dropdown trigger="click">
                <el-button size="mini">操作</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><div @click="openDetails(scope.row)">详情</div></el-dropdown-item>
                  <el-dropdown-item><div @click="editDialog(scope.row)">编辑</div></el-dropdown-item>
                  <el-dropdown-item><div @click="deleteListBtn(scope.row)">删除</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            </template>
          </el-table-column>
        </el-table>

        <Pagination
            ref="pagination"
            :pageData="paginationList"
            @jumpSize="jumpSize"
            @jumpPage="jumpPage">
        </Pagination>

      </div>
    </div>


    <el-dialog
        :title="viewAddressType === 0 ? '帮助文档': '新闻中心'"
        modal-append-to-body
        append-to-body
        :visible.sync="detailDialog"
        custom-class="detail_dialog">
      <div class="detail_main">
        <div class="title">{{detailMessage.title || '暂无文档标题' }}</div>
        <div class="info">
          <div class="source">{{detailMessage.source || '暂无创建人信息'}}</div>
          <div class="time">{{detailMessage.created_at || '暂无创建时间'}}</div>
        </div>
        <div class="content">{{detailMessage.content || '暂无文档内容'}}</div>
      </div>
    </el-dialog>

    <el-dialog
        :title="editDialogStatus?'添加文档':'修改文档'"
        modal-append-to-body
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :visible.sync="addDialog"
        custom-class="add_dialog">
      <el-form class="detail_main" ref="form" label-width="80px">
        <el-form-item label="标题">
          <el-input maxlength="50"
                    show-word-limit
                    v-model="detailForm.title">

          </el-input>
        </el-form-item>
        <el-form-item label="通知选择">
          <div class="select_box" @click="addSelectBtn">
            <span v-if="selectPersonnelList.length < 1" class="select_message">点击查看人员列表</span>
            <el-tag
                size="mini"
                v-for="tag in selectPersonnelList"
                :key="tag.target"
                @close="handleClose(tag)"
                closable>
              {{tag.account}}
            </el-tag>
          </div>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="10" v-model="detailForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" :loading="showSubmitAddBtn" @click="submitAddDialog">确 定</el-button>
      </div>

      <el-dialog
          title="通知选择"
          :show-close="false"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :visible.sync="selectDialog"
          append-to-body>
        <div class="select_main">
          <div class="select_left" v-loading="groupLoading">
            <el-tree :data="groupList" :props="groupProps" @node-click="handleNodeClick"></el-tree>
          </div>
          <div class="select_right" v-loading="personnelLoading">
            <div class="select_right_header" v-if="showPersonnelText">
              <el-input
                  class="personnel_input"
                  placeholder="输入关键字进行过滤人员"
                  v-model="personnelText">
              </el-input>
              <el-button @click="checkedAll(true)">全选</el-button>
              <el-button @click="checkedAll(false)">取消全选</el-button>
            </div>

            <el-tree
                :data="personnelList"
                :props="personnelProps"
                show-checkbox
                node-key="target"
                ref="personnelTree"
                :filter-node-method="personnelFilterNode"
                @check-change="handleCheckChange">
            </el-tree>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeSelectDialog">取 消</el-button>
          <el-button type="primary" @click="submitSelectDialog">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <el-dialog
        :title="editDialogStatus?'添加新闻':'修改新闻'"
        modal-append-to-body
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :visible.sync="addNewsDialog"
        custom-class="add_dialog">
      <el-form>
        <el-form-item label="标题">
          <el-input v-model="detailForm.title"></el-input>
        </el-form-item>
        <el-form-item label="类型名称">
          <el-select v-model="detailForm.typeName" placeholder="请选择">
            <el-option label="知识信息" value="知识信息"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查看权限">
          <div class="select_box" @click="addSelectBtn">
            <span v-if="selectPersonnelList.length < 1" class="select_message">点击查看人员列表</span>
            <el-tag
                size="mini"
                v-for="tag in selectPersonnelList"
                :key="tag.target"
                @close="handleClose(tag)"
                closable>
              {{tag.account}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="8" v-model="detailForm.content"></el-input>
        </el-form-item>
        <el-radio-group style="margin-bottom: 15px" @change="openOrderIdShow(detailForm.is_show)" v-model="detailForm.is_show">
          <el-radio label="1">显示</el-radio>
          <el-radio label="0">不显示</el-radio>
        </el-radio-group>
        <el-form-item label="是否显示订单详情" v-if="showOrderIdSelect">
          <el-select v-model="detailForm.orderMessage" :multiple="openMultiple" @change="selectOrderId(detailForm.orderMessage)" placeholder="请选择" clearable>
            <el-option label="全部" value="0"></el-option>
            <el-option
                v-for="(item ,index) in orderInfo"
                :key="index"
                :disabled="item.disabled"
                :label="item.order_sn"
                :value="item.order_sn">
            </el-option>
          </el-select>
        </el-form-item>
        <el-dialog
            title="通知选择"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="selectDialog"
            append-to-body>
          <div class="select_main">
            <div class="select_left" v-loading="groupLoading">
              <el-tree :data="groupList" :props="groupProps" @node-click="handleNodeClick"></el-tree>
            </div>
            <div class="select_right" v-loading="personnelLoading">
              <div class="select_right_header" v-if="showPersonnelText">
                <el-input
                    class="personnel_input"
                    placeholder="输入关键字进行过滤人员"
                    v-model="personnelText">
                </el-input>
                <el-button @click="checkedAll(true)">全选</el-button>
                <el-button @click="checkedAll(false)">取消全选</el-button>
              </div>

              <el-tree
                  :data="personnelList"
                  :props="personnelProps"
                  show-checkbox
                  node-key="target"
                  ref="personnelTree"
                  :filter-node-method="personnelFilterNode"
                  @check-change="handleCheckChange">
              </el-tree>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeSelectDialog">取 消</el-button>
            <el-button type="primary" @click="submitSelectDialog">确 定</el-button>
          </div>
        </el-dialog>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" :loading="showSubmitAddBtn" @click="submitAddDialog">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    name: "document",
    data(){
      return {
        viewAddressType: '',

        loading: true,
        helpTableData: [], // 帮助文档数据

        searchInput: '', // 搜索框
        detailDialog: false,  // 详情弹窗
        detailMessage: {}, // 详情内容

        editDialogStatus: true,
        addDialog: false, // 添加弹窗
        detailForm: {}, // 添加内容
        showSubmitAddBtn: false, // 确认添加内容按钮

        selectDialog: false, // 组选择弹窗
        groupLoading: true,  // 组加载效果
        groupList: [], // 组数据列表
        groupProps: {  // 组选择节点默认值
          children: 'subGroup',
          label: 'group_name'
        },

        personnelLoading: false,  // 人员列表加载效果
        personnelText: '', // 人员列表筛选框
        showPersonnelText: false, // 显示人员筛选框
        personnelList: [], // 人员列表数据
        personnelProps: {  // 人员选择节点默认值
          label: 'account'
        },
        selectPersonnelList: [], // 已选中人员列表

        // 添加新闻
        orderInfo: [], // 订单信息
        openMultiple: true, // 是否开启订单号多选
        showOrderIdSelect: false,

        addNewsDialog: false, // 新闻弹窗

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      /**
       * @Description: 获取帮助文档数据
       * @author Wish
       * @date 2019/9/26
      */
      getData(){
        this.viewAddressType = this.$route.name == 'helpDocument'? 0: 1
        this.loading = true
        let data = {
          page: this.page || null,
          per_page: this.per_page
        }
        this.$axios.get('/api/notice/show/'+this.viewAddressType,{params:data})
            .then(res =>{
              this.loading = false
              this.helpTableData = res.data.data
              this.paginationList = res.data
            })
      },
      
      /**
       * @Description: 文档搜索
       * @author Wish
       * @date 2019/9/26 
      */
      searchBtn(){
        this.loading = true
        let data = {
          keyWords: this.searchInput
        }
        this.$axios.post('/api/notice/search/'+this.viewAddressType,data)
            .then(res =>{
              this.loading = false
              this.helpTableData = res.data.data
            })
      },

      /**
       * @Description: 打开修改弹窗
       * @author Wish
       * @date 2019/9/26
      */
      editDialog(val){
        this.editDialogStatus = false
        this.$axios.get('/api/notice/showOne/0/'+val.id)
            .then(res =>{
              if(res.data.code === 0){
                let dataList = JSON.parse(JSON.stringify(res.data.result))
                this.addDialog = true
                this.detailForm['title'] = dataList[0].title
                this.detailForm['content'] = dataList[0].content
                this.detailForm['condition'] = dataList[0].id
                this.selectPersonnelList = dataList[0].person
                // let viewObjects = dataList[0].view_objects.split(',');// 切割人员id
                // viewObjects.forEach(e =>{  // 遍历人员id数组，并添加键值存入保存人员数组 person
                //   this.selectPersonnelList.push({
                //     target : parseInt(e)
                //   })
                // })
              }else {
                this.$message.warning(res.data.msg)
              }

            })
      },

      /**
       * @Description: 打开新增弹窗
       * @author Wish
       * @date 2019/9/26
      */
      addDialogBtn(){
        this.detailForm = {}
        this.selectPersonnelList = []

        if(this.viewAddressType === 0){
          this.addDialog = true
          this.editDialogStatus = true
        }else {
          this.addNewsDialog = true
          this.editDialogStatus = true
          this.detailForm['is_show'] = '0'
          this.getOrderMessage()
        }
      },

      /**
       * @Description: 关闭新增弹窗
       * @author Wish
       * @date 2019/9/26
      */
      closeAddDialog(){
        this.selectPersonnelList = []
        this.addDialog = false
        this.showSubmitAddBtn = false
        this.addNewsDialog = false
      },

      /**
       * @Description: 提交新增资料
       * @author Wish
       * @date 2019/9/26
      */
      submitAddDialog(){
        console.log(this.detailForm);
        if(this.detailForm.title && this.detailForm.content){
          this.showSubmitAddBtn = true
          let personnelId = []
          this.selectPersonnelList.map(res =>{
            personnelId.push(res.target)
          })
          this.detailForm['objects'] = String(personnelId)
          this.detailForm['type'] = this.viewAddressType
          if(this.viewAddressType === 1){ // 新闻新增or编辑
            this.detailForm.orderMessage.forEach(item =>{
              if(item === '0'){
                this.detailForm.orderMessage = ['0']
              }
            })
            this.detailForm['relation_order'] = String(this.detailForm.orderMessage)
            this.detailForm['is_show'] = this.detailForm.is_show
          }
            if(this.editDialogStatus){
              this.$axios.post('/api/notice/add',this.detailForm)
                  .then(res =>{
                    if(res.data.code === 0){
                      this.$message.success('保存成功')
                      this.addDialog = false
                      this.addNewsDialog = false
                      this.getData()
                      this.showSubmitAddBtn = false
                    }else {
                      this.$message.warning(res.data.msg)
                      this.showSubmitAddBtn = false
                      this.addNewsDialog = false
                    }
                  })
            }else {
              this.$axios.post('/api/notice/edit',this.detailForm)
                  .then(res =>{
                    if(res.data.code === 0){
                      this.$message.success('修改成功')
                      this.addDialog = false
                      this.getData()
                      this.showSubmitAddBtn = false
                      this.addNewsDialog = false
                    }else {
                      this.$message.warning(res.data.msg)
                      this.showSubmitAddBtn = false
                      this.addNewsDialog = false
                    }
                  })
            }


        }else {
          this.$message.warning('请填写完整信息')
        }
      },

      /**
       * @Description: 打开人员选择弹窗
       * @author Wish
       * @date 2019/9/26
      */
      addSelectBtn(){
        this.groupLoading = true
        this.selectDialog = true
        this.$axios.get('/api/user/group/obtain')
            .then(res =>{
              if(res.data.code === 0){
                this.groupLoading = false
                this.groupList = res.data.result
              }
            })
      },

      /**
       * @Description: 删除已选择人员tag标签
       * @author Wish
       * @date 2019/9/26
      */
      handleClose(tag) {
        this.selectPersonnelList.splice(this.selectPersonnelList.indexOf(tag), 1);
      },

      /**
       * @Description: 组选择
       * @author Wish
       * @date 2019/9/26
      */
      handleNodeClick(data) {
        this.personnelLoading = true
        this.showPersonnelText = false
        let postData ={
          group_id: data.id
        }
        this.$axios.post('/api/user/group/obtainMembers',postData)
            .then(res =>{
              if(res.data.code === 0){
                this.showPersonnelText = true
                this.personnelLoading = false
                this.personnelList = res.data.result
                this.setCheckedKeys()
              }
            })
      },


      /**
       * @Description: 默认人员选中
       * @author Wish
       * @date 2019/9/26
      */
      setCheckedKeys() {
        let data = [];
        this.selectPersonnelList.map(res => {
          data.push(res.target)
        })
        this.$refs.personnelTree.setCheckedKeys(data);
      },

      /**
       * @Description: 全选
       * @author Wish
       * @date 2019/9/26
      */
      checkedAll(status){
        if (status) {
          //全选
          this.$refs.personnelTree.setCheckedNodes(this.personnelList);
        }else{
          //取消选中
          this.$refs.personnelTree.setCheckedKeys([]);
        }
      },

      /**
       * @Description: 人员选中
       * @author Wish
       * @date 2019/9/26
      */
      handleCheckChange(data, checked, indeterminate) {
        if(checked){
          this.selectPersonnelList.push(data)
        }else {
          this.selectPersonnelList.splice(this.selectPersonnelList.findIndex(item => item.target === data.target), 1)
        }
      },

      /**
       * @Description: 关闭人员选择弹窗
       * @author Wish
       * @date 2019/9/26
      */
      closeSelectDialog(){
        this.selectDialog = false
        this.personnelList = []
      },

      /**
       * @Description: 确认人员选择
       * @author Wish
       * @date 2019/9/26
      */
      submitSelectDialog(){
        this.selectDialog = false
        this.personnelList = []
      },
      /**
       * @Description: 人员选择筛选
       * @author Wish
       * @date 2019/9/26
      */
      personnelFilterNode(value, data) {
        if (!value) return true;
        return data.account.indexOf(value) !== -1;
      },

      /**
       * @Description: 打开详情弹窗
       * @author Wish
       * @date 2019/9/26
      */
      openDetails(val){
        this.detailDialog = true
        this.detailMessage = val
      },

      /**
       * @Description: 删除列表数据
       * @author Wish
       * @date 2019/9/26
      */
      deleteListBtn(val){
        this.$confirm('此操作将永久删除该数据, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            condition: val.id,
            type: this.viewAddressType
          }
          this.$axios.post('/api/notice/del',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('删除成功')
                  this.getData()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }).catch(() =>{})

      },

      /**
       * @Description: 分页器
       * @author Wish
       * @date 2019/10/17
      */
      jumpSize(val){
        this.per_page = val
        this.getData()
      },
      jumpPage(val){
        this.page = val
        this.getData()
      },


      /**
       * @Description: 显示or隐藏订单id选择器
       * @author Wish
       * @date 2019/11/4
      */
      openOrderIdShow(val){
        this.showOrderIdSelect = val === '1'? true: false
      },

      /**
       * @Description: 选择全部单号
       * @author Wish
       * @date 2019/11/4
      */
      selectOrderId(val){
        val.forEach(item =>{
          this.orderInfo.forEach(cItem =>{
            cItem['disabled'] = item === '0'
          })
        })
      },

      /**
       * @Description: 获取全部有效订单单号
       * @author Wish
       * @date 2019/11/4
      */
      getOrderMessage(){
        this.$axios.get('/api/order/obtainList/0')
            .then(res =>{
              if(res.data.code === 0){
                this.orderInfo = res.data.result
              }
            })
      },


    },
    watch: {
      personnelText(val) {
        this.$refs.personnelTree.filter(val);
      },
      '$route'(to,form){
        this.getData()
      }
    },
    created() {
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .helpDocument{
    .help_main{
      max-width: 1380px;
      width: 100%;
      padding: 50px 30px;
      margin: 0 auto;
      .table_header{
        display: flex;
        align-items: center;
        margin-bottom: 35px;
        /deep/.el-input{
          margin-right: 10px;
        }
      }
      .table_main{

      }
    }
  }
  .detail_dialog{
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
      }
    }
  }
  .add_dialog{
    .detail_main{
      .select_box{
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        height: 40px;
        outline: none;
        padding: 0 15px;
        cursor: pointer;
        .select_message{
          font-size:12px;
          opacity:0.5;
        }
        /deep/.el-tag{
          &:not(:last-child){
            margin-right: 10px;
          }
        }
      }
    }
  }
  .select_main{
    display: flex;
    min-height: 400px;
    height: 100%;
    max-height: 600px;
    .select_left{
      flex: 1;
      margin-right: 40px;
      overflow-y: auto;
    }
    .select_right{
      flex: 1;
      overflow-y: auto;
      .select_right_header{
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        .personnel_input{
          margin-right: 10px;
          flex: 1;
        }
      }

    }
  }
</style>