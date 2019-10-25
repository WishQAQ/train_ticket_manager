<!--对账单详情-->
<template>
  <div class="content" v-loading="loading">
    <div class="top">
      <div>
        <el-input style="width: 225px;" placeholder="请输入您要查询的订单号" v-model="input" clearable></el-input>
      </div>
      <div>
        <el-input placeholder="账期" v-model="input" clearable></el-input>
      </div>
      <div>
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="center">
      <div>
        <el-table
                :data="tableData"
                border
                style="width: 100%; margin-top: 20px">

          <el-table-column
                  prop="id"
                  align="center"
                  label="操作人">
          </el-table-column>

          <el-table-column
                  prop="name"
                  align="center"
                  label="账期开始时间">
          </el-table-column>

          <el-table-column
                  prop="amount2"
                  align="center"
                  label="账期结束时间">
          </el-table-column>
        </el-table>
        <Pagination
                ref="pagination"
                :pageData="paginationList"
                @jumpSize="jumpSize"
                @jumpPage="jumpPage">
        </Pagination>
      </div>
      <div>
        <el-table
                :data="tableData"
                border
                style="width: 100%; margin-top: 20px">
          <el-table-column
                  label="订单号">
            <template slot-scope="scope">
              <div>{{ scope.row.id }}</div>
              <el-button type="text" @click="">添加一条</el-button>
            </template>
          </el-table-column>

          <el-table-column
                  prop="name"
                  align="center"
                  label="实收款">
          </el-table-column>

          <el-table-column
                  prop="amount2"
                  align="center"
                  label="收款时间">
          </el-table-column>

          <el-table-column
                  label="操作"
                  width="80">
            <el-button type="text" @click="">删除</el-button>
          </el-table-column>
        </el-table>
        <Pagination
                ref="pagination"
                :pageData="paginationList"
                @jumpSize="jumpSize"
                @jumpPage="jumpPage">
        </Pagination>
      </div>
      <div class="voucher">
        <el-row :gutter="0">
          <el-col :span="4">
            <div class="grid-content bg-purple voucher-item">收款凭证</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple voucher-item">
              <div class="add-income">+</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple voucher-item">付款凭证</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple voucher-item">
              <div class="add-pay">+</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row :gutter="0">
          <el-col :span="11">
            <div class="grid-content bg-purple">
              <el-table
                      :data="tableData"
                      border
                      style="width: 100%; margin-top: 20px">
                <el-table-column
                        label="序号"
                        align="center"
                        width="50px">
                  <template slot-scope="scope">
                    {{scope.$index+1}}
                  </template>
                </el-table-column>
                <el-table-column
                        prop="id"
                        align="center"
                        label="备注人">
                </el-table-column>

                <el-table-column
                        prop="name"
                        align="center"
                        label="备注">
                </el-table-column>

                <el-table-column
                        prop="amount2"
                        align="center"
                        label="时间">
                </el-table-column>
              </el-table>
              <Pagination
                      ref="pagination"
                      :pageData="paginationList"
                      @jumpSize="jumpSize"
                      @jumpPage="jumpPage">
              </Pagination>
            </div>
          </el-col>
          <el-col :span="2"><div class="grid-content bg-purple placeholder">&nbsp;</div></el-col>
          <el-col :span="11">
            <div class="grid-content bg-purple">
              <div class="add-income">
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%; margin-top: 20px">
                  <el-table-column
                          label="序号"
                          align="center"
                          width="50px">
                    <template slot-scope="scope">
                      {{scope.$index+1}}
                    </template>
                  </el-table-column>
                  <el-table-column
                          prop="id"
                          align="center"
                          label="备注人">
                  </el-table-column>

                  <el-table-column
                          prop="name"
                          align="center"
                          label="动作">
                  </el-table-column>

                  <el-table-column
                          prop="amount2"
                          align="center"
                          label="字段">
                  </el-table-column>

                  <el-table-column
                          prop="amount2"
                          align="center"
                          label="写入值">
                  </el-table-column>

                  <el-table-column
                          prop="amount2"
                          align="center"
                          label="时间">
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
          </el-col>
        </el-row>
      </div>
     </div>
  </div>
</template>
<script>
  export default {
    name: "billingInfo",
    components:{
      'Pagination': () => import('@/components/Pagination')
    },
    data(){
      return {
        loading: false,
          date_value: '',
          dialogFormVisible: false,
          ruleForm: {
              desc: ''
          },
          paginationList: {},
          per_page: 10,
          page: '',
          num: '',
          tableData: [{
              id: '12987122',
              name: '王小虎',
              amount1: '234',
              amount2: '3.2',
              amount3: 10
          },{
              id: '12987122',
              name: '王小虎',
              amount1: '234',
              amount2: '3.2',
              amount3: 10
          },{
              id: '12987124',
              name: '王小虎',
              amount1: '234',
              amount2: '3.2',
              amount3: 10
          },{
              id: '12987125',
              name: '王小虎',
              amount1: '234',
              amount2: '3.2',
              amount3: 10
          },]
      }
    },
    methods:{

      getData(){
        this.loading = true;
        this.$axios.get('/api/system/passengerTicket/')
            .then(res =>{
                this.tableData = res.data.result.data;
                this.loading = false;
                this.paginationList = res.data.result;
            })
      },
    },
    created() {
      // this.getData()
    }
  }
</script>

<style scoped lang="less">
  .content {
    display: flex;
    flex-direction: column;
    padding: 80px 2%;
    .top {
      display: flex;
      align-items: center;
      > div {
        margin-left: 10px;
      }
    }
    .voucher{
      margin: 20px 0;
      .voucher-item{
        border: 1px solid #ebeef5;
        padding: 20px;
        height: 130px;
        line-height: 80px;
        text-align: center;
        .add-income,.add-pay{
          width:87px;
          height:87px;
          background:rgba(238,247,255,1);
          opacity:1;

        }
      }
    }
  }
</style>