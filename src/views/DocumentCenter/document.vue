<template>
  <div class="helpDocument" v-loading="loading">
    <div class="help_main">
      <div class="table_header">
        <el-input v-model="searchInput" placeholder="输入关键字搜索"/>
        <el-button type="primary" @click="searchBtn">搜索</el-button>
        <el-button type="primary" @click="addDialogBtn" v-if="roleType === 0">新增</el-button>
      </div>
      <div class="table_main">
        <el-table
            stripe
            @row-dblclick="openDetails"
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
              width="400px"
              show-overflow-tooltip
              label="标题">
          </el-table-column>
<!--          <el-table-column-->
<!--              label="内容"-->
<!--              show-overflow-tooltip>-->
<!--            <template slot-scope="scope">-->
<!--              <div style="max-width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">-->
<!--                {{scope.row.content}}-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
              prop="source"
              label="来源">
          </el-table-column>
          <el-table-column
              show-overflow-tooltip
              label="发送给">
            <template slot-scope="scope">
              {{scope.row.objectsName || '全部人员'}}
            </template>
          </el-table-column>
          <el-table-column
              prop="created_at"
              label="日期">
          </el-table-column>
          <el-table-column
              v-if="viewAddressType === 1"
              label="类型">
            <template slot-scope="scope">
              {{scope.row.notice_type === 1 ? '通知公告' : scope.row.notice_type === 2 ? '规则制度': scope.row.notice_type === 3 ? '知识信息':scope.row.notice_type === 4?  '奖惩' : ''}}
            </template>
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
                  <el-dropdown-item v-if="roleType === 0"><div @click="editDialog(scope.row)">编辑</div></el-dropdown-item>
                  <el-dropdown-item v-if="roleType === 0"><div @click="deleteListBtn(scope.row)">删除</div></el-dropdown-item>
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
        :title="viewAddressType === 0 ? '帮助文档': '通知公告'"
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
        <div class="content" v-html="detailMessage.content || '暂无文档内容'"></div>
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
            <span style="padding: 5px 15px;cursor: pointer;border: 1px solid #dedede;font-size: 12px" v-if="selectPersonnelList.length < 1" class="select_message">点击查看人员列表</span>
            <el-tag
                size="mini"
                v-for="tag in selectPersonnelList"
                :key="tag.target"
                @close="handleClose(tag)"
                closable>
              {{tag.nickname || tag.account}}
            </el-tag>
          </div>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="内容">
          <quill-editor
            class="editor"
            ref="myQuillEditor"
            :value="detailForm.content"
            :options="editorOption"
            @change="onEditorChange"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          />
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
          <div class="select_left">
            <el-tree :data="groupList" :props="groupProps" ref="tree" @node-click="handleNodeClick"/>
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
                :default-expanded-keys="[2, 3]"
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
        :title="editDialogStatus?'添加通知公告':'修改通知公告'"
        modal-append-to-body
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :visible.sync="addNewsDialog"
        custom-class="add_dialog">
      <el-form>
        <el-form-item label="标题">
          <el-input v-model="detailForm.title"/>
        </el-form-item>
        <el-form-item label="类型名称">
          <el-select @input="change($event)" v-model="detailForm.noticeType" placeholder="请选择">
            <el-option label="通知公告" value="通知公告"/>
            <el-option label="规则制度" value="规则制度"/>
            <el-option label="知识信息" value="知识信息"/>
            <el-option label="奖惩" value="奖惩"/>
          </el-select>
        </el-form-item>
        <el-form-item label="查看权限">
          <div class="select_box" @click="addSelectBtn">
            <span style="padding: 5px 15px;cursor: pointer;border: 1px solid #dedede;font-size: 12px" v-if="selectPersonnelList.length < 1" class="select_message">点击查看人员列表</span>
            <el-tag
                size="mini"
                v-for="tag in selectPersonnelList"
                :key="tag.target"
                @close="handleClose(tag)"
                closable>
              {{tag.nickname || tag.account}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="8" v-model="detailForm.content"/>
        </el-form-item>
        <el-radio-group style="margin-bottom: 15px" @input="change($event)" @change="openOrderIdShow(detailForm.is_show)" v-model="detailForm.is_show">
          <el-radio label="1">显示</el-radio>
          <el-radio label="0">不显示</el-radio>
        </el-radio-group>
        <el-form-item label="是否显示订单详情" v-if="showOrderIdSelect">
          <el-select v-model="detailForm.orderMessage" :multiple="openMultiple" @change="selectOrderId(detailForm.orderMessage)" placeholder="请选择" clearable>
            <el-option label="全部" value="0"/>
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
            <div class="select_left">
              <el-tree :data="groupList" :props="groupProps" @node-click="handleNodeClick"/>
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
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  export default {
    components:{
      'Pagination': () => import('@/components/Pagination'),
      quillEditor
    },
    name: "document",
    data(){
      return {
        roleType: parseInt(sessionStorage.getItem('TYPE')),

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


        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              // [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              // [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              // [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              // ['clean'],
              ['link', 'image', 'video']
            ],
            content: '',
          }
        },
      }
    },
    methods:{
      change(e){
        this.$forceUpdate()
      },

      /**
       * @Description: 获取帮助文档数据
       * @author Wish
       * @date 2019/9/26
      */
      getData(){
        this.viewAddressType = this.$route.name === 'helpDocument'? 0: 1
        this.loading = true
        let data = {
          page: this.page || null,
          per_page: this.per_page
        }
        this.$axios.get('/notice/show/'+this.viewAddressType+'/'+this.per_page,{params:data})
            .then(res =>{
              this.loading = false
              this.helpTableData = res.data.data
              this.helpTableData.forEach(item =>{
                if(item.objects){
                  let newArr = []
                  item.objects.forEach(cItem =>{
                    newArr.push(cItem.nickname)
                  })
                  item['objectsName'] = String([...new Set(newArr)])
                }
              })
              this.paginationList = res.data
              this.getUserList()
              console.log(this.helpTableData);

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
        this.$axios.post('/notice/search/'+this.viewAddressType,data)
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
        console.log(val);
        if(this.viewAddressType === 0){
          this.addDialog = true
        }else {
          this.addNewsDialog = true
        }
        this.editDialogStatus = false
        this.detailForm = JSON.parse(JSON.stringify(val))
        this.detailForm['condition'] = this.detailForm.id
        this.detailForm.notice_type = this.detailForm.notice_type === 0 ? '':
            this.detailForm.notice_type === 1? this.detailForm['noticeType'] = '通知公告':
                this.detailForm.notice_type === 2?this.detailForm['noticeType'] = '规则制度':
                    this.detailForm.notice_type === 3?this.detailForm['noticeType'] = '知识信息':
                        this.detailForm.notice_type === 4?this.detailForm['noticeType'] = '奖惩' : ''
        this.detailForm.objects? this.selectPersonnelList = this.detailForm.objects: ''
        val.order_detail_show === 0?this.detailForm['is_show'] = '0':
            val.order_detail_show === 1?this.detailForm['is_show'] = '1': ''

        this.showOrderIdSelect = val.order_detail_show === 1
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
        if(this.detailForm.title){
          this.showSubmitAddBtn = true
          let personnelId = []
          this.selectPersonnelList.map(res =>{
            personnelId.push(res.target)
          })
          this.detailForm['objects'] = String(personnelId)
          this.detailForm['type'] = this.viewAddressType
          if(this.viewAddressType === 1){ // 新闻新增or编辑
            if(this.detailForm.orderMessage instanceof Array){
              this.detailForm.orderMessage.forEach(item =>{
                if(item === '0'){
                  this.detailForm.orderMessage = ['0']
                }
              })
            }

            this.detailForm['relation_order'] = String(this.detailForm.orderMessage) || ''
            this.detailForm['is_show'] = this.detailForm.is_show
          }
          if(this.detailForm.noticeType){
            this.detailForm.notice_type = this.detailForm.noticeType === '通知公告' ? 1:
                this.detailForm.noticeType === '规则制度' ? 1:
                    this.detailForm.noticeType === '知识信息' ? 1:
                        this.detailForm.noticeType === '奖惩' ? 4: ''
          }
          if(this.editDialogStatus){
            console.log(this.detailForm);
            this.$axios.post('/notice/add',this.detailForm)
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
                }
              })
          }else {
            console.log(this.detailForm.id);
            this.$axios.post('/notice/edit',this.detailForm)
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
                }
              })
          }

        }else {
          this.$message.warning('请填写完整信息')
        }
      },

      /**
       * @Description: 获取人员列表
       * @author Wish
       * @date 2019/11/28
      */
      getUserList(){
        this.$axios.get('/user/group/obtain')
            .then(res =>{
              if(res.data.code === 0){
                this.groupList = res.data.result
              }
            })
      },

      /**
       * @Description: 打开人员选择弹窗
       * @author Wish
       * @date 2019/9/26
      */
      addSelectBtn(){
        this.selectDialog = true
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
        this.$axios.post('/user/group/obtainMembers',postData)
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
      openDetails(val, column, cell, event){
        this.detailDialog = true
        this.detailMessage = val
        console.log(this.detailMessage.content);
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
          this.$axios.post('/notice/del',data)
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
        this.showOrderIdSelect = val === '1'
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
        this.$axios.get('/order/obtainList/0')
            .then(res =>{
              if(res.data.code === 0){
                this.orderInfo = res.data.result
              }
            })
      },
      //   personnelText(val) {
      //     this.$refs.personnelTree.filter(val);
      //   },

      onEditorBlur(editor) {
        console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      onEditorChange({ editor, html, text }) {
        console.log('editor change!', editor, html, text)
        this.detailForm.content = html
      }

    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    watch: {
      // personnelText(val) {
      //   this.$refs.personnelTree.filter(val);
      // },
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
      /*max-width: 1380px;*/
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
    /deep/.el-dialog__body{
      padding-top: 5px;
    }
    .detail_main{
      .title{
        font-size:20px;
        color:rgba(51,148,250,1);
        text-align: center;
        margin-bottom: 10px;
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
        font-size:16px;
        /*color:rgba(38,153,251,1);*/
        max-height: 600px;
        height: 100%;
        overflow-y: auto;
        white-space: pre-wrap;
      }
    }
  }
  .add_dialog{
      /deep/.select_box{
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        height: 40px;
        outline: none;
        padding: 0 15px;
        cursor: pointer;
        .select_message{
          font-size:12px;
          opacity:0.5;
          border: 1px solid #dedede;
          padding: 5px 15px;
          cursor: pointer;
        }
        /deep/.el-tag{
          &:not(:last-child){
            margin-right: 10px;
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
  /deep/.ql-editor{
    height: 300px;
  }
  /deep/.el-dialog__body{
    padding-bottom: unset;
  }
</style>
