<template>
  <div class="seatSetting" v-loading="loading">
    <div class="left_main">
      <div class="table_header">
        <el-input v-model="searchSeatName" :placeholder="urlType?'输入席别名称':'输入票种名称'"></el-input>
        <el-select v-model="searchSeatStatus" placeholder="请选择">
          <el-option label="全部状态" value="-1"></el-option>
          <el-option label="有效" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
        <el-button @click="searchBtn">搜索</el-button>
        <el-button @click="addSeatBtn" type="primary">新增{{urlType?'席别':'票种'}}</el-button>
      </div>

      <el-table
          :data="seatTableData"
          border
          stripe
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
            :label="urlType?'席别名称':'票种名称'">
        </el-table-column>
        <el-table-column
            prop="created_at"
            sortable
            label="创建时间">
        </el-table-column>
<!--        <el-table-column-->
<!--            label="类别"-->
<!--            width="80">-->
<!--          <template slot-scope="scope">-->
<!--            <el-tag type="success" v-if="scope.row.status === 0">有效</el-tag>-->
<!--            <el-tag type="danger" v-if="scope.row.status === 1">停用</el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
            label="操作"
            width="50">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editSeatBtn(scope.row)">编辑</el-button>
<!--            <el-dropdown trigger="click">-->
<!--              <el-button size="mini">操作</el-button>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item><el-button type="text" @click="editSeatBtn(scope.row)">编辑</el-button></el-dropdown-item>-->
<!--                <el-dropdown-item><el-button type="text" @click="editStatusBtn(scope.row)">{{scope.row.status === 0? '停用' : '启用'}}</el-button></el-dropdown-item>-->
<!--                <el-dropdown-item><el-button type="text" @click="deleteSeatBtn(scope.row)">删除</el-button></el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
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
    <div class="right_main">
      <div class="title">{{editType?'编辑':'新增'}}{{urlType?'席别':'票种'}}</div>
      <div class="right_form">
        <el-form ref="form" label-width="80px">
          <el-form-item :label="urlType?'席别名称':'票种名称'">
            <el-input v-model="seatName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitBtn" v-loading="submitLoading">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  let urlAddress;
  export default {
    name: "seatSetting",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        urlType: this.$route.meta.name === '席别管理', // 系别管理or票种管理

        loading: true,
        searchSeatName: '',  // 名称搜索
        searchSeatStatus: '-1',  // 状态搜索

        seatTableData: [], // 列表数据

        editType: false,

        seatId: '', // Id
        seatName: '', // 新增or编辑 名称

        submitLoading: false, // 提交按钮

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      getDataList(){
        this.loading = true
        urlAddress = this.urlType?'fareWell':'ticketSpecies';
        let data = {
          page: this.page || null,
        }
        this.$axios.get('/api/system/'+urlAddress+'/show/'+this.per_page || null,{params:data})
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.seatTableData = res.data.result.data
                this.paginationList = res.data.result
              }else {
                this.$message.warning(res.msg)
              }
            })
      },

      /**
       * @Description: 搜索
       * @author Wish
       * @date 2019/10/8
      */
      searchBtn(){
        this.loading = true
        urlAddress = this.urlType?'fareWell':'ticketSpecies';
        let searchStatus;
        if(this.searchSeatStatus !== '-1'){
          searchStatus = this.searchSeatStatus == 0 ? 2: 1
        }
        let data = {
          name: this.searchSeatName || null,
          status: searchStatus || 0
        }
        this.$axios.post('/api/system/'+urlAddress+'/show',data)
            .then(res =>{
              this.loading = false
              this.seatTableData = res.data.result.data
            })
      },

      /**
       * @Description: 新增席别
       * @author Wish
       * @date 2019/10/8
      */
      addSeatBtn(){
        this.editType = false;
        this.seatName = '';
        this.seatId = '';
      },

      /**
       * @Description: 编辑席别
       * @author Wish
       * @date 2019/10/8
      */
      editSeatBtn(val){
        this.editType = true;
        this.seatName = JSON.parse(JSON.stringify(val.name))
        this.seatId = val.id
      },

      /**
       * @Description: 修改席别状态
       * @author Wish
       * @date 2019/10/8
      */
      editStatusBtn(val){
        this.seatId = val.id
        urlAddress = this.urlType?'fareWell':'ticketSpecies';
        let type = val.status
        this.$confirm('是否修改此数据状态，当此数据状态被修改后，对应数据可能会受到影响！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data ={
            type: 1,
            status: type === 0 ?1:0,
            condition: this.seatId
          }
          this.$axios.post('/api/system/'+urlAddress+'/operation',data)
              .then(res =>{
                this.$message.success('状态修改成功')
                this.getDataList()
                this.addSeatBtn()
              })
        }).catch(() =>{})
      },

      /**
       * @Description: 删除席别
       * @author Wish
       * @date 2019/10/8
      */
      deleteSeatBtn(val){
        urlAddress = this.urlType?'fareWell':'ticketSpecies';
        this.seatId = val.id
        this.$confirm('是否删除此数据，当此数据被删除后，对应数据可能会受到影响！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data ={
            type: 2,
            condition: this.seatId
          }
          this.$axios.post('/api/system/'+urlAddress+'/operation',data)
              .then(res =>{
                this.$message.success('删除成功')
                this.getDataList()
                this.addSeatBtn()
              })
        }).catch(() =>{})
      },

      /**
       * @Description: 编辑or新增 提交按钮
       * @author Wish
       * @date 2019/10/8
      */
      submitBtn(){
        urlAddress = this.urlType?'fareWell':'ticketSpecies';
        if(this.seatName){
          this.submitLoading = true
          if(this.editType){  // 编辑席别
            let data ={
              type: 0,
              name: this.seatName,
              condition: this.seatId
            };
            this.$axios.post('/api/system/'+urlAddress+'/operation',data)
                .then(res =>{
                  if(res.data.code === 0){
                    this.submitLoading = false
                    this.$message.success('保存成功')
                    this.getDataList()
                    this.addSeatBtn()
                  }else {
                    this.$message.warning(res.msg)
                  }
                })
          }else {  // 新增席别
            let data ={
              name: this.seatName
            };
            this.$axios.post('/api/system/'+urlAddress+'/add',data)
                .then(res =>{
                  if(res.data.code === 0){
                    this.submitLoading = false
                    this.$message.success('保存成功')
                    this.getDataList()
                    this.addSeatBtn()
                  }else {
                    this.$message.warning(res.msg)
                  }
                })
          }
        }else {
          this.$message.warning('请填写名称')
        }
      },

      /**
       * @Description: 分页器
       * @author Wish
       * @data 2019/10/16
      */
      jumpSize(val){
        this.per_page = val
        this.getData()
      },
      jumpPage(val){
        this.page = val
        this.getData()
      },

    },
    watch: {
      '$route'(to, from) {
        this.loading = true;
        this.urlType = this.$route.meta.name === '席别管理';
        this.getDataList();
      },
    },
    mounted(){

    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .seatSetting{
    display: flex;
    padding: 15px 35px;
    background:rgba(238,247,255,.5);
    .left_main{
      flex: 1;
      background-color: #fff;
      margin-right: 16px;
      padding: 60px 34px 30px;
      .table_header{
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        /deep/.el-select{
          margin: 0 10px;
        }
      }
    }
    .right_main{
      width: 45%;
      background-color: #fff;
      padding: 0 10px 30px;
      .title{
        display: flex;
        align-items: center;
        height: 68px;
        border-bottom: 1px solid rgba(38,153,251,.5);
        margin-bottom: 40px;
        padding-left: 37px;
        font-size:18px;
        color:rgba(51,148,250,1);
      }
      .right_form{
        padding: 0 57px;
      }
    }
  }
</style>
