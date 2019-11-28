<template>
  <div class="clientSetting" v-loading="loading">
    <div class="client_header">
      <div><el-button type="primary" @click="addClient">新增客户</el-button></div>
      <div><el-input clearable v-model="searchForm.name" placeholder="客户商名称"></el-input></div>
      <div><el-date-picker
          clearable
          v-model="searchForm.time"
          type="date"
          placeholder="创建时间">
      </el-date-picker></div>
      <div><el-input clearable v-model="searchForm.contact" placeholder="联系方式"></el-input></div>
      <div><el-button type="primary" @click="getDataList('search')">搜索</el-button></div>
    </div>
    <div class="client">
      <el-table
          :data="clientData"
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
            prop="name"
            label="客户名称">
        </el-table-column>
        <el-table-column
            prop="order_prefix"
            label="订单前缀">
        </el-table-column>
        <el-table-column
            prop="contact"
            label="联系方式">
        </el-table-column>
        <el-table-column
            prop="address"
            show-overflow-tooltip
            label="旅行社地址">
        </el-table-column>
        <el-table-column
            prop="created_at"
            sortable
            label="创建时间">
        </el-table-column>
        <el-table-column
            label="类别"
            width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 0">有效</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 1">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="80">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button size="mini">操作</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><el-button type="text" @click="editBtn(scope.row)">编辑</el-button></el-dropdown-item>
                <el-dropdown-item><el-button type="text" @click="editStatusBtn(scope.row)">{{scope.row.status === 0? '停用' : '启用'}}</el-button></el-dropdown-item>
                <el-dropdown-item><el-button type="text" @click="deleteBtn(scope.row)">删除</el-button></el-dropdown-item>
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


    <el-dialog
        :title="dialogType?'添加客户':'修改客户'"
        modal-append-to-body
        append-to-body
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="addDialog"
        custom-class="add_dialog">
      <el-form class="dialog_main" ref="form" label-width="150px">
        <el-form-item label="客户商名称">
          <el-input v-model="addDataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="订单号前缀配置">
          <el-input v-model="addDataForm.prefix"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input  maxlength="11" show-word-limit v-model="addDataForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addDataForm.address"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "clientSetting",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: true,

        addDialog: false, // 添加弹窗
        addDataForm: {
          name: '',
          prefix: '',
          contact: '',
          address: ''
        },
        dialogType: true,  // 弹窗状态

        searchForm: {},  // 搜索

        clientData: [],  // 客户管理列表

        paginationList: {},
        per_page: 10,
        page: ''
      }
    },
    methods:{
      getDataList(type){
        this.loading = true
        let data

        if(type === 'search'){
          data = JSON.parse(JSON.stringify(this.searchForm))
          data['page'] = this.page || null
          data.time?data.time = this.$dateToDate(data.time):''
        }else {
          data = {
            page: this.page || null,
          }
        }

        this.$axios.post('/api/user/customer/show/'+this.per_page || null,data)
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.clientData = res.data.result.data
                this.paginationList = res.data.result
              }else {
                this.$message.warning(res.data.msg)
                this.loading = false
              }
            })
      },

      /**
       * @Description: 添加客户
       * @author Wish
       * @date 2019/10/8
      */
      addClient(){
        this.addDialog = true
        this.dialogType = true
        this.addDataForm = {
          name: '',
          prefix: '',
          contact: '',
          address: ''
        }
      },

      /**
       * @Description: 添加or编辑提交按钮
       * @author Wish
       * @date 2019/10/8
      */
      submitAdd(){
        if(this.dialogType){  // 新建
          if(this.addDataForm.name && this.addDataForm.prefix){
            this.$axios.post('/api/user/customer/add',this.addDataForm)
                .then(res =>{
                  if(res.data.code === 0){
                    this.$message.success('保存成功')
                    this.getDataList()
                    this.addDialog = false
                  }else {
                    this.$message.warning(res.data.msg)
                  }
                })
          }else {
            this.$message.warning('请填写完整信息')
          }

        }else { // 修改
          this.addDataForm['type'] = 0
          if(this.addDataForm.name && this.addDataForm.prefix){
            this.$axios.post('/api/user/customer/operation',this.addDataForm)
                .then(res =>{
                  if(res.data.code === 0){
                    this.$message.success('保存成功')
                    this.getDataList()
                    this.addDialog = false
                  }else {
                    this.$message.warning(res.data.msg)
                  }
                })
          }else {
            this.$message.warning('请填写完整信息')
          }

        }
      },

      /**
       * @Description: 编辑按钮
       * @author Wish
       * @date 2019/10/8
      */
      editBtn(val){
        this.addDataForm = {}
        this.dialogType = false
        val['prefix'] = val.order_prefix
        val['condition'] = val.id
        this.addDialog = true
        this.addDataForm = JSON.parse(JSON.stringify(val))
        delete this.addDataForm.created_at
        delete this.addDataForm.order_prefix
        delete this.addDataForm.status
        delete this.addDataForm.updated_at
        delete this.addDataForm.id
      },

      /**
       * @Description: 修改状态按钮
       * @author Wish
       * @date 2019/10/8
      */
      editStatusBtn(val){
        let data ={
          type: 1,
          status: val.status === 0?1:0,
          condition: val.id,
        }
        this.$confirm('是否修改此数据状态，当此数据状态被修改后，对应数据可能会受到影响！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/user/customer/operation',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('状态修改成功')
                  this.getDataList()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }).catch(() =>{})
      },

      /**
       * @Description: 删除按钮
       * @author Wish
       * @date 2019/10/8
      */
      deleteBtn(val){
        let data ={
          type: 2,
          condition: val.id,
        }
        this.$confirm('是否删除此数据，当此数据被删除后，对应数据可能会受到影响！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/user/customer/operation',data)
              .then(res =>{
                if(res.data.code === 0){
                  this.$message.success('删除成功')
                  this.getDataList()
                }else {
                  this.$message.warning(res.data.msg)
                }
              })
        }).catch(() =>{})
      },

      /**
       * @Description: 分页器
       * @author Wish
       * @data 2019/10/16
      */
      jumpSize(val){
        this.per_page = val
        this.getDataList()
      },
      jumpPage(val){
        this.page = val
        this.getDataList()
      }
    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .clientSetting{
    display: flex;
    flex-direction: column;
    padding: 20px 5%;
    .client_header{
      display: flex;
      align-items: center;
      margin-bottom: 50px;
      >div{
        margin-right: 10px;
      }
    }
  }
  /deep/.add_dialog{
    max-width: 600px;
    width: 100%;
    .dialog_main{
      width: 80%;
    }
  }
</style>
