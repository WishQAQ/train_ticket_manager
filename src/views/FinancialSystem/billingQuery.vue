<!--对账单查询-->
<template>
  <div class="content" v-loading="loading">
    <div class="top">
      <div>
        <el-input style="width: 225px;" placeholder="搜索相关的对账单号" v-model="input" clearable></el-input>
      </div>
      <div>
        <el-select v-model="value1" multiple placeholder="按客户筛选">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="value2" multiple collapse-tags placeholder="状态筛选">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div>
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="center">
      <el-table
              :data="tableData"
              @row-click="openDetails"
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
                prop="amount2"
                align="center"
                label="对账单号">
        </el-table-column>

        <el-table-column
                prop="amount2"
                align="center"
                label="账期">
        </el-table-column>

        <el-table-column
                prop="amount2"
                align="center"
                label="客户">
        </el-table-column>

        <el-table-column
                prop="amount1"
                align="center"
                label="对账金额">
        </el-table-column>
        <el-table-column
                prop="amount1"
                align="center"
                label="对账收款">
        </el-table-column>
        <el-table-column
                prop="amount1"
                align="center"
                label="对账债途">
        </el-table-column>
        <el-table-column
                prop="amount1"
                align="center"
                label="状态（已结清/未结算）">
        </el-table-column>

      </el-table>

      <div class="pages">
        <Pagination
                ref="pagination"
                :pageData="paginationList"
                @jumpSize="jumpSize"
                @jumpPage="jumpPage">
        </Pagination>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: "billingQuery",
        components:{
            'Pagination': () => import('@/components/Pagination')
        },
        data(){
            return {
                loading: false,
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                gridData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                dialogTableVisible: false,
                paginationList: {},
                per_page: 10,
                page: '',
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
                },]
            }
        },
        methods:{

            openDetails(row) {
                this.$router.push({
                    path: '/billingInfo',
                    params: { data: '我是要传递的参数' }
                })
            },

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
  .content{
    display: flex;
    flex-direction: column;
    padding: 80px 2%;
    .top{
      display: flex;
      align-items: center;
      >div{
        margin-left: 10px;
      }
    }
    .center{
      .export{
        margin-top: 20px;
        float: right;
      }
      .pages{
        display: flex;
        .refresh{
          height: 28px;
          margin-top: 32px;
        }
      }
      .info-table td{
        width: 15%;
        padding: 10px;
        border: 1px solid #EBEEF5;
      }
    }
    .bottom{
      .total{
        width: 25%;
        float: right;
        color: #2699FB;
        >p{
          text-align: center;
          margin: 10px 0;
        }
        >div{
          display: flex;
          >div{
            margin: 10px 0;
            width: 50%;
          }
        }
      }
    }
  }
</style>