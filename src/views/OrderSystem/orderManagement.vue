<template>
  <div class="orderManagement" v-loading="loading">
    <div class="table_header"></div>
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
            <div class="main_list" v-for="(item, index) in tableData" :key="index">
              <div class="list_num">
                <div style="width: 60px">{{index+1}}</div>
                <div style="width: 60px">
                  <el-checkbox @change="handleCheckChange(item)"></el-checkbox>
                </div>
                <div style="width: 220px">{{item.order_sn}}</div>
              </div>
              <div class="list_main">
                <div class="list_box" v-for="(cItem, CIndex) in item.info" :key="CIndex">
                  <div style="width: 150px; flex-shrink: 0">{{$getTime(cItem.riding_time * 1000)}}</div>
                  <div>{{cItem.departure_station}}</div>
                  <div>{{cItem.arrival_station}}</div>
                  <div>{{cItem.finishTask +'/'+cItem.incompleteTask}}</div>
                  <div>{{cItem.Cname}}</div>
                  <div>{{cItem.fdName}}</div>
                  <div>{{cItem.order_status === 0 ? '处理中':'已处理'}}</div>
                  <div>未知</div>
                  <div>{{cItem.desc[0].remarks}}</div>
                </div>
              </div>
              <div class="option_box">
                <el-dropdown trigger="click">
                  <el-button size="mini">操作</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><div>详情</div></el-dropdown-item>
                    <el-dropdown-item><div>备注</div></el-dropdown-item>
                    <el-dropdown-item><div>设为不明订单</div></el-dropdown-item>
                    <el-dropdown-item><div>标红置顶</div></el-dropdown-item>
                    <el-dropdown-item><div>合并订单</div></el-dropdown-item>
                    <el-dropdown-item><div @click="editBtn(item)">编辑</div></el-dropdown-item>
                    <el-dropdown-item><div>删除</div></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
        </div>
      </div>

      <Pagination
          ref="pagination"
          :pageData="paginationList"
          @jumpSize="jumpSize"
          @jumpPage="jumpPage">
      </Pagination>

    </div>
  </div>
</template>

<script>
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

        checkAll: false,
        selectList: [],  // 多选列表

        paginationList: {},
        per_page: 10,
        page: '',
      }
    },
    methods:{
      getDataList(){
        this.loading = true
        let data = {
          page: this.page || null,
          per_page: this.per_page
        }
        this.$axios.get('/api/order/list/'+this.viewsType,{params:data})
            .then(res =>{
              this.loading = false;
              this.tableData = res.data.data
              this.paginationList = res.data
              this.selectList = []
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
       * @Description: 编辑按钮
       * @author Wish
       * @date 2019/10/17
      */
      editBtn(val){
        console.log(val);
      },

      /**
       * @Description: 分页器
       * @author Wish
       * @data 2019/10/17
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
    created() {
      this.getDataList()
    }

  }
</script>

<style scoped lang="less">
  .orderManagement{
    padding: 80px;

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
          .main_list{
            display: flex;
            align-items: center;
            border: 1px solid #ebeef5;
            border-top: unset;
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
    }
  }
</style>